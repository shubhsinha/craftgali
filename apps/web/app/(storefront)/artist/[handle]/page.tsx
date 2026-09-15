import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontPage } from "@/components/storefront/StorefrontPage";
import { currentUser } from "@/lib/auth";
import { followerCount, isFollowing } from "@/lib/follows";
import { shelfFromDb } from "@/lib/listings";
import { ratingForShop, reviewsForShop } from "@/lib/reviews";
import { shelfFor } from "@/lib/sample-data";
import { resolveStudio } from "@/lib/storefronts";
import type { Piece } from "@/lib/types";

/* A shop's shelf changes the moment its owner lists or sells, so nothing here
   is frozen at build time. Caching, when it comes, is per-tag — see docs. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const studio = await resolveStudio(params.handle);
  if (!studio) return { title: "Storefront" };
  return {
    title: studio.name,
    description: studio.quote ?? studio.blurb ?? `${studio.discipline} from ${studio.city}.`,
  };
}

/**
 * The maker's own listings first, the seeded comp shelf behind — deduplicated
 * by slug, so a real sale can never sit beside a comp piece of the same name.
 */
function merge(own: Piece[], comp: Piece[]) {
  const seen = new Set(own.map((p) => p.slug));
  return [...own, ...comp.filter((p) => !seen.has(p.slug))];
}

export default async function Page({ params }: { params: { handle: string } }) {
  const studio = await resolveStudio(params.handle);
  if (!studio) notFound();

  const viewer = await currentUser();
  const [own, rating, reviews, followers, following] = await Promise.all([
    shelfFromDb(params.handle),
    ratingForShop(params.handle),
    reviewsForShop(params.handle),
    studio.id ? followerCount(studio.id) : Promise.resolve(0),
    studio.id ? isFollowing(viewer?.id ?? null, studio.id) : Promise.resolve(false),
  ]);
  const comp = shelfFor(params.handle);

  return (
    <StorefrontPage
      studio={studio}
      live={merge(own.live, comp.live)}
      sold={merge(own.sold, comp.sold)}
      rating={rating}
      reviews={reviews}
      followers={followers}
      following={following}
      viewerIsOwner={Boolean(viewer?.handle && viewer.handle === studio.handle)}
    />
  );
}
