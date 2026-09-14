import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontEditor } from "@/components/studio/StorefrontEditor";
import { requireSeller } from "@/lib/guard";
import { shelfFor } from "@/lib/sample-data";
import { shelfFromDb } from "@/lib/listings";
import { resolveStudio } from "@/lib/storefronts";
import { queryOne } from "@/lib/db";

export const metadata: Metadata = { title: "Storefront" };

export default async function Page() {
  const user = await requireSeller("/sell/storefront");
  const studio = await resolveStudio(user.handle);
  if (!studio) notFound();

  /* The preview shows the seller's own work when there is any, and four
     placeholders when there is not — a hue is hard to judge against nothing. */
  const comp = shelfFor(user.handle);
  const own = await shelfFromDb(user.handle);
  const live = [...own.live, ...comp.live];
  const sold = [...own.sold, ...comp.sold];

  /* Read straight from the row rather than from `studio`: a seeded comp studio
     carries the design's city, and this field must edit what is actually
     stored. */
  const shop = await queryOne<{ city_slug: string | null; pickup_neighborhood: string }>(
    "select city_slug, pickup_neighborhood from storefronts where handle = $1",
    [user.handle],
  );

  return (
    <StorefrontEditor
      studio={studio}
      pieces={[...live, ...sold].slice(0, 4)}
      citySlug={shop?.city_slug ?? null}
      neighbourhood={shop?.pickup_neighborhood ?? ""}
      /* Comes from the plan row once billing exists. Everyone is on free. */
      pro={false}
    />
  );
}
