import type { Metadata } from "next";
import { Yuji_Mai, Noto_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Yuji_Mai({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const bodyFont = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-body",
});

const metaFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-meta",
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
      className={`${displayFont.variable} ${bodyFont.variable} ${metaFont.variable} h-full antialiased`}
    >
      <body className="scroll-surface min-h-full">{children}</body>
    </html>
  );
}
