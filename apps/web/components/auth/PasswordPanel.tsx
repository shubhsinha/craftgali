"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { changePasswordAction, type FormState } from "@/lib/actions/auth";

const EMPTY: FormState = null;

/**
 * The change-password block in Settings.
 *
 * Proving the current password is the point: without it, anyone who walks up to
 * an unlocked laptop could take the account away from its owner.
 */
export function PasswordPanel() {
  const [state, action] = useFormState(changePasswordAction, EMPTY);

  return (
    <section className="cg-settings__block">
      <h2 className="cg-settings__blocktitle">Change your password</h2>
      <p className="cg-settings__blocknote">
        Choose something you don&rsquo;t use anywhere else. Saving signs out every
        other device on this account.
      </p>

      <form action={action} className="cg-form cg-settings__form">
        <label className="cg-field">
          <span className="cg-field__label">Current password</span>
          <input
            type="password"
            name="current"
            autoComplete="current-password"
            required
            aria-invalid={state?.field === "current" || undefined}
          />
        </label>

        <label className="cg-field">
          <span className="cg-field__label">New password</span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            aria-invalid={state?.field === "password" || undefined}
          />
        </label>

        <label className="cg-field">
          <span className="cg-field__label">New password again</span>
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
            required
            minLength={8}
            aria-invalid={state?.field === "confirm" || undefined}
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

        <SubmitButton busy="Saving…">Change password</SubmitButton>
      </form>
    </section>
  );
}
