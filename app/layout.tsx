import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TV Guide",
  description: "Teletext-style 2-hour TV guide"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
