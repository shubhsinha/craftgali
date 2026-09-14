/**
 * The one piece of session vocabulary that both runtimes need.
 *
 * `lib/auth.ts` is server-only and pulls in `pg`, which the edge runtime cannot
 * load — so the middleware imports the cookie name from here instead of from
 * there.
 */
export const SESSION_COOKIE = "cg_session";
