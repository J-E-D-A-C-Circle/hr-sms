"use client";

import React, { useEffect } from "react";
import { RefreshCw, AlertTriangle, Home, ArrowLeft, ShieldAlert } from "lucide-react";

export default function Error({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}) {
  useEffect(() => {
    // Log the error to console or error reporting service
    console.error("Application Error:", error);
  }, [error]);

  const handleRetry = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="relative max-w-xl w-full bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-700/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#006B3F] animate-pulse" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              DVLA HR SMS Portal
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            System Exception
          </span>
        </div>

        {/* Error Icon & Title */}
        <div className="text-center space-y-3 pt-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Unexpected System Error Occurred
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The application encountered a problem while rendering this page. You can try refreshing or navigating back to the portal dashboard.
          </p>
        </div>

        {/* Technical Details Box */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/60 font-mono text-xs space-y-2 text-slate-300 overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span>ERROR DIAGNOSTIC</span>
            {error?.digest && <span>REF: {error.digest}</span>}
          </div>
          <p className="text-rose-300 font-semibold break-words">
            {error?.message || "An unhandled execution fault was caught."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full py-3 px-4 rounded-xl bg-[#006B3F] hover:bg-[#005432] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all border border-emerald-600/30"
          >
            <RefreshCw className="w-4 h-4" />
            Reload & Try Again
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="w-full py-3 px-4 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-600/50"
          >
            <Home className="w-4 h-4" />
            Go to Portal Home
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center border-t border-slate-700/50 pt-4 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Driver and Vehicle Licensing Authority</span>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-slate-300 hover:text-white flex items-center gap-1 font-medium hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
