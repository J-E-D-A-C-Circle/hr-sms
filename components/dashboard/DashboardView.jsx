"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function DashboardView() {
  const { setActiveTab, stats, history, currentUser, selectedRole, mnotifyConfig } = useApp();
  const [selectedMessage, setSelectedMessage] = useState(null);

  const quickActions = [
    { label: "Send SMS", icon: "Send", tab: "send-sms", desc: "Start individual or bulk SMS", color: "bg-[#006B3F] text-white hover:bg-[#005432]" },
    { label: "Staff Directory", icon: "Users", tab: "staff-directory", desc: "View and search staff members", color: "bg-slate-800 text-white hover:bg-slate-900" },
    { label: "Create Group", icon: "FolderPlus", tab: "staff-groups", desc: "Organize staff into target groups", color: "bg-slate-800 text-white hover:bg-slate-900" },
    { label: "SMS History", icon: "History", tab: "sms-history", desc: "View previously sent messages", color: "bg-slate-800 text-white hover:bg-slate-900" },
    { label: "Schedule SMS", icon: "CalendarClock", tab: "scheduled", desc: "Set future delivery time", color: "bg-[#D4A017] text-slate-950 hover:bg-amber-500 font-semibold" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#004D2C] via-[#006B3F] to-emerald-900 text-white p-6 rounded-2xl shadow-md border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Icon name="MessageSquare" className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#EAB308] text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              {selectedRole} Portal
            </span>
            <span className="text-emerald-200 text-xs font-mono">• mNotify API Connected</span>
            <span className="text-amber-300 text-xs font-bold font-mono">({mnotifyConfig.creditBalance.toLocaleString()} Credits)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Good morning, {currentUser.name}
          </h2>
          <p className="text-emerald-100 text-sm mt-1.5 leading-relaxed">
            Manage and monitor official DVLA staff SMS communications across all regions, departments, and licensing stations nationwide.
          </p>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Staff */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Staff</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#006B3F] flex items-center justify-center">
              <Icon name="Users" className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalStaff.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Active staff registered in system</p>
        </div>

        {/* Card 2: SMS Sent Today */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SMS Sent Today</span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Icon name="Send" className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.smsSentToday.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Dispatched across all channels</p>
        </div>

        {/* Card 3: Delivered */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivered</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="CheckCircle" className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700">{stats.deliveredToday.toLocaleString()}</div>
          <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {stats.deliveryRate}% Success rate
          </p>
        </div>

        {/* Card 4: Failed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failed</span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Icon name="XCircle" className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600">{stats.failedToday.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Requires contact verification</p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Icon name="Zap" className="w-4 h-4 text-[#D4A017]" />
            Quick Actions
          </h3>
          <span className="text-xs text-slate-500 font-medium">Common HR workflows</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(action.tab)}
              className={`p-4 rounded-xl text-left transition-all duration-200 flex flex-col justify-between shadow-xs hover:-translate-y-0.5 ${action.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon name={action.icon} className="w-5 h-5" />
                <Icon name="ArrowRight" className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div>
                <div className="text-xs font-bold">{action.label}</div>
                <div className="text-[11px] opacity-80 mt-0.5 line-clamp-1">{action.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent SMS Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Icon name="Clock" className="w-4 h-4 text-[#006B3F]" />
              Recent Communication Activity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest dispatches sent to DVLA staff members</p>
          </div>
          <button
            onClick={() => setActiveTab("sms-history")}
            className="text-xs font-semibold text-[#006B3F] hover:underline flex items-center gap-1"
          >
            View Full History
            <Icon name="ChevronRight" className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Message Excerpt</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {history.slice(0, 5).map((item) => {
                let statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-200";
                if (item.status === "Pending") statusBadge = "bg-amber-100 text-amber-800 border-amber-200";
                if (item.status === "Failed") statusBadge = "bg-rose-100 text-rose-800 border-rose-200";
                if (item.status === "Scheduled") statusBadge = "bg-sky-100 text-sky-800 border-sky-200";

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      <div>{item.date}</div>
                      <div className="text-[10px] text-slate-400">{item.time}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs font-medium text-slate-900">
                      <div className="line-clamp-2">{item.message}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="font-semibold">{item.recipientsSummary}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] border ${statusBadge}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedMessage(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#006B3F] hover:bg-emerald-50 rounded border border-emerald-200 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006B3F]">Message Details</span>
                <h3 className="text-base font-bold text-slate-900">{selectedMessage.id}</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Sender</span>
                  <span className="font-semibold text-slate-800">{selectedMessage.sender} ({selectedMessage.senderId})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date & Time</span>
                  <span className="font-semibold text-slate-800">{selectedMessage.date} at {selectedMessage.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Recipient Type</span>
                  <span className="font-semibold text-slate-800">{selectedMessage.recipientType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">SMS Units / Parts</span>
                  <span className="font-semibold text-slate-800">{selectedMessage.totalUnits} Units ({selectedMessage.parts} Part)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Full Message Content:</label>
                <div className="p-3 bg-slate-100 text-slate-900 font-sans rounded-xl border border-slate-200 leading-relaxed text-xs">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <Icon name="CheckCircle" className="w-4 h-4 text-emerald-600" />
                  <span>Delivered: {selectedMessage.deliveredCount}</span>
                </div>
                {selectedMessage.failedCount > 0 && (
                  <span className="text-rose-600 font-semibold">Failed: {selectedMessage.failedCount}</span>
                )}
                {selectedMessage.pendingCount > 0 && (
                  <span className="text-amber-600 font-semibold">Pending: {selectedMessage.pendingCount}</span>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
