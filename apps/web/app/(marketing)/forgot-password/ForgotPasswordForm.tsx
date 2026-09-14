"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { requestResetAction, type FormState } from "@/lib/actions/auth";

const EMPTY: FormState = null;

export function ForgotPasswordForm({ mailConfigured }: { mailConfigured: boolean }) {
  const [state, action] = useFormState(requestResetAction, EMPTY);

  /* The confirmation replaces the form. Leaving the field there invites a
     second submit, which the throttle would then start counting against them. */
  if (state?.done) {
    return (
      <div className="cg-notice" style={{ marginTop: 24 }}>
        <p className="cg-notice__title">Check your email</p>
        <p className="cg-notice__body">{state.done}</p>
        {!mailConfigured ? (
          <p className="cg-notice__body" style={{ marginTop: 8 }}>
            <strong>Development:</strong> no mail provider is configured, so the link
            was written to the server log instead of being sent.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={action} className="cg-form" style={{ marginTop: 24 }}>
      <label className="cg-field">
        <span className="cg-field__label">Email address</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={state?.field === "email" || undefined}
        />
      </label>

      {state?.error ? (
        <p className="cg-form__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton busy="Sending…">Send the link</SubmitButton>
    </form>
  );
}
