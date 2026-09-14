import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioDashboard } from "@/components/studio/StudioDashboard";
import { StudioFirstRun } from "@/components/studio/StudioFirstRun";
import { requireSeller } from "@/lib/guard";
import { shelfFor } from "@/lib/sample-data";
import { shelfFromDb } from "@/lib/listings";
import { resolveStudio } from "@/lib/storefronts";

export const metadata: Metadata = { title: "Studio" };

export default async function Page() {
  const user = await requireSeller("/sell");
  const studio = await resolveStudio(user.handle);

  /* requireSeller only proved the session carries a handle; if the row behind it
     has gone the page has nothing to render. */
  if (!studio) notFound();

  /* The dashboard is built around a shop that has stock, traffic and offers.
     A shop with an empty shelf gets the first-run view instead, rather than
     being shown figures that belong to somebody else. */
  const comp = shelfFor(user.handle);
  const own = await shelfFromDb(user.handle);
  const live = [...own.live, ...comp.live];
  const sold = [...own.sold, ...comp.sold];

  if (!live.length && !sold.length) {
    return <StudioFirstRun name={user.fullName} studio={studio} />;
  }

  return <StudioDashboard name={user.fullName} handle={user.handle} />;
}
