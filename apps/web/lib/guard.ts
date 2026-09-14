import { redirect } from "next/navigation";
import { currentUser, type SessionUser } from "./auth";

/**
 * For pages that mean nothing without an account. Sends a visitor to sign in and
 * carries where they were headed, so they land back on it.
 */
export async function requireUser(next: string): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  return user;
}

/** As above, and additionally requires an open storefront. */
export async function requireSeller(next: string): Promise<SessionUser & { handle: string }> {
  const user = await requireUser(next);
  if (!user.handle) redirect("/become-seller");
  return user as SessionUser & { handle: string };
}
