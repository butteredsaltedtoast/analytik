import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Analytik",
  description: "AI research infrastructure — surface the invisible architecture in your data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <nav className="border-b border-gray-800 px-6 py-4 flex items-center gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Analytik
          </Link>
          <Link href="/experiments" className="text-sm text-gray-400 hover:text-white">
            Experiments
          </Link>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
