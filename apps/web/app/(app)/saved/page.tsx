import type { Metadata } from "next";
import Link from "next/link";
import { PieceCard } from "@/components/marketplace/PieceCard";
import { requireUser } from "@/lib/guard";
import { readPlace } from "@/lib/place";
import { savedPieces } from "@/lib/saves";
import { awaitingReview } from "@/lib/reviews";

export const metadata: Metadata = { title: "Saved" };

/**
 * The buyer's own list, plus anything they bought and have not reviewed.
 *
 * The two belong together: this is the page a buyer opens to see the pieces
 * they are still thinking about, which is exactly when they are most likely to
 * remember the one they already took home.
 */
export default async function SavedPage() {
  const user = await requireUser("/saved");
  const place = readPlace();

  const [pieces, pending] = await Promise.all([
    savedPieces(user.id, place.point),
    awaitingReview(user.id),
  ]);

  return (
    <main className="cg-savedpage">
      <header className="cg-savedpage__head">
        <h1 className="cg-shelf__title">Saved</h1>
        <p className="cg-shelf__lede">
          {pieces.length
            ? `${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"} you're thinking about. The artist is told how many people saved a piece, never which people.`
            : "Nothing saved yet. The heart on any piece keeps it here, and the artist is never told who saved what — only how many times a piece has been saved."}
        </p>
      </header>

      {pending.length ? (
        <section className="cg-notice cg-savedpage__review">
          <p className="cg-notice__title">
            {pending.length === 1
              ? "You bought a piece and haven't reviewed it"
              : `${pending.length} pieces you bought are waiting on a review`}
          </p>
          <p className="cg-notice__body">
            A review is the only thing a new buyer has to go on before meeting a
            stranger. It takes a sentence.
          </p>
          <ul className="cg-savedpage__pending">
            {pending.map((row) => (
              <li key={row.id}>
                <Link href={`/listing/${row.id}`}>
                  {row.title} <span className="cg-muted">· {row.shop}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pieces.length ? (
        <div className="cg-savedpage__grid">
          {pieces.map((piece) => (
            <PieceCard key={piece.id} piece={piece} saved savable />
          ))}
        </div>
      ) : (
        <Link href="/discover" className="cg-btn cg-btn--solid">
          Find something to save
        </Link>
      )}
    </main>
  );
}
