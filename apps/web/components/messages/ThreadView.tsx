"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendMessageAction } from "@/lib/actions/messages";
import type { Message, ThreadView as Thread } from "@/lib/messages";

/**
 * The conversation.
 *
 * Messages arrive over a Server-Sent Events stream and nothing here asks the
 * server "anything new?" — the tab sits idle until Postgres says a row landed
 * in this thread. Sending is a server action; the sender's own message comes
 * back over the same stream as everyone else's, and is reconciled by id
 * against the optimistic copy so it never shows twice.
 */
export function ThreadView({
  thread,
  initial,
  offer = false,
}: {
  thread: Thread;
  initial: Message[];
  offer?: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [draft, setDraft] = useState(offer ? "I'd like to make an offer of ₹" : "");
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState<"connecting" | "live" | "reconnecting">("connecting");
  const [pending, start] = useTransition();
  const bottom = useRef<HTMLDivElement>(null);

  /* Append if unseen. The optimistic copy carries a temporary id; when the real
     row arrives with a matching body from us, it replaces it. */
  function absorb(incoming: Message) {
    setMessages((current) => {
      if (current.some((m) => m.id === incoming.id)) return current;
      const optimisticIndex = current.findIndex(
        (m) => m.id.startsWith("tmp-") && m.senderId === incoming.senderId && m.body === incoming.body,
      );
      if (optimisticIndex >= 0) {
        const next = current.slice();
        next[optimisticIndex] = incoming;
        return next;
      }
      return [...current, incoming];
    });
  }

  useEffect(() => {
    const source = new EventSource(`/api/messages/${thread.id}/stream`);
    source.onopen = () => setLive("live");
    source.onerror = () => setLive("reconnecting"); /* EventSource retries itself */
    source.addEventListener("message", (e) => absorb(JSON.parse((e as MessageEvent).data)));
    return () => source.close();
  }, [thread.id]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function send() {
    const body = draft.trim();
    if (!body || pending) return;

    const tmp: Message = {
      id: `tmp-${Date.now()}`,
      body,
      senderId: thread.viewerId,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, tmp]);
    setDraft("");
    setError(null);

    start(async () => {
      const result = await sendMessageAction(thread.id, body);
      if (result?.error) {
        setMessages((m) => m.filter((x) => x.id !== tmp.id));
        setDraft(body);
        setError(result.error);
      }
    });
  }

  return (
    <div className="cg-chat__body">
      <div className="cg-notice cg-chat__notice">
        <p className="cg-notice__title">Never pay in advance.</p>
        <p className="cg-notice__body">
          Agree a price here, meet at a Safe Exchange Zone, and pay on handover once
          you have seen the piece. CraftGali cannot recover money sent outside the app.
        </p>
      </div>

      <ol className="cg-chat__log" aria-live="polite">
        {messages.map((m) => {
          const mine = m.senderId === thread.viewerId;
          const risky = looksLikeAdvancePayment(m.body);
          return (
            <li key={m.id} className={`cg-msg ${mine ? "cg-msg--mine" : ""} ${m.id.startsWith("tmp-") ? "cg-msg--sending" : ""}`}>
              <p className="cg-msg__body">{m.body}</p>
              {risky ? (
                <p className="cg-msg__flag" role="note">
                  This mentions paying before the handover. Don&rsquo;t — pay when you have the piece in your hands.
                </p>
              ) : null}
              <time className="cg-msg__time" dateTime={m.createdAt}>
                {new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
              </time>
            </li>
          );
        })}
        <div ref={bottom} />
      </ol>

      <form
        className="cg-chat__composer"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <label className="cg-sr" htmlFor="cg-chat-draft">Message</label>
        <textarea
          id="cg-chat-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={2}
          maxLength={2000}
          placeholder={`Message ${thread.withName}…`}
        />
        <button type="submit" className="cg-btn cg-btn--solid" disabled={pending || !draft.trim()}>
          Send
        </button>
      </form>

      <p className={`cg-chat__status cg-chat__status--${live}`}>
        {live === "live" ? "Live" : live === "connecting" ? "Connecting…" : "Reconnecting…"}
      </p>
      {error ? <p className="cg-form__error" role="alert">{error}</p> : null}
    </div>
  );
}

/* Mirrors lib/messages.ts; kept inline so the client bundle has no server import. */
function looksLikeAdvancePayment(body: string) {
  return /\b(upi|paytm|gpay|phonepe|advance|deposit|token amount|transfer (?:the )?money|send (?:the )?money|pay (?:me )?(?:first|now|online))\b/i.test(body);
}
