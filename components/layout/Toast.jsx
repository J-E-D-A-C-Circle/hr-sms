"use client";

import React from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = "bg-emerald-900 border-emerald-700 text-white";
        let iconName = "CheckCircle";

        if (toast.type === "warning") {
          bgClass = "bg-amber-900 border-amber-700 text-amber-50";
          iconName = "AlertTriangle";
        } else if (toast.type === "error") {
          bgClass = "bg-rose-900 border-rose-700 text-rose-50";
          iconName = "XCircle";
        } else if (toast.type === "scheduled") {
          bgClass = "bg-sky-900 border-sky-700 text-sky-50";
          iconName = "CalendarClock";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg shadow-xl border ${bgClass} transition-all duration-300 transform translate-y-0`}
          >
            <div className="flex items-center gap-3">
              <Icon name={iconName} className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 opacity-70 hover:opacity-100 p-1 transition-opacity"
            >
              <Icon name="X" className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
