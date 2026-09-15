import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscoverPage } from "@/components/marketplace/DiscoverPage";
import { DISCOVER_STREAMS } from "@/lib/sample-data";
import { feedPage, withDistance } from "@/lib/listings";
import { PIECES, studioFor } from "@/lib/sample-data";
import { citiesWithin } from "@/lib/cities";
import { readPlace } from "@/lib/place";
import { currentUser } from "@/lib/auth";
import { savedIds } from "@/lib/saves";

export const metadata: Metadata = { title: "Discover" };

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const stream = DISCOVER_STREAMS.find((s) => s.id === "everything");
  if (!stream) notFound();

  /* Measured on the server so the first paint already knows what is near. */
  const place = readPlace();
  const page = Math.max(0, Number(searchParams.page ?? 0) || 0);

  /* Real listings come one page at a time, already narrowed to the buyer's
     radius by Postgres. The seeded comp pieces ride behind them so the demo
     stays populated; they are few and static, so filtering them here is free. */
  const feed = await feedPage({
    stream: stream.streams?.length === 1 ? stream.streams[0] : undefined,
    cities: citiesWithin(place.point, place.radiusKm),
    q: searchParams.q,
    page,
  });
  const comps = page === 0
    ? PIECES.map((p) => (p.citySlug ? p : { ...p, citySlug: studioFor(p.studio.handle)?.citySlug }))
    : [];
  const pieces = withDistance([...feed.pieces, ...comps], place.point);

  /* Which of these the viewer has already saved — one query, not one per card. */
  const viewer = await currentUser();
  const saved = await savedIds(
    viewer?.id ?? null,
    pieces.filter((piece) => piece.photoIds).map((piece) => piece.id),
  );

  return (
    <DiscoverPage
      stream={stream}
      q={searchParams.q}
      pieces={pieces}
      place={{ city: place.city.name, radiusKm: place.radiusKm }}
      saved={[...saved]}
      page={page}
      hasMore={feed.hasMore}
    />
  );
}
