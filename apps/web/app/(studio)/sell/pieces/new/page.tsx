import type { Metadata } from "next";
import Link from "next/link";
import { NewPieceForm } from "./NewPieceForm";
import { FREE_SLOTS } from "@/lib/plans";
import { requireSeller } from "@/lib/guard";
import { liveCount } from "@/lib/listings";

export const metadata: Metadata = { title: "List a piece" };

export default async function Page() {
  const user = await requireSeller("/sell/pieces/new");
  const live = await liveCount(user.handle);
  const left = Math.max(0, FREE_SLOTS - live);

  return (
    <main className="cg-compose">
      <header className="cg-compose__head">
        <div>
          <p className="cg-eyebrow cg-eyebrow--accent">List a piece</p>
          <h1 className="cg-compose__title">Put something on your shelf</h1>
          <p className="cg-compose__lede">
            The photograph does most of the work. Everything else is what a buyer asks
            in the first message anyway — answer it here and they message you ready to
            meet.
          </p>
        </div>
        <Link href="/sell/pieces" className="cg-btn cg-btn--outline">
          Back to your pieces
        </Link>
      </header>

      {left === 0 ? (
        <div className="cg-notice cg-compose__full">
          <p className="cg-notice__title">All {FREE_SLOTS} free slots are full</p>
          <p className="cg-notice__body">
            Slots count pieces that are live at the same time, not pieces you have ever
            uploaded. Mark one sold and a slot frees immediately — or go Pro for
            unlimited.
          </p>
        </div>
      ) : (
        <NewPieceForm slotsLeft={left} />
      )}
    </main>
  );
}
