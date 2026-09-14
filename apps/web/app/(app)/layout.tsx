import { AppHeader } from "@/components/shell/AppHeader";
import { AppTabBar } from "@/components/shell/AppTabBar";
import { currentUser } from "@/lib/auth";

/**
 * The marketplace shell. Browsing is open — a visitor can read a listing and a
 * storefront without an account — so the guard sits on the private routes
 * themselves, not here.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  return (
    <div className="cg-app">
      <AppHeader />
      {children}
      <AppTabBar studioHref={user?.handle ? "/sell" : "/become-seller"} />
    </div>
  );
}
