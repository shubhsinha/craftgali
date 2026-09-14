import Link from "next/link";
import { placeholder } from "@/lib/media";
import { signOutAction } from "@/lib/actions/auth";
import type { SessionUser } from "@/lib/auth";

/**
 * The right-hand end of the app header. A visitor gets a way in; a signed-in
 * buyer gets their own rows, and a seller's "My studio" points at their shop.
 */
export function AccountMenu({ user }: { user: SessionUser | null }) {
  if (!user) {
    return (
      <div className="cg-appbar__actions">
        <Link href="/sign-in" className="cg-appbar__link cg-hide-sm">
          Sign in
        </Link>
        <Link href="/register" className="cg-btn cg-btn--solid cg-btn--sm">
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="cg-appbar__actions">
      <Link href="/saved" className="cg-appbar__link cg-hide-md">
        Saved
      </Link>
      <Link href="/messages" className="cg-appbar__link cg-hide-md">
        Messages
      </Link>

      <Link
        href={user.handle ? "/sell" : "/become-seller"}
        className="cg-btn cg-btn--solid cg-btn--sm cg-hide-sm"
      >
        {user.handle ? "My Atelier" : "Open Atelier"}
      </Link>

      <form action={signOutAction} className="cg-hide-md">
        <button type="submit" className="cg-appbar__link">
          Sign out
        </button>
      </form>

      <Link href="/settings" className="cg-avatar" aria-label={`${user.fullName} — settings`}>
        <span
          style={{ backgroundImage: `url(${placeholder(hashSeed(user.id), 60, 60)})` }}
        />
      </Link>
    </div>
  );
}

/** A stable placeholder portrait per account, until avatars are uploaded. */
function hashSeed(id: string) {
  return [...id].reduce((total, char) => total + char.charCodeAt(0), 0) % 900;
}
