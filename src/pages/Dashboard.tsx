import React from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { safeNum } from "../types";
import {
  Package,
  Layers,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Store,
  ShoppingBag,
  Cpu,
  Utensils,
  Home,
  Database,
} from "lucide-react";

export function Dashboard() {
  const { products, reports, setActivePage, setSelectedProductId } = useInventory();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const totalProducts = safeNum(reports?.totalProducts || products.length, 0);
  const totalStock = safeNum(reports?.totalStock || products.reduce((acc, p) => acc + safeNum(p.currentStock, 0), 0), 0);
  const lowStockItems = safeNum(reports?.lowStockItems || products.filter(p => p.status !== "In Stock").length, 0);
  const damagedItems = safeNum(reports?.damagedItems || 4, 0);

  const departments = [
    { name: "Electronics & Tech", icon: Cpu, count: "24 items", desc: "Cables, Earbuds, Smart Devices", bg: "from-sky-950/80 to-slate-950", border: "border-sky-900/60", text: "text-sky-300" },
    { name: "Grocery & Supermarket", icon: Utensils, count: "45 items", desc: "Basmati Rice, Cooking Oil, Tea", bg: "from-emerald-950/80 to-slate-950", border: "border-emerald-900/60", text: "text-emerald-300" },
    { name: "Clothing & Apparel", icon: ShoppingBag, count: "18 items", desc: "Formal Shirts, Denim, Casuals", bg: "from-rose-950/80 to-slate-950", border: "border-rose-900/60", text: "text-rose-300" },
    { name: "Household Essentials", icon: Home, count: "12 items", desc: "Cookware, Non-stick, Lamps", bg: "from-amber-950/80 to-slate-950", border: "border-amber-900/60", text: "text-amber-300" },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Visual Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-rose-950 to-slate-950 rounded-3xl p-8 border border-rose-900/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400 via-rose-900 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-rose-900/80 text-sky-200 px-2.5 py-1 rounded-md font-medium border border-rose-700/60 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-sky-300" />
              Nowshera Shopping Mall
            </span>
            <span className="text-xs text-sky-300 flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-md border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              Portal: {user?.role}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back, {user?.name}</h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            StockSense centralized inventory control system. Track store merchandise, real-time stock levels, deliveries, and AI assistant queries.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">

          <button
            onClick={() => setActivePage("ai-assistant")}
            className="px-5 py-2.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center gap-2 cursor-pointer border border-rose-700"
          >
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Visual Department Showcase Grid */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 tracking-wide">Mall Merchandise Departments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div
                key={idx}
                onClick={() => setActivePage("inventory")}
                className={`group p-5 rounded-2xl bg-gradient-to-br ${dept.bg} border ${dept.border} shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-black/60 border border-slate-800 ${dept.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 bg-black/40 px-2.5 py-0.5 rounded-full border border-slate-800">
                    {dept.count}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">{dept.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{dept.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-sky-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Catalog</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Products</span>
            <Package className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-white">{totalProducts}</p>
          <span className="text-[11px] text-rose-400 font-medium">Active catalog</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Stock</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-white">{totalStock}</p>
          <span className="text-[11px] text-sky-300 font-medium">Units in stock</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-amber-400">{lowStockItems}</p>
          <span className="text-[11px] text-amber-400 font-medium">Requires restock</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Stock In Today</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-white">70</p>
          <span className="text-[11px] text-emerald-400 font-medium">2 deliveries</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Stock Out Today</span>
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-white">18</p>
          <span className="text-[11px] text-sky-300 font-medium">Sales & dispatch</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Damaged Items</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-rose-400">{damagedItems}</p>
          <span className="text-[11px] text-rose-400 font-medium">Logged in history</span>
        </div>
      </div>

      {/* Manager Financial Metrics Cards */}
      {isManager && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-rose-950/40 via-black to-slate-950 p-5 rounded-2xl border border-rose-900/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-300 uppercase tracking-wide">Inventory Value</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                PKR {reports?.inventoryValue?.toLocaleString() || "142,500"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Total wholesale asset valuation</p>
            </div>
            <div className="p-3 bg-rose-950 rounded-xl text-rose-300 border border-rose-800">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-sky-950/40 via-black to-slate-950 p-5 rounded-2xl border border-sky-900/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-sky-300 uppercase tracking-wide">Weekly Sales</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                PKR {reports?.totalSales?.toLocaleString() || "145,000"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">+14% vs previous week</p>
            </div>
            <div className="p-3 bg-sky-950 rounded-xl text-sky-300 border border-sky-800">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-black to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Estimated Profit</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                PKR {reports?.profit?.toLocaleString() || "48,200"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Based on current stock margins</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl text-sky-300 border border-slate-700">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Items & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Low Stock Alert Items</h3>
            <button
              onClick={() => setActivePage("inventory")}
              className="text-xs font-medium text-sky-400 hover:underline cursor-pointer"
            >
              View All Inventory
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 font-medium">Product</th>
                  <th className="py-2.5 font-medium">Category</th>
                  <th className="py-2.5 font-medium">Current</th>
                  <th className="py-2.5 font-medium">Min</th>
                  <th className="py-2.5 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {products.filter(p => p.status !== "In Stock").length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      All products are fully stocked!
                    </td>
                  </tr>
                ) : (
                  products
                    .filter(p => p.status !== "In Stock")
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 font-semibold text-white">{p.name}</td>
                        <td className="py-3 text-slate-400">{p.category}</td>
                        <td className="py-3 font-mono tabular-nums font-bold text-rose-400">{p.currentStock}</td>
                        <td className="py-3 font-mono tabular-nums text-slate-400">{p.minStock}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                              p.status === "Out of Stock"
                                ? "bg-rose-950 text-rose-300 border border-rose-900"
                                : "bg-amber-950 text-amber-300 border border-amber-900"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setActivePage("stock-in");
                            }}
                            className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded-lg font-medium transition-colors cursor-pointer border border-rose-700"
                          >
                            Restock
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActivePage("stock-in")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-black hover:bg-slate-900 transition-colors text-xs font-medium text-slate-200 cursor-pointer border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                  <span>Record Stock In (Delivery)</span>
                </div>
                <span className="text-slate-500">→</span>
              </button>
              <button
                onClick={() => setActivePage("stock-out")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-black hover:bg-slate-900 transition-colors text-xs font-medium text-slate-200 cursor-pointer border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-sky-400" />
                  <span>Record Stock Out (Sale/Damage)</span>
                </div>
                <span className="text-slate-500">→</span>
              </button>
              <button
                onClick={() => setActivePage("stock-history")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-black hover:bg-slate-900 transition-colors text-xs font-medium text-slate-200 cursor-pointer border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400" />
                  <span>View Stock Movement History</span>
                </div>
                <span className="text-slate-500">→</span>
              </button>
              <button
                onClick={() => setActivePage("suppliers")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-black hover:bg-slate-900 transition-colors text-xs font-medium text-slate-200 cursor-pointer border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Manage Suppliers</span>
                </div>
                <span className="text-slate-500">→</span>
              </button>

            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 bg-black p-3 rounded-xl border border-slate-800">
            <p className="text-[11px] font-medium text-sky-300">💡 AI Assistant Tip:</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ask questions like &quot;What is the stock of Type-C cables?&quot; or request stock changes directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
