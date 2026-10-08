import React from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, ShieldCheck } from "lucide-react";

export function Settings() {
  const { aiUnavailable, setAiUnavailable, addToast } = useInventory();
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">System Settings & Test Controls</h2>
        <p className="text-xs text-slate-400">Configure preferences and test application failure scenarios (e.g., Test 5).</p>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-rose-400" />
            <span>AI Assistant Unavailability Simulator (Test 5)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Toggle this switch to simulate an AI API failure. When enabled, the AI chat will gracefully show &quot;AI Assistant is currently unavailable&quot; while normal stock forms continue working without crashing.
          </p>

          <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-white">Simulate AI API Failure</p>
              <p className="text-[11px] text-slate-400">Current AI status: {aiUnavailable ? "Unavailable (Simulated)" : "Online / Normal"}</p>
            </div>
            <button
              onClick={() => {
                const next = !aiUnavailable;
                setAiUnavailable(next);
                addToast(next ? "AI Failure simulation activated." : "AI Assistant restored.", next ? "error" : "success");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                aiUnavailable
                  ? "bg-rose-950 border-rose-800 text-rose-200 shadow-xs"
                  : "bg-slate-900 border-slate-700 hover:bg-slate-800 text-white"
              }`}
            >
              {aiUnavailable ? "Disable Simulation" : "Enable Simulation"}
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Mall Information</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-300 bg-black p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Mall Name:</span>
              <span className="font-semibold text-white">Nowshera Shopping Mall</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-white">Grand Trunk Road, Nowshera, KPK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Logged User:</span>
              <span className="font-semibold text-rose-400">{user?.name} ({user?.role})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
