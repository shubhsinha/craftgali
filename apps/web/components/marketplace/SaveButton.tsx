"use client";

import { useState, useTransition } from "react";
import { toggleSaveAction } from "@/lib/actions/saves";

/**
 * The heart.
 *
 * Flips immediately and reconciles with what the server actually did — a save
 * is a small enough act that waiting a round trip to see it register feels
 * broken, and small enough that being briefly wrong costs nothing.
 */
export function SaveButton({
  listingId,
  saved: initial,
  next,
  tone = "plate",
  count,
}: {
  listingId: string;
  saved: boolean;
  /** Where to return after signing in, for a visitor who has no list yet. */
  next: string;
  tone?: "plate" | "wide";
  /** Shown only on the buy rail, and only once a piece has been saved at all. */
  count?: number;
}) {
  const [saved, setSaved] = useState(initial);
  const [pending, start] = useTransition();

  function toggle() {
    const optimistic = !saved;
    setSaved(optimistic);

    start(async () => {
      const result = await toggleSaveAction(listingId, next);
      /* The server is the authority — a rejected save must not leave a filled
         heart behind. */
      if (result.saved !== optimistic) setSaved(result.saved);
    });
  }

  const shown = count === undefined ? 0 : count + (saved && !initial ? 1 : 0) - (!saved && initial ? 1 : 0);

  return (
    <button
      type="button"
      className={`cg-save cg-save--${tone} ${saved ? "cg-save--on" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? "Saved — tap to remove" : "Save this piece"}
      disabled={pending}
      onClick={toggle}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"
           fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9">
        <path d="M12 20s-7-4.6-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6C19 15.4 12 20 12 20z" />
      </svg>
      {tone === "wide" ? <span>{saved ? "Saved" : "Save"}</span> : null}
      {tone === "wide" && count !== undefined && shown > 0 ? (
        <span className="cg-save__count">{shown}</span>
      ) : null}
    </button>
  );
}
