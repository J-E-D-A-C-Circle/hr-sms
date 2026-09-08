import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// In-memory fallback if database table is not created yet
let inMemorySettings = {
  publicRegistrationEnabled: true
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("*")
      .eq("key", "public_registration_enabled")
      .single();

    if (error || !data) {
      return NextResponse.json({
        success: true,
        publicRegistrationEnabled: inMemorySettings.publicRegistrationEnabled
      });
    }

    return NextResponse.json({
      success: true,
      publicRegistrationEnabled: data.value === "true" || data.value === true
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      publicRegistrationEnabled: inMemorySettings.publicRegistrationEnabled
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { enabled } = body;

    const isEnabled = Boolean(enabled);
    inMemorySettings.publicRegistrationEnabled = isEnabled;

    // Persist to Supabase if system_settings table exists
    const { error } = await supabase.from("system_settings").upsert({
      key: "public_registration_enabled",
      value: String(isEnabled),
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.log("Supabase system_settings upsert notice:", error.message);
    }

    return NextResponse.json({
      success: true,
      publicRegistrationEnabled: isEnabled,
      message: `Public Staff Registration Portal is now ${isEnabled ? "ENABLED" : "DISABLED"}`
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update portal settings"
      },
      { status: 500 }
    );
  }
}
