import Link from "next/link";
import { Logotype } from "@/components/brand/Wordmark";
import { ThemeControls } from "./ThemeControls";
import { MobileNav } from "./MobileNav";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/discover/art", label: "Paintings & Canvas" },
  { href: "/discover/decor", label: "Handcrafted Objects" },
  { href: "/fees", label: "Fees" },
];

export function SiteHeader() {
  return (
    <header className="cg-header">
      <div className="cg-header__row">
        <div className="cg-header__lead">
          <Logotype size="lg" />
          <nav className="cg-nav cg-hide-md" aria-label="Primary">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="cg-header__actions">
          <div className="cg-header__divider cg-hide-sm">
            <ThemeControls />
          </div>
          <Link href="/sign-in" className="cg-header__signin cg-hide-sm">
            Sign in
          </Link>
          <Link href="/become-seller" className="cg-btn cg-btn--solid cg-btn--sm">
            Open Atelier
          </Link>
          <MobileNav links={LINKS} />
        </div>
      </div>
    </header>
  );
}
