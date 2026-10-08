import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";
import { sendAIChatApi } from "../services/api";
import { AIChatMessage } from "../types";
import { AIConfirmationCard } from "./AIConfirmationCard";
import { X, Send, Sparkles, RefreshCw, AlertTriangle } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "What is the stock of Type-C cables?",
  "Which items are running low?",
  "What sold most this week?",
  "How many damaged items do we have?",
  "Add 40 Type-C cables from Ali Traders.",
];

export function AIChatDrawer() {
  const { user } = useAuth();
  const { aiUnavailable } = useInventory();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "m1",
      sender: "ai",
      text: "Hello! I am StockSense AI for Nowshera Shopping Mall. How can I help you manage inventory today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-rose-900 hover:bg-rose-800 text-white p-3.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center cursor-pointer border border-rose-700"
        title="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 text-sky-300" />
      </button>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-black text-white h-full flex flex-col shadow-2xl border-l border-rose-950">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-rose-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-950 border border-rose-800 rounded-xl">
                  <Sparkles className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">StockSense AI Assistant</h3>
                  <p className="text-xs text-sky-300">Nowshera Shopping Mall</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Unavailability Warning Banner */}
            {aiUnavailable && (
              <div className="bg-amber-950 border-b border-amber-900 p-3 text-xs text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>AI Assistant is currently unavailable. You can continue managing inventory using the normal forms.</span>
              </div>
            )}

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-2xs leading-relaxed ${
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
                  <span>StockSense AI is analyzing inventory...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="p-3 bg-black border-t border-slate-900">
              <p className="text-[11px] font-semibold text-slate-400 mb-2">Suggested Questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-4 bg-slate-950 border-t border-rose-950">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about inventory, sales, or stock changes..."
                  className="flex-1 bg-black border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-rose-700 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
