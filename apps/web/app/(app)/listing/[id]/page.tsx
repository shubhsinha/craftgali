import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingPage } from "@/components/marketplace/ListingPage";
import { pieceBySlugOrId } from "@/lib/listings";
import { pieceById } from "@/lib/sample-data";
import { readPlace } from "@/lib/place";
import { currentUser } from "@/lib/auth";
import { isSaved, saveCounts } from "@/lib/saves";
import { ratingForShop, reviewsForShop, standing } from "@/lib/reviews";
import { cityBySlug, distanceKm } from "@/lib/cities";
import type { Piece } from "@/lib/types";

/** A real listing first, then the seeded comp pieces behind it. */
async function resolve(id: string): Promise<Piece | null> {
  return (await pieceBySlugOrId(id)) ?? pieceById(id) ?? null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const piece = await resolve(params.id);
  if (!piece) return { title: "Listing" };

  return {
    title: piece.title,
    description: `${piece.medium} · ${piece.dimensions} — from ${piece.studio.name}.`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const piece = await resolve(params.id);
  if (!piece) notFound();

  /* The buy rail says how far the handover is, so it needs the buyer's place. */
  const place = readPlace();
  const city = piece.citySlug ? cityBySlug(piece.citySlug) : null;
  const measured = city
    ? { ...piece, distanceKm: Math.round(distanceKm(place.point, city) * 10) / 10 }
    : piece;

  /* A real listing has a row to key saves and reviews on; a seeded comp piece
     does not, so those controls are simply absent there rather than broken. */
  const real = Boolean(piece.photoIds);
  const viewer = await currentUser();

  const [rating, reviews, review, saved, counts] = await Promise.all([
    ratingForShop(piece.studio.handle),
    reviewsForShop(piece.studio.handle, 6),
    real && viewer ? standing(viewer.id, piece.id) : Promise.resolve(undefined),
    real && viewer ? isSaved(viewer.id, piece.id) : Promise.resolve(false),
    real ? saveCounts([piece.id]) : Promise.resolve(new Map<string, number>()),
  ]);

  return (
    <ListingPage
      piece={measured}
      place={place}
      rating={rating}
      reviews={reviews}
      standing={review}
      saved={saved}
      saveCount={counts.get(piece.id) ?? 0}
      savable={real}
    />
  );
}
