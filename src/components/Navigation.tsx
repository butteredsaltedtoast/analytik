"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import icon from "../assets/icon.png";
import { useRouter } from "next/navigation";
import { useApiKey } from "@/context/ApiKeyContext";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, clearKey, showModal } = useApiKey();

  function handleGatedNav(href: string) {
    if (isSignedIn) router.push(href);
    else showModal();
  }

  return (
    <motion.nav
      className="border-b border-gray-800 px-6 py-4 flex items-center gap-6 flex-shrink-0"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Link
        href="/"
        className={`text-lg tracking-tight flex items-center gap-2 transition-colors ${pathname === "/"
          ? "font-bold text-white"
          : "text-gray-400 hover:text-white"
          }`}
      >
        <Image src={icon} alt="Analytik logo" width={50} height={50} />
        Analytik
      </Link>
      <button
        onClick={() => handleGatedNav("/experiments")}
        className={`text-sm transition-colors ${pathname.startsWith("/experiments") ? "font-bold text-white" : "text-gray-400 hover:text-white"
          }`}
      >
        Experiments
      </button>

      <div className="ml-auto flex items-center gap-3">
        {isSignedIn ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Connected
            </span>
            <button onClick={clearKey} className="text-xs text-gray-500 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded-md">
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={showModal} className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black text-sm font-medium px-4 py-1.5 rounded-full transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Connect Gemini
          </button>
        )}
      </div>
    </motion.nav>
  );
}
