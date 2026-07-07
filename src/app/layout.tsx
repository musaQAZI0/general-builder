import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "General Builder — Construction & Building Services",
  description:
    "Professional general building services: extensions, refurbishment, electrical, plumbing and painting.",
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
