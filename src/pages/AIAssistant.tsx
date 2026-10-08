import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";
import { sendAIChatApi } from "../services/api";
import { AIChatMessage } from "../types";
import { AIConfirmationCard } from "../components/AIConfirmationCard";
import { Sparkles, Send, RefreshCw, AlertTriangle } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "What is the stock of Type-C cables?",
  "Which items are running low?",
  "What sold most this week?",
  "How many damaged items do we have?",
  "Add 40 Type-C cables from Ali Traders.",
];

export function AIAssistant() {
  const { user } = useAuth();
  const { aiUnavailable } = useInventory();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "m1",
      sender: "ai",
      text: "Hello! I am StockSense AI assistant for Nowshera Shopping Mall. Ask me any inventory question or request a stock change.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: AIChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      if (aiUnavailable) {
        throw new Error("AI Assistant is currently unavailable.");
      }
      const data = await sendAIChatApi(query, user, aiUnavailable);
      const aiMsg: AIChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposal: data.proposal || null,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: AIChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: "ai",
        text: err.message || "AI Assistant is currently unavailable. You can continue managing inventory using the normal forms.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-black border-b border-rose-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-950 border border-rose-800 rounded-xl">
            <Sparkles className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">StockSense AI Assistant</h2>
            <p className="text-xs text-sky-300">Connected to Nowshera Shopping Mall database (Role: {user?.role})</p>
          </div>
        </div>
      </div>

      {aiUnavailable && (
        <div className="bg-amber-950 border-b border-amber-900 p-3 text-xs text-amber-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>AI Assistant is currently unavailable. You can continue managing inventory using the normal forms.</span>
        </div>
      )}

      {/* Suggested Questions Bar */}
      <div className="p-3 bg-black border-b border-slate-950 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Try asking:</span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/70">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-2xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-rose-900 text-white rounded-br-xs border border-rose-800"
                  : "bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-xs"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.proposal && (
                <AIConfirmationCard
                  proposal={msg.proposal}
                  onResolved={(msgText) => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `res_${Date.now()}`,
                        sender: "ai",
                        text: msgText,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ]);
                  }}
                  onCancelled={() => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `canc_${Date.now()}`,
                        sender: "ai",
                        text: "Stock change cancelled. No changes made.",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ]);
                  }}
                />
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 p-3 rounded-2xl border border-slate-800 w-fit animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
            <span>StockSense AI is querying database...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-black border-t border-rose-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about inventory, sales, or request stock changes..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold shadow-xs border border-rose-700"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
