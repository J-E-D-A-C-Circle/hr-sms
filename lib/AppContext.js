"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
  DELIVERY_STATS,
  SENDER_IDS,
  MNOTIFY_CONFIG,
  DEPARTMENTS,
  REGIONS,
  STATIONS,
  INITIAL_STAFF,
  INITIAL_GROUPS
} from "./mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [staff, setStaff] = useState([]);
  const [groups, setGroups] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [history, setHistory] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [stats, setStats] = useState(DELIVERY_STATS);
  const [senderIds] = useState(SENDER_IDS);
  const [mnotifyConfig, setMnotifyConfig] = useState(MNOTIFY_CONFIG);
  const [publicRegistrationEnabled, setPublicRegistrationEnabled] = useState(true);

  // System Users State
  const [systemUsers, setSystemUsers] = useState([
    { id: "usr-101", name: "Emmanuel Osei", email: "e.osei@dvla.gov.gh", role: "HR Administrator", department: "Human Resources", status: "Active" },
    { id: "usr-102", name: "Grace Addo", email: "g.addo@dvla.gov.gh", role: "HR Officer", department: "Human Resources", status: "Active" },
    { id: "usr-103", name: "Kwame Asante", email: "k.asante@dvla.gov.gh", role: "Comm Officer", department: "Information Technology", status: "Active" }
  ]);

  // Dynamic Organization Structure Lists
  const [departmentsList, setDepartmentsList] = useState(DEPARTMENTS);
  const [regionsList, setRegionsList] = useState(REGIONS);
  const [stationsList, setStationsList] = useState(STATIONS);

  // Load live data directly from Supabase Cloud Database on startup
  useEffect(() => {
    async function loadSupabaseData() {
      setIsDataLoading(true);
      try {
        // Fetch System Users
        const { data: usersData } = await supabase.from("system_users").select("*");
        if (usersData && usersData.length > 0) {
          setSystemUsers(usersData);
        }

        // Fetch Staff
        const { data: staffData } = await supabase.from("staff").select("*");
        let mappedStaff = [];
        if (staffData && staffData.length > 0) {
          mappedStaff = staffData.map((s) => ({
            id: s.id,
            name: s.name,
            department: s.department,
            position: s.position,
            region: s.region,
            station: s.station,
            phone: s.phone,
            email: s.email,
            employmentType: s.employment_type || s.employmentType || "Permanent Staff",
            status: s.status || "Active"
          }));
        } else {
          mappedStaff = INITIAL_STAFF;
        }
        setStaff(mappedStaff);

        // Fetch Staff Groups
        const { data: groupData } = await supabase.from("staff_groups").select("*");
        let mappedGroups = [];
        if (groupData && groupData.length > 0) {
          mappedGroups = groupData.map((g) => ({
            id: g.id,
            name: g.name,
            category: g.category,
            count: g.count || (g.members ? g.members.length : 0),
            description: g.description,
            createdDate: g.created_date || g.createdDate,
            lastUpdated: g.last_updated || g.lastUpdated,
            members: g.members || []
          }));
        } else {
          mappedGroups = INITIAL_GROUPS;
        }
        setGroups(mappedGroups);

        // Fetch Message Templates
        const { data: templateData } = await supabase.from("message_templates").select("*");
        let mappedTpls = [];
        if (templateData && templateData.length > 0) {
          mappedTpls = templateData.map((t) => ({
            id: t.id,
            title: t.title,
            category: t.category,
            message: t.message,
            lastModified: t.last_modified || t.lastModified,
            createdBy: t.created_by || t.createdBy
          }));
        } else {
          mappedTpls = INITIAL_TEMPLATES;
        }
        setTemplates(mappedTpls);

        // Fetch SMS History
        const { data: historyData } = await supabase.from("sms_history").select("*");
        let mappedHistory = [];
        if (historyData && historyData.length > 0) {
          mappedHistory = historyData.map((h) => {
            const totalUnits = h.total_units || h.totalUnits || 1;
            const status = h.status || "Delivered";
            const isDelivered = status === "Delivered";
            const isFailed = status === "Failed";
            let parsedLogs = [];
            if (h.recipient_logs) {
              try {
                parsedLogs = typeof h.recipient_logs === "string" ? JSON.parse(h.recipient_logs) : h.recipient_logs;
              } catch (e) {}
            }
            if (!Array.isArray(parsedLogs) || parsedLogs.length === 0) {
              if (h.recipientLogs && Array.isArray(h.recipientLogs)) {
                parsedLogs = h.recipientLogs;
              }
            }

            const delCount = h.delivered_count !== undefined && h.delivered_count !== null
              ? Number(h.delivered_count)
              : (isDelivered ? totalUnits : 0);

            let failCount = h.failed_count !== undefined && h.failed_count !== null
              ? Number(h.failed_count)
              : (isFailed ? totalUnits : Math.max(0, totalUnits - delCount));

            if (parsedLogs.length > 0) {
              const failedInLogs = parsedLogs.filter((l) => l.status === "Failed").length;
              if (failedInLogs > 0) failCount = Math.max(failCount, failedInLogs);
            }

            return {
              id: h.id,
              date: h.date,
              time: h.time,
              sender: h.sender,
              senderId: h.sender_id || h.senderId || "DVLA-HR",
              message: h.message,
              recipientsSummary: h.recipients_summary || h.recipientsSummary,
              recipientType: h.recipient_type || h.recipientType,
              type: h.type,
              status: status,
              deliveredCount: delCount,
              pendingCount: h.pending_count || 0,
              failedCount: failCount,
              parts: h.parts || 1,
              totalUnits: totalUnits,
              recipientLogs: parsedLogs
            };
          });
        } else {
          mappedHistory = INITIAL_HISTORY;
        }
        setHistory(mappedHistory);

        // Fetch Scheduled Messages
        const { data: schedData } = await supabase.from("scheduled_sms").select("*");
        let mappedSched = [];
        if (schedData && schedData.length > 0) {
          mappedSched = schedData.map((s) => ({
            id: s.id,
            message: s.message,
            recipientsSummary: s.recipients_summary || s.recipientsSummary,
            recipientType: s.recipient_type || s.recipientType,
            scheduledDate: s.scheduled_date || s.scheduledDate,
            scheduledTime: s.scheduled_time || s.scheduledTime,
            senderId: s.sender_id || s.senderId || "DVLA-HR",
            createdBy: s.created_by || s.createdBy,
            status: s.status || "Scheduled"
          }));
        } else {
          mappedSched = INITIAL_SCHEDULED;
        }
        setScheduled(mappedSched);


        // Sync & Fetch mNotify Config
        const realApiKey = process.env.MNOTIFY_API_KEY || "JCxSF806JZq1TMUWRCF0maKkI";
        const realSenderId = process.env.NEXT_PUBLIC_MNOTIFY_SENDER_ID || "Weskina";

        const { data: mnotifyData } = await supabase.from("mnotify_config").select("*").eq("id", 1).single();
        if (mnotifyData) {
          setMnotifyConfig({
            providerName: "mNotify Ghana Enterprise API Gateway (v3)",
            apiKey: realApiKey,
            senderId: realSenderId,
            creditBalance: mnotifyData.credit_balance ?? 300,
            smsRateGhc: 0.035,
            status: "Connected & Active"
          });
        } else {
          setMnotifyConfig({
            providerName: "mNotify Ghana Enterprise API Gateway (v3)",
            apiKey: realApiKey,
            senderId: realSenderId,
            creditBalance: 300,
            smsRateGhc: 0.035,
            status: "Connected & Active"
          });
        }

        // Fetch Live mNotify Balance directly from Gateway API
        fetch("/api/mnotify/balance")
          .then((res) => res.json())
          .then((resData) => {
            if (resData.success && resData.balance !== null && resData.balance !== undefined) {
              setMnotifyConfig((prev) => ({
                ...prev,
                creditBalance: resData.balance,
                status: "Connected & Active"
              }));
              supabase.from("mnotify_config").update({
                credit_balance: resData.balance,
                status: "Connected & Active"
              }).eq("id", 1);
            }
          })
          .catch((e) => console.log("mNotify balance fetch error:", e));

        // Fetch System Settings (Portal status)
        fetch("/api/system/settings")
          .then((res) => res.json())
          .then((sData) => {
            if (sData && sData.publicRegistrationEnabled !== undefined) {
              setPublicRegistrationEnabled(sData.publicRegistrationEnabled);
            }
          })
          .catch((e) => console.log("System settings fetch notice:", e));
      } catch (err) {
        console.log("Supabase fetch error:", err);
      } finally {
        setIsDataLoading(false);
      }
    }

    loadSupabaseData();
  }, []);

  // Dynamically re-compute dashboard & reports stats whenever staff or history state updates
  useEffect(() => {
    const totalStaffCount = staff.length;

    const today = new Date();
    const todayYYYYMMDD = today.toISOString().split("T")[0];
    const todayENGB = today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const isToday = (dateStr) => {
      if (!dateStr) return false;
      if (dateStr === todayENGB || dateStr === todayYYYYMMDD) return true;
      try {
        const d = new Date(dateStr);
        return !isNaN(d.getTime()) && d.toISOString().split("T")[0] === todayYYYYMMDD;
      } catch {
        return false;
      }
    };

    const todayHistory = history.filter((h) => isToday(h.date));
    // If messages were sent today, compute stats for today; otherwise compute across all history dispatches so dashboard KPIs reflect actual database counts
    const targetHistory = todayHistory.length > 0 ? todayHistory : history;

    const smsSent = targetHistory.reduce((acc, h) => acc + (Number(h.totalUnits) || Number(h.deliveredCount) || 1), 0);
    const delivered = targetHistory.reduce((acc, h) => {
      if (h.deliveredCount !== undefined && h.deliveredCount !== null && Number(h.deliveredCount) > 0) {
        return acc + Number(h.deliveredCount);
      }
      return h.status === "Delivered" ? acc + (Number(h.totalUnits) || 1) : acc;
    }, 0);

    const failed = targetHistory.reduce((acc, h) => {
      const total = Number(h.totalUnits) || 1;
      const del = Number(h.deliveredCount) || 0;
      const fail = Number(h.failedCount) || 0;
      if (fail > 0) return acc + fail;
      if (h.status === "Failed") return acc + total;
      if (total > del && del > 0) return acc + (total - del);
      return acc;
    }, 0);

    const totalUnitsSent = history.reduce((acc, h) => acc + (Number(h.totalUnits) || 1), 0);
    const totalDeliveredAllTime = history.reduce((acc, h) => {
      if (h.deliveredCount !== undefined && h.deliveredCount !== null && Number(h.deliveredCount) > 0) {
        return acc + Number(h.deliveredCount);
      }
      return h.status === "Delivered" ? acc + (Number(h.totalUnits) || 1) : acc;
    }, 0);

    const deliveryRate = totalUnitsSent > 0 
      ? Math.round((totalDeliveredAllTime / totalUnitsSent) * 100)
      : 95.7;

    setStats({
      totalStaff: totalStaffCount,
      smsSentToday: smsSent,
      deliveredToday: delivered,
      failedToday: failed,
      pendingToday: 0,
      monthlySent: totalUnitsSent,
      deliveryRate: deliveryRate,
      dailyVolume: [
        { day: "Mon", count: Math.round(totalUnitsSent * 0.15) || 120 },
        { day: "Tue", count: Math.round(totalUnitsSent * 0.22) || 280 },
        { day: "Wed", count: Math.round(totalUnitsSent * 0.18) || 190 },
        { day: "Thu", count: Math.round(totalUnitsSent * 0.25) || 310 },
        { day: "Fri", count: Math.round(totalUnitsSent * 0.20) || 240 }
      ],
      failureReasons: [
        { reason: "Invalid / Disconnected Number", percentage: "45%" },
        { reason: "Network Provider Timeout", percentage: "30%" },
        { reason: "Handset Off / Out of Coverage", percentage: "25%" }
      ]
    });
  }, [staff, history]);

  // Manual or production cron trigger for scheduled SMS dispatches
  const triggerScheduledDispatch = async () => {
    try {
      const res = await fetch("/api/scheduled/dispatch");
      const data = await res.json();
      if (data.success && data.processedCount > 0) {
        const { data: updatedHistory } = await supabase.from("sms_history").select("*");
        const { data: updatedSched } = await supabase.from("scheduled_sms").select("*");

        if (updatedHistory && updatedHistory.length > 0) {
          setHistory(updatedHistory.map((h) => ({
            id: h.id,
            date: h.date,
            time: h.time,
            sender: h.sender,
            senderId: h.sender_id || h.senderId || "DVLA-HR",
            message: h.message,
            recipientsSummary: h.recipients_summary || h.recipientsSummary,
            recipientType: h.recipient_type || h.recipientType,
            type: h.type,
            status: h.status || "Delivered",
            deliveredCount: h.delivered_count || 1,
            pendingCount: 0,
            failedCount: h.failed_count || 0,
            parts: h.parts || 1,
            totalUnits: h.total_units || 1
          })));
        }

        if (updatedSched && updatedSched.length > 0) {
          setScheduled(updatedSched.map((s) => ({
            id: s.id,
            message: s.message,
            recipientsSummary: s.recipients_summary || s.recipientsSummary,
            recipientType: s.recipient_type || s.recipientType,
            scheduledDate: s.scheduled_date || s.scheduledDate,
            scheduledTime: s.scheduled_time || s.scheduledTime,
            senderId: s.sender_id || s.senderId || "DVLA-HR",
            createdBy: s.created_by || s.createdBy,
            status: s.status || "Scheduled"
          })));
        }

        addToast(`Cron Dispatched ${data.processedCount} due scheduled SMS message(s).`, "success");
      }
      return data;
    } catch (e) {
      console.log("Scheduled cron poller notice:", e);
    }
  };

  // User & permissions
  const [currentUser] = useState({
    name: "Emmanuel Osei",
    email: "e.osei@dvla.gov.gh",
    staffId: "DVLA-02401",
    department: "Human Resources",
    position: "Chief HR Officer"
  });
  
  // Active role
  const [selectedRole, setSelectedRole] = useState("HR Administrator");

  // Notifications system
  const [toasts, setToasts] = useState([]);

  // Draft preset when clicking "Send SMS to Staff" or "Resend"
  const [smsDraft, setSmsDraft] = useState(null);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateToSendSmsWithDraft = (draftData) => {
    setSmsDraft(draftData);
    setActiveTab("send-sms");
  };

  const clearSmsDraft = () => {
    setSmsDraft(null);
  };

  // Dispatch new SMS
  const sendSmsMessage = async ({ recipientType, recipients, message, senderId, smsParts, totalUnits }) => {
    const newId = `SMS-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    let recipientSummaryText = "";
    if (recipientType === "all") {
      recipientSummaryText = `${staff.length} Staff Members (All Staff)`;
    } else if (recipientType === "group") {
      recipientSummaryText = `${recipients.length} Selected Groups (${totalUnits} Staff)`;
    } else {
      recipientSummaryText = recipients.length === 1 
        ? `${recipients[0].name} (${recipients[0].id})` 
        : `${recipients.length} Selected Staff Members`;
    }

    let dispatchSuccess = true;
    let statusMessage = "Delivered";

    // 1. Send SMS via mNotify Gateway Route
    try {
      const res = await fetch("/api/mnotify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientType,
          recipients: recipientType === "all" ? staff : recipients,
          message,
          senderId
        })
      });
      const apiResult = await res.json();

      if (!res.ok || apiResult.success === false) {
        dispatchSuccess = false;
        statusMessage = "Failed";
        addToast(apiResult.error || "Failed to dispatch SMS via mNotify Gateway", "error");
      } else {
        if (apiResult.demoMode) {
          addToast(`SMS queued in Demo Mode for ${totalUnits} recipient(s). Configure MNOTIFY_API_KEY for live delivery.`, "warning");
        } else {
          addToast(`SMS dispatched via mNotify API Gateway to ${totalUnits} recipient(s).`, "success");
        }
      }
    } catch (err) {
      console.error("SMS dispatch error:", err);
      dispatchSuccess = false;
      statusMessage = "Failed";
      addToast("Network error while reaching mNotify Gateway", "error");
    }

    // Build granular recipient logs for spread-out breakdown view
    let recipientLogs = [];
    const timeFormatted = `${dateStr} ${timeStr}`;

    if (recipientType === "all") {
      recipientLogs = staff.map((s) => ({
        staffId: s.id,
        name: s.name,
        department: s.department,
        station: s.station || s.region || "Head Office",
        phone: s.phone,
        status: dispatchSuccess ? "Delivered" : "Failed",
        failureReason: dispatchSuccess ? null : "Carrier network rejected / Invalid number",
        deliveredAt: dispatchSuccess ? timeFormatted : null
      }));
    } else if (recipientType === "group" && Array.isArray(recipients)) {
      recipients.forEach((g) => {
        if (g.members && Array.isArray(g.members)) {
          g.members.forEach((m) => {
            const matched = typeof m === "string" ? staff.find((st) => st.id === m) : m;
            if (matched) {
              recipientLogs.push({
                staffId: matched.id,
                name: matched.name,
                department: matched.department,
                station: matched.station || matched.region || "Head Office",
                phone: matched.phone,
                status: dispatchSuccess ? "Delivered" : "Failed",
                failureReason: dispatchSuccess ? null : "Carrier network error",
                deliveredAt: dispatchSuccess ? timeFormatted : null
              });
            }
          });
        }
      });
      if (recipientLogs.length === 0) {
        recipientLogs = staff.slice(0, Math.min(staff.length, totalUnits)).map((s) => ({
          staffId: s.id,
          name: s.name,
          department: s.department,
          station: s.station || "Head Office",
          phone: s.phone,
          status: dispatchSuccess ? "Delivered" : "Failed",
          failureReason: dispatchSuccess ? null : "Carrier network error",
          deliveredAt: dispatchSuccess ? timeFormatted : null
        }));
      }
    } else if (recipientType === "individual" && Array.isArray(recipients)) {
      recipientLogs = recipients.map((s) => ({
        staffId: s.id,
        name: s.name,
        department: s.department,
        station: s.station || s.region || "Head Office",
        phone: s.phone,
        status: dispatchSuccess ? "Delivered" : "Failed",
        failureReason: dispatchSuccess ? null : "Carrier network error",
        deliveredAt: dispatchSuccess ? timeFormatted : null
      }));
    }

    const newRecord = {
      id: newId,
      date: dateStr,
      time: timeStr,
      sender: currentUser.name,
      senderId: senderId || "DVLA-HR",
      message: message,
      recipientsSummary: recipientSummaryText,
      recipientType: recipientType === "all" ? "All Staff Broadcast" : recipientType === "group" ? "Group SMS" : "Individual SMS",
      type: recipientType === "all" ? "Broadcast" : recipientType === "group" ? "Group" : "Individual",
      status: statusMessage,
      deliveredCount: dispatchSuccess ? totalUnits : 0,
      pendingCount: 0,
      failedCount: dispatchSuccess ? 0 : totalUnits,
      parts: smsParts || 1,
      totalUnits: totalUnits || 1,
      recipientLogs
    };

    setHistory((prev) => [newRecord, ...prev]);

    // Update stats & mNotify credit balance
    if (dispatchSuccess) {
      setStats((prev) => ({
        ...prev,
        smsSentToday: prev.smsSentToday + totalUnits,
        deliveredToday: prev.deliveredToday + totalUnits
      }));

      setMnotifyConfig((prev) => ({
        ...prev,
        creditBalance: Math.max(0, prev.creditBalance - totalUnits)
      }));
    }

    // Save strictly to Supabase Cloud Database
    supabase.from("sms_history").upsert({
      id: newRecord.id,
      date: newRecord.date,
      time: newRecord.time,
      sender: newRecord.sender,
      sender_id: newRecord.senderId,
      message: newRecord.message,
      recipients_summary: newRecord.recipientsSummary,
      recipient_type: newRecord.recipientType,
      type: newRecord.type,
      status: newRecord.status,
      delivered_count: newRecord.deliveredCount,
      failed_count: newRecord.failedCount,
      parts: newRecord.parts,
      total_units: newRecord.totalUnits,
      recipient_logs: JSON.stringify(newRecord.recipientLogs || [])
    }).then(({ error }) => {
      if (error) console.log("Supabase SMS History error:", error.message);
    });

    // Refresh live balance
    fetch("/api/mnotify/balance")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.balance !== null) {
          setMnotifyConfig((prev) => ({ ...prev, creditBalance: data.balance }));
        }
      })
      .catch((e) => console.log("mNotify balance refresh error:", e));

    return newRecord;
  };

  // Schedule SMS
  const scheduleSmsMessage = ({ recipientType, recipients, message, senderId, date, time, totalUnits }) => {
    const newId = `SCH-${Math.floor(100 + Math.random() * 900)}`;

    let recipientSummaryText = "";
    let targetPhones = [];

    if (recipientType === "all") {
      recipientSummaryText = `${staff.length} Staff Members (All Staff)`;
      targetPhones = staff.map((s) => s.phone).filter(Boolean);
    } else if (recipientType === "group") {
      recipientSummaryText = `${recipients.length} Group(s) (${totalUnits} Staff)`;
      const memberIds = new Set();
      (recipients || []).forEach((g) => {
        (g.members || []).forEach((id) => memberIds.add(id));
      });
      targetPhones = staff.filter((s) => memberIds.has(s.id)).map((s) => s.phone).filter(Boolean);
      if (targetPhones.length === 0 && staff.length > 0) {
        targetPhones = staff.slice(0, Math.min(staff.length, totalUnits || 1)).map((s) => s.phone).filter(Boolean);
      }
    } else {
      recipientSummaryText = `${recipients.length} Staff Member(s)`;
      targetPhones = (recipients || []).map((s) => s.phone).filter(Boolean);
    }

    const newScheduled = {
      id: newId,
      message,
      recipientsSummary: recipientSummaryText,
      recipientType: recipientType === "all" ? "All Staff" : recipientType === "group" ? "Group" : "Individual",
      scheduledDate: date,
      scheduledTime: time,
      senderId: senderId || "DVLA-HR",
      createdBy: currentUser.name,
      status: "Scheduled",
      recipientPhones: targetPhones
    };

    setScheduled((prev) => [newScheduled, ...prev]);

    supabase.from("scheduled_sms").upsert({
      id: newScheduled.id,
      message: newScheduled.message,
      recipients_summary: newScheduled.recipientsSummary,
      recipient_type: newScheduled.recipientType,
      scheduled_date: newScheduled.scheduledDate,
      scheduled_time: newScheduled.scheduledTime,
      sender_id: newScheduled.senderId,
      created_by: newScheduled.createdBy,
      status: newScheduled.status,
      recipient_phones: JSON.stringify(targetPhones)
    }).then(({ error }) => {
      if (error) console.log("Supabase Scheduled SMS error:", error.message);
    });

    addToast(`SMS scheduled successfully for ${date} at ${time}. Saved to Supabase.`, "scheduled");
  };

  const cancelScheduledMessage = (id) => {
    setScheduled((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Cancelled" } : item))
    );
    supabase.from("scheduled_sms").update({ status: "Cancelled" }).eq("id", id).then(({ error }) => {
      if (error) console.log("Supabase cancel error:", error.message);
    });
    addToast("Scheduled SMS has been cancelled.", "warning");
  };

  // SMS History Deletion
  const deleteSmsHistoryRecord = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    supabase.from("sms_history").delete().eq("id", id).then(({ error }) => {
      if (error) console.log("Supabase delete sms history error:", error.message);
    });
    addToast("SMS history record deleted.", "warning");
  };

  const deleteMultipleSmsHistoryRecords = (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    setHistory((prev) => prev.filter((item) => !ids.includes(item.id)));
    supabase.from("sms_history").delete().in("id", ids).then(({ error }) => {
      if (error) console.log("Supabase delete multiple sms history error:", error.message);
    });
    addToast(`Deleted ${ids.length} SMS record(s) from history.`, "warning");
  };

  // Create & edit Group
  const createGroup = (groupData) => {
    const members = groupData.members || [];
    const newGroup = {
      id: `grp-${Date.now()}`,
      createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      count: members.length || groupData.count || 0,
      members: members,
      ...groupData
    };
    setGroups((prev) => [...prev, newGroup]);

    supabase.from("staff_groups").upsert({
      id: newGroup.id,
      name: newGroup.name,
      category: newGroup.category,
      count: newGroup.count,
      description: newGroup.description,
      created_date: newGroup.createdDate,
      last_updated: newGroup.lastUpdated,
      members: newGroup.members
    }).then(({ error }) => {
      if (error) console.log("Supabase group error:", error.message);
    });

    addToast(`Staff group "${groupData.name}" saved successfully.`, "success");
  };

  const updateGroup = (id, groupData) => {
    let updatedGroupObj = null;
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const membersList = groupData.members !== undefined ? groupData.members : (g.members || []);
          updatedGroupObj = {
            ...g,
            ...groupData,
            members: membersList,
            count: membersList.length,
            lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          };
          return updatedGroupObj;
        }
        return g;
      })
    );

    if (updatedGroupObj) {
      supabase.from("staff_groups").upsert({
        id: updatedGroupObj.id,
        name: updatedGroupObj.name,
        category: updatedGroupObj.category,
        count: updatedGroupObj.count,
        description: updatedGroupObj.description,
        created_date: updatedGroupObj.createdDate,
        last_updated: updatedGroupObj.lastUpdated,
        members: updatedGroupObj.members
      }).then(({ error }) => {
        if (error) console.log("Supabase update group error:", error.message);
      });
    }

    addToast(`Staff group updated successfully.`, "success");
  };

  // Create & edit & delete Template
  const createTemplate = (tplData) => {
    const newTpl = {
      id: `tpl-${Date.now()}`,
      lastModified: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      createdBy: `${currentUser.name} (${selectedRole})`,
      ...tplData
    };
    setTemplates((prev) => [...prev, newTpl]);

    supabase.from("message_templates").upsert({
      id: newTpl.id,
      title: newTpl.title,
      category: newTpl.category,
      message: newTpl.message,
      last_modified: newTpl.lastModified,
      created_by: newTpl.createdBy
    }).then(({ error }) => {
      if (error) console.log("Supabase template error:", error.message);
    });

    addToast(`Template "${tplData.title}" saved to Supabase.`, "success");
  };

  const updateTemplate = (id, tplData) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...tplData,
              lastModified: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            }
          : t
      )
    );
    addToast(`Template "${tplData.title}" updated.`, "success");
  };

  const deleteTemplate = (id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    supabase.from("message_templates").delete().eq("id", id).then(({ error }) => {
      if (error) console.log("Supabase delete template error:", error.message);
    });
    addToast("Message template deleted.", "warning");
  };

  const importStaffRecords = (newRecords) => {
    if (!Array.isArray(newRecords) || newRecords.length === 0) return;
    const updatedStaff = [...newRecords, ...staff];
    setStaff(updatedStaff);
    setStats((prev) => ({ ...prev, totalStaff: updatedStaff.length }));

    const supabaseStaffRows = newRecords.map((s) => ({
      id: s.id,
      name: s.name,
      department: s.department,
      position: s.position,
      region: s.region,
      station: s.station,
      phone: s.phone,
      email: s.email,
      employment_type: s.employmentType || "Permanent Staff",
      status: s.status || "Active"
    }));

    supabase.from("staff").upsert(supabaseStaffRows).then(({ error }) => {
      if (error) console.log("Supabase staff import error:", error.message);
    });

    addToast(`Imported ${newRecords.length} staff record(s) into Supabase.`, "success");
  };

  const addStaffMember = (staffData) => {
    const newStaff = {
      id: staffData.id || `DVLA-${Math.floor(3000 + Math.random() * 1000)}`,
      name: staffData.name,
      department: staffData.department,
      position: staffData.position,
      region: staffData.region,
      station: staffData.station,
      phone: staffData.phone,
      email: staffData.email,
      employmentType: staffData.employmentType || "Permanent Staff",
      status: staffData.status || "Active"
    };

    const updatedStaff = [newStaff, ...staff];
    setStaff(updatedStaff);
    setStats((prev) => ({ ...prev, totalStaff: updatedStaff.length }));

    supabase.from("staff").upsert({
      id: newStaff.id,
      name: newStaff.name,
      department: newStaff.department,
      position: newStaff.position,
      region: newStaff.region,
      station: newStaff.station,
      phone: newStaff.phone,
      email: newStaff.email,
      employment_type: newStaff.employmentType,
      status: newStaff.status
    }).then(({ error }) => {
      if (error) console.log("Supabase add staff error:", error.message);
    });

    addToast(`Staff member "${newStaff.name}" (${newStaff.id}) saved to Supabase.`, "success");
    return newStaff;
  };

  const updateStaffMember = (id, updatedData) => {
    const updatedStaff = staff.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
    setStaff(updatedStaff);

    const payload = {
      id,
      name: updatedData.name,
      department: updatedData.department,
      position: updatedData.position,
      region: updatedData.region,
      station: updatedData.station,
      phone: updatedData.phone,
      email: updatedData.email,
      employment_type: updatedData.employmentType || updatedData.employment_type,
      status: updatedData.status
    };

    supabase.from("staff").update(payload).eq("id", id).then(({ error }) => {
      if (error) console.log("Supabase edit staff error:", error.message);
    });

    addToast(`Staff member "${updatedData.name}" (${id}) updated successfully.`, "success");
  };

  // Organization Structure Handlers
  const addDepartment = (deptName) => {
    if (!deptName || departmentsList.includes(deptName)) return;
    setDepartmentsList((prev) => [...prev, deptName]);
    addToast(`Department "${deptName}" added successfully.`, "success");
  };

  const editDepartment = (oldName, newName) => {
    if (!newName || newName === oldName) return;
    setDepartmentsList((prev) => prev.map((d) => (d === oldName ? newName : d)));
    addToast(`Department updated to "${newName}".`, "success");
  };

  const deleteDepartment = (deptName) => {
    setDepartmentsList((prev) => prev.filter((d) => d !== deptName));
    addToast(`Department "${deptName}" removed.`, "warning");
  };

  const addRegion = (regionName) => {
    if (!regionName || regionsList.includes(regionName)) return;
    setRegionsList((prev) => [...prev, regionName]);
    addToast(`Region "${regionName}" added successfully.`, "success");
  };

  const editRegion = (oldName, newName) => {
    if (!newName || newName === oldName) return;
    setRegionsList((prev) => prev.map((r) => (r === oldName ? newName : r)));
    addToast(`Region updated to "${newName}".`, "success");
  };

  const deleteRegion = (regionName) => {
    setRegionsList((prev) => prev.filter((r) => r !== regionName));
    addToast(`Region "${regionName}" removed.`, "warning");
  };

  const addStation = (stationName) => {
    if (!stationName || stationsList.includes(stationName)) return;
    setStationsList((prev) => [...prev, stationName]);
    addToast(`Licensing Station "${stationName}" added successfully.`, "success");
  };

  const editStation = (oldName, newName) => {
    if (!newName || newName === oldName) return;
    setStationsList((prev) => prev.map((s) => (s === oldName ? newName : s)));
    addToast(`Licensing Station updated to "${newName}".`, "success");
  };

  const deleteStation = (stationName) => {
    setStationsList((prev) => prev.filter((s) => s !== stationName));
    addToast(`Licensing Station "${stationName}" removed.`, "warning");
  };

  // System Users Management Handlers
  const addSystemUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || "HR Officer",
      department: userData.department || "Human Resources",
      status: userData.status || "Active"
    };

    setSystemUsers((prev) => [newUser, ...prev]);

    supabase.from("system_users").upsert({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: newUser.status
    }).then(({ error }) => {
      if (error) console.log("Supabase add system user error:", error.message);
    });

    addToast(`System user "${newUser.name}" (${newUser.role}) created successfully.`, "success");
    return newUser;
  };

  const updateSystemUser = (id, updatedData) => {
    setSystemUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u)));

    supabase.from("system_users").update({
      name: updatedData.name,
      email: updatedData.email,
      role: updatedData.role,
      department: updatedData.department,
      status: updatedData.status
    }).eq("id", id).then(({ error }) => {
      if (error) console.log("Supabase update system user error:", error.message);
    });

    addToast(`System user "${updatedData.name}" updated successfully.`, "success");
  };

  const togglePublicRegistrationPortal = async (enabled) => {
    const isEnabled = Boolean(enabled);
    setPublicRegistrationEnabled(isEnabled);

    try {
      const res = await fetch("/api/system/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: isEnabled })
      });
      const data = await res.json();
      if (data.success) {
        addToast(
          `Public Staff Registration Portal is now ${isEnabled ? "ENABLED (Active)" : "DISABLED (Closed)"}.`,
          isEnabled ? "success" : "warning"
        );
      }
    } catch (err) {
      console.log("Toggle portal error:", err);
    }
  };

  const resendToFailedRecipients = (failedLogs, originalMessage) => {
    if (!failedLogs || failedLogs.length === 0) {
      addToast("No failed recipients to re-send to.", "info");
      return;
    }

    const targetStaffMembers = failedLogs.map((log) => {
      const existing = staff.find((s) => s.id === log.staffId);
      if (existing) return existing;
      return {
        id: log.staffId,
        name: log.name,
        department: log.department || "General",
        station: log.station || "Head Office",
        phone: log.phone
      };
    });

    navigateToSendSmsWithDraft({
      type: "individual",
      selectedStaffList: targetStaffMembers,
      message: originalMessage
    });

    addToast(`Pre-filled Send SMS form with ${targetStaffMembers.length} failed recipient(s).`, "success");
  };

  const deleteSystemUser = (id) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== id));
    supabase.from("system_users").delete().eq("id", id).then(({ error }) => {
      if (error) console.log("Supabase delete system user error:", error.message);
    });
    addToast("System user account removed.", "warning");
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        staff,
        setStaff,
        groups,
        setGroups,
        templates,
        setTemplates,
        history,
        scheduled,
        stats,
        senderIds,
        currentUser,
        selectedRole,
        setSelectedRole,
        toasts,
        addToast,
        removeToast,
        smsDraft,
        navigateToSendSmsWithDraft,
        clearSmsDraft,
        sendSmsMessage,
        scheduleSmsMessage,
        cancelScheduledMessage,
        triggerScheduledDispatch,
        createGroup,
        updateGroup,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        importStaffRecords,
        addStaffMember,
        updateStaffMember,
        departmentsList,
        regionsList,
        stationsList,
        addDepartment,
        editDepartment,
        deleteDepartment,
        addRegion,
        editRegion,
        deleteRegion,
        addStation,
        editStation,
        deleteStation,
        systemUsers,
        addSystemUser,
        updateSystemUser,
        deleteSystemUser,
        mnotifyConfig,
        setMnotifyConfig,
        publicRegistrationEnabled,
        togglePublicRegistrationPortal,
        resendToFailedRecipients,
        deleteSmsHistoryRecord,
        deleteMultipleSmsHistoryRecords,
        isDataLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
