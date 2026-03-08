"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface ApiKeyContextValue {
  apiKey: string | null;
  isSignedIn: boolean;
  saveKey: (key: string) => void;
  clearKey: () => void;
  showModal: () => void;
  hideModal: () => void;
  isModalOpen: boolean;
  requireAuth: (onSuccess?: () => void) => boolean;
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);
const STORAGE_KEY = "analytik-api-key";

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, []);

  const saveKey = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
    setIsModalOpen(false);
    setPendingAction((prev) => {
      if (prev) setTimeout(prev, 100);
      return null;
    });
  }, []);

  const clearKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey(null);
  }, []);

  const showModal = useCallback(() => setIsModalOpen(true), []);
  const hideModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  const requireAuth = useCallback(
    (onSuccess?: () => void): boolean => {
      if (apiKey) return true;
      setPendingAction(() => onSuccess ?? null);
      setIsModalOpen(true);
      return false;
    },
    [apiKey]
  );

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        isSignedIn: Boolean(apiKey),
        saveKey,
        clearKey,
        showModal,
        hideModal,
        isModalOpen,
        requireAuth,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error("useApiKey must be used inside ApiKeyProvider");
  return ctx;
}
