"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { hit, LIMITS, retryMessage } from "@/lib/ratelimit";
import type { ListingState } from "@/lib/plans";

/**
 * Leaving or editing a review.
 *
 * The eligibility check is a join, not a flag passed in from the form: the row
 * is only written when `listings.buyer_id` is this user. A form field claiming
 * otherwise buys nothing.
 */
export async function writeReviewAction(
  _prev: ListingState,
  form: FormData,
): Promise<ListingState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in to leave a review." };

  const throttle = await hit(`review:user:${user.id}`, LIMITS.review);
  if (throttle.limited) return { error: retryMessage(LIMITS.review) };

  const listingId = String(form.get("listingId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(listingId)) return { error: "That piece no longer exists." };

  const stars = Number(String(form.get("stars") ?? ""));
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return { error: "Choose one to five stars.", field: "stars" };
  }

  const body = String(form.get("body") ?? "").trim();
  if (body.length > 1200) {
    return { error: "Keep it under 1,200 characters.", field: "body" };
  }

  /* The gate. Only the buyer the seller recorded at handover gets through, and
     the storefront is taken from the listing rather than from the form. */
  const sale = await queryOne<{ storefrontId: string }>(
    `select storefront_id as "storefrontId"
       from listings where id = $1 and buyer_id = $2`,
    [listingId, user.id],
  );

  if (!sale) {
    return { error: "Only the buyer of a piece can review it." };
  }

  await query(
    `insert into reviews (listing_id, storefront_id, author_id, stars, body)
     values ($1, $2, $3, $4, $5)
     on conflict (listing_id, author_id) do update
        set stars = excluded.stars,
            body = excluded.body,
            updated_at = now()`,
    [listingId, sale.storefrontId, user.id, stars, body || null],
  );

  const shop = await queryOne<{ handle: string }>(
    "select handle from storefronts where id = $1",
    [sale.storefrontId],
  );

  revalidatePath(`/listing/${listingId}`);
  revalidatePath("/saved");
  if (shop) revalidatePath(`/artist/${shop.handle}`);

  return { done: "Thanks — your review is on their storefront." };
}
