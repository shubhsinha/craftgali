"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { resetPasswordAction, type FormState } from "@/lib/actions/auth";

const EMPTY: FormState = null;

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useFormState(resetPasswordAction, EMPTY);

  return (
    <form action={action} className="cg-form" style={{ marginTop: 24 }}>
      <input type="hidden" name="token" value={token} />

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
        <span className="cg-field__hint">
          Length does more for you here than punctuation does.
        </span>
      </label>

      <label className="cg-field">
        <span className="cg-field__label">New password again</span>
        <input
          type="password"
          name="confirm"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Type it once more"
          aria-invalid={state?.field === "confirm" || undefined}
        />
      </label>

      {state?.error ? (
        <p className="cg-form__error" role="alert">
          {state.error}{" "}
          <Link href="/forgot-password" style={{ textDecoration: "underline" }}>
            Send a new link
          </Link>
        </p>
      ) : null}

      <SubmitButton busy="Saving…">Save and sign in</SubmitButton>
    </form>
  );
}
