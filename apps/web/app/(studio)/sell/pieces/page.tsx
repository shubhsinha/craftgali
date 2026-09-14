import type { Metadata } from "next";
import Link from "next/link";
import { PieceRowActions } from "@/components/studio/PieceRowActions";
import { FREE_SLOTS } from "@/lib/plans";
import { requireSeller } from "@/lib/guard";
import { ownPieces } from "@/lib/listings";
import { saveCounts } from "@/lib/saves";
import { queryOne } from "@/lib/db";
import { HandoverPanel } from "@/components/studio/HandoverPanel";
import { pieceImage } from "@/lib/media";
import { rupees } from "@/components/marketplace/PieceCard";

export const metadata: Metadata = { title: "Pieces" };

const LABEL: Record<string, string> = {
  live: "Live",
  sold: "Sold",
  draft: "Draft",
  archived: "Archived",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { added?: string };
}) {
  const user = await requireSeller("/sell/pieces");
  const pieces = await ownPieces(user.handle);
  /* Counts only. There is no query in lib/saves.ts that would hand a seller the
     names, and that is deliberate. §5.1 */
  const saves = await saveCounts(pieces.map((piece) => piece.id));
  const shop = await queryOne<{ city_slug: string | null; pickup_neighborhood: string }>(
    "select city_slug, pickup_neighborhood from storefronts where handle = $1",
    [user.handle],
  );

  const live = pieces.filter((p) => p.status === "live");
  const rest = pieces.filter((p) => p.status !== "live");
  const left = Math.max(0, FREE_SLOTS - live.length);

  return (
    <main className="cg-shelf">
      <header className="cg-shelf__head">
        <div>
          <h1 className="cg-shelf__title">Your pieces</h1>
          <p className="cg-shelf__lede">
            {live.length} live of {FREE_SLOTS} free slots
            {left > 0 ? ` · ${left} open` : " · all full"}. Slots count pieces that are
            live at once, not pieces you have ever uploaded.
          </p>
        </div>
        {left > 0 ? (
          <Link href="/sell/pieces/new" className="cg-btn cg-btn--solid">
            List a piece
          </Link>
        ) : (
          <span className="cg-btn cg-btn--outline" aria-disabled="true">
            All slots full
          </span>
        )}
      </header>

      {shop && !shop.city_slug ? (
        <HandoverPanel
          tone="alert"
          city={shop.city_slug}
          neighbourhood={shop.pickup_neighborhood}
        />
      ) : null}

      {searchParams.added ? (
        <p className="cg-form__done" role="status">
          Listed. It is live on your storefront and in the feed now.
        </p>
      ) : null}

      {!pieces.length ? (
        <div className="cg-shelf__empty">
          <p className="cg-shelf__emptylead">Nothing on the shelf yet.</p>
          <p className="cg-shelf__emptybody">
            Your storefront is open and the link works — it just has nothing in it. One
            good photograph and a price is enough to start.
          </p>
          <Link href="/sell/pieces/new" className="cg-btn cg-btn--solid">
            List your first piece
          </Link>
        </div>
      ) : (
        <>
          <ul className="cg-shelf__list">
            {live.map((piece) => (
              <Row key={piece.id} piece={piece} saves={saves.get(piece.id) ?? 0} />
            ))}
          </ul>

          {rest.length ? (
            <>
              <h2 className="cg-eyebrow cg-shelf__section">Sold and archived</h2>
              <ul className="cg-shelf__list">
                {rest.map((piece) => (
                  <Row key={piece.id} piece={piece} saves={saves.get(piece.id) ?? 0} />
                ))}
              </ul>
            </>
          ) : null}
        </>
      )}
    </main>
  );
}

function Row({
  piece,
  saves,
}: {
  piece: Awaited<ReturnType<typeof ownPieces>>[number];
  saves: number;
}) {
  const sold = piece.status === "sold";

  return (
    <li className={`cg-shelfrow ${sold ? "cg-shelfrow--sold" : ""}`}>
      <Link href={`/listing/${piece.id}`} className="cg-shelfrow__shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pieceImage(piece, 200, 200)} alt={piece.title} loading="lazy" />
      </Link>

      <div className="cg-shelfrow__body">
        <Link href={`/listing/${piece.id}`} className="cg-shelfrow__title">
          {piece.title}
        </Link>
        <p className="cg-shelfrow__meta">
          {[piece.medium, piece.dimensions, piece.year].filter(Boolean).join(" · ")}
        </p>
        <p className="cg-shelfrow__price">
          {sold && piece.soldForInr ? `Sold for ${rupees(piece.soldForInr)}` : rupees(piece.priceInr)}
          {saves > 0 ? (
            <span className="cg-shelfrow__saves">
              · saved by {saves} {saves === 1 ? "person" : "people"}
            </span>
          ) : null}
        </p>
      </div>

      <div className="cg-shelfrow__side">
        <span className={`cg-badge ${piece.status === "live" ? "cg-badge--solid" : ""}`}>
          {LABEL[piece.status] ?? piece.status}
        </span>

        <PieceRowActions id={piece.id} status={piece.status} askingInr={piece.priceInr} />
      </div>
    </li>
  );
}
