"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
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
    <html lang="en">
      <head>
        <title>System Error — DVLA HR SMS Portal</title>
      </head>
      <body className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-2xl">
            !
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">System Error Occurred</h1>
            <p className="text-xs text-slate-400">
              An unhandled root application error occurred. Click reload to recover the session.
            </p>
          </div>

          {error?.message && (
            <div className="p-3 bg-slate-900 rounded-xl text-left text-xs font-mono text-rose-300 break-words border border-slate-700">
              {error.message}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleRetry}
              className="w-full py-3 rounded-xl bg-[#006B3F] hover:bg-[#005432] text-white font-bold text-xs transition-colors"
            >
              Reload Portal
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
