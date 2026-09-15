"use client";

import { useState } from "react";
import type { Piece } from "@/lib/types";
import { WorkCard } from "./WorkCard";

type Tab = "all" | "live" | "sold";

/**
 * The shelf, with tabs that actually filter it.
 *
 * The comp drew per-studio collections ("Monsoon Series") that nothing could
 * populate, so those buttons did nothing. What every shop genuinely has is
 * work for sale and work that has gone — so those are the tabs, and a shop
 * with nothing sold does not get a Sold tab it cannot use.
 */
export function Shelf({ live, sold, empty }: { live: Piece[]; sold: Piece[]; empty: string }) {
  const [tab, setTab] = useState<Tab>("all");

  const tabs: { id: Tab; label: string; n: number }[] = [
    { id: "all", label: "All work", n: live.length + sold.length },
    { id: "live", label: "For sale", n: live.length },
    ...(sold.length ? [{ id: "sold" as Tab, label: "Sold", n: sold.length }] : []),
  ];

  const shown = tab === "live" ? live : tab === "sold" ? sold : [...live, ...sold];

  if (!live.length && !sold.length) return <p className="cg-front__empty">{empty}</p>;

  return (
    <>
      <nav className="cg-front__tabs" aria-label="Shelf">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className="cg-chip"
            aria-pressed={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label} <span className="cg-front__tabn">{t.n}</span>
          </button>
        ))}
      </nav>

      <div className="cg-front__grid">
        {shown.map((piece) => (
          <WorkCard key={piece.id} piece={piece} />
        ))}
      </div>
    </>
  );
}
