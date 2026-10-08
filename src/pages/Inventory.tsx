import React, { useState, useMemo } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { Product, safeNum } from "../types";
import { addProductApi } from "../services/api";
import { Search, Filter, Plus, Eye, X, Loader2 } from "lucide-react";

export function Inventory() {
  const { products, refreshData, setActivePage, setSelectedProductId, addToast } = useInventory();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New product form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newSku, setNewSku] = useState("");
  const [newStock, setNewStock] = useState("20");
  const [newMinStock, setNewMinStock] = useState("5");
  const [newSellingPrice, setNewSellingPrice] = useState("1000");
  const [newCostPrice, setNewCostPrice] = useState("750");
  const [newSupplier, setNewSupplier] = useState("Ali Traders");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      addToast("Staff cannot add products.", "error");
      return;
    }
    try {
      setSubmitting(true);
      await addProductApi(
        {
          name: newName,
          category: newCategory,
          sku: newSku,
          currentStock: Number(newStock),
          minStock: Number(newMinStock),
          sellingPrice: Number(newSellingPrice),
          costPrice: Number(newCostPrice),
          supplier: newSupplier,
        },
        user
      );
      await refreshData();
      addToast("Product added successfully!");
      setIsAddModalOpen(false);
      setNewName("");
      setNewSku("");
    } catch (err: any) {
      addToast(err.message || "Failed to add product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Inventory Catalog</h2>
          <p className="text-xs text-slate-400">Manage all store stock, pricing, and stock thresholds.</p>
        </div>
        {isManager && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center gap-2 cursor-pointer border border-rose-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-3 py-2 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-rose-700"
          >
            {categories.map((cat, idx) => (
              <option key={`${cat}-${idx}`} value={cat} className="bg-slate-900 text-white">
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 ml-2">
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-rose-700"
          >
            <option value="All" className="bg-slate-900 text-white">All Status</option>
            <option value="In Stock" className="bg-slate-900 text-white">In Stock</option>
            <option value="Low Stock" className="bg-slate-900 text-white">Low Stock</option>
            <option value="Out of Stock" className="bg-slate-900 text-white">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Min Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Selling Price</th>
                {isManager && <th className="py-3 px-4">Cost Price</th>}
                {isManager && <th className="py-3 px-4">Profit Margin</th>}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={isManager ? 10 : 8} className="py-12 text-center text-slate-500">
                    No products found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => {
                  const sellingPrice = safeNum(p.sellingPrice, 0);
                  const costPrice = safeNum(p.costPrice, 0);
                  const profit = sellingPrice - costPrice;
                  const profitMargin = sellingPrice > 0 ? ((profit / sellingPrice) * 100).toFixed(1) : "0";
                  return (
                    <tr key={`${p.id}-${idx}`} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{p.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{p.category}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-sky-400">{p.sku}</td>
                      <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-white">{safeNum(p.currentStock, 0)}</td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400">{safeNum(p.minStock, 0)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                            p.status === "In Stock"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-900"
                              : p.status === "Low Stock"
                              ? "bg-amber-950 text-amber-300 border border-amber-900"
                              : "bg-rose-950 text-rose-300 border border-rose-900"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums font-medium text-white">
                        PKR {sellingPrice.toLocaleString()}
                      </td>
                      {isManager && (
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400">
                          PKR {costPrice.toLocaleString()}
                        </td>
                      )}
                      {isManager && (
                        <td className="py-3.5 px-4 font-mono tabular-nums text-sky-300 font-semibold">
                          PKR {profit.toLocaleString()} ({profitMargin}%)
                        </td>
                      )}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setActivePage("product-details");
                          }}
                          className="p-1.5 bg-black hover:bg-slate-800 text-sky-300 border border-slate-800 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Manager Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-950 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-950">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add New Product</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Smart Watch"
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-rose-700"
                  >
                    <option value="Electronics" className="bg-slate-900 text-white">Electronics</option>
                    <option value="Grocery" className="bg-slate-900 text-white">Grocery</option>
                    <option value="Clothing" className="bg-slate-900 text-white">Clothing</option>
                    <option value="Household" className="bg-slate-900 text-white">Household</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. ELEC-SW-01"
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Supplier</label>
                  <input
                    type="text"
                    required
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-rose-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums focus:outline-hidden focus:border-rose-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Minimum Stock Alert</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(e.target.value)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums focus:outline-hidden focus:border-rose-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Selling Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newSellingPrice}
                    onChange={(e) => setNewSellingPrice(e.target.value)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums focus:outline-hidden focus:border-rose-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Cost Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newCostPrice}
                    onChange={(e) => setNewCostPrice(e.target.value)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums focus:outline-hidden focus:border-rose-700"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
