"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { hit, LIMITS, retryMessage } from "@/lib/ratelimit";

/**
 * Toggling a save.
 *
 * Returns the new state rather than redirecting, so the heart can flip in place
 * — a save is a small enough act that a full navigation for it would feel
 * broken. A signed-out visitor is sent to sign in and brought back, because the
 * list has to belong to somebody.
 */
export async function toggleSaveAction(listingId: string, next: string) {
  const user = await currentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(next)}`);

  if (!/^[0-9a-f-]{36}$/i.test(listingId)) return { saved: false };

  const throttle = await hit(`save:user:${user.id}`, LIMITS.save);
  if (throttle.limited) return { saved: false, error: retryMessage(LIMITS.save) };

  /* One statement decides: delete if it was there, and report what happened.
     Reading then writing would let a double-click land twice. */
  const removed = await queryOne<{ ok: boolean }>(
    "delete from saves where user_id = $1 and listing_id = $2 returning true as ok",
    [user.id, listingId],
  );

  if (!removed) {
    await query(
      `insert into saves (user_id, listing_id) values ($1, $2)
       on conflict do nothing`,
      [user.id, listingId],
    );
  }

  revalidatePath("/saved");
  return { saved: !removed };
}
