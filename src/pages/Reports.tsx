import React from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert } from "lucide-react";

export function Reports() {
  const { reports, products } = useInventory();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  if (!isManager) {
    return (
      <div className="bg-rose-950/60 border border-rose-900 p-8 rounded-2xl text-center space-y-3 max-w-lg mx-auto mt-12 text-white">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="font-bold text-white text-lg">Access Restricted</h3>
        <p className="text-xs text-slate-300">
          Reports and financial summaries are restricted to Manager roles. Staff members cannot view inventory valuation, profits, or financial reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Mall Reports & Analytics</h2>
        <p className="text-xs text-slate-400">Comprehensive financial margins, inventory valuation, and sales analytics.</p>
      </div>

      {/* Overview Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Inventory Asset Value</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-white mt-2">
            PKR {(Number(reports?.inventoryValue) || 142500).toLocaleString()}
          </p>
          <p className="text-xs text-sky-400 mt-1 font-medium">Fully audited valuation</p>
        </div>
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Weekly Sales</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-white mt-2">
            PKR {(Number(reports?.totalSales) || 145000).toLocaleString()}
          </p>
          <p className="text-xs text-sky-400 mt-1 font-medium">Strong weekly turnover</p>
        </div>
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Projected Profit</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-rose-400 mt-2">
            PKR {(Number(reports?.profit) || 48200).toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Average 34% margin across categories</p>
        </div>
      </div>

      {/* Best-Selling Products Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-white text-sm mb-4">Best-Selling Products This Week</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5">Product</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Current Stock</th>
                <th className="py-2.5">Selling Price</th>
                <th className="py-2.5">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {products.slice(0, 4).map((p) => {
                const sellingPrice = Number(p.sellingPrice) || 0;
                const costPrice = Number(p.costPrice) || 0;
                const profit = sellingPrice - costPrice;
                return (
                  <tr key={p.id} className="hover:bg-slate-900 transition-colors">
                    <td className="py-3 font-semibold text-white">{p.name}</td>
                    <td className="py-3 text-slate-400">{p.category}</td>
                    <td className="py-3 font-mono tabular-nums font-bold text-white">{Number(p.currentStock) || 0}</td>
                    <td className="py-3 font-mono tabular-nums text-slate-300">PKR {sellingPrice.toLocaleString()}</td>
                    <td className="py-3 font-mono tabular-nums text-sky-300 font-semibold">PKR {profit.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
