"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import icon from "../assets/icon.png";

export function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="border-b border-gray-800 px-6 py-4 flex items-center gap-6 flex-shrink-0"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Link
        href="/"
        className={`text-lg tracking-tight flex items-center gap-2 transition-colors ${
          pathname === "/"
            ? "font-bold text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <Image src={icon} alt="Analytik logo" width={50} height={50} />
        Analytik
      </Link>
      <Link
        href="/experiments"
        className={`text-sm transition-colors ${
          pathname.startsWith("/experiments")
            ? "font-bold text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Experiments
      </Link>
    </motion.nav>
  );
}
