"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function DeliveryReportsView() {
  const { stats, addToast } = useApp();
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-03");

  const handleExportReport = () => {
    addToast("Analytics & Delivery Report generated successfully.", "success");
  };

  const maxVolume = Math.max(...stats.dailyVolume.map((d) => d.count)) || 1500;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="BarChart3" className="w-5 h-5 text-[#006B3F]" />
            Delivery & Analytics Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyze SMS message delivery performance, transmission volumes, and carrier failure metrics.
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <Icon name="Calendar" className="w-4 h-4 text-slate-400 ml-1" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none"
            />
            <span className="text-slate-400">—</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
          >
            <Icon name="Download" className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Top Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sent (Period)</span>
          <div className="text-3xl font-extrabold text-slate-900">{stats.monthlySent.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Total SMS units dispatched</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Delivered</span>
          <div className="text-3xl font-extrabold text-emerald-700">17,656</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Icon name="CheckCircle" className="w-3.5 h-3.5" />
            Successful carrier confirmation
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Failed</span>
          <div className="text-3xl font-extrabold text-rose-600">794</div>
          <p className="text-[11px] text-rose-500 font-medium">4.3% carrier drop rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#006B3F] uppercase tracking-wider">Delivery Rate</span>
          <div className="text-3xl font-extrabold text-[#006B3F]">{stats.deliveryRate}%</div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div style={{ width: `${stats.deliveryRate}%` }} className="bg-[#006B3F] h-full"></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Volume Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Icon name="TrendingUp" className="w-4 h-4 text-[#006B3F]" />
                SMS Dispatch Volume Over Time
              </h3>
              <p className="text-xs text-slate-500">Daily message volume trends over the past 7 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border">
              Daily Units
            </span>
          </div>

          {/* Bar Chart Graphics */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 px-2">
              {stats.dailyVolume.map((item, idx) => {
                const heightPercent = Math.round((item.count / maxVolume) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#004D2C] to-[#006B3F] rounded-t-lg group-hover:brightness-125 transition-all shadow-xs"
                    ></div>
                    <span className="text-[11px] font-medium text-slate-500 mt-1 whitespace-nowrap">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Icon name="PieChart" className="w-4 h-4 text-[#006B3F]" />
            Delivery Status Distribution
          </h3>
          <p className="text-xs text-slate-500">Overall message completion percentage</p>

          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006B3F]"></span>
                  Delivered Messages
                </span>
                <span className="text-emerald-700">95.7%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[95.7%] h-full bg-[#006B3F]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Pending Carrier Confirmation
                </span>
                <span className="text-amber-700">1.2%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[1.2%] h-full bg-amber-500"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Failed Dispatches
                </span>
                <span className="text-rose-600">3.1%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[3.1%] h-full bg-rose-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Failure Reason Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Icon name="AlertTriangle" className="w-4 h-4 text-rose-600" />
            Failure Reason Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Top reasons why SMS messages were un-delivered</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Failure Reason Category</th>
                <th className="py-3 px-4">Affected Messages</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats.failureReasons.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.reason}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{item.count} Messages</td>
                  <td className="py-3.5 px-4 font-bold text-rose-600">{item.percentage}</td>
                  <td className="py-3.5 px-4 text-slate-500">Verify staff phone record in Directory</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
