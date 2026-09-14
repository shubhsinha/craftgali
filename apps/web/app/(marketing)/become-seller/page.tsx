import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FOUNDING } from "@/lib/sample-data";
import { currentUser } from "@/lib/auth";
import { CITIES, DEFAULT_CITY } from "@/lib/cities";
import { StudioForm } from "./StudioForm";

export const metadata: Metadata = { title: "Open your studio" };

const PROMISES = [
  "0% commission — you keep every rupee a buyer pays you.",
  "Five pieces live at a time, free forever. A slot frees the moment one sells.",
  "Two storefront skins on the free tier, all four on Pro.",
];

export default async function BecomeSellerPage() {
  const user = await currentUser();

  /* Opening a studio needs an account, so send them through registration first
     and bring them straight back. */
  if (!user) redirect("/register?next=/become-seller");
  if (user.handle) redirect("/sell");

  return (
    <main className="cg-doc cg-seller">
      <header className="cg-doc__head">
        <p className="cg-eyebrow cg-eyebrow--accent">Open your studio</p>
        <h1 className="cg-doc__title">Your shop, on your street, with your name on it</h1>
        <p className="cg-lede cg-doc__lede">
          {FOUNDING.remaining.toLocaleString("en-IN")} Tier-1 founding places are still
          open — {FOUNDING.perks}
        </p>
      </header>

      <div className="cg-seller__grid">
        <StudioForm
          suggestedName={user.fullName}
          suggestedCity={
            CITIES.find((c) => c.name.toLowerCase() === (user.city ?? "").toLowerCase())?.slug ??
            DEFAULT_CITY
          }
        />

        <aside className="cg-seller__aside">
          <h2 className="cg-eyebrow">What it costs</h2>
          <ul className="cg-doc__list">
            {PROMISES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <Link href="/fees" className="cg-auth__more">
            The whole fee page →
          </Link>
        </aside>
      </div>
    </main>
  );
}
