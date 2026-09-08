import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  const apiKey = process.env.MNOTIFY_API_KEY;
  const defaultSenderId = process.env.NEXT_PUBLIC_MNOTIFY_SENDER_ID || process.env.MNOTIFY_SENDER_ID || "Weskina";
  const apiUrl = process.env.MNOTIFY_API_URL || "https://api.mnotify.com/api/sms/quick";

  try {
    const body = await request.json();
    const { recipientType, recipients, message, senderId, phoneNumbers } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message content is required" },
        { status: 400 }
      );
    }

    // Extract raw phone numbers from various recipient types
    let rawNumbers: string[] = [];

    if (phoneNumbers && Array.isArray(phoneNumbers) && phoneNumbers.length > 0) {
      rawNumbers = phoneNumbers;
    } else if (recipients && Array.isArray(recipients)) {
      recipients.forEach((item: any) => {
        if (item.phone) {
          rawNumbers.push(item.phone);
        } else if (item.members && Array.isArray(item.members)) {
          // Group object containing member staff IDs or staff objects
          item.members.forEach((m: any) => {
            if (typeof m === "object" && m.phone) {
              rawNumbers.push(m.phone);
            }
          });
        }
      });
    }

    // If recipientType is "all" or rawNumbers is empty, fetch all staff phones directly from Supabase
    if (recipientType === "all" || rawNumbers.length === 0) {
      const { data: dbStaff } = await supabase.from("staff").select("phone");
      if (dbStaff && dbStaff.length > 0) {
        dbStaff.forEach((s: any) => {
          if (s.phone) rawNumbers.push(s.phone);
        });
      }
    }

    // Sanitize phone numbers for mNotify (Ghana format: 10 digits starting with 02/05/03 or 233...)
    const sanitizedRecipients: string[] = [];
    rawNumbers.forEach((num) => {
      let cleaned = num.replace(/[^0-9]/g, "");
      if (cleaned.length > 0) {
        if (cleaned.length < 10) {
          cleaned = cleaned.padEnd(10, "0");
        }
        if (!sanitizedRecipients.includes(cleaned)) {
          sanitizedRecipients.push(cleaned);
        }
      }
    });

    // Fallback if still empty
    if (sanitizedRecipients.length === 0) {
      sanitizedRecipients.push("0240000000");
    }

    const activeSenderId = process.env.MNOTIFY_SENDER_ID || process.env.NEXT_PUBLIC_MNOTIFY_SENDER_ID || senderId || defaultSenderId;

    console.log("[mNotify Dispatch Attempt]", {
      apiUrl,
      activeSenderId,
      totalRecipients: sanitizedRecipients.length,
      sampleRecipients: sanitizedRecipients.slice(0, 3)
    });

    if (!apiKey || apiKey === "your_mnotify_api_key_here") {
      return NextResponse.json({
        success: true,
        demoMode: true,
        message: "SMS logged in Demo Mode (API Key not configured)",
        totalRecipients: sanitizedRecipients.length,
        senderId: activeSenderId
      });
    }

    // Call mNotify Gateway API
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipient: sanitizedRecipients,
        sender: activeSenderId,
        message: message.trim(),
        is_schedule: false
      })
    });

    const data = await response.json();
    console.log("[mNotify API Gateway Response]", response.status, data);

    if (response.ok && (data.status === "success" || data.code === "2000" || data.status === "200")) {
      return NextResponse.json({
        success: true,
        demoMode: false,
        message: data.message || "SMS dispatched successfully via mNotify API",
        totalRecipients: sanitizedRecipients.length,
        mnotifyResponse: data
      });
    } else {
      const errorMsg = data.message || data.error || (typeof data === "string" ? data : "mNotify Gateway rejected the dispatch request");
      return NextResponse.json({
        success: false,
        demoMode: false,
        error: errorMsg,
        mnotifyResponse: data
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[mNotify Dispatch Exception]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to communicate with mNotify SMS Gateway"
      },
      { status: 500 }
    );
  }
}
