import type { Metadata } from "next";
import Link from "next/link";
import { SAFE_ZONES } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Trust & Safety",
  description:
    "CraftGali never touches the money. How Safe Exchange Zones, the Verified Maker check and the no-advance-payment rule protect a handover.",
};

const RULES = [
  {
    figure: "01",
    title: "Never pay in advance",
    body: "CraftGali does not process payments and cannot recover money sent outside the app. Anyone who asks for a deposit, a UPI transfer to “hold” a piece, or payment before you have seen the work is not following the rules. Report them and walk away.",
  },
  {
    figure: "02",
    title: "Pay on handover",
    body: "Money changes hands when the piece does, in person, once you have looked at it. That is the whole model. Because we take no commission, we have no reason to sit between you and the artist.",
  },
  {
    figure: "03",
    title: "Meet in a Safe Exchange Zone",
    body: `${SAFE_ZONES.count} vetted public handover points across ${SAFE_ZONES.cities} cities — mall atriums, cafés and gallery lobbies with staff and cameras. A listing never stores an exact address; buyers see a neighbourhood and a city, nothing more.`,
  },
  {
    figure: "04",
    title: "Check the Verified Maker badge",
    body: "A verified studio has filmed twenty unedited seconds of itself: the artist, two of their listed pieces, and a handwritten slip carrying their handle and that day's date. It is close to impossible to fake with stolen photographs, which is exactly what it is for.",
  },
];

export default function TrustPage() {
  return (
    <main className="cg-doc">
      <header className="cg-doc__head">
        <p className="cg-eyebrow cg-eyebrow--accent">Trust &amp; Safety</p>
        <h1 className="cg-doc__title">
          We never touch the money, so we cannot get it back for you
        </h1>
        <p className="cg-lede cg-doc__lede">
          CraftGali is a place to find an artist near you and agree a handover. The four
          rules below are the whole of our safety model, and the first one matters most.
        </p>
      </header>

      <ol className="cg-doc__rules">
        {RULES.map((rule) => (
          <li key={rule.figure} className="cg-doc__rule">
            <span className="cg-doc__figure">{rule.figure}</span>
            <div>
              <h2 className="cg-doc__ruletitle">{rule.title}</h2>
              <p className="cg-doc__body">{rule.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="cg-notice cg-doc__notice">
        <p className="cg-notice__title">Something feels wrong?</p>
        <p className="cg-notice__body">
          Every listing and every studio carries a Report link. Reports are read by a
          person, not a filter, and a studio can be suspended while one is open.
        </p>
      </div>

      <Link href="/discover" className="cg-btn cg-btn--outline">
        Back to Discover
      </Link>
    </main>
  );
}
