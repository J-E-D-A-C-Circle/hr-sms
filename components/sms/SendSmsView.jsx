"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";
import { DEPARTMENTS, STATIONS, EMPLOYMENT_CATEGORIES } from "@/lib/mockData";

export default function SendSmsView() {
  const {
    staff,
    groups,
    templates,
    senderIds,
    sendSmsMessage,
    scheduleSmsMessage,
    smsDraft,
    clearSmsDraft,
    selectedRole,
    addToast,
    mnotifyConfig
  } = useApp();

  const envSenderId = mnotifyConfig?.senderId || process.env.NEXT_PUBLIC_MNOTIFY_SENDER_ID || "Weskina";

  // State
  const [recipientType, setRecipientType] = useState("group"); // "individual", "group", "all"
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [staffSearchQuery, setStaffSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [senderId, setSenderId] = useState(envSenderId);
  const [sendOption, setSendOption] = useState("now"); // "now", "schedule"
  const todayYYYYMMDD = new Date().toISOString().split("T")[0];
  const [scheduleDate, setScheduleDate] = useState(todayYYYYMMDD);
  const [scheduleTime, setScheduleTime] = useState("09:30 AM");

  // Modals
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isSending, setIsSending] = useState(false);

  // Sync Sender ID from environment / mNotify config
  useEffect(() => {
    if (mnotifyConfig?.senderId) {
      setSenderId(mnotifyConfig.senderId);
    }
  }, [mnotifyConfig?.senderId]);

  // Load draft if passed from another view
  useEffect(() => {
    if (smsDraft) {
      if (smsDraft.type === "individual" && smsDraft.selectedStaffList) {
        setRecipientType("individual");
        setSelectedStaff(smsDraft.selectedStaffList);
      } else if (smsDraft.type === "individual" && smsDraft.staffMember) {
        setRecipientType("individual");
        setSelectedStaff([smsDraft.staffMember]);
      } else if (smsDraft.type === "group" && smsDraft.groupItem) {
        setRecipientType("group");
        setSelectedGroups([smsDraft.groupItem]);
      }
      if (smsDraft.message) {
        setMessageText(smsDraft.message);
      }
      clearSmsDraft();
    }
  }, [smsDraft, clearSmsDraft]);

  // Handle staff search filtering
  const filteredStaff = staff.filter((s) => {
    const q = staffSearchQuery.toLowerCase();
    const isAlreadySelected = selectedStaff.some((sel) => sel.id === s.id);
    if (isAlreadySelected) return false;
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );
  });

  const toggleStaffSelect = (staffMember) => {
    if (selectedStaff.some((s) => s.id === staffMember.id)) {
      setSelectedStaff(selectedStaff.filter((s) => s.id !== staffMember.id));
    } else {
      setSelectedStaff([...selectedStaff, staffMember]);
    }
  };

  const removeStaffSelect = (id) => {
    setSelectedStaff(selectedStaff.filter((s) => s.id !== id));
  };

  const toggleGroupSelect = (groupItem) => {
    if (selectedGroups.some((g) => g.id === groupItem.id)) {
      setSelectedGroups(selectedGroups.filter((g) => g.id !== groupItem.id));
    } else {
      setSelectedGroups([...selectedGroups, groupItem]);
    }
  };

  const removeGroupSelect = (id) => {
    setSelectedGroups(selectedGroups.filter((g) => g.id !== id));
  };

  // Calculations
  const charCount = messageText.length;
  const smsParts = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  let totalRecipientsCount = 0;
  if (recipientType === "all") {
    totalRecipientsCount = staff.length; // 2486 represented
  } else if (recipientType === "group") {
    totalRecipientsCount = selectedGroups.reduce((acc, g) => acc + (g.count || 25), 0);
  } else {
    totalRecipientsCount = selectedStaff.length;
  }

  const estimatedTotalSms = totalRecipientsCount * (smsParts || 1);

  // Apply template
  const handleSelectTemplate = (tpl) => {
    setMessageText(tpl.message);
    setShowTemplateModal(false);
    addToast(`Template "${tpl.title}" applied.`, "success");
  };

  // Trigger Confirmation
  const handleInitiateSend = (e) => {
    e.preventDefault();
    if (totalRecipientsCount === 0) {
      addToast("Please select at least one recipient or group.", "error");
      return;
    }
    if (!messageText.trim()) {
      addToast("Please type a message before sending.", "error");
      return;
    }
    setShowConfirmModal(true);
  };

  // Final Action
  const handleConfirmSubmit = async () => {
    setIsSending(true);
    try {
      if (sendOption === "now") {
        await sendSmsMessage({
          recipientType,
          recipients: recipientType === "individual" ? selectedStaff : selectedGroups,
          message: messageText,
          senderId,
          smsParts,
          totalUnits: totalRecipientsCount
        });
      } else {
        await scheduleSmsMessage({
          recipientType,
          recipients: recipientType === "individual" ? selectedStaff : selectedGroups,
          message: messageText,
          senderId,
          date: scheduleDate,
          time: scheduleTime,
          totalUnits: totalRecipientsCount
        });
      }
      setShowConfirmModal(false);
      // Reset form after sending
      setMessageText("");
      setSelectedStaff([]);
      setSelectedGroups([]);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSending(false);
    }
  };

  const isReadOnly = selectedRole === "Viewer";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="MessageSquare" className="w-5 h-5 text-[#006B3F]" />
            Send Official SMS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Send an official SMS message to individual staff members, selected groups, or organization-wide.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <Icon name="ShieldCheck" className="w-4 h-4 text-[#006B3F]" />
          <span className="text-xs font-semibold text-[#006B3F]">Authorized Sender: {senderId}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Select Recipient Type */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Select Recipient Type
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Individual Option */}
              <button
                type="button"
                onClick={() => setRecipientType("individual")}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  recipientType === "individual"
                    ? "border-[#006B3F] bg-emerald-50/60 ring-2 ring-[#006B3F]/20 text-slate-900"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon name="User" className={`w-5 h-5 ${recipientType === "individual" ? "text-[#006B3F]" : "text-slate-400"}`} />
                  {recipientType === "individual" && <Icon name="CheckCircle" className="w-4 h-4 text-[#006B3F]" />}
                </div>
                <div>
                  <div className="text-xs font-bold">Individual Staff</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Select specific staff members</div>
                </div>
              </button>

              {/* Group Option */}
              <button
                type="button"
                onClick={() => setRecipientType("group")}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  recipientType === "group"
                    ? "border-[#006B3F] bg-emerald-50/60 ring-2 ring-[#006B3F]/20 text-slate-900"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon name="FolderUsers" className={`w-5 h-5 ${recipientType === "group" ? "text-[#006B3F]" : "text-slate-400"}`} />
                  {recipientType === "group" && <Icon name="CheckCircle" className="w-4 h-4 text-[#006B3F]" />}
                </div>
                <div>
                  <div className="text-xs font-bold">Staff Groups</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Send to departments & teams</div>
                </div>
              </button>

              {/* All Staff Broadcast Option */}
              <button
                type="button"
                onClick={() => setRecipientType("all")}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  recipientType === "all"
                    ? "border-[#D4A017] bg-amber-50/80 ring-2 ring-[#D4A017]/30 text-slate-900"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Radio" className={`w-5 h-5 ${recipientType === "all" ? "text-amber-600" : "text-slate-400"}`} />
                  {recipientType === "all" && <Icon name="CheckCircle" className="w-4 h-4 text-amber-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-900">All Staff Broadcast</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Entire organization (2,486)</div>
                </div>
              </button>
            </div>

            {/* Individual Staff Selector Section */}
            {recipientType === "individual" && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700">Search and Select Staff Members:</label>
                <div className="relative">
                  <Icon name="Search" className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={staffSearchQuery}
                    onChange={(e) => setStaffSearchQuery(e.target.value)}
                    placeholder="Search staff by name, staff ID, department or phone number..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#006B3F] bg-white"
                  />
                </div>

                {/* Selected Staff Chips */}
                {selectedStaff.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#006B3F]">
                      <span>{selectedStaff.length} recipient(s) selected</span>
                      <button
                        type="button"
                        onClick={() => setSelectedStaff([])}
                        className="text-[11px] text-rose-600 hover:underline font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStaff.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#006B3F] text-white text-xs font-medium shadow-xs"
                        >
                          {s.name} ({s.id})
                          <button
                            type="button"
                            onClick={() => removeStaffSelect(s.id)}
                            className="hover:text-amber-300 transition-colors"
                          >
                            <Icon name="X" className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Staff Search Results List */}
                <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                  {filteredStaff.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching staff found in directory.
                    </div>
                  ) : (
                    filteredStaff.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => toggleStaffSelect(s)}
                        className="p-2.5 hover:bg-emerald-50/50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-[#006B3F] font-bold text-xs flex items-center justify-center border border-slate-200">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{s.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {s.id} • {s.department} • {s.phone}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-xs font-semibold text-[#006B3F] hover:bg-emerald-100 px-2 py-1 rounded"
                        >
                          + Select
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Staff Group Selector Section */}
            {recipientType === "group" && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700">Select Staff Group(s):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groups.map((g) => {
                    const isSelected = selectedGroups.some((sel) => sel.id === g.id);
                    return (
                      <div
                        key={g.id}
                        onClick={() => toggleGroupSelect(g)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-[#006B3F] bg-emerald-50/80 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{g.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{g.category}</div>
                          <div className="text-xs font-semibold text-[#006B3F] mt-1">
                            {g.count || 25} Staff Members
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            isSelected ? "bg-[#006B3F] text-white" : "border border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Icon name="Check" className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Groups Chips & Summary */}
                {selectedGroups.length > 0 && (
                  <div className="p-3.5 bg-emerald-950 text-white rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#EAB308]">
                      <span>Selected Groups ({selectedGroups.length})</span>
                      <span>Total Staff Recipients: {totalRecipientsCount}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedGroups.map((g) => (
                        <span
                          key={g.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#006B3F] text-white text-xs font-medium border border-emerald-600"
                        >
                          {g.name} ({g.count || 25} Staff)
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGroupSelect(g.id);
                            }}
                            className="hover:text-amber-300"
                          >
                            <Icon name="X" className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* All Staff Notice */}
            {recipientType === "all" && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <Icon name="AlertTriangle" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block">Organization-Wide Broadcast Selected</span>
                  This message will be dispatched to all <strong>2,486 active DVLA staff members</strong> nationwide. Please double check content and obtain administrative authorization.
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Message Composer */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Message Composer
              </label>

              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="px-3 py-1.5 bg-emerald-50 text-[#006B3F] hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 transition-colors"
              >
                <Icon name="FileText" className="w-4 h-4" />
                Use Template
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={5}
                placeholder="Type your official HR SMS message here..."
                disabled={isReadOnly}
                className="w-full p-4 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-sans leading-relaxed text-slate-900 bg-white placeholder-slate-400 shadow-inner"
              />
            </div>

            {/* Character & Part Counters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-4 text-slate-600 font-medium">
                <span>Characters: <strong className="text-slate-900">{charCount} / 160</strong></span>
                <span>•</span>
                <span>SMS Parts: <strong className="text-slate-900">{smsParts}</strong></span>
              </div>

              {smsParts > 1 && (
                <div className="text-amber-700 font-semibold flex items-center gap-1">
                  <Icon name="Info" className="w-4 h-4 text-amber-600" />
                  This message will be sent as {smsParts} SMS parts.
                </div>
              )}
            </div>

            {/* Step 3: Sender ID & Send Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Sender ID (Disabled & locked to env) */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span>Sender ID</span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Icon name="Lock" className="w-3 h-3" /> Env Configured
                  </span>
                </label>
                <div className="relative">
                  <select
                    disabled
                    value={senderId}
                    className="w-full p-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-100 text-slate-700 cursor-not-allowed appearance-none"
                  >
                    <option value={senderId}>
                      {senderId}
                    </option>
                  </select>
                  <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                    <Icon name="Lock" className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Sender ID locked to system environment: <strong className="text-slate-700">{senderId}</strong></p>
              </div>

              {/* Schedule Option Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Delivery Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSendOption("now")}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      sendOption === "now"
                        ? "bg-[#006B3F] text-white border-[#006B3F]"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    Send Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendOption("schedule")}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      sendOption === "schedule"
                        ? "bg-[#D4A017] text-slate-950 border-[#D4A017]"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>

            {/* If Schedule is active, display date & time inputs */}
            {sendOption === "schedule" && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                <div>
                  <label className="text-xs font-bold text-amber-900 block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full p-2 text-xs border border-amber-300 rounded-lg bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-900 block mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full p-2 text-xs border border-amber-300 rounded-lg bg-white font-medium"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live SMS Preview & Action Button */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="Smartphone" className="w-4 h-4 text-[#006B3F]" />
              Live Mobile Preview
            </h3>

            {/* Mobile Phone Mockup */}
            <div className="bg-slate-900 p-4 rounded-3xl shadow-xl border-4 border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-b border-slate-800 pb-2">
                <span>DVLA SECURE SMS</span>
                <span>{senderId}</span>
              </div>

              <div className="bg-slate-800/90 rounded-2xl p-4 text-white text-xs space-y-2 border border-slate-700 shadow-inner min-h-36 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] text-[#EAB308] font-bold uppercase tracking-wider">
                    From: {senderId}
                  </div>
                  <p className="text-slate-100 font-sans leading-relaxed break-words whitespace-pre-wrap">
                    {messageText || "Your SMS text preview will appear here as you type..."}
                  </p>
                </div>
                <div className="text-[9px] text-slate-400 text-right pt-2 border-t border-slate-700">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Message Dispatch Summary Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>Dispatch Summary</span>
                <span className="text-[10px] text-[#006B3F] font-bold">mNotify API</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sender ID:</span>
                <span className="font-semibold text-slate-900">{senderId}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Recipients Count:</span>
                <span className="font-bold text-[#006B3F]">{totalRecipientsCount} Staff</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SMS Parts:</span>
                <span className="font-semibold text-slate-900">{smsParts}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200 text-sm font-bold">
                <span>Estimated Total Units:</span>
                <span className="text-[#006B3F]">{estimatedTotalSms} SMS</span>
              </div>
            </div>

            {/* Action Send / Schedule Button */}
            <button
              type="button"
              disabled={isReadOnly || isSending}
              onClick={handleInitiateSend}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                sendOption === "schedule"
                  ? "bg-[#D4A017] hover:bg-amber-500 text-slate-950"
                  : "bg-[#006B3F] hover:bg-[#005432] text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon name={sendOption === "schedule" ? "CalendarClock" : "Send"} className="w-4 h-4" />
              {isSending ? "Processing..." : sendOption === "schedule" ? "Schedule SMS Message" : "Send SMS Message"}
            </button>

            {isReadOnly && (
              <p className="text-[11px] text-center text-rose-600 font-semibold">
                (Read-Only Mode: Switch role to HR Admin or HR Officer to send)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* TEMPLATE SELECTION MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="FileText" className="w-5 h-5 text-[#006B3F]" />
                  Select Predefined HR Template
                </h3>
                <p className="text-xs text-slate-500">Choose a template to quickly populate the composer</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#006B3F] hover:bg-emerald-50/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#006B3F]">{tpl.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{tpl.message}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION BEFORE SENDING MODAL (STRICT SAFETY REQUIREMENTS) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${recipientType === "all" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-[#006B3F]"}`}>
                <Icon name={sendOption === "schedule" ? "CalendarClock" : "AlertCircle"} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {sendOption === "schedule" ? "Confirm SMS Schedule" : "Confirm SMS Dispatch"}
                </h3>
                <p className="text-xs text-slate-500">Verify details before broadcasting to staff</p>
              </div>
            </div>

            {/* Safety details breakdown */}
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">RECIPIENT TARGET:</span>
                  <span className="font-bold text-slate-900">
                    {recipientType === "all" ? "All DVLA Staff Nationwide" : recipientType === "group" ? `${selectedGroups.length} Selected Groups` : `${selectedStaff.length} Selected Staff`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">TOTAL RECIPIENTS:</span>
                  <span className="font-extrabold text-[#006B3F] text-sm">{totalRecipientsCount} Staff Members</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">SENDER ID:</span>
                  <span className="font-bold text-slate-900">{senderId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold text-slate-500">SMS CARRIER ROUTE:</span>
                  <span className="font-bold text-emerald-700">mNotify Ghana Enterprise API</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">DISPATCH TIMING:</span>
                  <span className="font-bold text-slate-900">
                    {sendOption === "schedule" ? `Scheduled for ${scheduleDate} at ${scheduleTime}` : "Immediate Dispatch"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">MESSAGE CONTENT PREVIEW:</label>
                <div className="p-3 bg-slate-100 text-slate-900 rounded-xl border border-slate-200 italic leading-relaxed text-xs">
                  "{messageText}"
                </div>
              </div>

              {/* Warning box if large broadcast */}
              {totalRecipientsCount > 100 && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <Icon name="AlertTriangle" className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    Warning: You are broadcasting to <strong>{totalRecipientsCount} staff members</strong>. This action will incur <strong>{estimatedTotalSms} SMS units</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 disabled:opacity-50"
              >
                Cancel & Review
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={handleConfirmSubmit}
                className="px-5 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Icon name={isSending ? "RefreshCw" : "Check"} className={`w-4 h-4 ${isSending ? "animate-spin" : ""}`} />
                {isSending ? "Dispatching SMS..." : "Confirm & Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
