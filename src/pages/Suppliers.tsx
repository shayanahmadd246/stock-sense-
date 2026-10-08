import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { addSupplierApi } from "../services/api";
import { Truck, Plus, Mail, Phone, X, Loader2 } from "lucide-react";

export function Suppliers() {
  const { suppliers, refreshData, addToast } = useInventory();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      addToast("Staff cannot add suppliers.", "error");
      return;
    }
    try {
      setSubmitting(true);
      await addSupplierApi({ name, contact, email }, user);
      await refreshData();
      addToast("Supplier added successfully!");
      setIsModalOpen(false);
      setName("");
      setContact("");
      setEmail("");
    } catch (err: any) {
      addToast(err.message || "Failed to add supplier", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Supplier Directory</h2>
          <p className="text-xs text-slate-400">Manage mall merchandise suppliers and vendors.</p>
        </div>
        {isManager && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center gap-2 cursor-pointer border border-rose-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-rose-950 text-rose-300 rounded-xl border border-rose-900">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-900">
                  {s.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-base">{s.name}</h3>
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>{s.contact}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{s.email}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Supplied Products:</span>
              <span className="font-mono tabular-nums font-bold text-white">{s.suppliedProductsCount} items</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-950 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-950">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add New Supplier</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Peshawar Wholesalers"
                  className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Number</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. info@supplier.pk"
                  className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-black border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 border border-rose-700"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Supplier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
