"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <Navigation />
      <AnimatePresence mode="wait">
        <main key={pathname} className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
      </AnimatePresence>
      <footer className="fixed bottom-4 right-4 text-xs text-gray-500">
        <Link href="/license" className="hover:text-gray-300">
          © Omar Aziza, Roma Joshi, Nicholas Maryniy
        </Link>
      </footer>
    </>
  );
}