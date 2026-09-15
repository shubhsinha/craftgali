import "server-only";

import { query, queryOne } from "./db";
import { cityBySlug, distanceKm } from "./cities";
import { PIECES, studioFor } from "./sample-data";
import type { Handover, Piece, Stream } from "./types";

/**
 * Real listings, mapped into the same `Piece` shape the pages already render.
 *
 * The design comps in `sample-data.ts` are still the populated shop window —
 * they are what the seeded studios show. What a seller actually lists lands
 * here and is merged in beside them, so a new piece appears in the feed, on its
 * maker's storefront and on its own page without any of those pages caring
 * where it came from.
 */

export interface ListingRow {
  id: string;
  slug: string;
  title: string;
  story: string | null;
  priceInr: number;
  soldForInr: number | null;
  stream: Stream;
  medium: string;
  dimensions: string;
  year: number | null;
  materials: string | null;
  edition: string | null;
  hours: number | null;
  framing: string | null;
  handover: Handover[];
  negotiable: boolean;
  aiAssisted: boolean;
  status: string;
  handle: string;
  shopName: string;
  citySlug: string | null;
  neighbourhood: string;
  photoIds: string[];
}

export const SELECT_LISTING = `
  select l.id,
         l.slug,
         l.title,
         l.story,
         l.price_inr    as "priceInr",
         l.sold_for_inr as "soldForInr",
         l.stream,
         l.medium,
         l.dimensions,
         l.year,
         l.materials,
         l.edition,
         l.hours,
         l.framing,
         l.handover,
         l.negotiable,
         l.ai_assisted  as "aiAssisted",
         l.status,
         s.handle,
         s.name         as "shopName",
         s.city_slug    as "citySlug",
         s.pickup_neighborhood as "neighbourhood",
         coalesce(
           (select array_agg(p.id::text order by p.position, p.created_at)
              from listing_photos p where p.listing_id = l.id),
           '{}'
         ) as "photoIds"
    from listings l
    join storefronts s on s.id = l.storefront_id`;

export /** A stable number in [0,900) from a uuid, for placeholder photography. */
function seedFromId(id: string) {
  let total = 0;
  for (const char of id) total = (total * 31 + char.charCodeAt(0)) % 900;
  return total;
}

export function rowToPiece(row: ListingRow): Piece {
  const studio = studioFor(row.handle);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    /* Only read when a listing has no photographs — which the create form does
       not allow, but a seeded row or one whose pictures were removed can be.
       Deriving it from the id keeps such a piece visually distinct instead of
       giving every one of them the same placeholder. */
    seed: seedFromId(row.id),
    photoIds: row.photoIds,
    priceInr: row.priceInr,
    soldForInr: row.soldForInr ?? undefined,
    medium: row.medium,
    dimensions: row.dimensions,
    year: row.year ?? undefined,
    stream: row.stream,
    studio: { name: row.shopName, handle: row.handle },
    negotiable: row.negotiable,
    /* Verification is a property of the studio, not of the piece. A shop that
       has not done the 20-second check does not get the badge on its work. */
    verifiedMaker: studio?.verifiedMaker ?? false,
    aiAssisted: row.aiAssisted,
    handover: row.handover,
    citySlug: row.citySlug ?? undefined,
    detail: {
      story: row.story ? row.story.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) : [],
      hours: row.hours ?? undefined,
      materials: row.materials ?? "",
      edition: row.edition ?? "One of one",
      framing: row.framing ?? undefined,
      meetNote: `Meet around ${row.neighbourhood} and pay on handover.`,
    },
  };
}

/** How many real listings a feed request fetches. Comp pieces ride behind. */
export const FEED_PAGE = 48;

export interface FeedQuery {
  stream?: Stream;
  /** Only shops in these cities — the buyer's radius resolved to city slugs. */
  cities?: string[];
  q?: string;
  page?: number;
}

/**
 * One page of the feed, filtered in Postgres.
 *
 * The first version loaded every live listing on every request and let the
 * browser filter — fine at a hundred rows, a full table scan and a megabyte of
 * JSON at a hundred thousand. This pushes stream, city and the search term into
 * the query, pages it, and leans on idx_listings_feed.
 */
