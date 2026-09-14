import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * The outer half of route protection.
 *
 * Middleware runs on the edge runtime, where `pg` cannot, so it cannot ask the
 * database whether a session is still good — it only checks that a signed,
 * unexpired token is present. The page-level `requireUser` / `requireSeller`
 * guards remain the authority: they re-read the user row and compare the
 * session version, which is what catches a revoked or deleted account.
 *
 * The point of having both is that this one fails closed. A new private page
 * under a protected prefix is guarded the moment it exists, rather than from
 * whenever someone remembers to add a guard to it.
 */

/* Everything under these is private. Browsing — the feed, a listing, a
   storefront — is deliberately open, so those prefixes are absent. */
const PRIVATE = ["/settings", "/messages", "/saved", "/sell", "/studio"];

/*
 * Middleware deliberately does NOT send signed-in visitors away from /sign-in.
 *
 * It cannot tell a live session from a revoked one — that needs the database —
 * so acting on "looks signed in" here locks people out: a revoked token still
 * verifies, the page guard bounces them to /sign-in, and middleware would bounce
 * them straight back off it, leaving no way to sign in again short of clearing
 * cookies by hand. The sign-in, register and forgot-password pages already turn
 * away genuinely signed-in visitors, using an answer that is actually true.
 */

function isUnder(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function hasValidToken(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false; /* expired, tampered with, or signed by an old secret */
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isUnder(pathname, PRIVATE)) return NextResponse.next();
  if (await hasValidToken(request)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/sign-in";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;

  const response = NextResponse.redirect(url);
  /* The cookie is either absent or no longer verifiable; clearing it stops the
     browser resending a dead token on every subsequent request. */
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  /* Skip the framework's own routes and anything with a file extension —
     running auth checks on every image is pure latency. */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
