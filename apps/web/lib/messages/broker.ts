import "server-only";

import { Client } from "pg";
import { directConnectionString } from "../db";

/**
 * One LISTEN connection per process, fanned out in memory.
 *
 * Every open chat is an SSE stream that wants to know when its thread gets a
 * message. The naive version gives each stream its own Postgres session with
 * its own LISTEN — one database connection per open tab, which is how a chat
 * feature takes a database down. This holds a single session, subscribes once
 * to `cg_message`, and dispatches each notification to whichever streams care.
 * A thousand open chats cost one connection.
 *
 * Across replicas nothing more is needed: NOTIFY reaches every session that
 * LISTENs, so each replica's broker hears every message and wakes its own
 * subscribers. Redis pub/sub is the step after this, not a prerequisite.
 */

export interface MessageEvent {
  threadId: string;
  messageId: string;
  senderId: string;
}

type Listener = (event: MessageEvent) => void;

class Broker {
  private client: Client | null = null;
  private connecting: Promise<void> | null = null;
  private subs = new Map<string, Set<Listener>>();
  private backoffMs = 1000;

  async subscribe(threadId: string, listener: Listener): Promise<() => void> {
    await this.ensureConnected();

    let set = this.subs.get(threadId);
    if (!set) this.subs.set(threadId, (set = new Set()));
    set.add(listener);

    return () => {
      set!.delete(listener);
      if (set!.size === 0) this.subs.delete(threadId);
    };
  }

  private ensureConnected() {
    if (this.client) return Promise.resolve();
    if (this.connecting) return this.connecting;

    this.connecting = (async () => {
      const client = new Client({ connectionString: directConnectionString() });
      await client.connect();
      await client.query("listen cg_message");

      client.on("notification", (note) => {
        if (note.channel !== "cg_message" || !note.payload) return;
        let raw: { t: string; m: string; s: string };
        try {
          raw = JSON.parse(note.payload);
        } catch {
          return;
        }
        const event: MessageEvent = { threadId: raw.t, messageId: raw.m, senderId: raw.s };
        for (const listener of this.subs.get(event.threadId) ?? []) listener(event);
      });

      /* A dropped session must not become a silent chat. Reconnect with
         backoff; subscribers stay registered and simply start hearing again. */
      const onGone = () => {
        this.client = null;
        this.connecting = null;
        const wait = this.backoffMs;
        this.backoffMs = Math.min(this.backoffMs * 2, 30_000);
        setTimeout(() => {
          if (this.subs.size) this.ensureConnected().catch(() => {});
        }, wait);
      };
      client.on("error", onGone);
      client.on("end", onGone);

      this.client = client;
      this.backoffMs = 1000;
    })().finally(() => {
      this.connecting = null;
    });

    return this.connecting;
  }
}

/* Parked on globalThis so the dev server's hot reloads reuse one session
   instead of leaking a LISTEN connection per edit. */
const g = globalThis as unknown as { cgBroker?: Broker };
export const broker = g.cgBroker ?? (g.cgBroker = new Broker());
