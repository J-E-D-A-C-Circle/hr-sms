import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: staff, error } = await supabase.from("staff").select("*");
    if (error) throw error;
    return NextResponse.json(staff || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const records = Array.isArray(body) ? body : [body];

    const supabaseStaffRows = records.map((s: any) => ({
      id: s.id || `DVLA-${Math.floor(3000 + Math.random() * 1000)}`,
      name: s.name,
      department: s.department,
      position: s.position,
      region: s.region,
      station: s.station,
      phone: s.phone,
      email: s.email,
      employment_type: s.employmentType || s.employment_type || "Permanent Staff",
      status: s.status || "Active"
    }));

    const { data, error } = await supabase.from("staff").upsert(supabaseStaffRows).select();
    if (error) throw error;

    return NextResponse.json({ success: true, staff: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to insert staff" }, { status: 500 });
  }
}
