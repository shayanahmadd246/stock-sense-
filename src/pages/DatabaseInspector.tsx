import React, { useEffect, useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { fetchDatabaseInspection } from "../services/api";
import { Database, ShieldAlert, RefreshCw, Table, DollarSign, TrendingUp, Package } from "lucide-react";

export function DatabaseInspector() {
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  const loadDb = async () => {
    try {
      setLoading(true);
      const data = await fetchDatabaseInspection(user);
      setDbData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isManager) return;
    loadDb();
  }, [user, isManager]);

  if (!isManager) {
    return (
      <div className="bg-rose-950/60 border border-rose-900 p-8 rounded-2xl text-center space-y-3 max-w-lg mx-auto mt-12 text-white">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="font-bold text-white text-lg">Access Restricted</h3>
        <p className="text-xs text-slate-300">
          Supabase Database Inspector is restricted to Manager roles.
        </p>
      </div>
    );
  }

  const tables = dbData?.tables || {};
  const tableNames = Object.keys(tables);
  const currentRows = tables[activeTab] || [];

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-900 font-mono">
              Supabase PostgreSQL
            </span>
            <span className="text-xs text-sky-300 font-mono">jdlfnxooydsrxewavyga.supabase.co</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Supabase Database Inspector (Manager Portal)</h2>
          <p className="text-xs text-slate-400">Directly inspect raw Supabase tables, cost prices, selling prices, profits, stock, and audit logs.</p>
        </div>
        <button
          onClick={loadDb}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Supabase</span>
        </button>
      </div>

      {/* Database Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {tableNames.map((name) => (
          <div
            key={name}
            onClick={() => setActiveTab(name)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === name
                ? "bg-rose-950/70 border-rose-800 shadow-md ring-1 ring-rose-700"
                : "bg-slate-950 border-slate-800 hover:bg-slate-900"
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-medium capitalize truncate">{name.replace("_", " ")}</span>
              <Table className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-white">{tables[name]?.length || 0}</p>
            <span className="text-[10px] text-slate-400">Rows</span>
          </div>
        ))}
      </div>

      {/* Special Profit & Cost Summary Header if Products Table is Selected */}
      {activeTab === "products" && tables.products && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Total Products in DB</p>
              <p className="text-lg font-bold font-mono text-white">{tables.products.length} Items</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Total Inventory Value (Cost)</p>
              <p className="text-lg font-bold font-mono text-emerald-400">
                Rs. {tables.products.reduce((acc: number, p: any) => acc + (p.currentStock * p.costPrice), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Total Potential Profit</p>
              <p className="text-lg font-bold font-mono text-amber-400">
                Rs. {tables.products.reduce((acc: number, p: any) => acc + (p.currentStock * (p.sellingPrice - p.costPrice)), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table Records View */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 bg-black border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-sm text-white capitalize">Table: {activeTab.replace("_", " ")}</span>
          </div>
          <span className="text-xs font-mono text-sky-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            {currentRows.length} records in Supabase
          </span>
        </div>

        <div className="overflow-x-auto">
          {currentRows.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">No records found in this table.</div>
          ) : (
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  {Object.keys(currentRows[0] || {}).map((col) => (
                    <th key={col} className="py-3 px-4 font-semibold">{col}</th>
                  ))}
                  {activeTab === "products" && <th className="py-3 px-4 font-semibold text-amber-400">profitPerUnit</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {currentRows.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    {Object.keys(row).map((col) => (
                      <td key={col} className={`py-3 px-4 truncate max-w-xs ${col === 'costPrice' || col === 'sellingPrice' ? 'text-emerald-300 font-semibold' : 'text-slate-300'}`}>
                        {String(row[col] ?? "—")}
                      </td>
                    ))}
                    {activeTab === "products" && (
                      <td className="py-3 px-4 text-amber-400 font-bold">
                        Rs. {(Number(row.sellingPrice) - Number(row.costPrice)).toLocaleString()}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
