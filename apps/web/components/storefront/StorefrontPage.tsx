import Link from "next/link";
import { AmbientGlows, HeritageTapestry, HeroMedallion, JaliCorners, ToranDivider } from "@/components/brand/Heritage";
import { Wordmark } from "@/components/brand/Wordmark";
import { placeholder } from "@/lib/media";
import { cityBySlug } from "@/lib/cities";
import { DEFAULT_HERITAGE, SKINS } from "@/lib/skins";
import type { Review, ShopRating } from "@/lib/reviews";
import type { Piece, Studio } from "@/lib/types";
import { FollowButton } from "./FollowButton";
import { Shelf } from "./Shelf";

/**
 * P8 — the artist's own shop at /artist/<handle>.
 *
 * Everything on it is either the maker's own (their words, their pictures, their
 * published skin) or counted from real rows (pieces, followers, reviews). The
 * comp used to state numbers here — "31 live", "replies in 2h" — and a real
 * shop cannot earn those, so they are gone rather than faked.
 */
export function StorefrontPage({
  studio,
  live,
  sold,
  rating,
  reviews,
  followers,
  following,
  viewerIsOwner,
}: {
  studio: Studio;
  live: Piece[];
  sold: Piece[];
  rating: ShopRating;
  reviews: Review[];
  followers: number;
  following: boolean;
  viewerIsOwner: boolean;
}) {
  const skin = SKINS[studio.skin];
  const heritage = { ...DEFAULT_HERITAGE, ...(studio.heritage ?? {}) };
  const city = cityBySlug(studio.citySlug);

  const cover = studio.coverId
    ? `/api/media/${studio.coverId}`
    : placeholder(studio.cover ?? studio.seed, 1400, 520);
  const avatar = studio.avatarId ? `/api/media/${studio.avatarId}` : placeholder(studio.seed, 160, 160);

  return (
    <div className="cg-front cg-skinned" data-hue={studio.skin} data-mode={studio.mode ?? "light"}>
      <div className="cg-skinned__ground" aria-hidden="true">
        <AmbientGlows />
        {heritage.tapestry ? <HeritageTapestry idPrefix="sk" /> : null}
      </div>

      <div className="cg-front__bar">
        <Link href="/" className="cg-front__home" aria-label="CraftGali — home">
          <Wordmark size="sm" />
        </Link>
        <span className="cg-front__url">craftgali.com/@{studio.handle}</span>
      </div>

      <header className="cg-front__hero">
        <div className="cg-front__cover" style={{ backgroundImage: `url(${cover})` }} />
        <span className="cg-front__wash" aria-hidden="true" />

        <div className="cg-front__over">
          {heritage.medallion ? <HeroMedallion /> : null}
          {heritage.jali ? <JaliCorners /> : null}

          <span className="cg-front__face" role="img" aria-label={studio.artist}
                style={{ backgroundImage: `url(${avatar})` }} />

          <div className="cg-front__ident">
            <p className="cg-front__place">{studio.place ?? studio.city}</p>
            <h1 className="cg-front__name">{studio.name}</h1>

            {/* What they make and where they hand over — the two things a buyer
                needs before anything else, and both come straight from the row. */}
            <p className="cg-front__makes">
              {studio.discipline}
              {studio.neighbourhood || city ? (
                <> · hands over around {[studio.neighbourhood, city?.name].filter(Boolean).join(", ")}</>
              ) : null}
            </p>

            <div className="cg-front__badges">
              {studio.verifiedMaker ? <span className="cg-badge cg-badge--solid">Verified Maker</span> : null}
              {studio.verifiedArtist ? <span className="cg-badge">Verified Artist · ID checked</span> : null}
              {studio.tier ? <span className="cg-badge">{studio.tier}</span> : null}
            </div>
          </div>

          <div className="cg-front__actions">
            {viewerIsOwner ? (
              <Link href="/sell/storefront" className="cg-btn cg-btn--solid">Edit your shop</Link>
            ) : (
              <>
                <Link href={`/messages?to=${studio.handle}`} className="cg-btn cg-btn--solid">
                  Message {studio.shortName}
                </Link>
                <FollowButton handle={studio.handle} following={following} count={followers} />
              </>
            )}
          </div>
        </div>
      </header>

      {studio.quote ? <p className="cg-front__quote">&ldquo;{studio.quote}&rdquo;</p> : null}
      {studio.blurb ? <p className="cg-front__blurb">{studio.blurb}</p> : null}

      <dl className="cg-front__stats">
        <Stat figure={live.length} label="For sale" />
        <Stat figure={sold.length} label="Sold" />
        <Stat figure={rating.rating ?? "—"}
              label={rating.count ? `${rating.count} ${rating.count === 1 ? "review" : "reviews"}` : "No reviews yet"} />
        <Stat figure={followers} label={followers === 1 ? "Follower" : "Followers"} />
      </dl>

      {heritage.toran ? <ToranDivider /> : null}

      <Shelf
        live={live}
        sold={sold}
        empty={
          viewerIsOwner
            ? "Your shelf is empty. List a piece and it appears here the moment it's live."
            : `${studio.shortName} hasn't listed anything yet. Follow the shop and you'll see the first piece when it lands.`
        }
      />

      {reviews.length || studio.wall?.length ? (
        <>
          <hr className="cg-front__thread" />
          <div className="cg-front__foot">
            {reviews.length ? (
              <section>
                <h2 className="cg-front__label">{reviews.length === 1 ? "One review" : `${reviews.length} reviews`}</h2>
                <ul className="cg-front__reviews">
                  {reviews.map((review) => (
                    <li key={review.id}>
                      <p className="cg-front__reviewstars" aria-label={`${review.stars} out of 5`}>
                        <span aria-hidden="true">{"★".repeat(review.stars)}</span>
                        <span aria-hidden="true" className="cg-review__dim">{"★".repeat(5 - review.stars)}</span>
                      </p>
                      {review.body ? <p className="cg-front__reviewbody">&ldquo;{review.body}&rdquo;</p> : null}
                      <p className="cg-front__reviewby">{review.by} · bought {review.piece}</p>
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
                    <span className="cg-front__wallwhen">{studio.shortName} replied {entry.answered}</span>
                  </p>
                ))}
              </section>
            ) : null}
          </div>
        </>
      ) : null}

      <p className="cg-front__skin">{skin.name} · {skin.tagline}</p>
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
