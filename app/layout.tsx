import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Microstock — $MSFT on Solana";
const description =
  "A fully usable Windows XP desktop for $MSFT, the Solana token that streams 1% of every trade straight to holders. Watch the payouts land live.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Microstock XP",
  openGraph: { title, description, type: "website", siteName: "Microstock" },
  twitter: { card: "summary_large_image", title, description },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#245edb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="blue" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
