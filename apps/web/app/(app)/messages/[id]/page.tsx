import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThreadView } from "@/components/messages/ThreadView";
import { requireUser } from "@/lib/guard";
import { markRead, messagesIn, threadFor } from "@/lib/messages";

export const metadata: Metadata = { title: "Conversation" };
export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { offer?: string };
}) {
  const user = await requireUser(`/messages/${params.id}`);

  const thread = await threadFor(user.id, params.id);
  if (!thread) notFound();

  /* Opening the thread is reading it. */
  await markRead(user.id, thread.id);
  const messages = await messagesIn(thread.id);

  return (
    <main className="cg-chat">
      <header className="cg-chat__head">
        <Link href="/messages" className="cg-chat__back">← Messages</Link>
        <div>
          <h1 className="cg-chat__who">
            {thread.withHandle ? (
              <Link href={`/artist/${thread.withHandle}`}>{thread.withName}</Link>
            ) : (
              thread.withName
            )}
          </h1>
          {thread.subject ? (
            <p className="cg-chat__subject">
              about{" "}
              {thread.listingId ? (
                <Link href={`/listing/${thread.listingId}`}>{thread.subject}</Link>
              ) : (
                thread.subject
              )}
            </p>
          ) : null}
        </div>
      </header>

      <ThreadView
        thread={thread}
        initial={messages}
        offer={Boolean(searchParams.offer)}
      />
    </main>
  );
}
