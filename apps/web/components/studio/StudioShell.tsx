"use client";

import { useEffect, useState } from "react";
import { AmbientGlows, HeritageTapestry } from "@/components/brand/Heritage";
import type { Mode } from "@/components/shell/theme";
import { StudioHeader } from "./StudioHeader";

const STUDIO_MODE_KEY = "cg-studio-mode";

/**
 * The seller's side of the app runs on its own mode, dark by default — the
 * design draws it that way, and the inversion is the fastest way to say which
 * side of CraftGali you are standing on. It is deliberately a separate setting
 * from the buyer's: flipping the studio to light must not repaint the feed.
 *
 * The hue is not duplicated. A seller sees the studio in whichever hue they
 * browse in, so there is only ever one hue choice per person.
 *
 * The header lives in here rather than in the layout because the mode toggle
 * and the wrapper it repaints have to be on the same side of the client
 * boundary — the layout can only hand this component finished children.
 */
export function StudioShell({ name, children }: { name: string; children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STUDIO_MODE_KEY);
      if (stored === "light" || stored === "dark") setMode(stored);
    } catch {
      /* private mode — the studio simply opens dark every time */
    }
  }, []);

  function toggle() {
    setMode((current) => {
      const next: Mode = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STUDIO_MODE_KEY, next);
      } catch {
        /* as above */
      }
      return next;
    });
  }

  return (
    <div className="cg-studioshell cg-skinned" data-mode={mode}>
      <div className="cg-skinned__ground" aria-hidden="true">
        <AmbientGlows />
        <HeritageTapestry idPrefix="st" />
      </div>

      <StudioHeader name={name} mode={mode} onToggleMode={toggle} />
      {children}
    </div>
  );
}
