import { StudioShell } from "@/components/studio/StudioShell";
import { requireSeller } from "@/lib/guard";

/** The seller's side of the app, under its own mode. Sellers only. */
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSeller("/sell");

  return <StudioShell name={user.fullName}>{children}</StudioShell>;
}
