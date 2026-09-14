/**
 * Storefront handles.
 *
 * A handle is the seller's public address — `craftgali.com/@meera` — so it is
 * the one field on the form that a buyer will read, type and trust. That makes
 * it worth more care than the rest: it has to be unambiguous when spoken aloud,
 * impossible to confuse with CraftGali's own pages, and impossible to use to
 * pass yourself off as staff.
 *
 * This module is the single authority. The form imports it for live feedback
 * and the server action imports it to decide — the client copy is a courtesy,
 * never the check.
 */

export const HANDLE_MIN = 3;
export const HANDLE_MAX = 30;

/**
 * Names nobody may take.
 *
 * Two groups: every path segment the site itself uses, so a handle can never be
 * read as a CraftGali page; and the words someone would pick in order to be
 * mistaken for us — support, admin, billing, the brand itself.
 */
const RESERVED = new Set([
  /* our own routes */
  "about", "api", "artist", "become-seller", "discover", "fees", "forgot-password",
  "grievance", "guidelines", "how-it-works", "listing", "messages", "register",
  "reset-password", "saved", "sell", "settings", "sign-in", "sign-out", "signin",
  "signup", "studio", "studios", "trust",
  /* things we may want later, cheap to hold back now */
  "auctions", "blog", "cart", "checkout", "explore", "help", "home", "orders",
  "pre-loved", "press", "pricing", "search", "shop", "terms", "privacy",
  /* impersonation */
  "admin", "administrator", "billing", "craftgali", "craft-gali", "info",
  "moderator", "official", "payments", "root", "security", "staff", "support",
  "system", "team", "verify", "verified",
]);

export type HandleProblem =
  | { ok: false; reason: string }
  | { ok: true; handle: string };

/**
 * Normalises what someone typed into what would be stored: lowercase, and only
 * the characters a handle may contain.
 *
 * This is the same shape the form applies as you type, so what you see in the
 * preview under the field is exactly what gets checked.
 */
export function normaliseHandle(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

/**
 * The rule: starts and ends with a letter or digit, single hyphens inside.
 *
 * Leading, trailing and doubled hyphens are out because `-meera` and `me--era`
 * are unreadable in a URL and trivial to confuse with the real thing. A
 * digits-only handle is allowed — plenty of shops are named for a year.
 */
export function checkHandle(input: string): HandleProblem {
  const handle = normaliseHandle(input);

  if (handle.length < HANDLE_MIN) {
    return { ok: false, reason: `Use at least ${HANDLE_MIN} letters or digits.` };
  }
  if (handle.length > HANDLE_MAX) {
    return { ok: false, reason: `Keep it to ${HANDLE_MAX} characters or fewer.` };
  }
  if (!/^[a-z0-9]/.test(handle) || !/[a-z0-9]$/.test(handle)) {
    return { ok: false, reason: "Start and end with a letter or digit." };
  }
  if (handle.includes("--")) {
    return { ok: false, reason: "Use single hyphens — two in a row is hard to read." };
  }
  if (RESERVED.has(handle)) {
    return { ok: false, reason: "That handle is reserved. Pick another." };
  }

  return { ok: true, handle };
}

/** Turns a storefront name into a first suggestion. */
export function suggestHandle(name: string) {
  return normaliseHandle(name.replace(/[^a-zA-Z0-9]+/g, "-"))
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, HANDLE_MAX)
    .replace(/-+$/, "");
}

/** What a storefront may say it makes. The form renders these; the action
    checks against them, because a hidden input is just a suggestion. */
export const STUDIO_CATEGORIES = [
  "Paintings & Canvas",
  "Handcrafted Objects",
  "Pre-Loved Items",
];
