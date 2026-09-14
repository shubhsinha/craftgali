"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { updateHandoverAction } from "@/lib/actions/listings";
import { CITIES } from "@/lib/cities";
import type { ListingState } from "@/lib/plans";

const EMPTY: ListingState = null;

/**
 * Where the shop hands over.
 *
 * Two shapes from the same component. `tone="alert"` is the interruption on the
 * pieces page for a shop that has no city and is therefore missing from every
 * distance search; `tone="panel"` is the ordinary editable field in the
 * storefront settings. Same action, same validation, so the urgent version and
 * the calm one can never drift apart.
 */
export function HandoverPanel({
  city,
  neighbourhood,
  tone = "panel",
}: {
  city: string | null;
  neighbourhood: string;
  tone?: "panel" | "alert";
}) {
  const [state, action] = useFormState(updateHandoverAction, EMPTY);
  const alert = tone === "alert";

  return (
    <section className={alert ? "cg-notice cg-handoverpanel cg-handoverpanel--alert" : "cg-card cg-handoverpanel"}>
      {alert ? (
        <>
          <p className="cg-notice__title">Your shop has no city yet</p>
          <p className="cg-notice__body">
            Buyers search by city and distance, so until this is set your pieces will
            not appear in anyone&rsquo;s feed.
          </p>
        </>
      ) : (
        <>
          <h2 className="cg-eyebrow">Where you hand over</h2>
          <p className="cg-handoverpanel__note">
            The city is what every distance on CraftGali is measured from. The
            neighbourhood is the only other place a buyer sees — never your address,
            on any listing, ever.
          </p>
        </>
      )}

      <form action={action} className="cg-handoverpanel__form">
        <label className="cg-field">
          <span className="cg-field__label">City</span>
          <select
            name="city"
            defaultValue={city ?? ""}
            aria-invalid={state?.field === "city" || undefined}
          >
            <option value="" disabled>
              Choose your city…
            </option>
            {[...CITIES]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name} · {option.state}
                </option>
              ))}
          </select>
        </label>

        <label className="cg-field">
          <span className="cg-field__label">Neighbourhood</span>
          <input
            name="neighbourhood"
            defaultValue={neighbourhood}
            required
            maxLength={80}
            placeholder="Bandra West"
            aria-invalid={state?.field === "neighbourhood" || undefined}
          />
        </label>

        <SubmitButton busy="Saving…">Save</SubmitButton>
      </form>

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
    </section>
  );
}
