"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/Wordmark";
import { placeholder } from "@/lib/media";
import { STUDIO_NAV } from "@/lib/sample-data";

/**
 * The seller's chrome. Same glass bar as the shell, over the studio's mode.
 *
 * Getting *out* of the studio matters as much as getting in. A seller is also a
 * buyer — they browse, they save, they message other makers — so the way back
 * to the shop sits in the same place on this bar as "My Atelier" does on the
 * buyer's, and the wordmark leaves the studio the way a logo normally does.
 */
export function StudioHeader({
  name,
  mode,
  onToggleMode,
}: {
  name: string;
  mode: "light" | "dark";
  onToggleMode: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="cg-studiobar">
      <div className="cg-studiobar__lead">
        <Link href="/discover" className="cg-studiobar__mark" aria-label="CraftGali — browse">
          <Wordmark size="md" />
          <span className="cg-studiobar__suffix">Studio</span>
        </Link>

        <nav className="cg-studionav cg-hide-md" aria-label="Studio">
          {STUDIO_NAV.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span key={item.label} title="This section is still being built">
                {item.label}
              </span>
            ),
          )}
        </nav>
      </div>

      <div className="cg-studiobar__actions">
        <button
          type="button"
          className="cg-modetoggle"
          onClick={onToggleMode}
          aria-pressed={mode === "dark"}
          title={mode === "dark" ? "Switch the studio to light" : "Switch the studio to dark"}
        >
          <span className="cg-sr">
            {mode === "dark" ? "Switch the studio to light" : "Switch the studio to dark"}
          </span>
          <span aria-hidden="true">{mode === "dark" ? "☀" : "☾"}</span>
        </button>

        <Link href="/discover" className="cg-studiobar__leave">
          <ShopIcon />
          <span className="cg-hide-sm">Browse as a buyer</span>
          <span className="cg-sr">Leave the studio and browse CraftGali</span>
        </Link>

        <Link href="/sell/pieces/new" className="cg-studiobar__add">
          Add a piece
        </Link>
        <Link
          href="/settings"
          className="cg-studiobar__face"
          aria-label={`${name} — account settings`}
          style={{ backgroundImage: `url(${placeholder(seedFor(name), 60, 60)})` }}
        />
      </div>
    </header>
  );
}

function ShopIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 9h16l-1 11H5z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

/** A stable placeholder portrait per seller, until avatar uploads land. */
function seedFor(name: string) {
  return [...name].reduce((total, char) => total + char.charCodeAt(0), 0) % 900;
}
