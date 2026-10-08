import React, { useEffect, useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { fetchUsers, addUserApi, updateUserApi, deleteUserApi } from "../services/api";
import { UserProfile } from "../types";
import { ShieldAlert, Users, History, CheckCircle, Plus, Trash2, Edit2, X, Loader2 } from "lucide-react";

export function UsersManagement() {
  const { auditLogs, addToast } = useInventory();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleInput, setRoleInput] = useState<"manager" | "staff">("staff");
  const [statusInput, setStatusInput] = useState<"Active" | "Inactive">("Active");
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers(user);
      setUsersList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isManager) return;
    loadUsers();
  }, [user, isManager]);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setRoleInput("staff");
    setStatusInput("Active");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: UserProfile) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRoleInput(u.role);
    setStatusInput(u.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingUser) {
        await updateUserApi(editingUser.id, { name, email, role: roleInput, status: statusInput }, user);
        addToast("Staff member updated successfully!");
      } else {
        await addUserApi({ name, email, role: roleInput, status: statusInput }, user);
        addToast("New staff member added successfully!");
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      addToast(err.message || "Failed to save staff member", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, staffName: string) => {
    if (!window.confirm(`Are you sure you want to remove staff member ${staffName}?`)) return;
    try {
      await deleteUserApi(id, user);
      addToast(`Staff member ${staffName} removed successfully.`);
      loadUsers();
    } catch (err: any) {
      addToast(err.message || "Failed to remove staff member", "error");
    }
  };

  if (!isManager) {
    return (
      <div className="bg-rose-950/60 border border-rose-900 p-8 rounded-2xl text-center space-y-3 max-w-lg mx-auto mt-12 text-white">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="font-bold text-white text-lg">Access Restricted</h3>
        <p className="text-xs text-slate-300">
          User management and audit logs are restricted to Manager roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Staff & User Management</h2>
          <p className="text-xs text-slate-400">Add, change, remove staff accounts, permissions, and system audit logs.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center gap-2 cursor-pointer border border-rose-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-rose-400" />
          <span>Active System Users & Staff</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5">Name</th>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900 transition-colors">
                  <td className="py-3 font-semibold text-white">{u.name}</td>
                  <td className="py-3 text-slate-400">{u.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-medium text-[11px] bg-sky-950 text-sky-300 uppercase border border-sky-900">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{u.status}</span>
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 bg-black hover:bg-slate-800 text-sky-300 rounded-lg border border-slate-800 transition-colors cursor-pointer inline-flex"
                      title="Edit Staff"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-1.5 bg-black hover:bg-slate-800 text-rose-400 rounded-lg border border-slate-800 transition-colors cursor-pointer inline-flex"
                      title="Remove Staff"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-950 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-950">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingUser ? "Edit Staff Member" : "Add New Staff Member"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ali Khan"
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
                  placeholder="e.g. ali@nowsheramall.pk"
                  className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Role</label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value as any)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-rose-700"
                  >
                    <option value="staff" className="bg-slate-900 text-white">Staff</option>
                    <option value="manager" className="bg-slate-900 text-white">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-rose-700"
                  >
                    <option value="Active" className="bg-slate-900 text-white">Active</option>
                    <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                  </select>
                </div>
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
                  <span>{editingUser ? "Save Changes" : "Add Staff"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-sky-400" />
          <span>System Audit & Change Log</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5">Timestamp</th>
                <th className="py-2.5">User</th>
                <th className="py-2.5">Action</th>
                <th className="py-2.5">Product</th>
                <th className="py-2.5">Previous → New</th>
                <th className="py-2.5">Source</th>
                <th className="py-2.5">Confirmed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No audit log entries recorded.
                  </td>
                </tr>
              ) : (
                auditLogs.map((al) => (
                  <tr key={al.id} className="hover:bg-slate-900 transition-colors">
                    <td className="py-3 font-mono text-[11px] text-slate-400">{al.timestamp}</td>
                    <td className="py-3 font-medium text-white">{al.user}</td>
                    <td className="py-3 text-slate-300">{al.action}</td>
                    <td className="py-3 font-semibold text-white">{al.productName}</td>
                    <td className="py-3 font-mono tabular-nums text-slate-300">
                      {al.previousValue} → {al.newValue}
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] bg-black text-slate-300 px-1.5 py-0.5 rounded border border-slate-800 font-medium">
                        {al.source}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-emerald-400 font-medium">Yes</span>
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
