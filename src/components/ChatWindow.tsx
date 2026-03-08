"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ChatMessage } from "@/lib/types";

export default function ChatWindow({
  experimentId,
  experimentContext,
}: {
  experimentId: string;
  experimentContext: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`analytik-chat-${experimentId}`);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        // corrupted data, ignore
      }
    }
  }, [experimentId]);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        `analytik-chat-${experimentId}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, experimentId]);

  // Auto-scroll to bottom when new messages are added
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          experimentContext: experimentContext,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Chat request failed");
      }

      const { response } = await res.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
      };
      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem(`analytik-chat-${experimentId}`);
  }

  return (
    <div className="border border-gray-800 rounded-lg p-6 flex flex-col max-h-[calc(100vh-280px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chat with your experiment</h2>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2"
      >
        {messages.length === 0 && !loading && (
          <p className="text-gray-600 text-sm text-center py-8">
            Ask a question about your experiment data.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Thinking...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={loading}
          placeholder={
            loading
              ? "Waiting for response..."
              : "Ask about your experiment..."
          }
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-white text-black px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
        >
          Send
        </button>
      </div>
    </div>
  );
}
