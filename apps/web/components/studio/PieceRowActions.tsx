"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { setListingStatusAction } from "@/lib/actions/listings";
import type { ListingState } from "@/lib/plans";

const EMPTY: ListingState = null;

/**
 * The status controls on a row of the seller's shelf.
 *
 * "Mark sold" opens rather than fires, because it asks one thing that cannot be
 * gathered later: who bought it. Naming the buyer is what lets them review the
 * piece afterwards, and a seller who skips it has simply made an ordinary sale
 * to somebody without an account.
 */
export function PieceRowActions({
  id,
  status,
  askingInr,
}: {
  id: string;
  status: string;
  askingInr: number;
}) {
  const [state, action] = useFormState(setListingStatusAction, EMPTY);
  const [selling, setSelling] = useState(false);

  if (status !== "live") {
    return (
      <div className="cg-shelfrow__actions">
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="live" />
          <button type="submit" className="cg-mini">
            Put back on the shelf
          </button>
        </form>
        {state?.done ? <span className="cg-shelfrow__said">{state.done}</span> : null}
      </div>
    );
  }

  if (selling) {
    return (
      <form action={action} className="cg-sold">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value="sold" />

        <label className="cg-field">
          <span className="cg-field__label">Sold for</span>
          <div className="cg-money">
            <span aria-hidden="true">₹</span>
            <input name="soldFor" inputMode="numeric" defaultValue={String(askingInr)} />
          </div>
        </label>

        <label className="cg-field">
          <span className="cg-field__label">
            Buyer&rsquo;s email <span className="cg-field__hint">optional</span>
          </span>
          <input
            name="buyerEmail"
            type="email"
            placeholder="so they can review it"
            autoComplete="off"
          />
        </label>

        <div className="cg-sold__row">
          <button type="submit" className="cg-mini cg-mini--solid">
            Confirm sold
          </button>
          <button type="button" className="cg-mini" onClick={() => setSelling(false)}>
            Cancel
          </button>
        </div>

        {state?.error ? (
          <p className="cg-form__error" role="alert">
            {state.error}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <div className="cg-shelfrow__actions">
      <button type="button" className="cg-mini cg-mini--solid" onClick={() => setSelling(true)}>
        Mark sold
      </button>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value="archived" />
        <button type="submit" className="cg-mini">
          Archive
        </button>
      </form>
      {state?.done ? <span className="cg-shelfrow__said">{state.done}</span> : null}
    </div>
  );
}
