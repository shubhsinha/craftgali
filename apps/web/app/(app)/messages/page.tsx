import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/guard";

export const metadata: Metadata = { title: "Messages" };

/**
 * Chat is where a price is agreed and a handover arranged, so it is the one
 * surface that must never move off the platform. The threads table isn't built
 * yet; this states the rule the feature will be built around.
 */
export default async function MessagesPage() {
  const user = await requireUser("/messages");

  return (
    <main className="cg-plain">
      <h1 className="cg-plain__title">Messages</h1>
      <p className="cg-plain__lede">
        No conversations yet, {user.fullName.split(" ")[0]}. Message an artist from any
        piece and the thread lands here.
      </p>

      <div className="cg-notice" style={{ maxWidth: "54ch", marginBottom: 28 }}>
        <p className="cg-notice__title">Keep it in the app</p>
        <p className="cg-notice__body">
          Agree the price here, then meet. A conversation that moves to another number
          straight away is the shape most scams take.
        </p>
      </div>

      <Link href="/discover" className="cg-btn cg-btn--solid">
        Find an artist
      </Link>
    </main>
  );
}
