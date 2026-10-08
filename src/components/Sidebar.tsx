import React from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ArrowDownRight,
  ArrowUpRight,
  History,
  Truck,
  BarChart3,
  Sparkles,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";

export function Sidebar() {
  const { activePage, setActivePage } = useInventory();
  const { user, switchDemoRole } = useAuth();

  const isManager = user?.role === "manager";

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "stock-in", label: "Stock In", icon: ArrowDownRight },
    { id: "stock-out", label: "Stock Out", icon: ArrowUpRight },
    { id: "stock-history", label: "History", icon: History },
    { id: "suppliers", label: "Suppliers", icon: Truck },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
    ...(isManager ? [{ id: "users", label: "Users", icon: Users }] : []),
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white border-r border-rose-950/60 hidden lg:flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-rose-950/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center text-white font-bold shadow-sm">
          SS
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight">StockSense</h1>
          <p className="text-[11px] text-sky-300">Nowshera Shopping Mall</p>
        </div>
      </div>

      {/* Role Switcher Demo Bar */}
      <div className="p-3 bg-rose-950/30 border border-rose-900/40 mx-3 mt-3 rounded-xl">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-sky-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            Portal:
          </span>
          <span className="text-[11px] font-bold uppercase text-rose-300 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
            {user?.role}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <button
            onClick={() => switchDemoRole("manager")}
            className={`flex-1 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
              isManager ? "bg-rose-900 text-white shadow-2xs" : "bg-black text-slate-300 border border-slate-800 hover:bg-slate-900"
            }`}
          >
            Manager
          </button>
          <button
            onClick={() => switchDemoRole("staff")}
            className={`flex-1 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
              !isManager ? "bg-rose-900 text-white shadow-2xs" : "bg-black text-slate-300 border border-slate-800 hover:bg-slate-900"
            }`}
          >
            Staff
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-rose-950 text-white font-semibold border border-rose-900/60 shadow-2xs"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-rose-400" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-rose-950/40 flex items-center justify-between bg-black">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-950 text-rose-300 font-bold flex items-center justify-center text-xs border border-rose-800">
            {user?.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-sky-300 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
