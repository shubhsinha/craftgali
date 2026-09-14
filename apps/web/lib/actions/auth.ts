"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query, queryOne, transaction } from "@/lib/db";
import { checkHandle, STUDIO_CATEGORIES } from "@/lib/handles";
import { cityBySlug } from "@/lib/cities";
import {
  currentUser,
  endSession,
  hashPassword,
  hashResetToken,
  makeResetToken,
  revokeSessions,
  startSession,
  verifyPassword,
  RESET_TTL_MINUTES,
} from "@/lib/auth";
import { deliver, siteOrigin } from "@/lib/mail";
import { clear, clientIp, hit, LIMITS, retryMessage } from "@/lib/ratelimit";

export type FormState = { error?: string; field?: string; done?: string } | null;

/** The shortest password we will accept. Length beats character classes. */
const MIN_PASSWORD = 8;

/* Postgres unique-violation. Cheaper and less racy than a pre-flight select. */
const UNIQUE_VIOLATION = "23505";

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function emailLooksValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Only same-site paths — an open redirect is a phishing gift. */
function safeNext(form: FormData, fallback: string) {
  const next = text(form, "next");
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

/* ------------------------------------------------------------- register --- */

export async function registerAction(_prev: FormState, form: FormData): Promise<FormState> {
  const fullName = text(form, "fullName");
  const email = text(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const city = text(form, "city") || null;

  if (!fullName) return { error: "Tell us what to call you.", field: "fullName" };
  if (!emailLooksValid(email)) return { error: "That email doesn't look right.", field: "email" };
  if (password.length < MIN_PASSWORD) {
    return { error: `Use at least ${MIN_PASSWORD} characters.`, field: "password" };
  }

  /* Signup is per-IP only: there is no account yet to key a limit on, and this
     is what stops a script filling the table with addresses. */
  const throttle = await hit(`register:ip:${clientIp()}`, LIMITS.registerIp);
  if (throttle.limited) return { error: retryMessage(LIMITS.registerIp) };

  let user: { id: string } | null;
  try {
    user = await queryOne<{ id: string }>(
      `insert into users (email, password_hash, full_name, city)
       values ($1, $2, $3, $4)
       returning id`,
      [email, await hashPassword(password), fullName, city],
    );
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return { error: "That email already has an account. Sign in instead.", field: "email" };
    }
    throw error;
  }

  if (!user) return { error: "Could not create the account. Try again." };

  await startSession(user.id);
  redirect(safeNext(form, "/discover"));
}

/* --------------------------------------------------------------- sign in --- */

export async function signInAction(_prev: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");

  /* Two buckets, because they stop different attacks. The per-email one stops a
     word list being run against one account from anywhere; the per-IP one stops
     one host spraying one password across many accounts. */
  const emailBucket = `signin:email:${email}`;
  const ipBucket = `signin:ip:${clientIp()}`;

  const [byEmail, byIp] = await Promise.all([
    hit(emailBucket, LIMITS.signInEmail),
    hit(ipBucket, LIMITS.signInIp),
  ]);

  if (byEmail.limited) return { error: retryMessage(LIMITS.signInEmail) };
  if (byIp.limited) return { error: retryMessage(LIMITS.signInIp) };

  const user = await queryOne<{ id: string; password_hash: string | null }>(
    "select id, password_hash from users where email = $1",
    [email],
  );

  /* One message for both halves — telling a stranger which emails exist here is
     a favour to whoever is guessing. */
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "That email and password don't match an account." };
  }

  /* A good sign-in clears the account's count, so someone who mistypes twice
     and then gets it right starts from zero again. The IP bucket is left alone:
     it is counting the host, not this account. */
  await clear(emailBucket);

  await startSession(user.id);
  redirect(safeNext(form, "/discover"));
}

/* -------------------------------------------------------------- sign out --- */

export async function signOutAction() {
  endSession();
  revalidatePath("/", "layout");
  redirect("/");
}

