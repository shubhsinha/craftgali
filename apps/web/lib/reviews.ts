import "server-only";

import { query, queryOne } from "./db";

/**
 * Reviews.
 *
 * A review is only worth reading if it came from someone who actually took the
 * piece home. CraftGali never handles the money, so there is no payment to
 * anchor that to — what anchors it instead is the seller naming the buyer when
 * they mark a piece sold. That one fact decides who may review, and nobody
 * else can.
 */

export interface Review {
  id: string;
  stars: number;
  body: string | null;
  createdAt: string;
  /** The reviewer's first name. A full name on a public page is more than a
      review needs, and more than the reviewer agreed to. */
  by: string;
  piece: string;
  listingId: string;
}

export interface ShopRating {
  /** Mean stars to one decimal, or null when nobody has reviewed yet. */
  rating: number | null;
  count: number;
}

const SELECT_REVIEW = `
  select r.id,
         r.stars,
         r.body,
         r.created_at as "createdAt",
         split_part(u.full_name, ' ', 1) as by,
         l.title      as piece,
         l.id::text   as "listingId"
    from reviews r
    join users u on u.id = r.author_id
    join listings l on l.id = r.listing_id`;

export async function reviewsForShop(handle: string, limit = 20): Promise<Review[]> {
  return query<Review>(
    `${SELECT_REVIEW}
      join storefronts s on s.id = r.storefront_id
     where s.handle = $1
     order by r.created_at desc
     limit $2`,
    [handle, limit],
  );
}

/** The headline figure. Derived, never stored — a cached average goes stale. */
export async function ratingForShop(handle: string): Promise<ShopRating> {
  const row = await queryOne<{ avg: string | null; n: string }>(
    `select avg(r.stars) as avg, count(*) as n
       from reviews r
       join storefronts s on s.id = r.storefront_id
      where s.handle = $1`,
    [handle],
  );

  const count = Number(row?.n ?? 0);
  return {
    count,
    rating: count && row?.avg ? Math.round(Number(row.avg) * 10) / 10 : null,
  };
}

/** Ratings for several shops at once, for a page that lists them. */
export async function ratingsForShops(handles: string[]) {
  if (!handles.length) return new Map<string, ShopRating>();

  const rows = await query<{ handle: string; avg: string; n: string }>(
    `select s.handle, avg(r.stars) as avg, count(*) as n
       from reviews r
       join storefronts s on s.id = r.storefront_id
      where s.handle = any($1::text[])
      group by s.handle`,
    [handles],
  );

  return new Map(
    rows.map((row) => [
      row.handle,
      { rating: Math.round(Number(row.avg) * 10) / 10, count: Number(row.n) } as ShopRating,
    ]),
  );
}

/* ------------------------------------------------------------ eligibility --- */

export interface ReviewStanding {
  /** True when this viewer is the recorded buyer of this piece. */
  mayReview: boolean;
  /** Their existing review, if they have already left one. */
  own: { id: string; stars: number; body: string | null } | null;
}

/**
 * May this person review this piece, and have they already?
 *
 * The only gate is being the buyer the seller recorded at handover. Not having
 * messaged, not having saved it — bought it.
 */
export async function standing(userId: string | null, listingId: string): Promise<ReviewStanding> {
  if (!userId) return { mayReview: false, own: null };

  const row = await queryOne<{ isBuyer: boolean; id: string | null; stars: number | null; body: string | null }>(
    `select (l.buyer_id = $1) as "isBuyer", r.id, r.stars, r.body
       from listings l
       left join reviews r on r.listing_id = l.id and r.author_id = $1
      where l.id = $2`,
    [userId, listingId],
  );

  if (!row) return { mayReview: false, own: null };

  return {
    mayReview: Boolean(row.isBuyer),
    own: row.id ? { id: row.id, stars: row.stars!, body: row.body } : null,
  };
}

/** Pieces this buyer owns and has not reviewed — the nudge on their saved page. */
export async function awaitingReview(userId: string) {
  return query<{ id: string; title: string; shop: string; handle: string }>(
    `select l.id, l.title, s.name as shop, s.handle
       from listings l
       join storefronts s on s.id = l.storefront_id
       left join reviews r on r.listing_id = l.id and r.author_id = $1
      where l.buyer_id = $1 and r.id is null
      order by l.sold_at desc nulls last`,
    [userId],
  );
}
