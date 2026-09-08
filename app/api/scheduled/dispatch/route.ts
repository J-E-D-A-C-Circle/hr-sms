import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  return handleDispatchCron();
}

export async function POST() {
  return handleDispatchCron();
}

// Helper to determine if a scheduled item is due for dispatch
function isMessageDue(scheduledDateStr: string, scheduledTimeStr: string, now: Date): boolean {
  if (!scheduledDateStr) return false;

  const nowYYYYMMDD = now.toISOString().split("T")[0]; // e.g. "2026-09-08"

  let itemYYYYMMDD = scheduledDateStr.trim();
  try {
    const d = new Date(scheduledDateStr);
    if (!isNaN(d.getTime())) {
      itemYYYYMMDD = d.toISOString().split("T")[0];
    }
  } catch (e) {}

  // If scheduled date is in the past, it is overdue -> MUST BE DISPATCHED!
  if (itemYYYYMMDD < nowYYYYMMDD) return true;

  // If scheduled date is in the future, it is not due yet.
  if (itemYYYYMMDD > nowYYYYMMDD) return false;

  // If scheduled date is TODAY, check the scheduled time:
  if (!scheduledTimeStr) return true;

  try {
    const timeMatch = scheduledTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : null;

      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      const schedMinutes = hours * 60 + minutes;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      return currentMinutes >= schedMinutes;
    }
  } catch (e) {}

  return true;
}

async function handleDispatchCron() {
  try {
    const { data: pending, error: fetchErr } = await supabase
      .from("scheduled_sms")
      .select("*")
      .eq("status", "Scheduled");

    if (fetchErr) {
      return NextResponse.json({ success: false, error: fetchErr.message }, { status: 500 });
    }

    if (!pending || pending.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending scheduled SMS to dispatch.",
        processedCount: 0
      });
    }

    const now = new Date();
    const todayENGB = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const currentHourMin = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    // Filter messages that are due now or past due
    const dueMessages = pending.filter((item) => {
      const sDate = item.scheduled_date || item.scheduledDate;
      const sTime = item.scheduled_time || item.scheduledTime;
      return isMessageDue(sDate, sTime, now);
    });

    if (dueMessages.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No scheduled messages are due at this moment.",
        processedCount: 0
      });
    }

    // Fetch staff records to retrieve recipient phone numbers
    const { data: staffData } = await supabase.from("staff").select("*");
    const staffList = staffData || [];

    const dispatched = [];

    for (const item of dueMessages) {
      const senderId = item.sender_id || item.senderId || process.env.NEXT_PUBLIC_MNOTIFY_SENDER_ID || "Weskina";
      const messageText = item.message;
      const recipientsText = item.recipients_summary || item.recipientsSummary || "Scheduled Staff Target";

      // Extract specific recipient phones for this scheduled item
      let recipientPhones: string[] = [];
      if (item.recipient_phones) {
        try {
          recipientPhones = typeof item.recipient_phones === "string" ? JSON.parse(item.recipient_phones) : item.recipient_phones;
        } catch (e) {}
      } else if (item.recipientPhones && Array.isArray(item.recipientPhones)) {
        recipientPhones = item.recipientPhones;
      }

      if (!Array.isArray(recipientPhones) || recipientPhones.length === 0) {
        const recType = (item.recipient_type || item.recipientType || "").toLowerCase();
        if (recType.includes("all")) {
          recipientPhones = staffList.map((s) => s.phone).filter(Boolean);
        } else {
          // Resolve specific staff matching recipient summary
          const matchedStaff = staffList.find((s) => (item.recipients_summary || "").includes(s.name) || (item.recipients_summary || "").includes(s.id));
          if (matchedStaff && matchedStaff.phone) {
            recipientPhones = [matchedStaff.phone];
          } else if (staffList.length > 0) {
            recipientPhones = [staffList[0].phone];
          }
        }
      }

      if (recipientPhones.length === 0) {
        recipientPhones = ["0240000000"];
      }

      // Optimistically mark as Processing to prevent parallel execution loops
      await supabase
        .from("scheduled_sms")
        .update({ status: "Processing" })
        .eq("id", item.id);

      // Transmit real SMS via mNotify Enterprise Gateway API
      let mnotifySuccess = true;
      try {
        const apiKey = process.env.MNOTIFY_API_KEY || "JCxSF806JZq1TMUWRCF0maKkI";
        const mnotifyRes = await fetch(`https://api.mnotify.com/api/sms/quick?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: recipientPhones,
            sender: senderId,
            message: messageText,
            is_schedule: false
          })
        });
        const mdata = await mnotifyRes.json();
        mnotifySuccess = mdata?.code === "1000" || mdata?.status === "success" || mnotifyRes.ok;
      } catch (gatewayErr) {
        console.error("mNotify dispatch gateway notice:", gatewayErr);
      }

      // 1. Mark status as "Sent" or "Failed" in scheduled_sms table
      const finalStatus = mnotifySuccess ? "Sent" : "Failed";
      await supabase
        .from("scheduled_sms")
        .update({ status: finalStatus })
        .eq("id", item.id);

      // 2. Insert record into sms_history table
      const historyItem = {
        id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
        date: todayENGB,
        time: currentHourMin,
        sender: item.created_by || item.createdBy || "System Cron",
        sender_id: senderId,
        message: messageText,
        recipients_summary: recipientsText,
        recipient_type: item.recipient_type || item.recipientType || "Scheduled Broadcast",
        type: "Scheduled",
        status: mnotifySuccess ? "Delivered" : "Failed",
        delivered_count: mnotifySuccess ? recipientPhones.length : 0,
        failed_count: mnotifySuccess ? 0 : recipientPhones.length,
        parts: Math.ceil(messageText.length / 160) || 1,
        total_units: recipientPhones.length || 1
      };

      await supabase.from("sms_history").insert(historyItem);
      dispatched.push({ id: item.id, historyId: historyItem.id, message: messageText, status: historyItem.status });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed and dispatched ${dispatched.length} scheduled SMS.`,
      processedCount: dispatched.length,
      dispatched
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Cron dispatch failed" }, { status: 500 });
  }
}
