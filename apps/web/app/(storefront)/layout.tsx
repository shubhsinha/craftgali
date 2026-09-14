/**
 * The storefront wears its maker's hue and mode, so it takes none of CraftGali's
 * own chrome — the page draws its own thin bar and nothing else.
 */
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
