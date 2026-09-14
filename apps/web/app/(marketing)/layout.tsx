import { SiteFooter } from "@/components/shell/SiteFooter";
import { SiteHeader } from "@/components/shell/SiteHeader";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
