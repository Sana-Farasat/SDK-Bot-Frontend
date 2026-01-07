"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askAgent = async () => {
    const userMessage = query.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("https://sana-naz-sdk-bot-backend.hf.space/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Backend communication failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "No response received" },
      ]);
    } catch (error: unknown) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${error || "Connection issue"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAgent();
    }
  };

  return (
    <div className="bg-linear-to-br from-gray-950 via-indigo-950 to-black min-h-screen flex flex-col text-gray-100">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-indigo-900/40 py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br  flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-cyan-500/30">
            <Image
            src={'/logo.png'}
            alt="Logo"
            height={120}
            width={120}/>

          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SDK Bot
            </span>
          </h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-400 font-medium">
          OpenAI Agents SDK • Designed by Sana
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto px-3 sm:px-5 md:px-8 py-4 md:py-6 scrollbar-thin scrollbar-thumb-indigo-600/70 scrollbar-track-transparent pb-24">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="text-4xl mb-4 opacity-80">👋</div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                Welcome to SDK Bot
              </h2>
              <p className="text-gray-400 max-w-md text-sm sm:text-base">
                Ask anything about OpenAI Agents SDK — workflows, tools, handoffs,
                guardrails, MCP, examples...
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-5 sm:mb-6 animate-fade-in-up ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] p-3.5 sm:p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                    msg.sender === "user"
                      ? "bg-linear-to-br from-indigo-600/90 to-purple-600/90 text-white rounded-br-none"
                      : "bg-gray-800/85 border border-gray-700/60 text-cyan-50 rounded-bl-none backdrop-blur-sm"
                  }`}
                >
                  <div className="font-medium text-xs sm:text-sm opacity-90 mb-1.5">
                    {msg.sender === "user" ? "You" : "SDK Bot"}
                  </div>
                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start mb-6">
              <div className="bg-gray-800/85 border border-gray-700/60 text-cyan-100 px-5 py-3.5 rounded-2xl rounded-bl-none backdrop-blur-sm flex items-center gap-2.5">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-sm font-medium">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area - safe area aware */}
      <footer className="bg-black/60 backdrop-blur-xl border-t border-indigo-900/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Agents SDK, handoffs, guardrails..."
            className="flex-1 bg-gray-900/70 border border-indigo-700/50 rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-cyan-50 placeholder-gray-500 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            disabled={loading}
          />
          <button
            onClick={askAgent}
            disabled={loading || !query.trim()}
            className={`
              min-w-[76px] sm:min-w-[88px] px-5 sm:px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base
              transition-all shadow-lg active:scale-95
              ${
                loading || !query.trim()
                  ? "bg-gray-700/60 cursor-not-allowed"
                  : "bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-500/40"
              }
            `}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </footer>
    </div>
  );
}

