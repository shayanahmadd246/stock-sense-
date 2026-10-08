import React from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Mail, Briefcase } from "lucide-react";

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto space-y-6 text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">User Profile</h2>
        <p className="text-xs text-slate-400">Authenticated staff or manager account credentials.</p>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-rose-950 border border-rose-800 text-rose-300 font-bold text-2xl flex items-center justify-center shadow-md">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{user?.name}</h3>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 uppercase tracking-wide border border-rose-800">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-slate-800">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" />
              Email Address:
            </span>
            <span className="font-semibold text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-slate-800">
            <span className="text-slate-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-sky-400" />
              Assigned Location:
            </span>
            <span className="font-semibold text-white">Nowshera Shopping Mall (Main Branch)</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-slate-800">
            <span className="text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Account Status:
            </span>
            <span className="font-semibold text-emerald-400">{user?.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
