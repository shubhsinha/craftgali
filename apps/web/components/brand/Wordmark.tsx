import Link from "next/link";

type Size = "sm" | "md" | "lg" | "xl";
export type Tone = "ink" | "paper";

const SIZES: Record<Size, number> = { sm: 18, md: 22, lg: 27, xl: 44 };

/**
 * The wordmark: CraftGali, with the second half set in Playfair italic and
 * carrying the live hue — so the switcher moves the brand as well as the
 * buttons, which is the fastest way to show what a hue actually does.
 */
export function Wordmark({ size = "md", tone = "ink" }: { size?: Size; tone?: Tone }) {
  return (
    <span
      className={`cg-wordmark cg-wordmark--${tone}`}
      style={{ fontSize: SIZES[size] }}
      aria-label="CraftGali"
    >
      <span aria-hidden="true">Craft</span>
      <em className="cg-wordmark__gali" aria-hidden="true">
        Gali
      </em>
    </span>
  );
}

/** The full lockup — fingerprint mark, then the wordmark, then an optional suffix. */
export function Logotype({
  size = "md",
  tone = "ink",
  href = "/",
  suffix,
}: {
  size?: Size;
  tone?: Tone;
  href?: string | null;
  suffix?: string;
}) {
  const inner = (
    <span className={`cg-logotype cg-logotype--${tone}`} style={{ fontSize: SIZES[size] }}>
      <span className="cg-logotype__mark" aria-hidden="true" />
      <Wordmark size={size} tone={tone} />
      {suffix ? <span className="cg-logotype__suffix">{suffix}</span> : null}
    </span>
  );

  return href ? (
    <Link href={href} aria-label="CraftGali — home">
      {inner}
    </Link>
  ) : (
    inner
  );
}
