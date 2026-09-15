import "server-only";

import { cache } from "react";

import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { queryOne } from "./db";
import { SESSION_COOKIE } from "./session";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

export { SESSION_COOKIE } from "./session";

const SESSION_DAYS = 30;

export type Role = "buyer" | "seller";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  city: string | null;
  handle: string | null;
}

/** How long a reset link stays good. Long enough to find the mail, short
    enough that an old one in an inbox is not a standing key to the account. */
export const RESET_TTL_MINUTES = 60;

/* ------------------------------------------------------------- passwords --- */

/**
 * scrypt from the standard library — no native build step, and a memory-hard KDF
 * rather than a bare hash. Stored as `scrypt$<salt hex>$<key hex>` so the
 * parameters travel with the digest and can be changed later.
 */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string | null) {
  if (!stored) return false;

  const [scheme, saltHex, keyHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);

  /* Constant-time, and only reached when the lengths already agree. */
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/* -------------------------------------------------------------- sessions --- */

/**
 * Whether the session cookie may carry `Secure`.
 *
 * A browser silently refuses to store a Secure cookie sent over plain HTTP, so
 * keying this off NODE_ENV alone breaks sign-in on any http:// deployment: the
 * action succeeds, the redirect happens, and the session never arrives — which
 * looks like a wrong password rather than a missing certificate.
 *
 * Keying it off the origin we are actually served from gets both right. A real
 * https:// domain becomes Secure on its own, and an http:// host (a Coolify
 * sslip.io address, say) still works until a certificate is in front of it.
 */
function cookieIsSecure() {
  const origin = process.env.SITE_ORIGIN;
  if (origin) return origin.startsWith("https://");
  return process.env.NODE_ENV === "production";
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not set — copy .env.example to .env.local.");
  return new TextEncoder().encode(value);
}

/**
 * Mints a session cookie.
 *
 * The token carries the user's current `session_version`. Bumping that column
 * invalidates every token already out there, which is what makes a password
 * change or a "sign out everywhere" actually revoke access — a stateless JWT
 * is otherwise valid until it expires, whatever the server does afterwards.
 */
export async function startSession(userId: string) {
  const row = await queryOne<{ session_version: number }>(
    "select session_version from users where id = $1",
    [userId],
  );

  const token = await new SignJWT({ sub: userId, sv: row?.session_version ?? 1 })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieIsSecure(),
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export function endSession() {
  cookies().delete(SESSION_COOKIE);
}

/**
 * The signed-in user, or null. Reads the row every time rather than trusting
 * claims in the cookie, so a role change or a deletion takes effect at once.
 */
/**
 * Memoised for the length of one request.
 *
 * The header, the layout and the page all ask who is signed in, and without
 * this each one is a separate round-trip to Postgres for the same row. React's
 * `cache` dedupes them inside a single render, which is exactly the scope a
 * session check should have: fresh on every request, once per request.
 */
export const currentUser = cache(async (): Promise<SessionUser | null> => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  let userId: string;
  let version: number;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    userId = payload.sub;
    version = typeof payload.sv === "number" ? payload.sv : 0;
  } catch {
    return null; /* expired, tampered with, or signed by an old secret */
  }

  const user = await queryOne<SessionUser & { sessionVersion: number }>(
    `select u.id,
            u.email,
            u.full_name as "fullName",
            u.role,
            u.city,
            u.session_version as "sessionVersion",
            s.handle
       from users u
       left join storefronts s on s.owner_id = u.id
      where u.id = $1`,
    [userId],
  );

  if (!user) return null;

  /* Revoked: the password changed, or the account signed out everywhere, after
     this token was minted. Tokens issued before `sv` existed have version 0 and
     fail here too, which is the behaviour we want on an upgrade. */
  if (user.sessionVersion !== version) return null;

  const { sessionVersion: _sessionVersion, ...session } = user;
  return session;
});

/**
 * Revokes every session the user has, including the caller's own.
 *
 * Used after a password change or reset, and behind the "sign out everywhere"
 * button — the one honest answer to "someone else may have my password".
 */
export async function revokeSessions(userId: string) {
  await queryOne(
    "update users set session_version = session_version + 1, updated_at = now() where id = $1 returning id",
    [userId],
  );
}

/* -------------------------------------------------------- reset tokens --- */

/**
 * A reset token and the digest to store for it.
 *
 * Only the digest is written down. The raw token exists in the emailed link and
 * nowhere else, so a database read cannot be turned into an account takeover —
 * the same reasoning as passwords, and the reason this is not just a uuid
 * column with the value in it.
 */
export function makeResetToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashResetToken(token) };
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
