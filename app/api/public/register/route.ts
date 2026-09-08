import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    // 1. Check if public registration is enabled
    let isPortalEnabled = true;
    try {
      const settingsRes = await fetch(new URL("/api/system/settings", request.url).toString(), {
        cache: "no-store"
      });
      const settingsData = await settingsRes.json();
      if (settingsData && settingsData.publicRegistrationEnabled !== undefined) {
        isPortalEnabled = settingsData.publicRegistrationEnabled;
      }
    } catch (e) {
      console.log("Portal status check notice:", e);
    }

    if (!isPortalEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: "The Public Staff Registration Portal is currently disabled by DVLA HR Administration."
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      name,
      department,
      position,
      region,
      station,
      phone,
      email,
      employmentType,
      status
    } = body;

    // Basic Validation
    if (!id || !id.trim()) {
      return NextResponse.json({ success: false, error: "Staff ID is required (e.g. DVLA-01234)" }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Full Name is required" }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ success: false, error: "Phone Number is required" }, { status: 400 });
    }

    const staffIdClean = id.trim().toUpperCase();
    const formattedPhone = phone.trim();
    const activeStatus = status || "Active";

    const newStaffRecord = {
      id: staffIdClean,
      name: name.trim(),
      department: department || "General",
      position: position || "Staff Member",
      region: region || "Greater Accra",
      station: station || "Head Office (14th Ave, Accra)",
      phone: formattedPhone,
      email: email ? email.trim() : `${staffIdClean.toLowerCase()}@dvla.gov.gh`,
      employment_type: employmentType || "Permanent Staff",
      status: activeStatus,
      created_at: new Date().toISOString()
    };

    // Save strictly to Supabase Cloud Database `staff` table
    const { data, error } = await supabase.from("staff").upsert({
      id: newStaffRecord.id,
      name: newStaffRecord.name,
      department: newStaffRecord.department,
      position: newStaffRecord.position,
      region: newStaffRecord.region,
      station: newStaffRecord.station,
      phone: newStaffRecord.phone,
      email: newStaffRecord.email,
      employment_type: newStaffRecord.employment_type,
      status: newStaffRecord.status
    }).select();

    if (error) {
      console.log("Supabase staff insert error:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Staff member registered successfully!",
      staff: {
        ...newStaffRecord,
        employmentType: newStaffRecord.employment_type
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process staff registration"
      },
      { status: 500 }
    );
  }
}