/* ------------------------------------------------------- password reset --- */

/**
 * Step one: ask for a link.
 *
 * The reply is the same whether or not the address has an account. Saying
 * "no account with that email" here would turn this form into a free
 * membership oracle, which is exactly what the sign-in error avoids.
 */
export async function requestResetAction(_prev: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email").toLowerCase();
  const sent = {
    done: "If that email has an account, a reset link is on its way. It expires in an hour.",
  };

  if (!emailLooksValid(email)) return { error: "That email doesn't look right.", field: "email" };

  const byEmail = await hit(`reset:email:${email}`, LIMITS.resetEmail);
  const byIp = await hit(`reset:ip:${clientIp()}`, LIMITS.resetIp);

  /* Over the limit still reads as success: a different answer would leak both
     which addresses exist and which ones are being probed. */
  if (byEmail.limited || byIp.limited) return sent;

  const user = await queryOne<{ id: string }>("select id from users where email = $1", [email]);
  if (!user) return sent;

  /* Any earlier link for this account stops working the moment a new one is
     asked for, so a forwarded or shoulder-surfed old mail is worthless. */
  await query(
    "update password_resets set used_at = now() where user_id = $1 and used_at is null",
    [user.id],
  );

  const { token, tokenHash } = makeResetToken();

  await query(
    `insert into password_resets (user_id, token_hash, expires_at)
     values ($1, $2, now() + make_interval(mins => $3))`,
    [user.id, tokenHash, RESET_TTL_MINUTES],
  );

  const link = `${siteOrigin()}/reset-password?token=${token}`;

  await deliver({
    to: email,
    subject: "Reset your CraftGali password",
    text: [
      "Someone asked to reset the password on this CraftGali account.",
      "",
      `Open this link within ${RESET_TTL_MINUTES} minutes to choose a new one:`,
      link,
      "",
      "If that wasn't you, ignore this — your password has not changed, and the",
      "link stops working as soon as it expires.",
    ].join("\n"),
  });

  return sent;
}

/**
 * Step two: spend the link.
 *
 * The token is looked up by digest, must be unused and unexpired, and is burned
 * in the same statement that claims it — so two tabs racing the same link
 * cannot both set a password.
 */
export async function resetPasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const token = text(form, "token");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const throttle = await hit(`resetconfirm:ip:${clientIp()}`, LIMITS.resetConfirmIp);
  if (throttle.limited) return { error: retryMessage(LIMITS.resetConfirmIp) };

  if (password.length < MIN_PASSWORD) {
    return { error: `Use at least ${MIN_PASSWORD} characters.`, field: "password" };
  }
  if (password !== confirm) {
    return { error: "Those two passwords don't match.", field: "confirm" };
  }

  const claimed = await queryOne<{ user_id: string }>(
    `update password_resets
        set used_at = now()
      where token_hash = $1
        and used_at is null
        and expires_at > now()
      returning user_id`,
    [hashResetToken(token)],
  );

  if (!claimed) {
    return {
      error: "That link has expired or has already been used. Ask for a new one.",
    };
  }

  await queryOne(
    "update users set password_hash = $1, updated_at = now() where id = $2 returning id",
    [await hashPassword(password), claimed.user_id],
  );

  /* Whoever knew the old password is signed out everywhere. A reset is most
     often a response to "someone else may be in my account", and leaving their
     existing sessions alive would defeat the point. */
  await revokeSessions(claimed.user_id);

  await startSession(claimed.user_id);
  revalidatePath("/", "layout");
  redirect("/discover");
}

/* ------------------------------------------------------ change password --- */

