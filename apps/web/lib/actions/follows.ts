"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { hit, LIMITS, retryMessage } from "@/lib/ratelimit";

/** Toggle. Returns the new state so the button flips in place. */
export async function toggleFollowAction(handle: string, next: string) {
  const user = await currentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(next)}`);

  const throttle = await hit(`follow:user:${user.id}`, LIMITS.follow);
  if (throttle.limited) return { following: false, error: retryMessage(LIMITS.follow) };

  const shop = await queryOne<{ id: string }>("select id from storefronts where handle = $1", [handle]);
  if (!shop) return { following: false };

  /* One statement decides, so a double-click cannot land twice. */
  const removed = await queryOne<{ ok: boolean }>(
    "delete from follows where user_id = $1 and storefront_id = $2 returning true as ok",
    [user.id, shop.id],
  );
  if (!removed) {
    await query(
      "insert into follows (user_id, storefront_id) values ($1, $2) on conflict do nothing",
      [user.id, shop.id],
    );
  }

  revalidatePath(`/artist/${handle}`);
  return { following: !removed };
}
