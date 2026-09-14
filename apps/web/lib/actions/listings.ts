"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query, queryOne, transaction } from "@/lib/db";
import { requireSeller } from "@/lib/guard";
import { hit, LIMITS, retryMessage } from "@/lib/ratelimit";
import { liveCount } from "@/lib/listings";
import { cityBySlug } from "@/lib/cities";
import { FREE_SLOTS, MAX_PHOTOS, MAX_PHOTO_MB, type ListingState } from "@/lib/plans";
import type { Handover, Stream } from "@/lib/types";

const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const STREAMS: Stream[] = ["art", "decor"];
const HANDOVERS: Handover[] = ["in-person", "seller-courier", "buyer-pickup"];

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "piece";
}

/** Appends -2, -3 … until the shop has no piece by that slug. */
async function freeSlug(storefrontId: string, base: string) {
  const taken = await query<{ slug: string }>(
    "select slug from listings where storefront_id = $1 and slug like $2",
    [storefrontId, `${base}%`],
  );
  const used = new Set(taken.map((row) => row.slug));
  if (!used.has(base)) return base;
  for (let n = 2; n < 500; n++) if (!used.has(`${base}-${n}`)) return `${base}-${n}`;
  return `${base}-${Date.now()}`;
}

/* --------------------------------------------------------------- create --- */

export async function createListingAction(
  _prev: ListingState,
  form: FormData,
): Promise<ListingState> {
  const user = await requireSeller("/sell/pieces/new");

  const throttle = await hit(`listing:user:${user.id}`, LIMITS.createListing);
  if (throttle.limited) return { error: retryMessage(LIMITS.createListing) };

  const title = text(form, "title");
  const medium = text(form, "medium");
  const dimensions = text(form, "dimensions");
  const priceRaw = text(form, "price").replace(/[^0-9]/g, "");
  const stream = text(form, "stream") as Stream;
  const story = text(form, "story");
  const materials = text(form, "materials");
  const edition = text(form, "edition") || "One of one";
  const framing = text(form, "framing");
  const yearRaw = text(form, "year");
  const hoursRaw = text(form, "hours");
  const handover = form.getAll("handover").map(String).filter((h): h is Handover =>
    HANDOVERS.includes(h as Handover),
  );

  if (!title) return { error: "Give the piece a title.", field: "title" };
  if (title.length > 90) return { error: "Keep the title under 90 characters.", field: "title" };
  if (!STREAMS.includes(stream)) return { error: "Say what kind of piece this is.", field: "stream" };
  if (!medium) return { error: "What is it made of or painted in?", field: "medium" };
  if (!dimensions) return { error: "Buyers need the size before they ask.", field: "dimensions" };

  const priceInr = Number(priceRaw);
  if (!priceInr || priceInr < 100) {
    return { error: "Set a price of at least ₹100.", field: "price" };
  }
  if (priceInr > 10_000_000) {
    return { error: "That price looks like a typo. Contact us for anything above ₹1,00,00,000.", field: "price" };
  }
  if (!handover.length) {
    return { error: "Choose at least one way to hand it over.", field: "handover" };
  }

  const year = yearRaw ? Number(yearRaw) : null;
  if (year !== null && (Number.isNaN(year) || year < 1900 || year > new Date().getFullYear())) {
    return { error: "That year doesn't look right.", field: "year" };
  }

  const hours = hoursRaw ? Number(hoursRaw) : null;
  if (hours !== null && (Number.isNaN(hours) || hours < 0 || hours > 10000)) {
    return { error: "Hours should be a plain number.", field: "hours" };
  }

  /* Photos. A listing with no picture is not worth publishing, and buyers say
     the photograph is the whole decision. */
  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { error: "Add at least one photograph.", field: "photos" };
  if (files.length > MAX_PHOTOS) {
    return { error: `Up to ${MAX_PHOTOS} photographs.`, field: "photos" };
  }
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: "Photographs must be JPEG, PNG, WebP or AVIF.", field: "photos" };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: `Each photograph must be under ${MAX_PHOTO_MB} MB.`, field: "photos" };
    }
  }

  const shop = await queryOne<{ id: string; city_slug: string | null }>(
    "select id, city_slug from storefronts where handle = $1",
    [user.handle],
  );
  if (!shop) return { error: "Your storefront has gone missing. Reload and try again." };

  /* The shelf is a live-at-once count, not a lifetime cap. §4.2 */
  const live = await liveCount(user.handle);
  if (live >= FREE_SLOTS) {
    return {
      error: `All ${FREE_SLOTS} of your free slots are full. Mark a piece sold to free one, or go Pro for unlimited.`,
    };
  }

  const slug = await freeSlug(shop.id, slugify(title));
  const photos = await Promise.all(
    files.map(async (file) => ({
      type: file.type,
      bytes: Buffer.from(await file.arrayBuffer()),
    })),
  );

  let id: string;
  try {
    /* The row and its pictures land together, or not at all — a listing with
       no photograph is exactly the thing the validation above refuses. */
    id = await transaction(async (run) => {
      const [row] = await run<{ id: string }>(
        `insert into listings
           (storefront_id, title, slug, story, price_inr, stream, medium, dimensions,
            year, materials, edition, hours, framing, handover, negotiable, ai_assisted, status)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'live')
         returning id`,
        [
          shop.id, title, slug, story || null, priceInr, stream, medium, dimensions,
          year, materials || null, edition, hours, framing || null, handover,
          form.get("negotiable") === "on", form.get("aiAssisted") === "on",
        ],
      );

      for (const [position, photo] of photos.entries()) {
        await run(
          `insert into listing_photos (listing_id, bytes, content_type, position)
           values ($1, $2, $3, $4)`,
          [row.id, photo.bytes, photo.type, position],
        );
      }

      return row.id;
    });
  } catch (error) {
    console.error("createListing failed:", (error as Error).message);
    return { error: "Could not save the piece. Try again." };
  }

  revalidatePath("/discover");
  revalidatePath(`/artist/${user.handle}`);
  revalidatePath("/sell/pieces");
  redirect(`/sell/pieces?added=${id}`);
}

