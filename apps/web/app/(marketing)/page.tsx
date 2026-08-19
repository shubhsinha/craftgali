import ExploreSection from "./ExploreSection";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">
          <span className="dot"></span> Now live in your neighborhood
        </span>
        <h1>
          Every street, a master artisan. <em>Their art, worldwide.</em>
        </h1>
        <p className="sub">Crafted locally. Cherished globally.</p>
        <div className="hero-ctas">
          <a href="#explore" className="btn btn-primary">
            Explore near you
          </a>
          <Link href="/become-seller" className="btn btn-secondary">
            List your craft
          </Link>
        </div>
        <p className="hero-note">
          Free to browse · Pickup within your neighborhood · Payments held
          safely until delivery
        </p>
      </section>

      <ExploreSection />

      <section className="discover" id="discover">
        <div className="wrap">
          <p className="kicker">Browse by intent</p>
          <h2>Four ways into the neighborhood</h2>
          <div className="discover-grid">
            <div className="d-card">
              <div
                className="d-icon"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                A
              </div>
              <h3>Art &amp; paintings</h3>
              <p>
                Original canvases, sketches and fine art from independent
                artists nearby.
              </p>
            </div>
            <div className="d-card">
              <div
                className="d-icon"
                style={{ background: "var(--primary-soft)" }}
              >
                H
              </div>
              <h3>Handmade decor</h3>
              <p>
                Macrame, pottery, resin work and crafted pieces for the home.
              </p>
            </div>
            <div className="d-card">
              <div
                className="d-icon"
                style={{ background: "var(--primary-faint)" }}
              >
                P
              </div>
              <h3>Pre-loved items</h3>
              <p>
                Quality used furniture and vintage decor, cycled to a new home.
              </p>
            </div>
            <div className="d-card">
              <div
                className="d-icon"
                style={{ background: "var(--sky)", color: "#fff" }}
              >
                L
              </div>
              <h3>Local auctions</h3>
              <p>
                Bid on standout pieces before they&apos;re gone — all within
                your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="wrap">
          <h2>From your workbench to their wall</h2>
          <p className="lead">
            No shipping to arrange, no gallery cut to negotiate.
          </p>
          <div className="how-steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>List in minutes</h3>
              <p>
                Photograph your piece, set a fixed price or start an auction.
                One registration, unlimited listings.
              </p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Sell or get bid on</h3>
              <p>
                Buyers nearby browse, chat and either buy instantly or bid until
                your auction closes.
              </p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Meet and get paid</h3>
              <p>
                Hand it over at a safe public spot. Payment releases to your
                wallet after confirmed delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="wrap">
          <div className="t-item">
            <h4>Escrow protected</h4>
            <p>
              Payments are held securely and only released after the buyer
              confirms delivery.
            </p>
          </div>
          <div className="t-item">
            <h4>Safe exchange zones</h4>
            <p>
              Meet at a suggested public spot — your address is never shown to
              buyers.
            </p>
          </div>
          <div className="t-item">
            <h4>No shipping needed</h4>
            <p>
              Everything sells and moves within your neighborhood, no courier
              required.
            </p>
          </div>
        </div>
      </section>

      <section className="seller-band" id="sell">
        <h2>Your craft deserves an audience closer than a screen</h2>
        <p>
          One-time registration, unlimited listings, and a public portfolio you
          can share anywhere.
        </p>
        <Link href="/become-seller" className="btn btn-primary">
          Register your storefront
        </Link>
      </section>
    </main>
  );
}
