"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeControls } from "./ThemeControls";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="cg-mobilenav cg-show-md">
      <button
        type="button"
        className="cg-mobilenav__toggle"
        aria-expanded={open}
        aria-controls="cg-mobilenav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cg-sr">{open ? "Close menu" : "Open menu"}</span>
        <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <>
                <path d="M2 2l18 10" />
                <path d="M20 2L2 12" />
              </>
            ) : (
              <>
                <path d="M0 1h22" />
                <path d="M0 7h22" />
                <path d="M0 13h22" />
              </>
            )}
          </g>
        </svg>
      </button>

      {open ? (
        <div className="cg-mobilenav__panel" id="cg-mobilenav-panel">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/sign-in" onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <div className="cg-mobilenav__hues">
            <span className="cg-eyebrow">Theme</span>
            <ThemeControls compact />
          </div>
        </div>
      ) : null}
    </div>
  );
}
