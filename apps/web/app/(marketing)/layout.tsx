// Marketing layout — public nav + footer
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <div className="nav">
          <a href="/" className="logo">
            CraftGali
          </a>
          <nav className="nav-links nav-mobile-hide">
            <a href="#explore">Explore</a>
            <a href="#discover">Categories</a>
            <a href="#how">How it works</a>
          </nav>
          <div className="nav-actions">
            <Link href="/sign-in" className="nav-signin">
              Sign in
            </Link>
            <Link href="/become-seller" className="nav-cta">
              Start selling
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer>
        <div className="wrap foot-row">
          <span className="logo" style={{ fontSize: 17 }}>
            CraftGali
          </span>
          <div className="foot-links">
            <a href="/about">About</a>
            <a href="#">Safety</a>
            <a href="#">For sellers</a>
            <a href="#">Contact</a>
          </div>
          <span className="foot-copy">© 2026 CraftGali</span>
        </div>
      </footer>
    </>
  );
}
