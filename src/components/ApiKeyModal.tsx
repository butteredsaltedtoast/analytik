"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApiKey } from "@/context/ApiKeyContext";

export function ApiKeyModal() {
  const { isModalOpen, hideModal, saveKey } = useApiKey();
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      setInput("");
      setStatus("idle");
      setErrorMsg("");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) hideModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isModalOpen, hideModal]);

  async function handleSubmit() {
    const key = input.trim();
    if (!key) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Invalid API key");
      }
      setStatus("success");
      setTimeout(() => saveKey(key), 600);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Invalid API key.");
    }
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={hideModal}
          />
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Connect Groq</h2>
                  <button
                    onClick={hideModal}
                    className="text-gray-500 hover:text-white transition-colors p-1 rounded"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Your API key stays in your browser and is sent directly to Groq.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Groq API Key
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={show ? "text" : "password"}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setStatus("idle");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="gsk_..."
                    className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors pr-10 ${
                      status === "error"
                        ? "border-red-500 focus:border-red-400"
                        : status === "success"
                          ? "border-green-500"
                          : "border-gray-700 focus:border-gray-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {show ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-400"
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!input.trim() || status === "loading" || status === "success"}
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Verifying...
                  </>
                ) : status === "success" ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Key saved!
                  </>
                ) : (
                  "Save & Continue"
                )}
              </button>

              <p className="text-xs text-gray-600 text-center">
                Get a free key at{" "}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  console.groq.com
                </a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