/* ---------------------------------------------------------- status moves --- */

/**
 * Moving a piece between live, sold and archived.
 *
 * Marking it sold frees the slot at once — that is the point of counting live
 * pieces rather than uploads — and optionally records who bought it. That last
 * part is what makes a review possible later: CraftGali never sees the money,
 * so the seller naming the buyer at handover is the only anchor a review can
 * have. It is optional because a handover to someone with no account is a
 * perfectly ordinary sale.
 */
export async function setListingStatusAction(
  _prev: ListingState,
  formData: FormData,
): Promise<ListingState> {
  const user = await requireSeller("/sell/pieces");

  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("status") ?? "");
  if (!["live", "sold", "archived"].includes(next)) return null;

  const soldFor = next === "sold"
    ? String(formData.get("soldFor") ?? "").replace(/[^0-9]/g, "")
    : "";

  /* The buyer, if the seller named one. An address we do not recognise is not
     an error — plenty of buyers never make an account — but it cannot become a
     review either, so say so rather than swallowing it. */
  let buyerId: string | null = null;
  let unknownBuyer: string | null = null;

  if (next === "sold") {
    const email = String(formData.get("buyerEmail") ?? "").trim().toLowerCase();
    if (email) {
      const buyer = await queryOne<{ id: string }>("select id from users where email = $1", [email]);
      if (buyer) buyerId = buyer.id;
      else unknownBuyer = email;
    }
  }

  /* Scoped to this seller's own storefront: an id in a form field is not
     authority to touch somebody else's listing. */
  const moved = await queryOne<{ title: string }>(
    `update listings l
        set status = $3,
            sold_for_inr = case when $3 = 'sold'
                                then coalesce(nullif($4, '')::integer, l.price_inr)
                                else null end,
            buyer_id = case when $3 = 'sold' then $5::uuid else null end,
            sold_at  = case when $3 = 'sold' then now() else null end,
            updated_at = now()
       from storefronts s
      where l.storefront_id = s.id and s.handle = $1 and l.id = $2
      returning l.title`,
    [user.handle, id, next, soldFor, buyerId],
  );

  revalidatePath("/sell/pieces");
  revalidatePath("/discover");
  revalidatePath(`/artist/${user.handle}`);

  if (!moved) return { error: "That piece is no longer yours to move." };

  if (unknownBuyer) {
    return {
      done: `Marked sold. No CraftGali account uses ${unknownBuyer}, so there is nobody to invite a review from — ask them to sign up and set it again.`,
    };
  }
  if (next === "sold" && buyerId) {
    return { done: `Marked sold. ${moved.title} is now open for the buyer to review.` };
  }

  if (next === "sold") return { done: "Marked sold. A slot has freed." };
  return { done: next === "live" ? "Back on the shelf." : "Archived. The slot is free." };
}

/* --------------------------------------------------------- where you are --- */

/**
 * The handover location: a city and a neighbourhood.
 *
 * They are one form because they are one decision. The city is structured and
 * is what every distance in the app is measured from; the neighbourhood is free
 * text a buyer only ever reads. Neither is an address, and that is the point —
 * a listing carries "Bandra West, Mumbai" and never a door number. §3.4
 *
 * A shop opened before cities existed has none, which quietly removes it from
 * every distance search. That is worth nagging about until it is fixed, and
 * worth being able to change afterwards without support.
 */
export async function updateHandoverAction(
  _prev: ListingState,
  formData: FormData,
): Promise<ListingState> {
  const user = await requireSeller("/sell/storefront");

  const throttle = await hit(`handover:user:${user.id}`, LIMITS.updateShop);
  if (throttle.limited) return { error: retryMessage(LIMITS.updateShop) };

  const city = cityBySlug(String(formData.get("city") ?? ""));
  if (!city) return { error: "Pick the city you hand over in.", field: "city" };

  const neighbourhood = String(formData.get("neighbourhood") ?? "").trim();
  if (!neighbourhood) {
    return { error: "Buyers see a neighbourhood, never your address.", field: "neighbourhood" };
  }
  if (neighbourhood.length > 80) {
    return { error: "That neighbourhood name is too long.", field: "neighbourhood" };
  }

  await query(
    `update storefronts
        set city_slug = $2, pickup_neighborhood = $3, updated_at = now()
      where handle = $1`,
    [user.handle, city.slug, neighbourhood],
  );

  /* Every surface that quotes a distance or a place has just gone stale. */
  revalidatePath("/sell/storefront");
  revalidatePath("/sell/pieces");
  revalidatePath("/sell");
  revalidatePath("/discover");
  revalidatePath(`/artist/${user.handle}`);

  return { done: `Handover set to ${neighbourhood}, ${city.name}.` } as ListingState;
}
