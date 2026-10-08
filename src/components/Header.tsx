import React from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { Sparkles, User, LogOut, ArrowLeft } from "lucide-react";

export function Header() {
  const { activePage, setActivePage, goBack } = useInventory();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-950 text-white border-b border-rose-950/60 px-6 flex items-center justify-between shrink-0">
      {/* Zone 1: Back button + Wordmark */}
      <div className="flex items-center gap-3">
        {activePage !== "dashboard" && (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 cursor-pointer transition-colors shadow-2xs"
            title="Go Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span>Back</span>
          </button>
        )}
        <span className="font-bold text-white text-base tracking-tight hidden sm:inline">
          StockSense — Nowshera Shopping Mall
        </span>
      </div>

      {/* Zone 2: Navigation links */}
      <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => setActivePage("dashboard")}
          className={`hover:text-white transition-colors cursor-pointer ${activePage === "dashboard" ? "text-rose-400 font-semibold" : ""}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActivePage("inventory")}
          className={`hover:text-white transition-colors cursor-pointer ${activePage === "inventory" ? "text-rose-400 font-semibold" : ""}`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActivePage("stock-in")}
          className={`hover:text-white transition-colors cursor-pointer ${activePage === "stock-in" ? "text-rose-400 font-semibold" : ""}`}
        >
          Stock In
        </button>
        <button
          onClick={() => setActivePage("stock-out")}
          className={`hover:text-white transition-colors cursor-pointer ${activePage === "stock-out" ? "text-rose-400 font-semibold" : ""}`}
        >
          Stock Out
        </button>
        <button
          onClick={() => setActivePage("reports")}
          className={`hover:text-white transition-colors cursor-pointer ${activePage === "reports" ? "text-rose-400 font-semibold" : ""}`}
        >
          Reports
        </button>
        <button
          onClick={() => setActivePage("ai-assistant")}
          className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${activePage === "ai-assistant" ? "text-rose-400 font-semibold" : ""}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          AI Assistant
        </button>
      </nav>

      {/* Zone 3: Primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActivePage("profile")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors text-xs font-medium text-slate-200 cursor-pointer"
        >
          <User className="w-3.5 h-3.5 text-sky-400" />
          <span className="truncate max-w-[120px]">{user?.name}</span>
        </button>
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
