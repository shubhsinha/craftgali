"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_HUE,
  DEFAULT_MODE,
  HUES,
  HUE_KEY,
  MODE_KEY,
  type HueId,
  type Mode,
} from "./theme";

/**
 * The four hue dots and the mode toggle, as they sit in the header's glass bar.
 *
 * The document already carries the right attributes before this mounts — the
 * bootstrap in <head> saw to that — so the effect only syncs local state up to
 * what is already on screen, and never repaints on hydration.
 */
export function ThemeControls({ compact = false }: { compact?: boolean }) {
  const [hue, setHue] = useState<HueId>(DEFAULT_HUE);
  const [mode, setMode] = useState<Mode>(DEFAULT_MODE);

  useEffect(() => {
    const root = document.documentElement;
    setHue((root.dataset.hue as HueId) ?? DEFAULT_HUE);
    setMode((root.dataset.mode as Mode) ?? DEFAULT_MODE);
  }, []);

  function remember(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode — the choice simply doesn't outlive the tab */
    }
  }

  function chooseHue(next: HueId) {
    setHue(next);
    document.documentElement.dataset.hue = next;
    remember(HUE_KEY, next);
  }

  function toggleMode() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.dataset.mode = next;
    remember(MODE_KEY, next);
  }

  return (
    <div className={`cg-theme ${compact ? "cg-theme--compact" : ""}`}>
      <div className="cg-hues" role="group" aria-label="Colour">
        {HUES.map((option) => (
          <button
            key={option.id}
            type="button"
            className="cg-hue"
            style={{ background: option.swatch }}
            aria-pressed={hue === option.id}
            aria-label={option.label}
            title={option.label}
            onClick={() => chooseHue(option.id)}
          />
        ))}
      </div>

      <button
        type="button"
        className="cg-modetoggle"
        onClick={toggleMode}
        aria-pressed={mode === "dark"}
        title={mode === "dark" ? "Switch to light" : "Switch to dark"}
      >
        <span className="cg-sr">{mode === "dark" ? "Switch to light" : "Switch to dark"}</span>
        <span aria-hidden="true">{mode === "dark" ? "☀" : "☾"}</span>
      </button>
    </div>
  );
}
