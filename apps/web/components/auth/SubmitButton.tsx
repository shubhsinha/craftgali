"use client";

import { useFormStatus } from "react-dom";

/** Disables itself for the round trip, so a double-click can't double-submit. */
export function SubmitButton({ children, busy }: { children: string; busy: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="cg-btn cg-btn--solid cg-btn--block" disabled={pending}>
      {pending ? busy : children}
    </button>
  );
}
