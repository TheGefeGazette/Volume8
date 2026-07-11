import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Gefe Gazette",
  description: "All The Fake Football News Fit To Print"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
