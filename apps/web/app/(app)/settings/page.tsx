import type { Metadata } from "next";
import Link from "next/link";
import { PasswordPanel } from "@/components/auth/PasswordPanel";
import { signOutAction, signOutEverywhereAction } from "@/lib/actions/auth";
import { requireUser } from "@/lib/guard";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser("/settings");

  return (
    <main className="cg-plain">
      <h1 className="cg-plain__title">Your account</h1>

      <dl className="cg-account">
        <div>
          <dt>Name</dt>
          <dd>{user.fullName}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>City</dt>
          <dd>{user.city ?? <span className="cg-muted">Not set</span>}</dd>
        </div>
        <div>
          <dt>Account type</dt>
          <dd>{user.role === "seller" ? "Seller" : "Buyer"}</dd>
        </div>
        <div>
          <dt>Storefront</dt>
          <dd>
            {user.handle ? (
              <Link href={`/artist/${user.handle}`}>craftgali.com/@{user.handle}</Link>
            ) : (
              <Link href="/become-seller">Open one — free for five pieces</Link>
            )}
          </dd>
        </div>
      </dl>

      <PasswordPanel />

      <section className="cg-settings__block">
        <h2 className="cg-settings__blocktitle">Sessions</h2>
        <p className="cg-settings__blocknote">
          Signing out everywhere revokes every device currently signed into this
          account, including this one. Use it if you think someone else has your
          password.
        </p>

        <div className="cg-settings__actions">
          <form action={signOutAction}>
            <button type="submit" className="cg-btn cg-btn--outline">
              Sign out
            </button>
          </form>

          <form action={signOutEverywhereAction}>
            <button type="submit" className="cg-btn cg-btn--quiet">
              Sign out everywhere
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
