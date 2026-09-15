import "server-only";

import { query, queryOne } from "./db";

/**
 * Threads and messages.
 *
 * A thread has exactly two people in it: the buyer who opened it and the owner
 * of the shop it was opened against. Every read here is scoped to one of those
 * two, so a thread id in a URL is never enough on its own.
 */

export interface ThreadSummary {
  id: string;
  subject: string | null;
  /** The other person, as this viewer sees them. */
  withName: string;
  withHandle: string | null;
  /** Which side of the counter the viewer is on. */
  role: "buyer" | "seller";
  lastBody: string | null;
  lastAt: string;
  unread: number;
}

export interface Message {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
}

export interface ThreadView {
  id: string;
  subject: string | null;
  listingId: string | null;
  role: "buyer" | "seller";
  withName: string;
  withHandle: string | null;
  viewerId: string;
}

/** Everything this person is part of, newest activity first. */
export async function inbox(userId: string): Promise<ThreadSummary[]> {
  return query<ThreadSummary>(
    `select t.id,
            t.subject,
            case when t.buyer_id = $1 then s.name else u.full_name end as "withName",
            case when t.buyer_id = $1 then s.handle else null end      as "withHandle",
            case when t.buyer_id = $1 then 'buyer' else 'seller' end   as role,
            (select body from messages m where m.thread_id = t.id
              order by m.created_at desc limit 1) as "lastBody",
            t.last_message_at as "lastAt",
            (select count(*) from messages m
              where m.thread_id = t.id and m.sender_id <> $1 and m.read_at is null)::int as unread
       from threads t
       join storefronts s on s.id = t.storefront_id
       join users u on u.id = t.buyer_id
      where t.buyer_id = $1 or s.owner_id = $1
      order by t.last_message_at desc
      limit 100`,
    [userId],
  );
}

/** For the badge. One query, indexed on the unread partial. */
export async function unreadCount(userId: string) {
  const row = await queryOne<{ n: string }>(
    `select count(*) as n
       from messages m
       join threads t on t.id = m.thread_id
       join storefronts s on s.id = t.storefront_id
      where m.read_at is null and m.sender_id <> $1
        and (t.buyer_id = $1 or s.owner_id = $1)`,
    [userId],
  );
  return Number(row?.n ?? 0);
}

/** The thread, if and only if this person is one of its two participants. */
export async function threadFor(userId: string, threadId: string): Promise<ThreadView | null> {
  if (!/^[0-9a-f-]{36}$/i.test(threadId)) return null;
  const row = await queryOne<ThreadView>(
    `select t.id,
            t.subject,
            t.listing_id as "listingId",
            case when t.buyer_id = $1 then 'buyer' else 'seller' end as role,
            case when t.buyer_id = $1 then s.name else u.full_name end as "withName",
            case when t.buyer_id = $1 then s.handle else null end      as "withHandle",
            $1::text as "viewerId"
       from threads t
       join storefronts s on s.id = t.storefront_id
       join users u on u.id = t.buyer_id
      where t.id = $2 and (t.buyer_id = $1 or s.owner_id = $1)`,
    [userId, threadId],
  );
  return row;
}

export async function messagesIn(threadId: string, limit = 200): Promise<Message[]> {
  return query<Message>(
    `select id, body, sender_id as "senderId", created_at as "createdAt"
       from messages where thread_id = $1
      order by created_at asc limit $2`,
    [threadId, limit],
  );
}

export async function messageById(threadId: string, messageId: string): Promise<Message | null> {
  return queryOne<Message>(
    `select id, body, sender_id as "senderId", created_at as "createdAt"
       from messages where thread_id = $1 and id = $2`,
    [threadId, messageId],
  );
}

/** Everything the other person sent, now read. Idempotent. */
export async function markRead(userId: string, threadId: string) {
  await query(
    `update messages set read_at = now()
      where thread_id = $1 and sender_id <> $2 and read_at is null`,
    [threadId, userId],
  );
}

/**
 * Finds the buyer's thread with a shop about a piece, creating it if new.
 *
 * `listingId` is null for a general enquiry or a seeded comp piece; `subject`
 * carries the title either way so the inbox can say what it is about.
 */
export async function findOrCreateThread(input: {
  buyerId: string;
  handle: string;
  listingId: string | null;
  subject: string | null;
}): Promise<{ id: string } | { error: string }> {
  const shop = await queryOne<{ id: string; ownerId: string }>(
    `select id, owner_id as "ownerId" from storefronts where handle = $1 and status = 'active'`,
    [input.handle],
  );
  if (!shop) return { error: "That shop doesn't exist." };
  if (shop.ownerId === input.buyerId) return { error: "That's your own shop." };

  const row = await queryOne<{ id: string }>(
    `insert into threads (storefront_id, buyer_id, listing_id, subject)
     values ($1, $2, $3, $4)
     on conflict (storefront_id, buyer_id, listing_id) do update
        set subject = coalesce(threads.subject, excluded.subject)
     returning id`,
    [shop.id, input.buyerId, input.listingId, input.subject],
  );
  return row ? { id: row.id } : { error: "Could not open the conversation." };
}

/** True when a message reads like a request to pay before the handover. */
export function looksLikeAdvancePayment(body: string) {
  return /\b(upi|paytm|gpay|phonepe|advance|deposit|token amount|transfer (?:the )?money|send (?:the )?money|pay (?:me )?(?:first|now|online))\b/i.test(body);
}
