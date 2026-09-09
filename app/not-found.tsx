"use client";

import React from "react";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#006B3F] flex items-center justify-center">
          <Search className="w-8 h-8 text-[#006B3F]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-[#006B3F] font-bold uppercase tracking-widest">
            404 — Page Not Found
          </span>
          <h1 className="text-2xl font-bold text-white">Resource Unavailable</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested page or resource could not be found on the DVLA HR SMS Portal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="py-3 px-4 rounded-xl bg-[#006B3F] hover:bg-[#005432] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
