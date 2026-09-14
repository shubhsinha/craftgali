import Link from "next/link";
import { PinIcon } from "@/components/shell/icons";
import { SaveButton } from "./SaveButton";
import { pieceImage } from "@/lib/media";
import type { Piece } from "@/lib/types";

export function rupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * One piece in the masonry. The card's height comes from the artwork's own
 * proportions — the column packs itself, and nothing is cropped to a grid.
 */
export function PieceCard({
  piece,
  saved = false,
  savable = false,
}: {
  piece: Piece;
  saved?: boolean;
  /** Only a real listing can be saved — the comp pieces have no row to key on. */
  savable?: boolean;
}) {
  const aspect = piece.aspect ?? 1.2;

  return (
    <article className="cg-piece">
      <Link href={`/listing/${piece.id}`} className="cg-piece__plate">
        <img
          src={pieceImage(piece, 500, Math.round(500 * aspect))}
          alt={piece.title}
          loading="lazy"
          style={{ aspectRatio: `1 / ${aspect}` }}
        />
        {piece.distanceKm !== undefined ? (
          <span className="cg-piece__distance">
            <PinIcon size={11} />
            {piece.distanceKm} km away
          </span>
        ) : null}
        {piece.verifiedMaker ? (
          <span className="cg-piece__badge">Verified maker</span>
        ) : null}
      </Link>

      {savable ? (
        <SaveButton listingId={piece.id} saved={saved} next="/discover" />
      ) : null}

      <div className="cg-piece__body">
        <Link href={`/listing/${piece.id}`} className="cg-piece__title">
          {piece.title}
        </Link>
        <p className="cg-piece__meta">
          {piece.studio.name} · {piece.medium} · {piece.dimensions}
        </p>
        <div className="cg-piece__foot">
          <span className="cg-piece__price">{rupees(piece.priceInr)}</span>
          <Link href={`/messages?about=${piece.id}`} className="cg-piece__cta">
            {piece.negotiable ? "Make an offer" : "Inquire"}
          </Link>
        </div>
      </div>
    </article>
  );
}
