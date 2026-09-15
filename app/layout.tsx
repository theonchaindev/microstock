import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-stack", display: "swap" });

const title = "Microstock — $MSFT on Solana";
const description =
  "A fully usable Windows 11 desktop for $MSFT, the Solana token that streams 1% of every trade straight to holders. Watch the payouts land live.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Microstock Desktop",
  openGraph: { title, description, type: "website", siteName: "Microstock" },
  twitter: { card: "summary_large_image", title, description },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#202020",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
