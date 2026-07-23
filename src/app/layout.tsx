import type { Metadata, Viewport } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: { default: "Flint LTD — Construction & Building Services", template: "%s | Flint LTD" },
  description:
    "Professional general building services: extensions, refurbishment, electrical, plumbing and painting.",
  applicationName: "Flint LTD",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Flint LTD — Construction & Building Services",
    description: "Extensions, refurbishments and complete property improvements across London.",
    type: "website",
    locale: "en_GB",
    siteName: "Flint LTD",
  },
  robots: { index: true, follow: true },
};

// Ensures <meta name="viewport" content="width=device-width, initial-scale=1" />
// is emitted for correct mobile scaling.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
