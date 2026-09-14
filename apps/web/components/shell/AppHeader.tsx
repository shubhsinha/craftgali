import { Suspense } from "react";
import { Logotype } from "@/components/brand/Wordmark";
import { currentUser } from "@/lib/auth";
import { readPlace } from "@/lib/place";
import { CityPicker } from "./CityPicker";
import { AccountMenu } from "./AccountMenu";
import { SearchField } from "./SearchField";
import { ThemeControls } from "./ThemeControls";

/**
 * The signed-in header. The marketing header sells; this one navigates — so the
 * nav links give way to the location + search combo, which is the only control
 * a buyer touches on every screen.
 */
export async function AppHeader() {
  const user = await currentUser();
  const place = readPlace();

  return (
    <header className="cg-appbar">
      <div className="cg-appbar__row">
        <Logotype size="md" />

        <Suspense fallback={<div className="cg-search" />}>
          <SearchField
            place={<CityPicker city={place.city} radiusKm={place.radiusKm} precise={place.precise} />}
          />
        </Suspense>

        <div className="cg-appbar__actions">
          <div className="cg-hide-md">
            <ThemeControls compact />
          </div>
          <AccountMenu user={user} />
        </div>
      </div>
    </header>
  );
}
