import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Analytik",
  description: "An AI research infrastructure platform that helps labs analyze experimental data, learn from past results, catch hidden problems, and propose smarter next experiments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Navigation />
          <main className="flex flex-col flex-1 max-w-5xl mx-auto px-6 py-8">
            {children}
          </main>
          <footer className="fixed bottom-4 right-4 text-xs text-gray-500">
            <Link href="/license" className="hover:text-gray-300">
              © Omar Aziza, Roma Joshi, Nicholas Maryniy
            </Link>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
