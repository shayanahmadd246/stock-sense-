import React, { useState, useMemo } from "react";
import { useInventory } from "../context/InventoryContext";
import { Filter, Search } from "lucide-react";

export function StockHistory() {
  const { stockHistory, products } = useInventory();
  const [productFilter, setProductFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchUser, setSearchUser] = useState("");

  const filteredHistory = useMemo(() => {
    return stockHistory.filter((m) => {
      const matchProd = productFilter === "All" || m.productName === productFilter;
      const matchType = typeFilter === "All" || m.movementType === typeFilter;
      const matchUser = !searchUser || m.user.toLowerCase().includes(searchUser.toLowerCase());
      return matchProd && matchType && matchUser;
    });
  }, [stockHistory, productFilter, typeFilter, searchUser]);

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Stock Movement History</h2>
        <p className="text-xs text-slate-400">Complete immutable audit trail of all stock ins, outs, damages, and adjustments.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Filter by user..."
            className="w-full pl-9 pr-3 py-2 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>Product:</span>
          </div>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="bg-black border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-rose-700"
          >
            <option value="All" className="bg-slate-900 text-white">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.name} className="bg-slate-900 text-white">
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 ml-2">
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-black border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-rose-700"
          >
            <option value="All" className="bg-slate-900 text-white">All Types</option>
            <option value="Stock In" className="bg-slate-900 text-white">Stock In</option>
            <option value="Stock Out" className="bg-slate-900 text-white">Stock Out</option>
            <option value="Damaged" className="bg-slate-900 text-white">Damaged</option>
            <option value="Adjustment" className="bg-slate-900 text-white">Adjustment</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Movement Type</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Previous → New</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Supplier / Reason</th>
                <th className="py-3 px-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No matching stock movement records found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{m.timestamp}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{m.productName}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                          m.movementType === "Stock In"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-900"
                            : m.movementType === "Stock Out"
                            ? "bg-sky-950 text-sky-300 border border-sky-900"
                            : "bg-rose-950 text-rose-300 border border-rose-900"
                        }`}
                      >
                        {m.movementType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-white">
                      {m.movementType === "Stock In" ? `+${m.quantity}` : `-${m.quantity}`}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                      {m.previousStock} → {m.newStock}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{m.user}</td>
                    <td className="py-3.5 px-4 text-slate-300">{m.supplier || m.reason || "—"}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-black text-slate-300 px-1.5 py-0.5 rounded border border-slate-800 font-medium">
                        {m.source}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
