import Link from "next/link";
import { Greeting } from "./Greeting";
import { CopyLink } from "./CopyLink";
import type { Studio } from "@/lib/types";

/**
 * What a seller sees on the day they open their shop.
 *
 * The full dashboard is built around a studio that already has stock, traffic
 * and offers. Showing it to someone with nothing listed would mean showing them
 * numbers that are not theirs — so a shop with an empty shelf gets this
 * instead: their real address, what is actually live, and an honest account of
 * which steps exist yet and which do not.
 */
export function StudioFirstRun({
  name,
  studio,
}: {
  name: string;
  studio: Studio;
}) {
  const url = `craftgali.com/@${studio.handle}`;

  return (
    <main className="cg-studio">
      <div className="cg-studio__head">
        <Greeting name={name.split(" ")[0]} tierLine="Free studio · 5 slots · 0% commission" />
        <p className="cg-studio__link">
          Storefront: <strong>{url}</strong> · <CopyLink value={`https://${url}`} />
        </p>
      </div>

      <section className="cg-firstrun">
        <div className="cg-firstrun__lead">
          <h2 className="cg-eyebrow cg-eyebrow--accent">Your shop is open</h2>
          <p className="cg-firstrun__title">
            {studio.name} is live at {url}
          </p>
          <p className="cg-firstrun__body">
            It is a real page right now — anyone with the link can read it. It says
            what you make and roughly where you are, and nothing else until you add
            a piece.
          </p>
          <Link href={`/artist/${studio.handle}`} className="cg-btn cg-btn--solid">
            View your storefront
          </Link>
        </div>

        <dl className="cg-firstrun__facts">
          <Fact label="Shop name" value={studio.name} />
          <Fact label="Handle" value={`@${studio.handle}`} />
          <Fact label="You make" value={studio.discipline} />
          <Fact label="Handover area" value={studio.neighbourhood ?? studio.city} />
        </dl>
      </section>

      <section className="cg-card cg-steps">
        <header className="cg-card__head">
          <h2 className="cg-eyebrow">What happens next</h2>
          <span className="cg-card__aside">1 of 4 done</span>
        </header>

        <ol className="cg-steps__list">
          <Step done n={1} title="Open your storefront">
            Done. Your handle is yours, and nobody else can take it.
          </Step>

          <Step n={2} title="List your first piece" building>
            Photos, price, size and how you will hand it over. Five pieces can be
            live at a time on the free plan, and a slot frees the moment one sells.
          </Step>

          <Step n={3} title="Record the 20-second Verified Maker clip" building>
            You, two of your listed pieces, and a handwritten slip with your handle
            and the date. It is the check buyers look for before they message.
          </Step>

          <Step n={4} title="Pick your storefront skin" building>
            One hue and one mode, applied to your shop only. Electric Indigo and
            Ruby Crimson are free; Light Pink and Teal Breeze come with Pro.
          </Step>
        </ol>

        <p className="cg-steps__note">
          The steps marked <em>being built</em> are not available yet. Nothing is
          waiting on you — the shop is open and the link works today.
        </p>
      </section>

      <section className="cg-verify">
        <div>
          <h2 className="cg-eyebrow cg-eyebrow--accent">While you wait</h2>
          <p className="cg-verify__title">Share the link now, not later</p>
          <p className="cg-verify__body">
            A storefront with your name on it is worth sending to people who already
            buy from you. They can follow the shop before there is anything in it, and
            they will be the first to see the piece you list.
          </p>
        </div>
        <Link href={`/artist/${studio.handle}`} className="cg-btn cg-btn--outline">
          Open your page
        </Link>
      </section>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="cg-firstrun__fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Step({
  n,
  title,
  children,
  done = false,
  building = false,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  done?: boolean;
  building?: boolean;
}) {
  return (
    <li className={`cg-step ${done ? "cg-step--done" : ""}`}>
      <span className="cg-step__n" aria-hidden="true">
        {done ? "✓" : n}
      </span>
      <div>
        <p className="cg-step__title">
          {title}
          {building ? <span className="cg-step__tag">being built</span> : null}
        </p>
        <p className="cg-step__body">{children}</p>
      </div>
    </li>
  );
}
