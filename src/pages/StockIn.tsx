import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { recordStockIn } from "../services/api";
import { ArrowDownRight, Loader2 } from "lucide-react";

export function StockIn() {
  const { products, refreshData, addToast, selectedProductId } = useInventory();
  const { user } = useAuth();

  const [productId, setProductId] = useState(selectedProductId || (products[0]?.id ?? ""));
  const [quantity, setQuantity] = useState("40");
  const [supplier, setSupplier] = useState("Ali Traders");
  const [reference, setReference] = useState("INV-2026-001");
  const [notes, setNotes] = useState("Standard store restocking delivery");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = Number(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      addToast("Please enter a valid positive quantity.", "error");
      return;
    }
    if (!productId) {
      addToast("Please select a product.", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await recordStockIn(
        {
          productId,
          quantity: qtyNum,
          supplier,
          reference,
          notes,
        },
        user
      );
      await refreshData();
      addToast(res.message || `Successfully recorded stock in for ${res.product?.name || "product"}!`);
      setQuantity("10");
    } catch (err: any) {
      addToast(err.message || "Failed to record stock in", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Record Stock In</h2>
        <p className="text-xs text-slate-400">Log incoming store deliveries from suppliers to increase inventory.</p>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-rose-700"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} (Current Stock: {p.currentStock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono tabular-nums focus:outline-hidden focus:border-rose-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Supplier</label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Ali Traders"
                className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Reference / Invoice #</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. INV-9921"
                className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().substring(0, 10)}
                className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-rose-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Remarks</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-rose-700"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Stock In...</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-4 h-4" />
                <span>Confirm Stock In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
