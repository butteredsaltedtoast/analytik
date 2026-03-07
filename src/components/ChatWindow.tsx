"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/types";

export default function ChatWindow({ experimentId: _experimentId }: { experimentId: string }) {
  const [messages, _setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;
    // TODO: Add user message, POST to /api/chat, append assistant response
    setInput("");
  }

  return (
    <div className="border border-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">Chat with your experiment</h2>

      <div className="space-y-2 min-h-[200px]">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className="inline-block bg-gray-800 rounded px-3 py-2 text-sm">
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your experiment..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-white text-black px-4 py-2 rounded text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
