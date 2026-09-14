import type { Metadata } from "next";
import Link from "next/link";
import { placeholder } from "@/lib/media";
import { STUDIOS, shelfFor } from "@/lib/sample-data";
import { SKINS } from "@/lib/skins";
import { ratingsForShops } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Studios",
  description:
    "Every studio on CraftGali — the maker, the city, the craft, and the skin they chose for their shop.",
};

/* Ratings come from the reviews table, so this page is as live as they are —
   and it must not try to reach the database while the image is being built. */
export const dynamic = "force-dynamic";

/** The directory behind the landing page's storefront strip. */
export default async function StudiosPage() {
  /* One query for the whole page, rather than a rating lookup per row. */
  const ratings = await ratingsForShops(STUDIOS.map((studio) => studio.handle));

  return (
    <main className="cg-doc cg-studios">
      <header>
        <p className="cg-eyebrow cg-eyebrow--accent">Studios</p>
        <h1 className="cg-doc__title">Every shop, skinned by the hand that runs it</h1>
        <p className="cg-lede cg-doc__lede">
          A storefront on CraftGali is the artist&rsquo;s own room, not a search result.
          Each one is painted in one of four hues, in light or dark, by the maker
          themselves — and it stays that way whichever hue you browse in.
        </p>
      </header>

      <ul className="cg-studios__list">
        {STUDIOS.map((studio) => {
          const { live, sold } = shelfFor(studio.handle);

          return (
            <li key={studio.handle}>
              {/* The row carries the shop's own hue, so its name-tick and skin
                  label preview the colourway the storefront is painted in. */}
              <Link
                href={`/artist/${studio.handle}`}
                className="cg-studiorow"
                data-hue={studio.skin}
              >
                <span
                  className="cg-studiorow__face"
                  style={{ backgroundImage: `url(${placeholder(studio.seed, 120, 120)})` }}
                />

                <span className="cg-studiorow__body">
                  <span className="cg-studiorow__name">
                    {studio.name}
                    {studio.verifiedMaker ? (
                      <span className="cg-studiorow__tick" title="Verified Maker">
                        ✓
                      </span>
                    ) : null}
                  </span>
                  <span className="cg-studiorow__meta">
                    @{studio.handle} · {studio.city} · {studio.discipline}
                  </span>

                  <span className="cg-studiorow__counts">
                    <span>
                      {live.length} live · {sold.length + studio.stats.sold} sold ·{" "}
                      {ratings.get(studio.handle)
                        ? `${ratings.get(studio.handle)!.rating} ★ (${ratings.get(studio.handle)!.count})`
                        : "no reviews yet"}
                    </span>
                    <span className="cg-studiorow__skin">{SKINS[studio.skin].name}</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
