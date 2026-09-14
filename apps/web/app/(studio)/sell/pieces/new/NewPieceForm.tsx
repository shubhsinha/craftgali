"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { PhotoPicker } from "@/components/studio/PhotoPicker";
import { createListingAction } from "@/lib/actions/listings";
import { MAX_PHOTOS, MAX_PHOTO_MB, type ListingState } from "@/lib/plans";

const EMPTY: ListingState = null;

const HANDOVER = [
  { id: "in-person", label: "Meet in person", note: "At a Safe Exchange Zone near you." },
  { id: "seller-courier", label: "I'll courier it", note: "At cost, once you've agreed." },
  { id: "buyer-pickup", label: "Buyer arranges pickup", note: "They send their own courier." },
];

export function NewPieceForm({ slotsLeft }: { slotsLeft: number }) {
  const [state, action] = useFormState(createListingAction, EMPTY);
  const [stream, setStream] = useState<"art" | "decor">("art");
  const [handover, setHandover] = useState<string[]>(["in-person"]);

  function toggle(id: string) {
    setHandover((prev) => (prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]));
  }

  const bad = (field: string) => state?.field === field || undefined;

  return (
    <form action={action} className="cg-compose__form">
      <section className="cg-card cg-compose__card">
        <h2 className="cg-eyebrow">The photographs</h2>
        <p className="cg-compose__hint">
          Up to {MAX_PHOTOS}, {MAX_PHOTO_MB} MB each. Shoot flat-on in daylight against a plain wall — pieces
          photographed that way get roughly three times the views.
        </p>
        <PhotoPicker invalid={Boolean(bad("photos"))} />
      </section>

      <section className="cg-card cg-compose__card">
        <h2 className="cg-eyebrow">What it is</h2>

        <div className="cg-field">
          <span className="cg-field__label">Kind of piece</span>
          <div className="cg-field__chips">
            {[
              { id: "art", label: "Painting or canvas" },
              { id: "decor", label: "Handcrafted object" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                className="cg-chip"
                aria-pressed={stream === option.id}
                onClick={() => setStream(option.id as "art" | "decor")}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="stream" value={stream} />
        </div>

        <label className="cg-field">
          <span className="cg-field__label">Title</span>
          <input name="title" required maxLength={90} placeholder="Monsoon Serenade in Oils" aria-invalid={bad("title")} />
        </label>

        <div className="cg-compose__pair">
          <label className="cg-field">
            <span className="cg-field__label">Medium</span>
            <input name="medium" required placeholder="Oil on linen" aria-invalid={bad("medium")} />
          </label>
          <label className="cg-field">
            <span className="cg-field__label">Size</span>
            <input name="dimensions" required placeholder="90×60 cm" aria-invalid={bad("dimensions")} />
          </label>
        </div>

        <div className="cg-compose__pair">
          <label className="cg-field">
            <span className="cg-field__label">Year <span className="cg-field__hint">optional</span></span>
            <input name="year" inputMode="numeric" placeholder={String(new Date().getFullYear())} aria-invalid={bad("year")} />
          </label>
          <label className="cg-field">
            <span className="cg-field__label">Hours in it <span className="cg-field__hint">optional</span></span>
            <input name="hours" inputMode="numeric" placeholder="38" aria-invalid={bad("hours")} />
          </label>
        </div>
      </section>

      <section className="cg-card cg-compose__card">
        <h2 className="cg-eyebrow">The price</h2>
        <label className="cg-field">
          <span className="cg-field__label">Asking price</span>
          <div className="cg-money">
            <span aria-hidden="true">₹</span>
            <input name="price" required inputMode="numeric" placeholder="3400" aria-invalid={bad("price")} />
          </div>
          <span className="cg-field__hint">
            You keep every rupee of it — CraftGali takes no commission and never handles
            the money.
          </span>
        </label>

        <label className="cg-switch">
          <input type="checkbox" name="negotiable" />
          <span>
            <span className="cg-switch__label">Open to offers</span>
            <span className="cg-switch__note">Buyers get a Make an offer button instead of a plain message.</span>
          </span>
        </label>

        <label className="cg-switch">
          <input type="checkbox" name="aiAssisted" />
          <span>
            <span className="cg-switch__label">AI was involved in making this</span>
            <span className="cg-switch__note">
              Declare it and buyers who want handmade only can filter it out. Not
              declaring it when it was is grounds for removal.
            </span>
          </span>
        </label>
      </section>

      <section className="cg-card cg-compose__card">
        <h2 className="cg-eyebrow">Handover</h2>
        <p className="cg-compose__hint">
          Pick every way you are willing to do it. Buyers filter on this.
        </p>
        <div className="cg-layers__list">
          {HANDOVER.map((option) => (
            <button
              key={option.id}
              type="button"
              className="cg-tick"
              aria-pressed={handover.includes(option.id)}
              onClick={() => toggle(option.id)}
            >
              <span className="cg-tick__box">{handover.includes(option.id) ? "✓" : null}</span>
              <span>
                <span className="cg-tick__label">{option.label}</span>
                <span className="cg-tick__note">{option.note}</span>
              </span>
            </button>
          ))}
        </div>
        {handover.map((id) => (
          <input key={id} type="hidden" name="handover" value={id} />
        ))}
      </section>

      <section className="cg-card cg-compose__card">
        <h2 className="cg-eyebrow">The making of <span className="cg-field__hint">optional</span></h2>
        <p className="cg-compose__hint">
          The one thing a marketplace listing cannot fake. Where you made it, what went
          wrong, what you would do differently. Leave a blank line between paragraphs.
        </p>
        <label className="cg-field">
          <span className="cg-sr">Story</span>
          <textarea name="story" rows={7} placeholder="I started this on the first real day of the monsoon…" />
        </label>

        <div className="cg-compose__pair">
          <label className="cg-field">
            <span className="cg-field__label">Materials</span>
            <input name="materials" placeholder="Oil, linen" />
          </label>
          <label className="cg-field">
            <span className="cg-field__label">Edition</span>
            <input name="edition" placeholder="One of one" />
          </label>
        </div>

        <label className="cg-field">
          <span className="cg-field__label">Framing or finish <span className="cg-field__hint">optional</span></span>
          <input name="framing" placeholder="Unframed" />
        </label>
      </section>

      {state?.error ? (
        <p className="cg-form__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="cg-compose__foot">
        <p className="cg-compose__slots">
          {slotsLeft} of your free slots {slotsLeft === 1 ? "is" : "are"} still open.
        </p>
        <SubmitButton busy="Putting it on the shelf…">List this piece</SubmitButton>
      </div>
    </form>
  );
}
