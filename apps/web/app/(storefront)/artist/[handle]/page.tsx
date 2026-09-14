import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontPage } from "@/components/storefront/StorefrontPage";
import { shelfFor } from "@/lib/sample-data";
import { shelfFromDb } from "@/lib/listings";
import { resolveStudio } from "@/lib/storefronts";
import { ratingForShop, reviewsForShop } from "@/lib/reviews";

/* Every storefront is rendered per request: a shop's shelf changes the moment
   its owner lists or sells something, so there is nothing here worth freezing
   at build time. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const studio = await resolveStudio(params.handle);
  if (!studio) return { title: "Storefront" };

  return {
    title: studio.name,
    description: studio.quote ?? studio.blurb ?? `${studio.discipline} from ${studio.city}.`,
  };
}

export default async function Page({ params }: { params: { handle: string } }) {
  const studio = await resolveStudio(params.handle);
  if (!studio) notFound();

  /* What the maker has actually listed comes first; the seeded comp shelf sits
     behind it, so the design studios stay populated. */
  const [own, rating, reviews] = await Promise.all([
    shelfFromDb(params.handle),
    ratingForShop(params.handle),
    reviewsForShop(params.handle),
  ]);
  const comp = shelfFor(params.handle);

  return (
    <StorefrontPage
      studio={studio}
      live={[...own.live, ...comp.live]}
      sold={[...own.sold, ...comp.sold]}
      rating={rating}
      reviews={reviews}
    />
  );
}