export async function changePasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await currentUser();
  if (!user) redirect("/sign-in?next=/settings");

  const current = String(form.get("current") ?? "");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const throttle = await hit(`changepw:user:${user.id}`, LIMITS.changePassword);
  if (throttle.limited) return { error: retryMessage(LIMITS.changePassword) };

  if (password.length < MIN_PASSWORD) {
    return { error: `Use at least ${MIN_PASSWORD} characters.`, field: "password" };
  }
  if (password !== confirm) {
    return { error: "Those two passwords don't match.", field: "confirm" };
  }

  const row = await queryOne<{ password_hash: string | null }>(
    "select password_hash from users where id = $1",
    [user.id],
  );

  /* Proving the old password is what stops a borrowed open session from
     locking the real owner out of their own account. */
  if (!(await verifyPassword(current, row?.password_hash ?? null))) {
    return { error: "That isn't your current password.", field: "current" };
  }

  await queryOne(
    "update users set password_hash = $1, updated_at = now() where id = $2 returning id",
    [await hashPassword(password), user.id],
  );

  await revokeSessions(user.id);
  await startSession(user.id); /* keep the tab that made the change signed in */

  revalidatePath("/", "layout");
  return { done: "Password changed. Every other device has been signed out." };
}

/* --------------------------------------------------- sign out everywhere --- */

export async function signOutEverywhereAction() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  await revokeSessions(user.id);
  endSession();
  revalidatePath("/", "layout");
  redirect("/");
}

/* --------------------------------------------------------- open a studio --- */

export async function openStudioAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await currentUser();
  if (!user) redirect("/sign-in?next=/become-seller");

  /* A handle is a public address other people will link to and type. Changing
     it later silently breaks every one of those links, so this form opens a
     storefront and never edits one — a seller who already has a shop is sent to
     the studio, where renaming will be its own deliberate, warned-about step. */
  if (user.handle) redirect("/sell");

  const name = text(form, "name");
  const neighbourhood = text(form, "neighbourhood");
  const categories = form.getAll("categories").map(String).filter(Boolean);
  const city = cityBySlug(text(form, "city"));

  const throttle = await hit(`openstudio:user:${user.id}`, LIMITS.openStudio);
  if (throttle.limited) return { error: retryMessage(LIMITS.openStudio) };

  if (!name) return { error: "Your storefront needs a name.", field: "name" };
  if (name.length > 60) {
    return { error: "Keep the name to 60 characters or fewer.", field: "name" };
  }

  /* One authority for the rule, shared with the form — see lib/handles.ts. */
  const checked = checkHandle(text(form, "handle"));
  if (!checked.ok) return { error: checked.reason, field: "handle" };

  /* The city is what distance is measured from; the neighbourhood is only ever
     shown as text. Together they are as precise as a listing is allowed to be. */
  if (!city) return { error: "Pick the city you hand over in.", field: "city" };
  if (!neighbourhood) {
    return { error: "Buyers see a neighbourhood, never your address.", field: "neighbourhood" };
  }
  if (neighbourhood.length > 80) {
    return { error: "That neighbourhood name is too long.", field: "neighbourhood" };
  }
  if (!categories.length) {
    return { error: "Choose at least one thing you make.", field: "categories" };
  }
  if (!categories.every((category) => STUDIO_CATEGORIES.includes(category))) {
    return { error: "Pick from the listed categories.", field: "categories" };
  }

  try {
    /* Both writes or neither: a shop row whose owner is still a buyer, or an
       owner flipped to seller with no shop, are each broken in their own way. */
    await transaction(async (run) => {
      await run(
        `insert into storefronts
           (owner_id, name, handle, categories, pickup_neighborhood, city_slug)
         values ($1, $2, $3, $4, $5, $6)`,
        [user.id, name, checked.handle, categories, neighbourhood, city.slug],
      );
      await run(
        "update users set role = 'seller', updated_at = now() where id = $1",
        [user.id],
      );
    });
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      /* The owner_id and handle columns are both unique. Losing the race on
         owner_id means this seller already opened a shop in another tab. */
      const constraint = (error as { constraint?: string }).constraint ?? "";
      if (constraint.includes("owner")) redirect("/sell");
      return { error: "That handle is taken. Try another.", field: "handle" };
    }
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/sell");
}
