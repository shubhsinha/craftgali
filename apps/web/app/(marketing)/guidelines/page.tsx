import type { Metadata } from "next";
import Link from "next/link";
import { SAFE_ZONES } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Guidelines",
  description:
    "What may be listed on CraftGali, what may not, and what both sides of a handover are expected to do.",
};

const SECTIONS = [
  {
    heading: "What belongs here",
    rules: [
      "Work made by hand, by you or by your studio. A piece you threw, painted, printed, cast, carved, knotted or fired.",
      "Pre-loved handmade work you own outright and can describe honestly, including its wear.",
      "Materials and dimensions stated as they actually are. “90×60 cm” means the piece, not the frame.",
    ],
  },
  {
    heading: "What does not",
    rules: [
      "Mass-produced or drop-shipped goods, however they are photographed.",
      "Work made by someone else and listed as your own. Reselling another maker's current work needs their name on the listing.",
      "Photographs you did not take of pieces you do not have. The Verified Maker check exists precisely because this is the common fraud.",
      "Anything whose sale is restricted by law — protected wildlife materials, antiquities, weapons.",
    ],
  },
  {
    heading: "Declare AI assistance",
    rules: [
      "If a generative tool produced the image, the design, or a substantial part of the composition, mark the listing AI-assisted.",
      "Buyers can filter AI-assisted work out of their feed. Hiding it is the one thing that will get a storefront suspended on a first offence.",
    ],
  },
  {
    heading: "How a handover works",
    rules: [
      `Agree the price in chat, then meet. ${SAFE_ZONES.count} Safe Exchange Zones across ${SAFE_ZONES.cities} cities exist for exactly this.`,
      "Money moves when the piece does. CraftGali processes no payments and takes no commission, so nobody here can reverse a transfer for you.",
      "Never publish an exact home or studio address on a listing. Neighbourhood and city only.",
      "Turn up, or say you cannot. Reply time is shown on every piece you list and it feeds where you rank.",
    ],
  },
  {
    heading: "Talking to each other",
    rules: [
      "Negotiate in the app. A conversation that moves to another number immediately is the shape most scams take.",
      "No harassment, no pressure about a seller's caste, religion, gender or language, and no contacting someone who has ended a conversation.",
      "Reviews describe the piece and the handover. They are not a place to publish someone's personal details.",
    ],
  },
];

export default function GuidelinesPage() {
  return (
    <main className="cg-doc">
      <header className="cg-doc__head">
        <p className="cg-eyebrow cg-eyebrow--accent">Guidelines</p>
        <h1 className="cg-doc__title">Made by hand, described honestly, handed over in person</h1>
        <p className="cg-lede cg-doc__lede">
          CraftGali is small enough that these fit on one page. Reports are read by a
          person, and a storefront can be suspended while one is open.
        </p>
      </header>

      <div className="cg-doc__sections">
        {SECTIONS.map((section) => (
          <section key={section.heading} className="cg-doc__section">
            <h2 className="cg-doc__heading">{section.heading}</h2>
            <ul className="cg-doc__list">
              {section.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="cg-notice cg-doc__notice">
        <p className="cg-notice__title">Reporting something</p>
        <p className="cg-notice__body">
          Every listing and studio carries a Report link. If you believe a listing breaks
          the law rather than these guidelines, raise it with the{" "}
          <Link href="/grievance">Grievance Officer</Link>, who must respond within the
          statutory window.
        </p>
      </div>

      <Link href="/trust" className="cg-btn cg-btn--outline">
        How a safe handover works
      </Link>
    </main>
  );
}
