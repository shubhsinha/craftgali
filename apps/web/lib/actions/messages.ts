"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { threadFor, markRead } from "@/lib/messages";
import { hit, LIMITS, retryMessage } from "@/lib/ratelimit";

export type SendState = { error?: string; id?: string } | null;

/**
 * Sends a message. The trigger on `messages` does the rest — bumps the thread
 * and notifies every listening replica — so this returns the moment the row
 * is in, and the sender's own stream will echo it back like anyone else's.
 */
export async function sendMessageAction(threadId: string, body: string): Promise<SendState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in to send a message." };

  const text = body.trim();
  if (!text) return { error: "Say something first." };
  if (text.length > 2000) return { error: "Keep it under 2,000 characters." };

  const throttle = await hit(`msg:user:${user.id}`, LIMITS.sendMessage);
  if (throttle.limited) return { error: retryMessage(LIMITS.sendMessage) };

  /* The participant check is the join in threadFor; a thread id in a form
     field is not authority to write into it. */
  const thread = await threadFor(user.id, threadId);
  if (!thread) return { error: "That conversation isn't yours." };

  const [row] = await query<{ id: string }>(
    "insert into messages (thread_id, sender_id, body) values ($1, $2, $3) returning id",
    [threadId, user.id, text],
  );

  revalidatePath("/messages");
  return { id: row.id };
}

export async function markReadAction(threadId: string) {
  const user = await currentUser();
  if (!user) return;
  const thread = await threadFor(user.id, threadId);
  if (!thread) return;
  await markRead(user.id, threadId);
  revalidatePath("/messages");
}
