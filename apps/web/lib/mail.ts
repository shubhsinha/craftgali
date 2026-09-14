import "server-only";

/**
 * Outbound mail.
 *
 * There is no transactional provider wired up yet, so the default transport
 * writes the message to the server log. That is enough to develop and test the
 * reset flow end to end, and it fails loudly in production rather than
 * silently dropping mail: `deliver` returns false when nothing real is
 * configured, and the caller decides what to do about it.
 *
 * Set RESEND_API_KEY and MAIL_FROM to send for real. Any provider with an HTTP
 * API can be added the same way — no dependency, one fetch.
 */

export interface Message {
  to: string;
  subject: string;
  text: string;
}

export function mailIsConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

export async function deliver(message: Message): Promise<boolean> {
  if (!mailIsConfigured()) {
    /* Development transport. The link is printed whole so it can be pasted
       straight into the browser. */
    console.info(
      [
        "",
        "──────────── mail (no provider configured) ────────────",
        `To:      ${message.to}`,
        `Subject: ${message.subject}`,
        "",
        message.text,
        "───────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: [message.to],
      subject: message.subject,
      text: message.text,
    }),
  });

  if (!response.ok) {
    /* The body can carry the recipient, so log the status and nothing else. */
    console.error(`mail: provider rejected the message (${response.status})`);
    return false;
  }

  return true;
}

/**
 * The absolute origin to build links against. Reset links are followed from a
 * mail client, so a relative path is no use.
 */
export function siteOrigin() {
  const configured = process.env.SITE_ORIGIN?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
