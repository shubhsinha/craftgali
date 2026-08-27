import type { Metadata } from "next";
import {
  Fraunces,
  Work_Sans,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Lora,
} from "next/font/google";
import "./globals.css";
import "./craftgali.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Craftgali",
  description: "A marketplace for handcrafted goods.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${workSans.variable} ${playfair.variable} ${jakarta.variable} ${lora.variable}`}
    >
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/@fontsource/uncut-sans@5.0.7/index.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
