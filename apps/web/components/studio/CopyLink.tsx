"use client";

import { useState } from "react";

/** Copies the storefront URL, and says so — a button that looks inert after a
    click reads as broken. */
export function CopyLink({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* No clipboard permission — the address is on screen to be selected. */
    }
  }

  return (
    <button type="button" className="cg-studio__copy" onClick={copy}>
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
