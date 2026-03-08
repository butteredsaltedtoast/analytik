"use client";

import { ReactNode } from "react";
import { ApiKeyProvider } from "@/context/ApiKeyContext";
import { ApiKeyModal } from "@/components/ApiKeyModal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApiKeyProvider>
      {children}
      <ApiKeyModal />
    </ApiKeyProvider>
  );
}
