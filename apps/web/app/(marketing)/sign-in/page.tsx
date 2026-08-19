"use client";

import Link from "next/link";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-frame-outer wide">
        <div className="auth-frame auth-card">
          <div className="auth-screen active">
            <div className="icon-badge">🔑</div>
            <p className="screen-title">Welcome back</p>
            <p className="screen-sub">
              Sign in to keep up with your orders, saved pieces and local
              sellers.
            </p>

            <button type="button" className="google-btn">
              <GoogleIcon />
              Sign in with Google
            </button>

            <div className="divider">or</div>

            <form onSubmit={(e) => e.preventDefault()}>
              <label className="field-label" htmlFor="signin-email">
                Email address
              </label>
              <input
                id="signin-email"
                className="field"
                type="email"
                placeholder="you@example.com"
              />

              <label className="field-label" htmlFor="signin-password">
                Password
              </label>
              <input
                id="signin-password"
                className="field"
                type="password"
                placeholder="Your password"
              />

              <button type="submit" className="auth-btn">
                Sign in
              </button>
            </form>

            <p className="helper">
              <a href="#" className="auth-link">
                Forgot password?
              </a>
            </p>
          </div>
        </div>

        <div className="auth-frame auth-card">
          <div className="auth-screen active">
            <div className="icon-badge">🛍️</div>
            <p className="screen-title">New to CraftGali?</p>
            <p className="screen-sub">
              Create a free buyer account and start discovering handmade art,
              decor and pre-loved finds nearby.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <label className="field-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="field"
                type="text"
                placeholder="e.g. Ananya Rao"
              />

              <label className="field-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                className="field"
                type="email"
                placeholder="you@example.com"
              />

              <label className="field-label" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                className="field"
                type="tel"
                placeholder="+91 98765 43210"
              />

              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="field"
                type="password"
                placeholder="Create a password"
              />

              <label className="field-label" htmlFor="city">
                City / pincode
              </label>
              <input
                id="city"
                className="field"
                type="text"
                placeholder="e.g. Bandra West, 400050"
              />

              <label className="field-label" htmlFor="address">
                Delivery address (optional)
              </label>
              <input
                id="address"
                className="field"
                type="text"
                placeholder="Where we should deliver or meet"
              />

              <button type="submit" className="auth-btn">
                Create account
              </button>
            </form>

            <p className="helper">
              By creating an account you agree to our terms. Sellers and buyers
              use the same login.
            </p>
          </div>
        </div>

        <p className="text-link">
          <Link href="/become-seller">Looking to sell? Set up your storefront</Link>
        </p>
      </div>
    </div>
  );
}
