import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: history, error } = await supabase.from("sms_history").select("*");
    if (error) throw error;
    return NextResponse.json(history || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch SMS history" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newRecord = await request.json();

    const { data, error } = await supabase.from("sms_history").upsert({
      id: newRecord.id,
      date: newRecord.date,
      time: newRecord.time,
      sender: newRecord.sender,
      sender_id: newRecord.senderId || "DVLA-HR",
      message: newRecord.message,
      recipients_summary: newRecord.recipientsSummary,
      recipient_type: newRecord.recipientType,
      type: newRecord.type,
      status: newRecord.status || "Delivered",
      delivered_count: newRecord.deliveredCount || 0,
      failed_count: newRecord.failedCount || 0,
      parts: newRecord.parts || 1,
      total_units: newRecord.totalUnits || 1,
      recipient_logs: JSON.stringify(newRecord.recipientLogs || [])
    }).select();

    if (error) throw error;

    return NextResponse.json({ success: true, history: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log SMS dispatch" }, { status: 500 });
  }
}
