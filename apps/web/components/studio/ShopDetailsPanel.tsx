"use client";

import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { updateShopDetailsAction, uploadShopMediaAction } from "@/lib/actions/storefront";
import type { ListingState } from "@/lib/plans";

const EMPTY: ListingState = null;

/**
 * What the shop says about itself, and what it looks like.
 *
 * Three forms rather than one, because they save at different rhythms: a
 * cover is uploaded once and forgotten, the bio gets rewritten on a slow
 * afternoon, and neither should have to wait for the other.
 */
export function ShopDetailsPanel({
  tagline,
  bio,
  coverId,
  avatarId,
}: {
  tagline: string;
  bio: string;
  coverId: string | null;
  avatarId: string | null;
}) {
  const [words, saveWords] = useFormState(updateShopDetailsAction, EMPTY);

  return (
    <section className="cg-card cg-details">
      <h2 className="cg-eyebrow">Your shop, in your words</h2>
      <p className="cg-details__note">
        The line sits under your name in the serif. The about text goes beneath it.
        Both are yours — nothing here is edited or rewritten.
      </p>

      <form action={saveWords} className="cg-form cg-details__form">
        <label className="cg-field">
          <span className="cg-field__label">
            A line <span className="cg-field__hint">up to 140 characters</span>
          </span>
          <input name="tagline" defaultValue={tagline} maxLength={140}
                 placeholder="I paint the twenty minutes after it stops raining."
                 aria-invalid={words?.field === "tagline" || undefined} />
        </label>

        <label className="cg-field">
          <span className="cg-field__label">
            About <span className="cg-field__hint">optional</span>
          </span>
          <textarea name="bio" rows={5} defaultValue={bio} maxLength={1500}
                    placeholder="Where you work, what you make, how you came to it."
                    aria-invalid={words?.field === "bio" || undefined} />
        </label>

        {words?.error ? <p className="cg-form__error" role="alert">{words.error}</p> : null}
        {words?.done ? <p className="cg-form__done" role="status">{words.done}</p> : null}

        <SubmitButton busy="Saving…">Save words</SubmitButton>
      </form>

      <div className="cg-details__media">
        <MediaSlot kind="cover" label="Cover" note="Wide. Up to 6 MB." currentId={coverId} />
        <MediaSlot kind="avatar" label="Portrait" note="Square. Up to 2 MB." currentId={avatarId} />
      </div>
    </section>
  );
}

function MediaSlot({
  kind,
  label,
  note,
  currentId,
}: {
  kind: "cover" | "avatar";
  label: string;
  note: string;
  currentId: string | null;
}) {
  const [state, action] = useFormState(uploadShopMediaAction, EMPTY);
  const [preview, setPreview] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const shown = preview ?? (currentId ? `/api/media/${currentId}` : null);

  return (
    <form action={action} className={`cg-slot-media cg-slot-media--${kind}`}>
      <input type="hidden" name="kind" value={kind} />
      <input ref={input} type="file" name="file" className="cg-sr"
             accept="image/jpeg,image/png,image/webp,image/avif"
             onChange={(e) => {
               const f = e.target.files?.[0];
               if (preview) URL.revokeObjectURL(preview);
               setPreview(f ? URL.createObjectURL(f) : null);
             }} />

      <button type="button" className="cg-slot-media__frame" onClick={() => input.current?.click()}
              aria-label={`Choose a ${label.toLowerCase()}`}>
        {shown ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={shown} alt="" />
        ) : (
          <span className="cg-slot-media__empty">Choose a {label.toLowerCase()}</span>
        )}
      </button>

      <div className="cg-slot-media__row">
        <span className="cg-slot-media__label">{label} <span className="cg-field__hint">{note}</span></span>
        {preview ? <SubmitButton busy="Uploading…">Upload</SubmitButton> : null}
      </div>

      {state?.error ? <p className="cg-form__error" role="alert">{state.error}</p> : null}
      {state?.done ? <p className="cg-form__done" role="status">{state.done}</p> : null}
    </form>
  );
}
