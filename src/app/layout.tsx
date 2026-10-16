import type { Metadata } from "next";
import { Press_Start_2P, Silkscreen, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BRAND } from "@/lib/brand";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} — Arcade Ledger`,
  description: BRAND.subheadline,
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='16' height='16' fill='%23FFC93C'/><rect x='4' y='4' width='8' height='8' fill='%230B0B14'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pressStart.variable} ${silkscreen.variable} ${ibmPlexMono.variable}`}
    >
      <body className="scanlines pixel-grid-bg min-h-screen text-pix-ink bg-pix-bg font-mono">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