export async function feedPage(opts: FeedQuery = {}): Promise<{ pieces: Piece[]; hasMore: boolean }> {
  const page = Math.max(0, opts.page ?? 0);
  const where: string[] = ["l.status in ('live','sold')", "s.status = 'active'"];
  const params: unknown[] = [];

  if (opts.stream) { params.push(opts.stream); where.push(`l.stream = $${params.length}`); }
  if (opts.cities?.length) { params.push(opts.cities); where.push(`s.city_slug = any($${params.length}::text[])`); }
  if (opts.q?.trim()) {
    params.push(`%${opts.q.trim()}%`);
    where.push(`(l.title ilike $${params.length} or l.medium ilike $${params.length} or s.name ilike $${params.length})`);
  }

  params.push(FEED_PAGE + 1, page * FEED_PAGE);
  const rows = await query<ListingRow>(
    `${SELECT_LISTING} where ${where.join(" and ")}
      order by l.created_at desc
      limit $${params.length - 1} offset $${params.length}`,
    params,
  );

  return {
    pieces: rows.slice(0, FEED_PAGE).map(rowToPiece),
    hasMore: rows.length > FEED_PAGE,
  };
}

/** Everything a buyer may see: live and sold, never drafts or archived. */
export async function livePieces(): Promise<Piece[]> {
  const rows = await query<ListingRow>(
    `${SELECT_LISTING} where l.status in ('live','sold') and s.status = 'active'
      order by l.created_at desc`,
  );
  return rows.map(rowToPiece);
}

/**
 * The feed: real listings first, then the seeded comp content behind them.
 *
 * A comp piece carries no city of its own — it belongs to a studio, and the
 * studio is what has an address. Stamping it here is what keeps the design
 * content inside a distance search rather than silently absent from every one.
 */
export async function catalogue(): Promise<Piece[]> {
  const comps = PIECES.map((piece) =>
    piece.citySlug
      ? piece
      : { ...piece, citySlug: studioFor(piece.studio.handle)?.citySlug },
  );

  return [...(await livePieces()), ...comps];
}

export async function pieceBySlugOrId(idOrSlug: string): Promise<Piece | null> {
  const byId = /^[0-9a-f-]{36}$/i.test(idOrSlug);
  const row = await queryOne<ListingRow>(
    `${SELECT_LISTING} where ${byId ? "l.id = $1" : "l.slug = $1"} and l.status in ('live','sold') limit 1`,
    [idOrSlug],
  );
  return row ? rowToPiece(row) : null;
}

/** One shop's shelf, for the storefront and the studio. */
export async function shelfFromDb(handle: string) {
  const rows = await query<ListingRow>(
    `${SELECT_LISTING} where s.handle = $1 and l.status in ('live','sold')
      order by l.created_at desc`,
    [handle],
  );
  const pieces = rows.map(rowToPiece);
  return {
    live: pieces.filter((p) => !p.soldForInr),
    sold: pieces.filter((p) => p.soldForInr),
  };
}

/** Everything the seller owns, drafts and archive included. */
export async function ownPieces(handle: string) {
  const rows = await query<ListingRow & { status: string }>(
    `${SELECT_LISTING} where s.handle = $1 order by l.created_at desc`,
    [handle],
  );
  return rows.map((row) => ({ ...rowToPiece(row), status: row.status }));
}

/** Live pieces count against the plan's slots; sold and archived do not. */
export async function liveCount(handle: string) {
  const row = await queryOne<{ n: string }>(
    `select count(*) as n from listings l
       join storefronts s on s.id = l.storefront_id
      where s.handle = $1 and l.status = 'live'`,
    [handle],
  );
  return Number(row?.n ?? 0);
}

/* ------------------------------------------------------------- distance --- */

/**
 * How far each piece is from the buyer.
 *
 * A seeded comp piece carries its own `distanceKm` from the design; a real one
 * is measured city-to-city, which is the most precision a listing is allowed to
 * imply. A shop with no city set simply has no distance, and a distance filter
 * therefore excludes it rather than guessing.
 */
export function withDistance(pieces: Piece[], from: { lat: number; lng: number }) {
  return pieces.map((piece) => {
    if (!piece.citySlug) return piece;
    const city = cityBySlug(piece.citySlug);
    if (!city) return piece;
    return { ...piece, distanceKm: Math.round(distanceKm(from, city) * 10) / 10 };
  });
}
