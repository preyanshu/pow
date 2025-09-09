import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROOF OF WORK",
  description: "Minimal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="terminal">
        {children}
      </body>
    </html>
  );
}
