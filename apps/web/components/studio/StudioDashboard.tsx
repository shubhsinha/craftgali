import { rupees } from "@/components/marketplace/PieceCard";
import { placeholder } from "@/lib/media";
import { DASHBOARD, pieceById } from "@/lib/sample-data";
import { CopyLink } from "./CopyLink";
import { Greeting } from "./Greeting";

/**
 * S3 — the studio dashboard. No SKUs, no inventory, no GMV: every panel is
 * something the artist can act on before lunch.
 */
export function StudioDashboard({ name, handle }: { name: string; handle: string }) {
  const { nudge, slots, week, searches, offers, offersNote, photos, verification } = DASHBOARD;

  return (
    <main className="cg-studio">
      <div className="cg-studio__head">
        <Greeting name={name.split(" ")[0]} tierLine={DASHBOARD.tierLine} />
        <p className="cg-studio__link">
          Storefront: <strong>craftgali.com/@{handle}</strong> ·{" "}
          <CopyLink value={`https://craftgali.com/@${handle}`} />
        </p>
      </div>

      <div className="cg-studio__top">
        <section className="cg-nudge">
          <h2 className="cg-eyebrow cg-nudge__label">{nudge.label}</h2>
          <p className="cg-nudge__lead">
            {nudge.lead} <em>{nudge.piece}</em> {nudge.tail}
          </p>
          <p className="cg-nudge__body">{nudge.body}</p>
          <button type="button" className="cg-nudge__action">
            {nudge.action}
          </button>
        </section>

        <section className="cg-card">
          <header className="cg-card__head">
            <h2 className="cg-eyebrow">Pieces live</h2>
            <span className="cg-card__aside">{slots.plan}</span>
          </header>

          <p className="cg-card__figure">
            <strong>{slots.used}</strong> live right now
          </p>

          {/* Slots are a shelf, not a quota — the bar shows how much of the
              shelf is spoken for right now, not how much has ever been used. */}
          <div
            className="cg-slots"
            role="img"
            aria-label={`${slots.filled} slots filled, ${slots.expiring} expiring, ${
              slots.total - slots.filled - slots.expiring
            } free`}
          >
            {Array.from({ length: slots.total }, (_, index) => (
              <span
                key={index}
                className={`cg-slot ${
                  index < slots.filled
                    ? "cg-slot--on"
                    : index < slots.filled + slots.expiring
                      ? "cg-slot--soon"
                      : ""
                }`}
              />
            ))}
          </div>

          <p className="cg-card__note">{slots.note}</p>
          <p className="cg-card__warn">{slots.warning}</p>
        </section>

        <section className="cg-card">
          <h2 className="cg-eyebrow">This week</h2>
          <dl className="cg-week">
            {week.map((stat) => (
              <div key={stat.label}>
                <dt className="cg-week__figure">{stat.figure}</dt>
                <dd className="cg-week__label">
                  {stat.label}
                  {stat.delta ? <span className="cg-week__delta"> {stat.delta}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
          <p className="cg-card__note cg-card__note--ruled">
            Most searches that found you:{" "}
            {searches.map((term, index) => (
              <span key={term}>
                {index ? ", " : ""}
                <strong>&ldquo;{term}&rdquo;</strong>
              </span>
            ))}
            .
          </p>
        </section>
      </div>

      <div className="cg-studio__mid">
        <section className="cg-card cg-card--flush">
          <header className="cg-card__head cg-card__head--ruled">
            <h2 className="cg-eyebrow">Offers waiting on you</h2>
            <span className="cg-card__aside">{offersNote}</span>
          </header>

          {offers.map((offer) => {
            const piece = pieceById(offer.pieceId);
            if (!piece) return null;

            return (
              <div key={offer.pieceId} className="cg-offer">
                <span
                  className="cg-offer__thumb"
                  style={{ backgroundImage: `url(${placeholder(piece.seed, 120, 120)})` }}
                />
                <div className="cg-offer__body">
                  <p className="cg-offer__title">{piece.title}</p>
                  <p className="cg-offer__meta">
                    {offer.by} offered {rupees(offer.offeredInr)} · asking{" "}
                    {rupees(piece.priceInr)}
                  </p>
                </div>
                <div className="cg-offer__actions">
                  <button type="button" className="cg-mini cg-mini--solid">
                    Accept
                  </button>
                  <button type="button" className="cg-mini">
                    Counter
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section className="cg-card cg-card--flush">
          <header className="cg-card__head cg-card__head--ruled">
            <h2 className="cg-eyebrow">Photo quality across your pieces</h2>
            <span className="cg-card__aside cg-card__aside--ink">
              Average {photos.average}
            </span>
          </header>

          <div className="cg-photos">
            <p className="cg-photos__body">{photos.body}</p>
            <div className="cg-photos__row">
              {photos.weak.map((shot) => (
                <figure key={shot.seed} className="cg-photos__shot">
                  <span style={{ backgroundImage: `url(${placeholder(shot.seed, 160, 160)})` }} />
                  <figcaption>
                    {shot.score} · {shot.reason}
                  </figcaption>
                </figure>
              ))}
            </div>
            <button type="button" className="cg-btn cg-btn--solid cg-btn--sm">
              {photos.action}
            </button>
          </div>
        </section>
      </div>

      <section className="cg-verify">
        <div>
          <h2 className="cg-eyebrow cg-eyebrow--accent">{verification.label}</h2>
          <p className="cg-verify__title">{verification.title}</p>
          <p className="cg-verify__body">{verification.body}</p>
        </div>
        <button type="button" className="cg-btn cg-btn--solid">
          {verification.action}
        </button>
      </section>
    </main>
  );
}
