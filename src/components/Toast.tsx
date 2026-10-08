import React from "react";
import { useInventory } from "../context/InventoryContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border text-sm transition-all duration-300 transform translate-y-0 ${
            toast.type === "success"
              ? "bg-slate-950 border-rose-900 text-white"
              : toast.type === "error"
              ? "bg-rose-950 border-rose-800 text-white"
              : "bg-slate-950 border-sky-900 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
            <p className="font-medium text-xs">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
