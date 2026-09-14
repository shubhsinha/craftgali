import Link from "next/link";
import { AmbientGlows, HeritageTapestry } from "@/components/brand/Heritage";
import { Wordmark } from "@/components/brand/Wordmark";
import { placeholder } from "@/lib/media";
import type { Piece } from "@/lib/types";
import type { Review, ShopRating } from "@/lib/reviews";
import { SKINS } from "@/lib/skins";
import type { Studio } from "@/lib/types";
import { WorkCard } from "./WorkCard";

/**
 * P8 — the artist's own shop at /artist/<handle>.
 *
 * The whole page hangs under one wrapper carrying the shop's `data-hue` and
 * `data-mode`. Those are the same attributes the buyer sets on <html>, so every
 * --cg-* token resolves to the artist's colourway from here down and the shell
 * above is untouched: a buyer browsing in Teal still sees a Ruby shop as its
 * maker built it. Nothing else about the layout varies by skin — the design
 * puts the artist's choice in the light, not in the grid.
 */
export function StorefrontPage({
  studio,
  live,
  sold,
  rating,
  reviews,
}: {
  studio: Studio;
  live: Piece[];
  sold: Piece[];
  /** Derived from rows in `reviews`. Nothing here is a stated figure. */
  rating: ShopRating;
  reviews: Review[];
}) {
  const skin = SKINS[studio.skin];

  return (
    <div className="cg-front cg-skinned" data-hue={studio.skin} data-mode={studio.mode ?? "light"}>
      <div className="cg-skinned__ground" aria-hidden="true">
        <AmbientGlows />
        <HeritageTapestry idPrefix="sk" />
      </div>

      <div className="cg-front__bar">
        <Link href="/" className="cg-front__home" aria-label="CraftGali — home">
          <Wordmark size="sm" />
        </Link>
        <span className="cg-front__url">craftgali.com/@{studio.handle}</span>
      </div>

      <header className="cg-front__hero">
        <div
          className="cg-front__cover"
          style={{ backgroundImage: `url(${placeholder(studio.cover ?? studio.seed, 1400, 520)})` }}
        />
        <span className="cg-front__wash" aria-hidden="true" />

        <div className="cg-front__over">
          <span
            className="cg-front__face"
            role="img"
            aria-label={studio.artist}
            style={{ backgroundImage: `url(${placeholder(studio.seed, 160, 160)})` }}
          />

          <div className="cg-front__ident">
            <p className="cg-front__place">{studio.place ?? studio.city}</p>
            <h1 className="cg-front__name">{studio.name}</h1>

            <div className="cg-front__badges">
              {studio.verifiedMaker ? (
                <span className="cg-badge cg-badge--solid">Verified Maker</span>
              ) : null}
              {studio.verifiedArtist ? (
                <span className="cg-badge">Verified Artist · ID checked</span>
              ) : null}
              {studio.tier ? <span className="cg-badge">{studio.tier}</span> : null}
            </div>
          </div>

          <div className="cg-front__actions">
            <Link href={`/messages?to=${studio.handle}`} className="cg-btn cg-btn--solid">
              Message {studio.shortName}
            </Link>
            <button type="button" className="cg-btn cg-btn--outline">
              Follow
            </button>
          </div>
        </div>
      </header>

      {studio.quote ? <p className="cg-front__quote">&ldquo;{studio.quote}&rdquo;</p> : null}
      {studio.blurb ? <p className="cg-front__blurb">{studio.blurb}</p> : null}

      <dl className="cg-front__stats">
        <Stat figure={studio.stats.live} label="Pieces live" />
        <Stat figure={studio.stats.sold} label="Sold" />
        <Stat
          figure={rating.rating ?? "—"}
          label={rating.count ? `${rating.count} ${rating.count === 1 ? "review" : "reviews"}` : "No reviews yet"}
        />
        <Stat figure={studio.stats.repliesIn} label="Replies in" />
      </dl>

      {studio.collections?.length ? (
        <nav className="cg-front__tabs" aria-label="Collections">
          {studio.collections.map((name, index) => (
            <button key={name} type="button" className="cg-chip" aria-pressed={index === 0}>
              {name}
            </button>
          ))}
        </nav>
      ) : null}

      {!live.length && !sold.length ? (
        <p className="cg-front__empty">
          {studio.shortName} hasn&rsquo;t listed anything yet. Follow the shop and
          you&rsquo;ll see the first piece when it lands.
        </p>
      ) : null}

      <div className="cg-front__grid">
        {live.map((piece) => (
          <WorkCard key={piece.id} piece={piece} />
        ))}
        {sold.map((piece) => (
          <WorkCard key={piece.id} piece={piece} />
        ))}
      </div>

      {reviews.length || studio.wall?.length ? (
        <>
          <hr className="cg-front__thread" />
          <div className="cg-front__foot">
            {reviews.length ? (
              <section>
                <h2 className="cg-front__label">
                  {reviews.length === 1 ? "One review" : `${reviews.length} reviews`}
                </h2>
                <ul className="cg-front__reviews">
                  {reviews.map((review) => (
                    <li key={review.id}>
                      <p className="cg-front__reviewstars" aria-label={`${review.stars} out of 5`}>
                        <span aria-hidden="true">{"\u2605".repeat(review.stars)}</span>
                        <span aria-hidden="true" className="cg-review__dim">
                          {"\u2605".repeat(5 - review.stars)}
                        </span>
                      </p>
                      {review.body ? (
                        <p className="cg-front__reviewbody">&ldquo;{review.body}&rdquo;</p>
                      ) : null}
                      <p className="cg-front__reviewby">
                        {review.by} · bought {review.piece}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {studio.wall?.length ? (
              <section>
                <h2 className="cg-front__label">Communication wall</h2>
                {studio.wall.map((entry) => (
                  <p key={entry.question} className="cg-front__wall">
                    &ldquo;{entry.question}&rdquo; —{" "}
                    <span className="cg-front__wallwhen">
                      {studio.shortName} replied {entry.answered}
                    </span>
                  </p>
                ))}
                <Link href={`/messages?to=${studio.handle}`} className="cg-front__ask">
                  Ask {studio.shortName} something
                </Link>
              </section>
            ) : null}
          </div>
        </>
      ) : null}

      <p className="cg-front__skin">
        {skin.name} · {skin.tagline}
      </p>
    </div>
  );
}

function Stat({ figure, label }: { figure: React.ReactNode; label: string }) {
  return (
    <div className="cg-front__stat">
      <dt className="cg-front__figure">{figure}</dt>
      <dd className="cg-front__statlabel">{label}</dd>
    </div>
  );
}
