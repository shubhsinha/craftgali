"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { registerAction, type FormState } from "@/lib/actions/auth";

const EMPTY: FormState = null;

export function RegisterForm({ next }: { next?: string }) {
  const [state, action] = useFormState(registerAction, EMPTY);

  return (
    <>
      <button type="button" className="cg-auth__oauth" disabled title="Coming soon">
        <GoogleMark />
        Continue with Google
      </button>

      <p className="cg-auth__or">or</p>

      <form action={action} className="cg-form">
        {next ? <input type="hidden" name="next" value={next} /> : null}

        <label className="cg-field">
          <span className="cg-field__label">Your name</span>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            required
            placeholder="Anaya Deshpande"
            aria-invalid={state?.field === "fullName" || undefined}
          />
        </label>

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

        <label className="cg-field">
          <span className="cg-field__label">Password</span>
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
          <span className="cg-field__label">
            City <span className="cg-field__hint">optional — it sets your feed</span>
          </span>
          <input type="text" name="city" autoComplete="address-level2" placeholder="Mumbai" />
        </label>

        {state?.error ? (
          <p className="cg-form__error" role="alert">
            {state.error}
          </p>
        ) : null}

        <SubmitButton busy="Creating your account…">Create account</SubmitButton>
      </form>

      <p className="cg-auth__alt">
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </>
  );
}
