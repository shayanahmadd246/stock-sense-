import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { recordStockOut } from "../services/api";
import { ArrowUpRight, AlertTriangle, Loader2 } from "lucide-react";

export function StockOut() {
  const { products, refreshData, addToast, selectedProductId } = useInventory();
  const { user } = useAuth();

  const [productId, setProductId] = useState(selectedProductId || (products[0]?.id ?? ""));
  const [quantity, setQuantity] = useState("3");
  const [reason, setReason] = useState("Sold");
  const [notes, setNotes] = useState("Customer retail counter sale");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    const qtyNum = Number(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setValidationError("Please enter a valid positive quantity.");
      return;
    }

    if (selectedProduct && selectedProduct.currentStock < qtyNum) {
      setValidationError(`Insufficient stock. Only ${selectedProduct.currentStock} units are available.`);
      addToast(`Insufficient stock. Only ${selectedProduct.currentStock} units are available.`, "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await recordStockOut(
        {
          productId,
          quantity: qtyNum,
          reason,
          notes,
        },
        user
      );
      await refreshData();
      addToast(`Successfully recorded ${reason.toLowerCase()} for ${res.product?.name || "product"}!`);
      setQuantity("1");
    } catch (err: any) {
      const msg = err.message || "Failed to record stock out";
      setValidationError(msg);
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Record Stock Out</h2>
        <p className="text-xs text-slate-400">Log retail sales, damaged items, or inventory dispatches.</p>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm">
        {validationError && (
          <div className="mb-4 p-3 bg-rose-950 border border-rose-900 text-rose-200 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Product</label>
            <select
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setValidationError("");
              }}
              className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-rose-700"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} (Available Stock: {p.currentStock})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="p-3 bg-black rounded-xl border border-slate-800 flex items-center justify-between text-xs text-sky-300">
              <span className="text-slate-400">Current available units:</span>
              <span className="font-mono tabular-nums font-bold text-sm text-white">{selectedProduct.currentStock}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Quantity to Remove</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setValidationError("");
                }}
                className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono tabular-nums focus:outline-hidden focus:border-rose-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-rose-700"
              >
                <option value="Sold" className="bg-slate-900 text-white">Sold</option>
                <option value="Damaged" className="bg-slate-900 text-white">Damaged</option>
                <option value="Other" className="bg-slate-900 text-white">Other</option>
              </select>
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
            className="w-full py-3 px-4 bg-sky-900 hover:bg-sky-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-sky-700"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Stock Out...</span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Confirm Stock Out</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
