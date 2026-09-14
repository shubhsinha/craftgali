"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { writeReviewAction } from "@/lib/actions/reviews";
import type { ListingState } from "@/lib/plans";

const EMPTY: ListingState = null;

/**
 * The review form, shown only to the person who bought the piece.
 *
 * It appears on the listing itself rather than in some separate inbox, because
 * the piece in front of you is the thing you are describing — and because a
 * buyer who comes back to look at what they bought is exactly the buyer with
 * something to say.
 */
export function ReviewForm({
  listingId,
  shop,
  existing,
}: {
  listingId: string;
  shop: string;
  existing: { stars: number; body: string | null } | null;
}) {
  const [state, action] = useFormState(writeReviewAction, EMPTY);
  const [stars, setStars] = useState(existing?.stars ?? 0);

  return (
    <section className="cg-panel cg-panel--stacked cg-reviewform">
      <h2 className="cg-eyebrow cg-eyebrow--accent">
        {existing ? "Your review" : "You bought this"}
      </h2>
      <p className="cg-reviewform__lead">
        {existing
          ? `You reviewed ${shop}. You can change it whenever you like.`
          : `How did the handover go with ${shop}? Other buyers see this on their storefront.`}
      </p>

      <form action={action} className="cg-form">
        <input type="hidden" name="listingId" value={listingId} />
        <input type="hidden" name="stars" value={stars} />

        <div
          className="cg-stars"
          role="radiogroup"
          aria-label="Stars"
          aria-invalid={state?.field === "stars" || undefined}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={stars === n}
              aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
              className={`cg-star ${n <= stars ? "cg-star--on" : ""}`}
              onClick={() => setStars(n)}
            >
              ★
            </button>
          ))}
        </div>

        <label className="cg-field">
          <span className="cg-field__label">
            What happened <span className="cg-field__hint">optional</span>
          </span>
          <textarea
            name="body"
            rows={4}
            maxLength={1200}
            defaultValue={existing?.body ?? ""}
            placeholder="Did it look like the photographs? Were they easy to meet?"
          />
        </label>

        {state?.error ? (
          <p className="cg-form__error" role="alert">
            {state.error}
          </p>
        ) : null}
        {state?.done ? (
          <p className="cg-form__done" role="status">
            {state.done}
          </p>
        ) : null}

        <SubmitButton busy="Posting…">
          {existing ? "Update your review" : "Post your review"}
        </SubmitButton>
      </form>
    </section>
  );
}
