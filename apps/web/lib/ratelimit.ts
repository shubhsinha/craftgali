import "server-only";

import { headers } from "next/headers";
import { query, queryOne } from "./db";

/**
 * A fixed-window throttle backed by the `auth_attempts` table.
 *
 * It lives in Postgres rather than in process memory because the web app is
 * deployed as serverless functions: an in-memory counter would reset on every
 * cold start and would not be shared between concurrent instances, which is the
 * same as having no limit at all.
 */

export interface Limit {
  /** How many attempts are allowed inside the window. */
  max: number;
  /** The window, in seconds. */
  windowSec: number;
}

/* Tuned to be invisible to a person who mistypes a password twice and painful
   for anything working through a word list. The per-IP limits are looser than
   the per-account ones because a household or an office shares an address. */
export const LIMITS = {
  signInEmail: { max: 5, windowSec: 15 * 60 },
  signInIp: { max: 30, windowSec: 15 * 60 },
  registerIp: { max: 10, windowSec: 60 * 60 },
  resetEmail: { max: 3, windowSec: 60 * 60 },
  resetIp: { max: 10, windowSec: 60 * 60 },
  resetConfirmIp: { max: 20, windowSec: 60 * 60 },
  changePassword: { max: 10, windowSec: 60 * 60 },
  openStudio: { max: 15, windowSec: 60 * 60 },
  createListing: { max: 40, windowSec: 60 * 60 },
  updateShop: { max: 20, windowSec: 60 * 60 },
  save: { max: 200, windowSec: 60 * 60 },
  review: { max: 20, windowSec: 60 * 60 },
  follow: { max: 200, windowSec: 60 * 60 },
  shopDetails: { max: 30, windowSec: 60 * 60 },
  shopMedia: { max: 20, windowSec: 60 * 60 },
  publishSkin: { max: 30, windowSec: 60 * 60 },
  sendMessage: { max: 120, windowSec: 60 * 60 },
  startThread: { max: 30, windowSec: 60 * 60 },
} satisfies Record<string, Limit>;

/**
 * The caller's address, as far as it can be trusted.
 *
 * Behind a proxy this is whatever that proxy put at the head of
 * `x-forwarded-for`. A client can forge the header when the app is exposed
 * directly, so the per-IP limits are a speed bump on top of the per-account
 * ones, never the only thing standing in the way.
 */
export function clientIp() {
  const head = headers();
  const forwarded = head.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return head.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Records an attempt and reports whether the bucket is now over its limit.
 *
 * The attempt is written first and then counted, so a burst of concurrent
 * requests cannot all read a stale count and slip through together.
 */
export async function hit(bucket: string, limit: Limit): Promise<RateResult> {
  await query("insert into auth_attempts (bucket) values ($1)", [bucket]);

  const row = await queryOne<{ used: string }>(
    `select count(*) as used
       from auth_attempts
      where bucket = $1
        and occurred_at > now() - make_interval(secs => $2)`,
    [bucket, limit.windowSec],
  );

  const used = Number(row?.used ?? 0);

  /* Sweep this bucket's expired rows now and again rather than running a cron:
     the table is only written on auth attempts, so it stays small. */
  if (used % 10 === 0) {
    await query(
      `delete from auth_attempts
        where bucket = $1 and occurred_at <= now() - make_interval(secs => $2)`,
      [bucket, limit.windowSec],
    );
  }

  return { limited: used > limit.max, used, limit };
}

export interface RateResult {
  limited: boolean;
  used: number;
  limit: Limit;
}

/** Clears a bucket. Called after a success, so one good sign-in resets the count. */
export async function clear(bucket: string) {
  await query("delete from auth_attempts where bucket = $1", [bucket]);
}

/** "Try again in about 15 minutes." — approximate on purpose, never a countdown. */
export function retryMessage(limit: Limit) {
  const minutes = Math.round(limit.windowSec / 60);
  const [amount, unit] =
    minutes >= 60 ? [Math.round(minutes / 60), "hour"] : [minutes, "minute"];

  return `Too many attempts. Try again in about ${amount} ${unit}${amount === 1 ? "" : "s"}.`;
}
