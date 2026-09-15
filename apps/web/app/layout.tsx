import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/brand.css";
import "./styles/shell.css";
import "./styles/app.css";
import "./styles/discover.css";
import "./styles/listing.css";
import "./styles/studio.css";
import "./styles/editor.css";
import "./styles/compose.css";
import "./styles/place.css";
import "./styles/messages.css";
import "./styles/auth.css";
import "./styles/skins.css";
import "./styles/storefront.css";
import "./styles/landing.css";

import { AmbientGlows, HeritageTapestry } from "@/components/brand/Heritage";
import { THEME_BOOTSTRAP } from "@/components/shell/theme";

/* The system speaks in two voices: Playfair for the brand and the maker's
   own words, Plus Jakarta Sans for everything else. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const FONTS = [playfair, jakarta].map((font) => font.variable).join(" ");

export const metadata: Metadata = {
  title: {
    default: "CraftGali — Reaching Every Corner of the World",
    template: "%s · CraftGali",
  },
  description:
    "Explore breathtaking canvases, sculptures and decor curated directly from independent makers in your creative ecosystem. The artist keeps every rupee.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* The bootstrap below stamps data-hue and data-mode before React hydrates,
       which React would otherwise report as server/client attribute drift. */
    <html lang="en" className={FONTS} suppressHydrationWarning>
      <head>
        {/* Restores the visitor's hue and mode before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        {/* Both grounds are mounted once, here: the tapestry defines the
            `cgJewel` gradient that the toran and the jali corners point at. */}
        <AmbientGlows />
        <HeritageTapestry />
        {children}
      </body>
    </html>
  );
}
