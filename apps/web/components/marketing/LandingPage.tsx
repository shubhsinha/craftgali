import Link from "next/link";
import {
  HeroMedallion,
  JaliCorners,
  RangoliDivider,
  ToranDivider,
} from "@/components/brand/Heritage";
import { PieceCard } from "@/components/marketplace/PieceCard";
import { PinIcon, SearchIcon } from "@/components/shell/icons";
import { FOUNDING, PIECES, showcaseStudios, VIEWER } from "@/lib/sample-data";
import { SKINS } from "@/lib/skins";
import { placeholder } from "@/lib/media";
import type { Stream } from "@/lib/types";

/**
 * P1 — the logged-out landing page.
 *
 * The order is the argument: what this is, where it is near you, what it costs
 * an artist to join, what is for sale, and only then who runs the place. The
 * medallion, the rangoli rule and the toran carry the craft reading so the
 * glass surfaces themselves can stay plain.
 */
export function LandingPage({ stream = "art" }: { stream?: Stream }) {
  return (
    <main>
      <Hero />
      <Gallery stream={stream} />
      <ToranDivider />
      <Spotlight />
      <Storefronts />
    </main>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero() {
  return (
    <section className="cg-hero">
      <HeroMedallion />

      <div className="cg-wrap cg-hero__copy">
        <p className="cg-hero__eyebrow">Passionate hands, Legendary art</p>
        <h1 className="cg-hero__title">
          Reaching Every Corner <em>of the World</em>
        </h1>
        <p className="cg-lede cg-hero__lede">
          Explore breathtaking canvases, sculptures, and decor curated directly from
          independent makers in your creative ecosystem.
        </p>

        <RangoliDivider />

        <form className="cg-hero__search" role="search" action="/discover">
          <button type="button" className="cg-hero__place">
            <PinIcon size={15} />
            <span>
              {VIEWER.location} · {VIEWER.radiusKm} km
            </span>
          </button>
          <label className="cg-hero__keyword">
            <SearchIcon size={15} />
            <span className="cg-sr">Search</span>
            <input
              type="search"
              name="q"
              placeholder="Search artwork, studio, or medium…"
              autoComplete="off"
            />
          </label>
          <button type="submit" className="cg-btn cg-btn--solid">
            Explore near me
          </button>
        </form>

        <span className="cg-hero__slogan">Crafted Locally, Cherished Globally</span>

        <FoundingMeter />
      </div>
    </section>
  );
}

function FoundingMeter() {
  const pct = Math.round((FOUNDING.claimed / FOUNDING.total) * 100);

  return (
    <div className="cg-meter">
      <div className="cg-meter__head">
        <span className="cg-eyebrow">{FOUNDING.tier}</span>
        <span className="cg-meter__count">
          {FOUNDING.claimed.toLocaleString("en-IN")} claimed
        </span>
      </div>

      <div
        className="cg-meter__track"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={FOUNDING.total}
        aria-valuenow={FOUNDING.claimed}
        aria-label={FOUNDING.tier}
      >
        <span className="cg-meter__fill" style={{ width: `${pct}%` }} />
        <span className="cg-meter__pip" style={{ left: `${pct}%` }} />
      </div>

      <p className="cg-meter__note">
        {FOUNDING.remaining.toLocaleString("en-IN")} of{" "}
        {FOUNDING.total.toLocaleString("en-IN")} Tier-1 spots left — {FOUNDING.perks}
      </p>

      <div className="cg-meter__actions">
        <Link href="/become-seller" className="cg-btn cg-btn--solid cg-btn--sm">
          Claim a slot
        </Link>
        <Link href="/fees" className="cg-btn cg-btn--outline cg-btn--sm">
          See the fees
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- gallery --- */

const TABS = [
  { id: "art" as const, label: "Paintings & Canvas", href: "/?stream=art" },
  { id: "decor" as const, label: "Handcrafted Objects", href: "/?stream=decor" },
];

function Gallery({ stream }: { stream: Stream }) {
  /* The landing page is a shop window, not the feed: it shows verified work
     only, and never more than six pieces before handing over to /discover. */
  const shown = PIECES.filter(
    (piece) => piece.stream === stream && piece.verifiedMaker && !piece.soldForInr,
  ).slice(0, 6);

  return (
    <section className="cg-wrap">
      <nav className="cg-streams" aria-label="Categories">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className="cg-stream"
            aria-current={tab.id === stream ? "page" : undefined}
            scroll={false}
          >
            {tab.label}
          </Link>
        ))}
        <span className="cg-stream" aria-disabled="true">
          Verified Makers only
        </span>
      </nav>

      <div className="cg-gallery">
        {shown.map((piece) => (
          <PieceCard key={piece.id} piece={piece} />
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- spotlight --- */

function Spotlight() {
  return (
    <div className="cg-wrap">
      <section className="cg-spotlight">
        <JaliCorners />

        <div>
          <h2 className="cg-spotlight__title">Raw Vision, Timeless Heritage</h2>
          <p className="cg-spotlight__body">
            Every piece tells a story born from heritage craftsmanship. Share your talent
            with neighbours nearby and admirers across the globe — and keep every rupee a
            buyer pays you.
          </p>
          <Link href="/become-seller" className="cg-btn cg-btn--solid">
            Share Your Art Globally
          </Link>
        </div>

        <div className="cg-spotlight__card">
          <p className="cg-spotlight__name">Meera&rsquo;s Clay Atelier</p>
          <p className="cg-spotlight__place">Bandra West • 1.4 km away</p>
          <p className="cg-spotlight__quote">
            &ldquo;Crafting slow-made stoneware ceramics right in the
            neighbourhood—shipped with pride across the globe.&rdquo;
          </p>
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------- storefronts --- */

function Storefronts() {
  return (
    <section className="cg-wrap cg-storefronts">
      <header className="cg-section__head">
        <h2 className="cg-section__title">Ateliers, painted by their maker</h2>
        <Link href="/studios" className="cg-section__more">
          See all 1,416 studios →
        </Link>
      </header>

      <div className="cg-storefronts__grid">
        {showcaseStudios().map((studio) => (
          <Link
            key={studio.handle}
            href={`/artist/${studio.handle}`}
            className="cg-skincard"
            data-hue={studio.skin}
          >
            <div
              className="cg-skincard__img"
              style={{ backgroundImage: `url(${placeholder(studio.seed, 400, 300)})` }}
            />
            <div className="cg-skincard__body">
              <span className="cg-skincard__name">{studio.name}</span>
              <span className="cg-skincard__meta">
                @{studio.handle} · {studio.city} · {studio.discipline}
              </span>
              <span className="cg-skincard__skin">{SKINS[studio.skin].name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
