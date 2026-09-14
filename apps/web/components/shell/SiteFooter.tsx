import Link from "next/link";
import { ChakraWatermark } from "@/components/brand/Heritage";
import { Logotype } from "@/components/brand/Wordmark";

const PROMISES = [
  {
    figure: "0%",
    label: "Commission on the sale",
    body: "The seller keeps 100% of what the buyer pays. CraftGali never touches the transaction — we charge for the shelf space, not the sale.",
  },
  {
    figure: "20s",
    label: "Verified Maker check",
    body: "A short unedited studio clip — the artist, two of their listed pieces, and a handwritten slip with their handle and the date. Nearly impossible to fake with stolen photos.",
  },
  {
    figure: "142",
    label: "Safe Exchange Zones",
    body: "Vetted public handover points across 11 cities. Exact addresses are never stored on a listing — neighbourhood and city only.",
  },
];

const LINKS = [
  { href: "/fees", label: "Fees" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/trust", label: "Trust & Safety" },
  { href: "/grievance", label: "Grievance Officer" },
];

export function SiteFooter() {
  return (
    <footer className="cg-footer">
      <ChakraWatermark />
      <div className="cg-wrap">
        <div className="cg-footer__stats">
          {PROMISES.map((promise) => (
            <div key={promise.label}>
              <div className="cg-stat__figure">{promise.figure}</div>
              <div className="cg-stat__label">{promise.label}</div>
              <p className="cg-stat__body">{promise.body}</p>
            </div>
          ))}
        </div>

        <div className="cg-footer__base">
          <Logotype size="md" tone="paper" />
          <span className="cg-footer__tag">Crafted Locally, Cherished Globally</span>
          <nav className="cg-footer__links" aria-label="Footer">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
