import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: staff } = await supabase.from("staff").select("*");
    const { data: groups } = await supabase.from("staff_groups").select("*");
    const { data: templates } = await supabase.from("message_templates").select("*");
    const { data: history } = await supabase.from("sms_history").select("*");
    const { data: scheduled } = await supabase.from("scheduled_sms").select("*");
    const { data: mnotifyConfig } = await supabase.from("mnotify_config").select("*").eq("id", 1).single();

    return NextResponse.json({
      driver: "Supabase Cloud PostgreSQL",
      staff: staff || [],
      groups: groups || [],
      templates: templates || [],
      history: history || [],
      scheduled: scheduled || [],
      mnotifyConfig: mnotifyConfig || null,
      stats: {
        totalStaff: (staff || []).length,
        smsSentToday: (history || []).reduce((acc, h) => acc + (h.total_units || 0), 0),
        deliveredToday: (history || []).reduce((acc, h) => acc + (h.delivered_count || 0), 0),
        failedToday: 0,
        pendingToday: 0,
        monthlySent: 18450,
        deliveryRate: 95.7
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from Supabase Cloud" }, { status: 500 });
  }
}
