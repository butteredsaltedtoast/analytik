"use client";

import { useEffect } from "react";
import { useApiKey } from "@/context/ApiKeyContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, showModal } = useApiKey();

  useEffect(() => {
    if (!isSignedIn) showModal();
  }, [isSignedIn, showModal]);

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-24 text-center">
        <p className="text-gray-500 text-sm">Connect your Gemini API key to continue.</p>
      </div>
    );
  }

  return <>{children}</>;
}