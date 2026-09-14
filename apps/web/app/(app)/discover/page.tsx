import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscoverPage } from "@/components/marketplace/DiscoverPage";
import { DISCOVER_STREAMS } from "@/lib/sample-data";
import { catalogue, withDistance } from "@/lib/listings";
import { readPlace } from "@/lib/place";
import { currentUser } from "@/lib/auth";
import { savedIds } from "@/lib/saves";

export const metadata: Metadata = { title: "Discover" };

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const stream = DISCOVER_STREAMS.find((s) => s.id === "everything");
  if (!stream) notFound();

  /* Measured on the server so the first paint already knows what is near. */
  const place = readPlace();
  const pieces = withDistance(await catalogue(), place.point);

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
    />
  );
}
