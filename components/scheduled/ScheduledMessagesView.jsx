"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function ScheduledMessagesView() {
  const { scheduled, cancelScheduledMessage, triggerScheduledDispatch, selectedRole } = useApp();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessingCron, setIsProcessingCron] = useState(false);

  const handleRunCron = async () => {
    setIsProcessingCron(true);
    await triggerScheduledDispatch();
    setIsProcessingCron(false);
  };

  const isReadOnly = selectedRole === "Viewer";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="CalendarClock" className="w-5 h-5 text-[#D4A017]" />
            Scheduled SMS Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage upcoming automated SMS communications scheduled for future dates and times.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold bg-amber-50 text-amber-800 px-3 py-2 rounded-xl border border-amber-200">
            {scheduled.filter((s) => s.status === "Scheduled").length} Pending Messages
          </div>
          <button
            onClick={handleRunCron}
            disabled={isProcessingCron || isReadOnly}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Check and dispatch due scheduled SMS messages now"
          >
            <Icon name="Play" className="w-3.5 h-3.5 text-amber-400" />
            {isProcessingCron ? "Dispatching..." : "Run Due Dispatches"}
          </button>
        </div>
      </div>

      {/* Scheduled Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Message ID</th>
                <th className="py-3.5 px-4">Message Excerpt</th>
                <th className="py-3.5 px-4">Recipients Target</th>
                <th className="py-3.5 px-4">Scheduled Date & Time</th>
                <th className="py-3.5 px-4">Sender ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {scheduled.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Icon name="CalendarClock" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-slate-700">No scheduled messages</p>
                    <p className="text-xs">There are currently no scheduled SMS dispatches queued.</p>
                  </td>
                </tr>
              ) : (
                scheduled.map((item) => {
                  let statusStyle = "bg-sky-100 text-sky-800 border-sky-200";
                  if (item.status === "Processing") statusStyle = "bg-amber-100 text-amber-800 border-amber-200";
                  if (item.status === "Sent" || item.status === "Dispatched") statusStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
                  if (item.status === "Failed") statusStyle = "bg-rose-100 text-rose-800 border-rose-200";
                  if (item.status === "Cancelled") statusStyle = "bg-slate-100 text-slate-500 border-slate-200";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs font-medium text-slate-900">
                        <div className="line-clamp-2">{item.message}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold whitespace-nowrap">
                        {item.recipientsSummary}
                      </td>
                      <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                        <div className="text-slate-900 font-semibold">{item.scheduledDate}</div>
                        <div className="text-[10px] text-slate-400">{item.scheduledTime}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#006B3F] whitespace-nowrap">
                        {item.senderId}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${statusStyle}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
                        >
                          View
                        </button>

                        {item.status === "Scheduled" && (
                          <button
                            disabled={isReadOnly}
                            onClick={() => cancelScheduledMessage(item.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded text-xs border border-rose-200 disabled:opacity-40"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW SCHEDULED MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017]">Scheduled Dispatch Details</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedItem.id}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-medium">
                <div>
                  <span className="text-amber-700 block text-[11px]">Scheduled Date</span>
                  <span className="font-bold">{selectedItem.scheduledDate}</span>
                </div>
                <div>
                  <span className="text-amber-700 block text-[11px]">Scheduled Time</span>
                  <span className="font-bold">{selectedItem.scheduledTime}</span>
                </div>
                <div>
                  <span className="text-amber-700 block text-[11px]">Sender ID</span>
                  <span className="font-mono font-bold text-[#006B3F]">{selectedItem.senderId}</span>
                </div>
                <div>
                  <span className="text-amber-700 block text-[11px]">Created By</span>
                  <span className="font-bold">{selectedItem.createdBy}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Target Recipients:</label>
                <p className="p-2.5 bg-slate-50 text-slate-800 rounded-lg border font-semibold">{selectedItem.recipientsSummary}</p>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Message Body:</label>
                <div className="p-3 bg-slate-100 text-slate-900 rounded-xl border border-slate-200 leading-relaxed font-sans">
                  {selectedItem.message}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
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
