import Link from "next/link";
import { SAFE_ZONES } from "@/lib/sample-data";

/**
 * The safety rail, dealt into the masonry rather than parked at the top — it is
 * read where the money decision is actually made. §3.4.
 */
export function SafetyCard() {
  return (
    <aside className="cg-piece cg-safety">
      <p className="cg-eyebrow cg-eyebrow--accent">Never pay in advance</p>
      <p className="cg-safety__lead">
        CraftGali does not process payments and cannot recover money sent outside the app.
      </p>
      <p className="cg-safety__body">
        Meet at one of {SAFE_ZONES.count} Safe Exchange Zones. Pay on handover, once
        you&rsquo;ve seen the piece.
      </p>
      <Link href="/trust" className="cg-safety__link">
        Find a zone near you
      </Link>
    </aside>
  );
}
