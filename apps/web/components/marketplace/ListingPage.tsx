import Link from "next/link";
import { placeholder } from "@/lib/media";
import type { Place } from "@/lib/place";
import type { Review, ShopRating, ReviewStanding } from "@/lib/reviews";
import { ReviewForm } from "./ReviewForm";
import { SaveButton } from "./SaveButton";
import { ShareButton } from "./ShareButton";
import { alsoBy, studioFor } from "@/lib/sample-data";
import type { Piece } from "@/lib/types";
import { Gallery } from "./Gallery";
import { PieceCard, rupees } from "./PieceCard";

const STREAM_LABEL = { art: "Paintings & Canvas", decor: "Handcrafted Objects" } as const;

/**
 * P6 — the listing. Deliberately in shell chrome rather than the artist's skin:
 * the buyer is comparing across studios here, so the frame has to stay neutral.
 */
export function ListingPage({
  piece,
  place,
  rating,
  reviews,
  standing,
  saved,
  saveCount,
  savable,
}: {
  piece: Piece;
  place?: Place;
  /** Derived from real reviews. Null when nobody has reviewed this shop. */
  rating?: ShopRating;
  reviews?: Review[];
  standing?: ReviewStanding;
  saved?: boolean;
  saveCount?: number;
  savable?: boolean;
}) {
  const studio = studioFor(piece.studio.handle);
  const detail = piece.detail;
  const siblings = alsoBy(piece.studio.handle, piece.id);

  return (
    <main className="cg-listing">
      <nav className="cg-crumbs" aria-label="Breadcrumb">
        <Link href="/discover">Discover</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/discover/${piece.stream}`}>{STREAM_LABEL[piece.stream]}</Link>
        <span aria-hidden="true">/</span>
        <span className="cg-crumbs__here">{piece.title}</span>
      </nav>

      <div className="cg-listing__grid">
        <div className="cg-listing__main">
          <Gallery piece={piece} />

          {detail ? (
            <section className="cg-story">
              <h2 className="cg-eyebrow">The making of</h2>
              {detail.story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="cg-story__para">
                  {paragraph}
                </p>
              ))}

              <dl className="cg-spec">
                {detail.hours ? <Spec label="Hours invested" value={detail.hours} /> : null}
                <Spec label="Materials" value={detail.materials} />
                <Spec label="Size" value={piece.dimensions} />
                <Spec label="Edition" value={detail.edition} />
              </dl>
            </section>
          ) : null}

          {reviews?.length ? (
            <section className="cg-reviews">
              <h2 className="cg-eyebrow">
                What buyers said about {piece.studio.name}
              </h2>
              <ul className="cg-reviews__list">
                {reviews.map((review) => (
                  <li key={review.id} className="cg-review">
                    <p className="cg-review__stars" aria-label={`${review.stars} out of 5`}>
                      <span aria-hidden="true">{"★".repeat(review.stars)}</span>
                      <span aria-hidden="true" className="cg-review__dim">
                        {"★".repeat(5 - review.stars)}
                      </span>
                    </p>
                    {review.body ? <p className="cg-review__body">{review.body}</p> : null}
                    <p className="cg-review__by">
                      {review.by} · bought {review.piece}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="cg-listing__side">
          {standing?.mayReview ? (
            <ReviewForm
              listingId={piece.id}
              shop={piece.studio.name}
              existing={standing.own}
            />
          ) : null}

          <section className="cg-panel">
            <h1 className="cg-listing__title">{piece.title}</h1>
            <p className="cg-listing__spec">
              {[piece.medium, piece.dimensions, piece.year, detail?.framing]
                .filter(Boolean)
                .join(" · ")}
            </p>

            <div className="cg-listing__price">
              <span className="cg-listing__figure">{rupees(piece.priceInr)}</span>
              <span className="cg-listing__keeps">
                Artist keeps
                <br />
                every rupee
              </span>
            </div>

            <div className="cg-listing__actions">
              <Link href={`/messages?about=${piece.id}`} className="cg-btn cg-btn--solid cg-btn--block">
                Message {studio?.shortName ?? "the artist"}
              </Link>
              {piece.negotiable ? (
                <Link href={`/messages?offer=${piece.id}`} className="cg-btn cg-btn--outline cg-btn--block">
                  Make an offer
                </Link>
              ) : null}
              <div className="cg-listing__pair">
                {savable ? (
                  <SaveButton
                    listingId={piece.id}
                    saved={Boolean(saved)}
                    count={saveCount}
                    tone="wide"
                    next={`/listing/${piece.id}`}
                  />
                ) : (
                  <span className="cg-btn cg-btn--quiet cg-btn--block" aria-disabled="true">
                    Save
                  </span>
                )}
                <ShareButton title={piece.title} />
              </div>
            </div>

            <div className="cg-notice cg-listing__notice">
              <p className="cg-notice__title">Never pay in advance.</p>
              <p className="cg-notice__body">
                CraftGali does not process payments and cannot recover money sent outside
                the app. Pay on handover.
              </p>
            </div>
          </section>

          <section className="cg-panel cg-panel--stacked">
            <h2 className="cg-eyebrow">Handover</h2>
            <ul className="cg-handover">
              {piece.handover.includes("in-person") ? (
                <HandoverRow
                  title={`Meet in person${
                    piece.distanceKm !== undefined && place
                      ? ` · ${piece.distanceKm} km from ${place.city.name}`
                      : studio?.neighbourhood
                        ? ` · around ${studio.neighbourhood}`
                        : ""
                  }`}
                  note={detail?.meetNote ?? "Meet at a Safe Exchange Zone and pay on handover."}
                />
              ) : null}
              {piece.handover.includes("seller-courier") ? (
                <HandoverRow
                  title="Artist couriers at cost"
                  note={detail?.courierNote ?? "Shipped at the artist's cost price."}
                />
              ) : null}
              {piece.handover.includes("buyer-pickup") ? (
                <HandoverRow
                  title="Buyer arranges pickup"
                  note="Send your own courier to the studio once you've agreed a time."
                />
              ) : null}
            </ul>
          </section>

          {studio ? (
            <section className="cg-panel cg-panel--stacked cg-maker">
              <div className="cg-maker__head">
                <span
                  className="cg-maker__face"
                  style={{ backgroundImage: `url(${placeholder(studio.seed, 120, 120)})` }}
                />
                <div>
                  <p className="cg-maker__name">{studio.name}</p>
                  <p className="cg-maker__meta">
                    @{studio.handle} · {studio.city}
                    {studio.joined ? ` · joined ${studio.joined}` : ""}
                  </p>
                </div>
              </div>

              <div className="cg-maker__badges">
                {studio.verifiedMaker ? (
                  <span className="cg-badge cg-badge--solid">Verified Maker</span>
                ) : null}
                {studio.tier ? <span className="cg-badge">{studio.tier.split(" · ")[0]}</span> : null}
                <span className="cg-badge">{studio.stats.sold} sold</span>
              </div>

              <dl className="cg-maker__stats">
                {/* Derived from reviews actually left, so a new shop reads as
                    new rather than borrowing a number it has not earned. */}
                <Stat
                  figure={rating?.rating ?? "—"}
                  label={rating?.count ? `${rating.count} ${rating.count === 1 ? "review" : "reviews"}` : "No reviews yet"}
                />
                <Stat figure={studio.stats.repliesIn} label="Replies in" />
                <Stat figure={studio.stats.live} label="Pieces live" />
              </dl>

              <Link href={`/artist/${studio.handle}`} className="cg-maker__link">
                Visit the atelier →
              </Link>
            </section>
          ) : null}
        </aside>
      </div>

      {siblings.length ? (
        <section className="cg-alsoby">
          <header className="cg-section__head">
            <h2 className="cg-section__title">More from {piece.studio.name}</h2>
            <Link href={`/artist/${piece.studio.handle}`} className="cg-section__more">
              See the storefront →
            </Link>
          </header>
          <div className="cg-alsoby__grid">
            {siblings.map((sibling) => (
              <PieceCard key={sibling.id} piece={sibling} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="cg-spec__cell">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function HandoverRow({ title, note }: { title: string; note: string }) {
  return (
    <li className="cg-handover__row">
      <span className="cg-handover__dot" aria-hidden="true" />
      <div>
        <p className="cg-handover__title">{title}</p>
        <p className="cg-handover__note">{note}</p>
      </div>
    </li>
  );
}

function Stat({ figure, label }: { figure: React.ReactNode; label: string }) {
  return (
    <div>
      <dt className="cg-maker__figure">{figure}</dt>
      <dd className="cg-maker__label">{label}</dd>
    </div>
  );
}
