import {
  HeritageTapestry,
  HeroMedallion,
  JaliCorners,
  RangoliDivider,
  ToranDivider,
} from "@/components/brand/Heritage";
import { placeholder } from "@/lib/media";
import type { Heritage } from "@/lib/skins";
import type { Piece, SkinId, SkinMode, Studio } from "@/lib/types";

function rupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * The live preview in the storefront editor.
 *
 * It repaints by exactly the mechanism the real storefront uses: the wrapper
 * carries `data-hue` and `data-mode`, and every --cg-* token below it resolves
 * to the seller's choice. Nothing here reads the studio's own theme, which is
 * why a seller working in a dark studio can still see their light shop.
 *
 * It is a scaled-down rendering rather than an iframe of the real page: the
 * point is to answer "what will my hue look like", and four pieces at card size
 * answer that without the cost and the scroll of a whole page in a box.
 */
export function AtelierPreview({
  studio,
  pieces,
  hue,
  mode,
  heritage,
}: {
  studio: Studio;
  pieces: Piece[];
  hue: SkinId;
  mode: SkinMode;
  heritage: Heritage;
}) {
  return (
    <div className="cg-preview cg-skinned" data-hue={hue} data-mode={mode}>
      <div className="cg-skinned__ground" aria-hidden="true">
        {/* Its own id prefix: `currentColor` inside a <pattern> resolves against
            the pattern's own ancestors, so a second copy cannot share the
            first one's ids and still take a different hue. */}
        {heritage.tapestry ? <HeritageTapestry idPrefix="ed" /> : null}
      </div>

      <div className="cg-preview__hero">
        {heritage.medallion ? <HeroMedallion /> : null}
        {heritage.jali ? <JaliCorners /> : null}

        <div className="cg-preview__ident">
          <span
            className="cg-preview__face"
            role="img"
            aria-label={studio.artist}
            style={{ backgroundImage: `url(${placeholder(studio.seed, 120, 120)})` }}
          />
          <div>
            <p className="cg-preview__name">{studio.name}</p>
            <p className="cg-preview__place">{studio.place ?? studio.city}</p>
          </div>
        </div>

        <div className="cg-preview__row">
          {studio.verifiedMaker ? (
            <span className="cg-badge cg-badge--solid">Verified Maker</span>
          ) : null}
          <span className="cg-preview__cta">Message {studio.shortName}</span>
        </div>

        {heritage.medallion ? <RangoliDivider /> : null}
      </div>

      {heritage.toran ? <ToranDivider /> : null}

      <div className="cg-preview__grid">
        {pieces.map((piece) => (
          <figure key={piece.id} className="cg-preview__work">
            <span
              className="cg-preview__plate"
              style={{ backgroundImage: `url(${placeholder(piece.seed, 240, 240)})` }}
            />
            <figcaption>
              <span className="cg-preview__title">{piece.title}</span>
              <span className="cg-preview__price">
                {rupees(piece.soldForInr ?? piece.priceInr)}
              </span>
            </figcaption>
          </figure>
        ))}

        {pieces.length === 0
          ? Array.from({ length: 4 }, (_, i) => (
              <figure key={i} className="cg-preview__work cg-preview__work--empty">
                <span className="cg-preview__plate" />
                <figcaption>
                  <span className="cg-preview__title">Your piece</span>
                  <span className="cg-preview__price">₹—</span>
                </figcaption>
              </figure>
            ))
          : null}
      </div>
    </div>
  );
}
