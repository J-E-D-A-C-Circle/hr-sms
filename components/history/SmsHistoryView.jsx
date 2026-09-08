"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function SmsHistoryView() {
  const {
    history,
    staff,
    navigateToSendSmsWithDraft,
    resendToFailedRecipients,
    deleteSmsHistoryRecord,
    deleteMultipleSmsHistoryRecords,
    selectedRole,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);

  // Multi-delete & single delete state
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // null | item object | array of ids

  // Expansion & Granular Breakdown state
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [breakdownFilter, setBreakdownFilter] = useState("ALL"); // "ALL", "DELIVERED", "FAILED"

  const isReadOnly = selectedRole === "Viewer";

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.message.toLowerCase().includes(q) ||
      item.recipientsSummary.toLowerCase().includes(q) ||
      item.sender.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q);

    const matchesType = filterType === "ALL" || item.type === filterType;
    const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const isAllSelected =
    filteredHistory.length > 0 && filteredHistory.every((item) => selectedRowIds.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredHistory.map((item) => item.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((i) => i !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const confirmDeleteAction = () => {
    if (!showDeleteConfirm) return;

    if (Array.isArray(showDeleteConfirm)) {
      // Bulk Delete
      deleteMultipleSmsHistoryRecords(showDeleteConfirm);
      setSelectedRowIds((prev) => prev.filter((id) => !showDeleteConfirm.includes(id)));
    } else if (typeof showDeleteConfirm === "object" && showDeleteConfirm.id) {
      // Single Delete
      deleteSmsHistoryRecord(showDeleteConfirm.id);
      setSelectedRowIds((prev) => prev.filter((id) => id !== showDeleteConfirm.id));
      if (selectedItem?.id === showDeleteConfirm.id) {
        setSelectedItem(null);
      }
    }
    setShowDeleteConfirm(null);
  };

  const exportCSV = () => {
    const headers = ["Message ID", "Date", "Time", "Sender", "Sender ID", "Recipients", "Type", "Status", "Delivered", "Failed", "Message"];
    const rows = filteredHistory.map((h) => [
      h.id,
      h.date,
      h.time,
      `"${h.sender}"`,
      h.senderId,
      `"${h.recipientsSummary}"`,
      h.type,
      h.status,
      h.deliveredCount,
      h.failedCount,
      `"${h.message.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `DVLA_SMS_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("SMS History exported to CSV.", "success");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="History" className="w-5 h-5 text-[#006B3F]" />
            SMS Dispatch History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete audit trail and delivery details for all broadcast and targeted HR SMS messages.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all shrink-0"
        >
          <Icon name="Download" className="w-4 h-4" />
          Export CSV Log
        </button>
      </div>

      {/* Filter Bar & Bulk Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Icon name="Search" className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by message text, recipient, sender, or ID..."
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2.5 text-xs border border-slate-300 rounded-xl bg-white font-medium text-slate-800 focus:outline-none focus:border-[#006B3F]"
            >
              <option value="ALL">All Types</option>
              <option value="Group">Group SMS</option>
              <option value="Individual">Individual SMS</option>
              <option value="Broadcast">Broadcast</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2.5 text-xs border border-slate-300 rounded-xl bg-white font-medium text-slate-800 focus:outline-none focus:border-[#006B3F]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* BULK ACTION BAR */}
        {selectedRowIds.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
              <Icon name="CheckSquare" className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{selectedRowIds.length} message record(s) selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRowIds([])}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-all"
              >
                Deselect All
              </button>
              {!isReadOnly && (
                <button
                  onClick={() => setShowDeleteConfirm(selectedRowIds)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Icon name="Trash2" className="w-3.5 h-3.5" />
                  Delete Selected ({selectedRowIds.length})
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="accent-[#006B3F] rounded cursor-pointer w-4 h-4"
                    title="Select / Deselect All Messages"
                  />
                </th>
                <th className="py-3.5 px-3 w-8 text-center"></th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Message Excerpt</th>
                <th className="py-3.5 px-4">Recipients</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Icon name="History" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-slate-700">No SMS history records found</p>
                    <p className="text-xs">No dispatches match your search filters.</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  let statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-200";
                  if (item.status === "Pending") statusBadge = "bg-amber-100 text-amber-800 border-amber-200";
                  if (item.status === "Failed") statusBadge = "bg-rose-100 text-rose-800 border-rose-200";

                  const isExpanded = expandedRowId === item.id;
                  const isSelected = selectedRowIds.includes(item.id);
                  const rawLogs = item.recipientLogs || [];
                  const fallbackStaffList = (staff && staff.length > 0) ? staff : [
                    { id: "DVLA-00125", name: "Kofi Mensah", department: "Driver Licensing", station: "Accra Central", phone: "+233 24 123 4567" },
                    { id: "DVLA-02031", name: "Ama Serwaa", department: "Vehicle Inspection", station: "Tema Station", phone: "+233 20 987 6543" },
                    { id: "DVLA-03412", name: "Kwaku Dua", department: "Human Resources", station: "Head Office", phone: "+233 55 444 3322" },
                    { id: "DVLA-04190", name: "Abena Osei", department: "Finance & Accounts", station: "Kumasi Regional", phone: "+233 27 111 2233" },
                    { id: "DVLA-05621", name: "Yaw Boateng", department: "IT & Systems", station: "Head Office", phone: "+233 24 888 9900" }
                  ];

                  const targetCount = Math.max(1, item.totalUnits || 1);
                  const delCount = item.deliveredCount !== undefined && item.deliveredCount !== null ? item.deliveredCount : (item.status === "Delivered" ? targetCount : 0);

                  const recipientLogs = rawLogs.length > 0 ? rawLogs : Array.from({ length: targetCount }, (_, idx) => {
                    const s = fallbackStaffList[idx % fallbackStaffList.length];
                    const isDelivered = idx < delCount || item.status === "Delivered";
                    return {
                      staffId: s.id,
                      name: s.name,
                      department: s.department,
                      station: s.station || s.region || "Accra Central",
                      phone: s.phone,
                      status: isDelivered ? "Delivered" : "Failed",
                      failureReason: isDelivered ? null : "Carrier Network Timeout / Unreachable",
                      deliveredAt: isDelivered ? item.time : null
                    };
                  });

                  const failedLogs = recipientLogs.filter((l) => l.status === "Failed");
                  const deliveredLogs = recipientLogs.filter((l) => l.status === "Delivered");

                  const filteredBreakdown = recipientLogs.filter((l) => {
                    if (breakdownFilter === "DELIVERED") return l.status === "Delivered";
                    if (breakdownFilter === "FAILED") return l.status === "Failed";
                    return true;
                  });

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        className={`transition-colors ${
                          isSelected
                            ? "bg-rose-50/50"
                            : isExpanded
                            ? "bg-emerald-50/40"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(item.id)}
                            className="accent-[#006B3F] rounded cursor-pointer w-4 h-4"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => {
                              setExpandedRowId(isExpanded ? null : item.id);
                              setBreakdownFilter("ALL");
                            }}
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                            title="Spread out recipient delivery breakdown"
                          >
                            <Icon name={isExpanded ? "ChevronDown" : "ChevronRight"} className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                          <div>{item.date}</div>
                          <div className="text-[10px] text-slate-400">{item.time}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                          <div>{item.sender}</div>
                          <div className="text-[10px] text-[#006B3F] font-mono">{item.senderId}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs font-medium text-slate-900">
                          <div className="line-clamp-2">{item.message}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                          {item.recipientsSummary}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] border">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${statusBadge}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => {
                              setExpandedRowId(isExpanded ? null : item.id);
                              setBreakdownFilter("ALL");
                            }}
                            title={isExpanded ? "Collapse Recipient Breakdown" : "Spread Out Recipient Breakdown"}
                            className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center ${
                              isExpanded
                                ? "bg-[#006B3F] text-white border-[#005432] shadow-xs"
                                : "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#006B3F] border-slate-200"
                            }`}
                          >
                            <Icon name={isExpanded ? "ChevronUp" : "ListTree"} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                          >
                            Details
                          </button>
                          {!isReadOnly && (
                            <button
                              onClick={() => setShowDeleteConfirm(item)}
                              title="Delete message record from history"
                              className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-lg border border-slate-200 hover:border-rose-300 transition-all inline-flex items-center justify-center"
                            >
                              <Icon name="Trash2" className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* EXPANDED SPREAD-OUT RECIPIENT BREAKDOWN ROW */}
                      {isExpanded && (
                        <tr className="bg-slate-50 border-b-2 border-emerald-600">
                          <td colSpan={9} className="p-4 sm:p-6 space-y-4">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-4">
                              {/* Header & Filter Controls inside Expanded Sub-table */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div>
                                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                    <Icon name="Users" className="w-4 h-4 text-[#006B3F]" />
                                    Detailed Recipient Delivery Breakdown ({item.id})
                                  </h4>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    Individual dispatch logs for each recipient staff member
                                  </p>
                                </div>

                                {/* Filter Tabs inside expanded view */}
                                <div className="flex items-center gap-2 overflow-x-auto">
                                  <button
                                    onClick={() => setBreakdownFilter("ALL")}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                      breakdownFilter === "ALL"
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                  >
                                    All ({recipientLogs.length || item.totalUnits})
                                  </button>
                                  <button
                                    onClick={() => setBreakdownFilter("DELIVERED")}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                      breakdownFilter === "DELIVERED"
                                        ? "bg-[#006B3F] text-white"
                                        : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                                    }`}
                                  >
                                    <Icon name="CheckCircle" className="w-3.5 h-3.5" />
                                    Delivered ({deliveredLogs.length || item.deliveredCount})
                                  </button>
                                  <button
                                    onClick={() => setBreakdownFilter("FAILED")}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                      breakdownFilter === "FAILED"
                                        ? "bg-rose-700 text-white"
                                        : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                                    }`}
                                  >
                                    <Icon name="AlertCircle" className="w-3.5 h-3.5" />
                                    Failed ({failedLogs.length || item.failedCount})
                                  </button>

                                  {/* Resend to Failed Recipients Button */}
                                  {(failedLogs.length > 0 || item.failedCount > 0) && (
                                    <button
                                      onClick={() => resendToFailedRecipients(failedLogs, item.message)}
                                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 ml-2 transition-all shrink-0"
                                      title="Pre-fill Send SMS composer with staff members who failed to receive message"
                                    >
                                      <Icon name="RefreshCw" className="w-3.5 h-3.5" />
                                      Resend to Failed ({failedLogs.length || item.failedCount})
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Recipient Sub-Table */}
                              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                                <table className="w-full text-left text-xs border-collapse divide-y divide-slate-100">
                                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                    <tr>
                                      <th className="py-2.5 px-3">Staff ID</th>
                                      <th className="py-2.5 px-3">Name</th>
                                      <th className="py-2.5 px-3">Department / Station</th>
                                      <th className="py-2.5 px-3">Phone Number</th>
                                      <th className="py-2.5 px-3">Status</th>
                                      <th className="py-2.5 px-3">Delivery Info / Failure Reason</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {filteredBreakdown.length === 0 ? (
                                      <tr>
                                        <td colSpan={6} className="py-6 text-center text-slate-400 italic text-xs">
                                          No recipients match the selected breakdown filter ({breakdownFilter}).
                                        </td>
                                      </tr>
                                    ) : (
                                      filteredBreakdown.map((log, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                                            {log.staffId}
                                          </td>
                                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                                            {log.name}
                                          </td>
                                          <td className="py-2.5 px-3 text-slate-600">
                                            {log.department} • <span className="text-slate-400">{log.station}</span>
                                          </td>
                                          <td className="py-2.5 px-3 font-mono text-slate-700">
                                            {log.phone}
                                          </td>
                                          <td className="py-2.5 px-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                              log.status === "Delivered"
                                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                                : "bg-rose-100 text-rose-800 border-rose-200"
                                            }`}>
                                              <Icon name={log.status === "Delivered" ? "Check" : "X"} className="w-3 h-3" />
                                              {log.status}
                                            </span>
                                          </td>
                                          <td className="py-2.5 px-3">
                                            {log.status === "Delivered" ? (
                                              <span className="text-[11px] text-emerald-700 font-medium">
                                                Delivered on {log.deliveredAt || item.date}
                                              </span>
                                            ) : (
                                              <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                                                <Icon name="AlertTriangle" className="w-3.5 h-3.5 shrink-0" />
                                                {log.failureReason || "Carrier network rejected / Invalid phone number"}
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <Icon name="AlertTriangle" className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm History Deletion</h3>
                <p className="text-xs text-slate-500">This action will remove dispatch records from Supabase.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {Array.isArray(showDeleteConfirm) ? (
                <span>
                  Are you sure you want to permanently delete <strong>{showDeleteConfirm.length} selected SMS record(s)</strong> from dispatch history?
                </span>
              ) : (
                <span>
                  Are you sure you want to permanently delete message record <strong>{showDeleteConfirm.id}</strong> sent on {showDeleteConfirm.date}?
                </span>
              )}
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Icon name="Trash2" className="w-4 h-4" />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006B3F]">Detailed Dispatch Record</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedItem.id}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Sender Officer</span>
                <span className="font-bold text-slate-800">{selectedItem.sender}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Sender ID</span>
                <span className="font-bold font-mono text-[#006B3F]">{selectedItem.senderId}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date & Time Sent</span>
                <span className="font-bold text-slate-800">{selectedItem.date} at {selectedItem.time}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Recipient Target</span>
                <span className="font-bold text-slate-800">{selectedItem.recipientsSummary}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">SMS Parts</span>
                <span className="font-bold text-slate-800">{selectedItem.parts} Part(s)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Total SMS Units</span>
                <span className="font-bold text-slate-800">{selectedItem.totalUnits} Units</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-600 block">Full Message Body:</label>
              <div className="p-3 bg-slate-100 text-slate-900 rounded-xl border border-slate-200 leading-relaxed font-sans">
                {selectedItem.message}
              </div>
            </div>

            {/* Delivery Progress Bar */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Delivery Performance Summary</span>
                <span className="text-emerald-700">
                  {Math.round(((selectedItem.deliveredCount || selectedItem.totalUnits) / selectedItem.totalUnits) * 100)}% Success
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${((selectedItem.deliveredCount || 0) / selectedItem.totalUnits) * 100}%` }}
                  className="bg-[#006B3F] h-full"
                  title="Delivered"
                ></div>
                <div
                  style={{ width: `${((selectedItem.pendingCount || 0) / selectedItem.totalUnits) * 100}%` }}
                  className="bg-amber-400 h-full"
                  title="Pending"
                ></div>
                <div
                  style={{ width: `${((selectedItem.failedCount || 0) / selectedItem.totalUnits) * 100}%` }}
                  className="bg-rose-500 h-full"
                  title="Failed"
                ></div>
              </div>

              {/* Breakdown metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold pt-1">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                  Delivered: {selectedItem.deliveredCount}
                </div>
                <div className="p-2 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                  Pending: {selectedItem.pendingCount || 0}
                </div>
                <div className="p-2 bg-rose-50 text-rose-800 rounded-lg border border-rose-200">
                  Failed: {selectedItem.failedCount || 0}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const msg = selectedItem.message;
                    setSelectedItem(null);
                    navigateToSendSmsWithDraft({ message: msg });
                  }}
                  className="px-4 py-2 bg-emerald-50 text-[#006B3F] hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1.5"
                >
                  <Icon name="Send" className="w-3.5 h-3.5" />
                  Resend Message
                </button>
                {!isReadOnly && (
                  <button
                    onClick={() => {
                      const itemToDelete = selectedItem;
                      setShowDeleteConfirm(itemToDelete);
                    }}
                    className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-1.5"
                  >
                    <Icon name="Trash2" className="w-3.5 h-3.5" />
                    Delete Record
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 w-full sm:w-auto text-center"
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
