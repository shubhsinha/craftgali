"use client";

import { useState } from "react";

/**
 * Sharing a piece.
 *
 * Native share where the browser has it — on a phone that is the sheet people
 * expect — and the clipboard everywhere else, which is what sharing actually
 * means on a desktop. It says what it did either way, because a button that
 * looks inert after a click reads as broken.
 */
export function ShareButton({ title }: { title: string }) {
  const [said, setSaid] = useState<string | null>(null);

  async function share() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* Dismissing the sheet throws. That is a choice, not a failure — fall
           through to the clipboard rather than telling them something broke. */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setSaid("Link copied");
    } catch {
      setSaid("Copy the address bar");
    }
    setTimeout(() => setSaid(null), 2200);
  }

  return (
    <button type="button" className="cg-btn cg-btn--quiet cg-btn--block" onClick={share}>
      {said ?? "Share"}
    </button>
  );
}
