"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { signInAction, type FormState } from "@/lib/actions/auth";

const EMPTY: FormState = null;

export function SignInForm({ next }: { next?: string }) {
  const [state, action] = useFormState(signInAction, EMPTY);

  return (
    <>
      {/* Google sign-in needs an OAuth client id and a callback route; the
          column in `users` is there, the flow is not wired yet. */}
      <button type="button" className="cg-auth__oauth" disabled title="Coming soon">
        <GoogleMark />
        Sign in with Google
      </button>

      <p className="cg-auth__or">or</p>

      <form action={action} className="cg-form">
        {next ? <input type="hidden" name="next" value={next} /> : null}

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
          <span className="cg-field__label">
            Password
            <Link href="/forgot-password" className="cg-field__aside">
              Forgot it?
            </Link>
          </span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Your password"
            aria-invalid={state?.field === "password" || undefined}
          />
        </label>

        {state?.error ? (
          <p className="cg-form__error" role="alert">
            {state.error}
          </p>
        ) : null}

        <SubmitButton busy="Signing in…">Sign in</SubmitButton>
      </form>

      <p className="cg-auth__alt">
        No account yet? <Link href="/register">Create one</Link>
      </p>
    </>
  );
}
