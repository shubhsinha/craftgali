import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/guard";
import { queryOne } from "@/lib/db";
import { findOrCreateThread, inbox } from "@/lib/messages";
import { pieceById } from "@/lib/sample-data";
import { hit, LIMITS } from "@/lib/ratelimit";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

/**
 * The inbox — and the front door.
 *
 * Every "Message Anaya" and "Make an offer" link on the site lands here with
 * `?to=` or `?about=`. Those resolve to a thread (created if new) and redirect
 * into it, so the buttons that used to point at a stub now open a conversation.
 */
export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { to?: string; about?: string; offer?: string };
}) {
  const user = await requireUser("/messages");

  const target = await resolveTarget(searchParams);
  if (target) {
    const throttle = await hit(`thread:user:${user.id}`, LIMITS.startThread);
    if (!throttle.limited) {
      const result = await findOrCreateThread({ buyerId: user.id, ...target });
      if ("id" in result) redirect(`/messages/${result.id}${searchParams.offer ? "?offer=1" : ""}`);
    }
  }

  const threads = await inbox(user.id);

  return (
    <main className="cg-inbox">
      <header className="cg-inbox__head">
        <h1 className="cg-shelf__title">Messages</h1>
        <p className="cg-shelf__lede">
          Agree the price here, then meet. A conversation that moves to another number
          straight away is the shape most scams take.
        </p>
      </header>

      {threads.length ? (
        <ul className="cg-inbox__list">
          {threads.map((t) => (
            <li key={t.id}>
              <Link href={`/messages/${t.id}`} className={`cg-thread ${t.unread ? "cg-thread--unread" : ""}`}>
                <span className="cg-thread__who">
                  {t.withName}
                  {t.role === "seller" ? <span className="cg-thread__role">buyer</span> : null}
                </span>
                {t.subject ? <span className="cg-thread__subject">about {t.subject}</span> : null}
                <span className="cg-thread__last">{t.lastBody ?? "No messages yet"}</span>
                {t.unread ? <span className="cg-thread__badge">{t.unread}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="cg-inbox__empty">
          <p>No conversations yet. Message an artist from any piece and the thread lands here.</p>
          <Link href="/discover" className="cg-btn cg-btn--solid">Find an artist</Link>
        </div>
      )}
    </main>
  );
}

/** `?to=handle`, or `?about=listing` / `?offer=listing` → the shop and subject. */
async function resolveTarget(p: { to?: string; about?: string; offer?: string }) {
  const id = p.about ?? p.offer;

  if (id) {
    if (/^[0-9a-f-]{36}$/i.test(id)) {
      const row = await queryOne<{ handle: string; title: string }>(
        `select s.handle, l.title from listings l join storefronts s on s.id = l.storefront_id where l.id = $1`,
        [id],
      );
      if (row) return { handle: row.handle, listingId: id, subject: row.title };
    }
    const comp = pieceById(id);
    if (comp) return { handle: comp.studio.handle, listingId: null, subject: comp.title };
  }

  if (p.to && /^[a-z0-9-]{3,30}$/.test(p.to)) return { handle: p.to, listingId: null, subject: null };
  return null;
}
