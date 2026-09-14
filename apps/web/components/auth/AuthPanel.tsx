import Link from "next/link";
import { Logotype } from "@/components/brand/Wordmark";

/**
 * The frame both auth screens sit in: the mark, a title, the form, and the
 * safety line — because the first thing a new account should learn is that
 * CraftGali never holds the money.
 */
export function AuthPanel({
  title,
  lede,
  children,
  footer,
}: {
  title: string;
  lede: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="cg-auth">
      <div className="cg-auth__card">
        <Logotype size="lg" href="/" />
        <h1 className="cg-auth__title">{title}</h1>
        <p className="cg-auth__lede">{lede}</p>

        {children}

        <p className="cg-auth__footer">{footer}</p>
      </div>

      <aside className="cg-auth__aside">
        <p className="cg-eyebrow cg-eyebrow--accent">Before you start</p>
        <p className="cg-auth__promise">
          CraftGali takes no commission and processes no payments. You agree a price in
          chat and pay the artist on handover, once you have seen the piece.
        </p>
        <Link href="/trust" className="cg-auth__more">
          How a safe handover works →
        </Link>
      </aside>
    </main>
  );
}
