import Link from "next/link";
import { pieceImage } from "@/lib/media";
import type { Piece } from "@/lib/types";

function rupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * A piece on its maker's own shelf. Every colour here comes from a --cg-* token
 * resolved against the storefront's wrapper, so the same markup reads as four
 * different shops without a single skin-specific rule.
 */
export function WorkCard({ piece }: { piece: Piece }) {
  const sold = Boolean(piece.soldForInr);

  return (
    <article className={`cg-work ${sold ? "cg-work--sold" : ""}`}>
      <Link href={`/listing/${piece.id}`} className="cg-work__mount">
        <img
          src={pieceImage(piece, 440, Math.round(440 * (piece.aspect ?? 1.2)))}
          alt={piece.title}
          loading="lazy"
          style={{ aspectRatio: `1 / ${piece.aspect ?? 1.2}` }}
        />
        {sold ? <span className="cg-work__sold">Sold</span> : null}
      </Link>

      <div className="cg-work__body">
        <Link href={`/listing/${piece.id}`} className="cg-work__title">
          {piece.title}
        </Link>
        <p className="cg-work__meta">
          {[piece.medium, piece.dimensions, piece.year].filter(Boolean).join(" · ")}
        </p>
        <p className="cg-work__price">
          {sold ? `Sold for ${rupees(piece.soldForInr!)}` : rupees(piece.priceInr)}
        </p>
      </div>
    </article>
  );
}
