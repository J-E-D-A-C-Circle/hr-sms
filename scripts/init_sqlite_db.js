// Script to force-create the physical SQLite .db file for DB Browser for SQLite
import { Database } from "bun:sqlite";
import path from "path";
import fs from "fs";
import {
  INITIAL_STAFF,
  INITIAL_GROUPS,
  INITIAL_TEMPLATES,
  INITIAL_HISTORY,
  INITIAL_SCHEDULED,
  MNOTIFY_CONFIG
} from "../lib/mockData.js";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DB_DIR, "dvla_staff_sms.db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

console.log("Initializing SQLite binary file at:", DB_FILE_PATH);

const db = new Database(DB_FILE_PATH);

db.run(`
  CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT,
    position TEXT,
    region TEXT,
    station TEXT,
    phone TEXT,
    email TEXT,
    employmentType TEXT,
    status TEXT
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS staff_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    count INTEGER,
    description TEXT,
    createdDate TEXT,
    lastUpdated TEXT
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS message_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    message TEXT NOT NULL,
    lastModified TEXT,
    createdBy TEXT
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS sms_history (
    id TEXT PRIMARY KEY,
    date TEXT,
    time TEXT,
    sender TEXT,
    senderId TEXT,
    message TEXT,
    recipientsSummary TEXT,
    recipientType TEXT,
    type TEXT,
    status TEXT,
    deliveredCount INTEGER,
    pendingCount INTEGER,
    failedCount INTEGER,
    parts INTEGER,
    totalUnits INTEGER
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS scheduled_sms (
    id TEXT PRIMARY KEY,
    message TEXT,
    recipientsSummary TEXT,
    recipientType TEXT,
    scheduledDate TEXT,
    scheduledTime TEXT,
    senderId TEXT,
    createdBy TEXT,
    status TEXT
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS mnotify_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    providerName TEXT,
    apiKey TEXT,
    senderId TEXT,
    creditBalance INTEGER,
    smsRateGhc REAL,
    status TEXT
  );
`);

// Insert Staff
const insertStaff = db.prepare(`
  INSERT OR REPLACE INTO staff (id, name, department, position, region, station, phone, email, employmentType, status)
  VALUES ($id, $name, $department, $position, $region, $station, $phone, $email, $employmentType, $status)
`);

for (const s of INITIAL_STAFF) {
  insertStaff.run({
    $id: s.id,
    $name: s.name,
    $department: s.department,
    $position: s.position,
    $region: s.region,
    $station: s.station,
    $phone: s.phone,
    $email: s.email,
    $employmentType: s.employmentType,
    $status: s.status
  });
}

// Insert Groups
const insertGroup = db.prepare(`
  INSERT OR REPLACE INTO staff_groups (id, name, category, count, description, createdDate, lastUpdated)
  VALUES ($id, $name, $category, $count, $description, $createdDate, $lastUpdated)
`);

for (const g of INITIAL_GROUPS) {
  insertGroup.run({
    $id: g.id,
    $name: g.name,
    $category: g.category,
    $count: g.count || 25,
    $description: g.description,
    $createdDate: g.createdDate,
    $lastUpdated: g.lastUpdated
  });
}

// Insert Templates
const insertTpl = db.prepare(`
  INSERT OR REPLACE INTO message_templates (id, title, category, message, lastModified, createdBy)
  VALUES ($id, $title, $category, $message, $lastModified, $createdBy)
`);

for (const t of INITIAL_TEMPLATES) {
  insertTpl.run({
    $id: t.id,
    $title: t.title,
    $category: t.category,
    $message: t.message,
    $lastModified: t.lastModified,
    $createdBy: t.createdBy
  });
}

// Insert History
const insertHistory = db.prepare(`
  INSERT OR REPLACE INTO sms_history (id, date, time, sender, senderId, message, recipientsSummary, recipientType, type, status, deliveredCount, pendingCount, failedCount, parts, totalUnits)
  VALUES ($id, $date, $time, $sender, $senderId, $message, $recipientsSummary, $recipientType, $type, $status, $deliveredCount, $pendingCount, $failedCount, $parts, $totalUnits)
`);

for (const h of INITIAL_HISTORY) {
  insertHistory.run({
    $id: h.id,
    $date: h.date,
    $time: h.time,
    $sender: h.sender,
    $senderId: h.senderId,
    $message: h.message,
    $recipientsSummary: h.recipientsSummary,
    $recipientType: h.recipientType,
    $type: h.type,
    $status: h.status,
    $deliveredCount: h.deliveredCount,
    $pendingCount: h.pendingCount || 0,
    $failedCount: h.failedCount || 0,
    $parts: h.parts || 1,
    $totalUnits: h.totalUnits || 1
  });
}

// Insert mNotify config
db.run(`
  INSERT OR REPLACE INTO mnotify_config (id, providerName, apiKey, senderId, creditBalance, smsRateGhc, status)
  VALUES (1, '${MNOTIFY_CONFIG.providerName}', '${MNOTIFY_CONFIG.apiKey}', '${MNOTIFY_CONFIG.senderId}', ${MNOTIFY_CONFIG.creditBalance}, ${MNOTIFY_CONFIG.smsRateGhc}, '${MNOTIFY_CONFIG.status}')
`);

console.log("SQLite binary database successfully populated!");
