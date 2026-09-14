import type { Piece } from "./types";

/**
 * Placeholder photography for the seeded comp pieces. Every artwork in the
 * design references a stable seed, so a piece keeps the same image across pages.
 */
export function placeholder(seed: number, w: number, h: number) {
  return `https://picsum.photos/seed/cg${seed}/${w}/${h}`;
}

/** An uploaded photo, served out of the database. */
export function photoUrl(id: string) {
  return `/api/photos/${id}`;
}

/**
 * The picture to show for a piece, wherever it came from.
 *
 * A real listing has uploads; a comp piece has a seed. `index` reaches further
 * into the strip for the gallery's thumbnails and falls back to the first shot
 * rather than to nothing.
 */
export function pieceImage(piece: Piece, w: number, h: number, index = 0) {
  const photos = piece.photoIds ?? [];
  if (photos.length) return photoUrl(photos[Math.min(index, photos.length - 1)]);
  return placeholder(piece.seed, w, h);
}

/** How many pictures a piece actually has, for the thumbnail strip. */
export function pieceImageCount(piece: Piece) {
  return piece.photoIds?.length || 1 + (piece.detail?.gallery?.length ?? 0);
}
