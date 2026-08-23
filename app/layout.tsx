import type { Metadata } from "next";
import { Zen_Old_Mincho } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Harukaze by Andrie Nugrie (nugsproject.com) — brush display face used
// only for the owner's name. Personal-use license; a commercial license
// is required if this site ever becomes commercial.
const displayFont = localFont({
  src: "./fonts/harukaze.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

// Zen Old Mincho (SIL OFL) — every other piece of text on the site.
const bodyFont = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Ayan Kawlekar",
  description:
    "Personal site of Ayan Kawlekar — applied mathematics at UC Berkeley. AI agents, machine-learning systems, and full-stack products.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="scroll-surface min-h-full">{children}</body>
    </html>
  );
}
