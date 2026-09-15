import "server-only";

import { query, queryOne } from "./db";

/**
 * Following a shop. The same asymmetry as saves: a buyer owns their list and a
 * seller is told a number. There is no function here that returns a follower's
 * name to anyone but that follower.
 */

export async function isFollowing(userId: string | null, storefrontId: string) {
  if (!userId) return false;
  const row = await queryOne<{ ok: boolean }>(
    "select true as ok from follows where user_id = $1 and storefront_id = $2",
    [userId, storefrontId],
  );
  return Boolean(row);
}

export async function followerCount(storefrontId: string) {
  const row = await queryOne<{ n: string }>(
    "select count(*) as n from follows where storefront_id = $1",
    [storefrontId],
  );
  return Number(row?.n ?? 0);
}

/** Shops this buyer follows — for their own page, never a seller's. */
export async function followedHandles(userId: string) {
  return query<{ handle: string; name: string }>(
    `select s.handle, s.name from follows f
       join storefronts s on s.id = f.storefront_id
      where f.user_id = $1 order by f.created_at desc`,
    [userId],
  );
}
