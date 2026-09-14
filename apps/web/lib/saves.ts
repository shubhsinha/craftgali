import "server-only";

import { query, queryOne } from "./db";
import { cityBySlug, distanceKm } from "./cities";
import type { Piece } from "./types";

/**
 * Saving a piece.
 *
 * The asymmetry is the whole design: a buyer owns their own list and can read
 * it; a seller is told a count and never a name. So everything on the selling
 * side of this file aggregates, and everything on the buying side is scoped to
 * one user id — there is no query here that hands a seller a list of people.
 */

export async function isSaved(userId: string, listingId: string) {
  const row = await queryOne<{ ok: boolean }>(
    "select true as ok from saves where user_id = $1 and listing_id = $2",
    [userId, listingId],
  );
  return Boolean(row);
}

/** Which of these the viewer has saved, in one round trip. */
export async function savedIds(userId: string | null, listingIds: string[]) {
  if (!userId || !listingIds.length) return new Set<string>();

  const rows = await query<{ listing_id: string }>(
    "select listing_id from saves where user_id = $1 and listing_id = any($2::uuid[])",
    [userId, listingIds],
  );
  return new Set(rows.map((row) => row.listing_id));
}

/** How many people saved each of these. Counts only — never who. */
export async function saveCounts(listingIds: string[]) {
  if (!listingIds.length) return new Map<string, number>();

  const rows = await query<{ listing_id: string; n: string }>(
    `select listing_id, count(*) as n
       from saves where listing_id = any($1::uuid[])
      group by listing_id`,
    [listingIds],
  );
  return new Map(rows.map((row) => [row.listing_id, Number(row.n)]));
}

/** The buyer's own list, newest first. */
export async function savedPieces(userId: string, from?: { lat: number; lng: number }) {
  const { SELECT_LISTING, rowToPiece } = await import("./listings");

  const rows = await query<Parameters<typeof rowToPiece>[0]>(
    `${SELECT_LISTING}
       join saves sv on sv.listing_id = l.id
      where sv.user_id = $1 and l.status in ('live','sold')
      order by sv.created_at desc`,
    [userId],
  );

  const pieces: Piece[] = rows.map(rowToPiece);
  if (!from) return pieces;

  return pieces.map((piece) => {
    const city = piece.citySlug ? cityBySlug(piece.citySlug) : null;
    return city
      ? { ...piece, distanceKm: Math.round(distanceKm(from, city) * 10) / 10 }
      : piece;
  });
}
