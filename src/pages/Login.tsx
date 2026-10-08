import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, UserCheck, ArrowRight, Loader2, Lock, Mail, AlertCircle } from "lucide-react";

export function Login() {
  const { login, switchDemoRole } = useAuth();
  const [selectedPortal, setSelectedPortal] = useState<"manager" | "staff" | null>(null);
  const [loading, setLoading] = useState(false);

  // Manager credentials state
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showManagerModal, setShowManagerModal] = useState(false);

  const handleManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (managerEmail.trim() !== "shayan@gmail.com" || managerPassword !== "s12345") {
      setErrorMsg("Invalid credentials. Please use shayan@gmail.com and password s12345");
      return;
    }

    setSelectedPortal("manager");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      switchDemoRole("manager");
      login("shayan@gmail.com", "manager", "Shayan (Mall Manager)");
    }, 500);
  };

  const handleStaffSignIn = () => {
    setSelectedPortal("staff");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      switchDemoRole("staff");
      login("staff@nowsheramall.pk", "staff", "Bilal (Store Staff)");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-950 border border-rose-800 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            SS
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
          StockSense — Nowshera Shopping Mall
        </h2>
        <p className="mt-1 text-center text-xs text-sky-300">
          Centralized Inventory & AI Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-slate-950 py-8 px-6 shadow-2xl border border-rose-950/60 rounded-3xl sm:px-10">
          <div className="text-center mb-6">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Select Portal Sign-In</h3>
            <p className="text-xs text-slate-400 mt-1">Choose your designated mall portal to sign in.</p>
          </div>

          <div className="space-y-4">
            {!showManagerModal ? (
              <>
                {/* Manager Portal Card */}
                <button
                  onClick={() => setShowManagerModal(true)}
                  disabled={loading}
                  className="w-full group relative p-5 bg-gradient-to-r from-rose-950 via-rose-900 to-black hover:from-rose-900 hover:to-slate-900 text-white rounded-2xl text-left transition-all border border-rose-800/60 shadow-lg cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-900/80 flex items-center justify-center text-sky-200 shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Manager Portal</h4>
                      <p className="text-[11px] text-sky-200 mt-0.5">
                        Exclusive executive access, reports, profit margins, and admin tools
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-sky-300 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Staff Portal Card */}
                <button
                  onClick={handleStaffSignIn}
                  disabled={loading}
                  className="w-full group relative p-5 bg-gradient-to-r from-slate-900 via-sky-950 to-black hover:from-slate-800 hover:to-slate-900 text-white rounded-2xl text-left transition-all border border-sky-800/40 shadow-lg cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-900/80 flex items-center justify-center text-sky-200 shrink-0">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Staff Portal</h4>
                      <p className="text-[11px] text-sky-200 mt-0.5">
                        Floor operations, stock in, stock out, and inventory management
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-sky-300 group-hover:translate-x-1 transition-transform shrink-0">
                    {loading && selectedPortal === "staff" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </button>
              </>
            ) : (
              <form onSubmit={handleManagerSubmit} className="space-y-4 bg-black/60 p-5 rounded-2xl border border-rose-900/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-rose-400" />
                    <h4 className="font-bold text-sm text-white">Manager Authentication</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManagerModal(false)}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Back
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-rose-700 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer border border-rose-700"
                >
                  {loading && selectedPortal === "manager" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>Login to Manager Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Nowshera Shopping Mall · Grand Trunk Road, KPK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
