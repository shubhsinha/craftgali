import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontEditor } from "@/components/studio/StorefrontEditor";
import { requireSeller } from "@/lib/guard";
import { shelfFor } from "@/lib/sample-data";
import { shelfFromDb } from "@/lib/listings";
import { resolveStudio } from "@/lib/storefronts";
import { queryOne } from "@/lib/db";
import { DEFAULT_HERITAGE, type SkinDraft } from "@/lib/skins";

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
  const shop = await queryOne<{
    city_slug: string | null; pickup_neighborhood: string;
    skin: SkinDraft["hue"]; mode: SkinDraft["mode"]; heritage: SkinDraft["heritage"] | null;
    tagline: string | null; bio: string | null; coverId: string | null; avatarId: string | null;
  }>(
    `select city_slug, pickup_neighborhood, skin, mode, heritage, tagline, bio,
            (select id from storefront_media m where m.storefront_id = s.id and m.kind = 'cover')  as "coverId",
            (select id from storefront_media m where m.storefront_id = s.id and m.kind = 'avatar') as "avatarId"
       from storefronts s where handle = $1`,
    [user.handle],
  );

  return (
    <StorefrontEditor
      studio={studio}
      pieces={[...live, ...sold].slice(0, 4)}
      citySlug={shop?.city_slug ?? null}
      neighbourhood={shop?.pickup_neighborhood ?? ""}
      publishedSkin={{
        hue: shop?.skin ?? "indigo",
        mode: shop?.mode ?? "light",
        heritage: { ...DEFAULT_HERITAGE, ...(shop?.heritage ?? {}) },
      }}
      tagline={shop?.tagline ?? ""}
      bio={shop?.bio ?? ""}
      coverId={shop?.coverId ?? null}
      avatarId={shop?.avatarId ?? null}
      /* Comes from the plan row once billing exists. Everyone is on free. */
      pro={false}
    />
  );
}
