import { currentUser } from "@/lib/auth";
import { broker } from "@/lib/messages/broker";
import { messageById, threadFor } from "@/lib/messages";

/* Node, not edge: the broker holds a pg session. Never cached, never static. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 25_000;

/**
 * The live half of a chat: one Server-Sent Events stream per open thread.
 *
 * Nothing here polls. The stream sits idle until Postgres says a row landed
 * in this thread, then pushes that one message. SSE rather than WebSockets
 * because the traffic is one-way — sending is a plain server action — and
 * because a route handler can serve it from the standalone build with no
 * custom server, through Traefik and Cloudflare, with reconnect for free.
 *
 * The heartbeat is a comment line every 25 s. Cloudflare closes a proxied
 * connection that is silent for 100 s; Traefik and browsers are patient but
 * a NAT somewhere is not.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return new Response("Sign in", { status: 401 });

  /* Same gate as the page: a participant, or nothing. */
  const thread = await threadFor(user.id, params.id);
  if (!thread) return new Response("Not found", { status: 404 });

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (line: string) => {
        try {
          controller.enqueue(encoder.encode(line));
        } catch {
          /* closed under us — the cancel() below cleans up */
        }
      };

      send(`retry: 3000\n: connected\n\n`);
      heartbeat = setInterval(() => send(`: ping\n\n`), HEARTBEAT_MS);

      unsubscribe = await broker.subscribe(thread.id, async (event) => {
        /* The notification carries ids only; the body is read back so the
           payload on the wire is exactly the stored row, not a copy. */
        const message = await messageById(thread.id, event.messageId);
        if (!message) return;
        send(`event: message\ndata: ${JSON.stringify(message)}\n\n`);
      });
    },
    cancel() {
      if (heartbeat) clearInterval(heartbeat);
      unsubscribe?.();
    },
  });

  request.signal.addEventListener("abort", () => {
    if (heartbeat) clearInterval(heartbeat);
    unsubscribe?.();
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      /* Tells nginx-style proxies not to buffer; harmless elsewhere. */
      "x-accel-buffering": "no",
    },
  });
}
