import type { Metadata } from "next";
import Link from "next/link";
import { FOUNDING } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Fees",
  description:
    "CraftGali takes 0% commission. Sellers pay for shelf space — the number of pieces live at once — and never for a sale.",
};

const LINES = [
  {
    figure: "0%",
    title: "Commission on every sale",
    body: "The seller keeps 100% of what the buyer pays. We never touch the transaction, which is also why we cannot recover money for you — see Trust & Safety.",
  },
  {
    figure: "₹0",
    title: "Free studio · 5 slots",
    body: "Five pieces live at the same time, both free skins (Electric Indigo and Ruby Crimson) in either light or dark, and the full Verified Maker check. No card, no trial clock.",
  },
  {
    figure: "Pro",
    title: "Unlimited slots · both Pro skins",
    body: "Light Pink and Teal Breeze, unlimited pieces live at once, the photo-quality tools and the insight panel. Billed monthly, cancellable in one click; your storefront drops back to five slots rather than going dark.",
  },
];

export default function FeesPage() {
  return (
    <main className="cg-doc">
      <header className="cg-doc__head">
        <p className="cg-eyebrow cg-eyebrow--accent">Fees</p>
        <h1 className="cg-doc__title">We charge for the shelf space, not the sale</h1>
        <p className="cg-lede cg-doc__lede">
          A slot counts pieces that are live at the same time, not pieces you have ever
          uploaded. Mark one sold and the slot frees immediately.
        </p>
      </header>

      <ol className="cg-doc__rules">
        {LINES.map((line) => (
          <li key={line.title} className="cg-doc__rule">
            <span className="cg-doc__figure">{line.figure}</span>
            <div>
              <h2 className="cg-doc__ruletitle">{line.title}</h2>
              <p className="cg-doc__body">{line.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="cg-notice cg-doc__notice">
        <p className="cg-notice__title">{FOUNDING.tier}</p>
        <p className="cg-notice__body">
          {FOUNDING.remaining.toLocaleString("en-IN")} of{" "}
          {FOUNDING.total.toLocaleString("en-IN")} Tier-1 spots are still open —{" "}
          {FOUNDING.perks}
        </p>
      </div>

      <Link href="/become-seller" className="cg-btn cg-btn--solid">
        Open your studio — free
      </Link>
    </main>
  );
}
