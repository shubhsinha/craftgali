"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  { key: "signin", label: "Sign in" },
  { key: "account", label: "Create account" },
  { key: "storefront", label: "Storefront setup" },
  { key: "fee", label: "Registration fee" },
  { key: "live", label: "Storefront live" },
];

const CATEGORIES = ["Art & Paintings", "Handmade Decor", "Pre-Loved Items"];

export default function BecomeSellerPage() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(["Art & Paintings"]);

  function toggleCategory(category: string) {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  function goTo(index: number) {
    setStep(index);
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  return (
    <div className="auth-page">
      <div className="auth-stepper-wrap">
        <div className="auth-stepper">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={s.label}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <p className="auth-stepper-label">{STEPS[step].label}</p>
      </div>

      <div className="auth-frame-outer">
        <div className="auth-frame">
          {step === 0 && (
            <div className="auth-screen active" key="s0">
              <div className="icon-badge">📱</div>
              <p className="screen-title">Verify your number</p>
              <p className="screen-sub">
                We&apos;ll text a 4-digit code — no password to remember.
              </p>
              <label className="field-label">Phone number</label>
              <input
                className="field"
                type="text"
                defaultValue="+91 98765 43210"
                readOnly
              />
              <label className="field-label">Enter OTP</label>
              <div className="otp-row">
                {["4", "8", "2", "1", "", ""].map((digit, i) => (
                  <div key={i} className={`otp-box ${digit ? "filled" : ""}`}>
                    {digit || "\u00a0"}
                  </div>
                ))}
              </div>
              <button className="auth-btn" onClick={next}>
                Verify &amp; continue
              </button>
              <p className="helper">
                Same flow whether you&apos;re new or returning — sellers and
                buyers log in exactly the same way.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="auth-screen active" key="s1">
              <div className="icon-badge">👤</div>
              <p className="screen-title">Tell us about you</p>
              <p className="screen-sub">
                This is the entire signup — new numbers land here once.
              </p>
              <label className="field-label">Your name</label>
              <input className="field" type="text" placeholder="e.g. Ananya Rao" />
              <label className="field-label">City / pincode</label>
              <input
                className="field"
                type="text"
                placeholder="e.g. Bandra West, 400050"
              />
              <button className="auth-btn" onClick={next}>
                Create account
              </button>
              <p className="helper">
                No seller fields, no category, no fee. Everyone becomes a full
                buyer with just this.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="auth-screen active" key="s2">
              <div className="icon-badge">🎨</div>
              <p className="screen-title">Set up your storefront</p>
              <p className="screen-sub">Takes about 3 minutes.</p>
              <label className="field-label">Storefront name</label>
              <input
                className="field"
                type="text"
                placeholder="e.g. Meera Sculpts"
              />
              <label className="field-label">What do you make?</label>
              <div className="chip-row">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className={`chip ${selected.includes(category) ? "sel" : ""}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="field-label">Pickup neighborhood</label>
              <input
                className="field"
                type="text"
                placeholder="e.g. Bandra West (not your exact address)"
              />
              <div className="note-box">
                <strong>Private by default.</strong> Buyers only ever see your
                neighborhood or a suggested safe exchange spot — never your exact
                address.
              </div>
              <button className="auth-btn" onClick={next}>
                Continue to registration fee
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="auth-screen active" key="s3">
              <div className="icon-badge">🧾</div>
              <p className="screen-title">One-time registration</p>
              <p className="screen-sub">Pay once, list forever.</p>
              <div className="fee-card">
                <div className="fee-row">
                  <span>Seller registration</span>
                  <span>₹149</span>
                </div>
                <div className="fee-row">
                  <span>Unlimited listings, lifetime</span>
                  <span>Included</span>
                </div>
                <div className="fee-row total">
                  <span>Total</span>
                  <span>₹149</span>
                </div>
              </div>
              <label className="field-label">Pay via UPI</label>
              <input className="field" type="text" placeholder="yourname@upi" />
              <button className="auth-btn" onClick={next}>
                Pay &amp; activate storefront
              </button>
              <p className="helper">
                Same escrow-linked payment gateway buyers already use at
                checkout — no separate billing system.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="auth-screen active" key="s4">
              <div className="confirm-icon">✓</div>
              <p className="confirm-title">Your storefront is live</p>
              <p className="confirm-sub">
                Meera Sculpts can now list unlimited items, fixed price or
                auction.
              </p>
              <div className="portfolio-link">craftgali.com/meera-sculpts</div>
              <Link href="/" className="auth-btn">
                Go to your storefront
              </Link>
              <p className="helper">
                Same account, same login. Nothing about your buyer experience
                changed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
