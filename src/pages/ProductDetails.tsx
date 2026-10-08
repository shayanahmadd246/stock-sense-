import React, { useEffect, useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { fetchProductDetails } from "../services/api";
import { Product, StockMovement, safeNum } from "../types";
import { ArrowLeft, Truck } from "lucide-react";

export function ProductDetails() {
  const { selectedProductId, setActivePage, setSelectedProductId } = useInventory();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [productData, setProductData] = useState<{ product: Product; movements: StockMovement[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProductId) return;
    fetchProductDetails(selectedProductId, user)
      .then((data) => setProductData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedProductId, user]);

  if (!selectedProductId || !productData) {
    return (
      <div className="text-center py-16 space-y-4 text-white">
        <p className="text-slate-400 text-sm">No product selected or product not found.</p>
        <button
          onClick={() => setActivePage("inventory")}
          className="px-4 py-2 bg-rose-900 text-white rounded-xl text-xs font-semibold cursor-pointer border border-rose-700"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const { product, movements } = productData;
  const sellingPrice = safeNum(product.sellingPrice, 0);
  const costPrice = safeNum(product.costPrice, 0);
  const profit = isManager ? sellingPrice - costPrice : 0;
  const currentStock = safeNum(product.currentStock, 0);
  const minStock = safeNum(product.minStock, 0);

  return (
    <div className="space-y-6 text-slate-100">
      <button
        onClick={() => {
          setSelectedProductId(null);
          setActivePage("inventory");
        }}
        className="flex items-center gap-2 text-xs font-semibold text-sky-400 hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Inventory</span>
      </button>

      {/* Product Overview Card */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-sky-950 text-sky-300 font-medium px-2 py-0.5 rounded border border-sky-900">
                {product.category}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  product.status === "In Stock"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-900"
                    : product.status === "Low Stock"
                    ? "bg-amber-950 text-amber-300 border border-amber-900"
                    : "bg-rose-950 text-rose-300 border border-rose-900"
                }`}
              >
                {product.status}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{product.name}</h2>
            <p className="text-xs font-mono text-sky-400 mt-1">SKU: {product.sku}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage("stock-in")}
              className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer border border-rose-700"
            >
              Stock In
            </button>
            <button
              onClick={() => setActivePage("stock-out")}
              className="px-4 py-2 bg-sky-900 hover:bg-sky-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer border border-sky-700"
            >
              Stock Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
          <div>
            <p className="text-xs text-slate-400">Current Stock</p>
            <p className="text-2xl font-bold font-mono tabular-nums text-white mt-1">{currentStock}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Minimum Stock</p>
            <p className="text-2xl font-bold font-mono tabular-nums text-slate-300 mt-1">{minStock}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Selling Price</p>
            <p className="text-2xl font-bold font-mono tabular-nums text-sky-300 mt-1">
              PKR {sellingPrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Supplier</p>
            <p className="text-sm font-semibold text-white mt-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-slate-400" />
              <span>{product.supplier}</span>
            </p>
          </div>
        </div>

        {isManager && (
          <div className="grid grid-cols-2 gap-6 pt-6 mt-6 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Cost Price</p>
              <p className="text-xl font-bold font-mono tabular-nums text-white mt-1">
                PKR {costPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Profit Margin</p>
              <p className="text-xl font-bold font-mono tabular-nums text-sky-300 mt-1">
                PKR {profit.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stock Movement History */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-white text-sm mb-4">Stock Movement History for {product.name}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5">Timestamp</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5">Quantity</th>
                <th className="py-2.5">Previous → New</th>
                <th className="py-2.5">User</th>
                <th className="py-2.5">Reason / Supplier</th>
                <th className="py-2.5">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No movement history recorded yet for this product.
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900 transition-colors">
                    <td className="py-3 text-slate-400 font-mono text-[11px]">{m.timestamp}</td>
                    <td className="py-3">
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
                    <td className="py-3 font-mono tabular-nums font-bold text-white">
                      {m.movementType === "Stock In" ? `+${safeNum(m.quantity, 0)}` : `-${safeNum(m.quantity, 0)}`}
                    </td>
                    <td className="py-3 font-mono tabular-nums text-slate-300">
                      {safeNum(m.previousStock, 0)} → {safeNum(m.newStock, 0)}
                    </td>
                    <td className="py-3 text-white font-medium">{m.user}</td>
                    <td className="py-3 text-slate-300">{m.reason || m.supplier || "—"}</td>
                    <td className="py-3">
                      <span className="text-[10px] bg-black text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
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
