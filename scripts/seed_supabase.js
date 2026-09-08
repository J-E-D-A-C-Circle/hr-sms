// Node/Bun script to seed Supabase database via JS Client SDK
import { createClient } from "@supabase/supabase-js";
import {
  INITIAL_STAFF,
  INITIAL_GROUPS,
  INITIAL_TEMPLATES,
  INITIAL_HISTORY,
  INITIAL_SCHEDULED,
  MNOTIFY_CONFIG
} from "../lib/mockData.js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes("your-project") || !supabaseKey) {
  console.log("========================================================================");
  console.log("SUPABASE SEEDING NOTICE:");
  console.log("Please update your `.env.local` file with your real Supabase credentials:");
  console.log("NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co");
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>");
  console.log("========================================================================");
  console.log("\nAlternatively, copy the SQL migration script from `supabase/schema.sql` ");
  console.log("and paste it directly into your Supabase Dashboard -> SQL Editor!");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSupabase() {
  console.log("Starting Supabase database seeding...");

  // 1. Seed Staff Directory
  const staffRows = INITIAL_STAFF.map((s) => ({
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

  const { error: staffErr } = await supabase.from("staff").upsert(staffRows);
  if (staffErr) {
    console.error("Staff insert error:", staffErr.message);
  } else {
    console.log(`Seeded ${staffRows.length} staff records into Supabase.`);
  }

  // 2. Seed Staff Groups
  const groupRows = INITIAL_GROUPS.map((g) => ({
    id: g.id,
    name: g.name,
    category: g.category,
    count: g.count || 25,
    description: g.description,
    created_date: g.createdDate,
    last_updated: g.lastUpdated
  }));

  const { error: groupErr } = await supabase.from("staff_groups").upsert(groupRows);
  if (groupErr) console.error("Groups insert error:", groupErr.message);
  else console.log(`Seeded ${groupRows.length} staff groups into Supabase.`);

  // 3. Seed Message Templates
  const templateRows = INITIAL_TEMPLATES.map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    message: t.message,
    last_modified: t.lastModified,
    created_by: t.createdBy
  }));

  const { error: tplErr } = await supabase.from("message_templates").upsert(templateRows);
  if (tplErr) console.error("Templates insert error:", tplErr.message);
  else console.log(`Seeded ${templateRows.length} message templates into Supabase.`);

  // 4. Seed SMS History
  const historyRows = INITIAL_HISTORY.map((h) => ({
    id: h.id,
    date: h.date,
    time: h.time,
    sender: h.sender,
    sender_id: h.senderId || "DVLA-HR",
    message: h.message,
    recipients_summary: h.recipientsSummary,
    recipient_type: h.recipientType,
    type: h.type,
    status: h.status || "Delivered",
    delivered_count: h.deliveredCount || 0,
    parts: h.parts || 1,
    total_units: h.totalUnits || 1
  }));

  const { error: historyErr } = await supabase.from("sms_history").upsert(historyRows);
  if (historyErr) console.error("SMS History insert error:", historyErr.message);
  else console.log(`Seeded ${historyRows.length} SMS history records into Supabase.`);

  // 5. Seed mNotify Config
  const { error: mnotifyErr } = await supabase.from("mnotify_config").upsert({
    id: 1,
    provider_name: MNOTIFY_CONFIG.providerName,
    api_key: MNOTIFY_CONFIG.apiKey,
    sender_id: MNOTIFY_CONFIG.senderId,
    credit_balance: MNOTIFY_CONFIG.creditBalance,
    sms_rate_ghc: MNOTIFY_CONFIG.smsRateGhc,
    status: MNOTIFY_CONFIG.status
  });

  if (mnotifyErr) console.error("mNotify Config insert error:", mnotifyErr.message);
  else console.log("Seeded mNotify configuration into Supabase.");

  console.log("Supabase seeding process finished!");
}

seedSupabase();
