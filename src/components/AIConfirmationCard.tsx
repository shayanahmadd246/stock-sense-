import React, { useState } from "react";
import { AIStockProposal } from "../types";
import { confirmAIChangeApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";
import { Sparkles, Check, X } from "lucide-react";

interface AIConfirmationCardProps {
  proposal: AIStockProposal;
  onResolved: (successMessage: string) => void;
  onCancelled: () => void;
}

export function AIConfirmationCard({ proposal, onResolved, onCancelled }: AIConfirmationCardProps) {
  const { user } = useAuth();
  const { refreshData, addToast } = useInventory();
  const [loading, setLoading] = useState(false);
  const [resolvedStatus, setResolvedStatus] = useState<"pending" | "confirmed" | "cancelled">("pending");

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await confirmAIChangeApi(proposal, user);
      await refreshData();
      setResolvedStatus("confirmed");
      addToast(res.message || "Stock change successfully confirmed via AI!");
      onResolved(res.message || "Stock change confirmed.");
    } catch (err: any) {
      addToast(err.message || "Failed to confirm stock change", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setResolvedStatus("cancelled");
    addToast("Stock change cancelled.", "info");
    onCancelled();
  };

  if (resolvedStatus === "cancelled") {
    return (
      <div className="my-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
        <X className="w-4 h-4 text-slate-400" />
        <span>Stock change cancelled. No database changes were made.</span>
      </div>
    );
  }

  if (resolvedStatus === "confirmed") {
    return (
      <div className="my-3 p-3 bg-rose-950/60 border border-rose-900 rounded-xl text-xs text-rose-200 flex items-center gap-2">
        <Check className="w-4 h-4 text-rose-400" />
        <span>Stock change confirmed successfully! New stock is <strong>{proposal.newStock}</strong>.</span>
      </div>
    );
  }

  return (
    <div className="my-4 p-4 bg-slate-950 border border-rose-950/80 rounded-2xl shadow-md max-w-md text-white">
      <div className="flex items-center gap-2 mb-3 text-sky-300 font-semibold text-sm">
        <Sparkles className="w-4 h-4 text-rose-400" />
        <span>Stock Change Request (AI Proposed)</span>
      </div>

      <div className="bg-black rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs text-slate-300 mb-4 shadow-2xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Product:</span>
          <span className="font-semibold text-white">{proposal.productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Action:</span>
          <span className="font-medium text-rose-400 capitalize">{proposal.action.replace("_", " ")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Current Stock:</span>
          <span className="font-mono tabular-nums text-white">{proposal.currentStock}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Quantity Change:</span>
          <span className="font-mono tabular-nums text-rose-400 font-bold">+{proposal.quantity}</span>
        </div>
        {proposal.supplier && (
          <div className="flex justify-between">
            <span className="text-slate-400">Supplier:</span>
            <span className="font-medium text-white">{proposal.supplier}</span>
          </div>
        )}
        <div className="pt-1.5 border-t border-slate-800 flex justify-between font-medium">
          <span className="text-white">Resulting Stock:</span>
          <span className="font-mono tabular-nums text-sky-300 font-bold">{proposal.currentStock} → {proposal.newStock}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer border border-rose-700"
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
