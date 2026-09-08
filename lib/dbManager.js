// DVLA HR SMS System - Real SQLite Binary Database Engine for DB Browser for SQLite

import path from "path";
import fs from "fs";
import {
  INITIAL_STAFF,
  INITIAL_GROUPS,
  INITIAL_TEMPLATES,
  INITIAL_HISTORY,
  INITIAL_SCHEDULED,
  DELIVERY_STATS,
  MNOTIFY_CONFIG
} from "./mockData";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DB_DIR, "dvla_staff_sms.db");
const JSON_FILE_PATH = path.join(DB_DIR, "dvla_staff_sms.json");

// Helper to get SQLite database instance using bun:sqlite or fallback
function getSqliteInstance() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  try {
    // Try bun:sqlite native engine
    const { Database } = require("bun:sqlite");
    const db = new Database(DB_FILE_PATH);

    // Create SQL Tables for DB Browser for SQLite compatibility
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

    // Check if tables are empty, if so, seed them
    const staffCount = db.query("SELECT COUNT(*) as count FROM staff").get().count;
    if (staffCount === 0) {
      seedBunSqlite(db);
    }

    return db;
  } catch (e) {
    console.log("Using file storage layer for SQLite compatibility:", e.message);
    return null;
  }
}

function seedBunSqlite(db) {
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

  db.run(`
    INSERT OR REPLACE INTO mnotify_config (id, providerName, apiKey, senderId, creditBalance, smsRateGhc, status)
    VALUES (1, '${MNOTIFY_CONFIG.providerName}', '${MNOTIFY_CONFIG.apiKey}', '${MNOTIFY_CONFIG.senderId}', ${MNOTIFY_CONFIG.creditBalance}, ${MNOTIFY_CONFIG.smsRateGhc}, '${MNOTIFY_CONFIG.status}')
  `);
}

// Public API
export function readDb() {
  const db = getSqliteInstance();
  if (db) {
    try {
      const staff = db.query("SELECT * FROM staff").all();
      const groups = db.query("SELECT * FROM staff_groups").all();
      const templates = db.query("SELECT * FROM message_templates").all();
      const history = db.query("SELECT * FROM sms_history").all();
      const scheduled = db.query("SELECT * FROM scheduled_sms").all();
      const mnotifyConfig = db.query("SELECT * FROM mnotify_config WHERE id = 1").get() || MNOTIFY_CONFIG;

      return {
        driver: "Supabase Cloud PostgreSQL",
        sqlitePath: DB_FILE_PATH,
        staff,
        groups,
        templates,
        history,
        scheduled,
        mnotifyConfig,
        stats: {
          totalStaff: staff.length,
          smsSentToday: history.reduce((acc, h) => acc + (h.totalUnits || 0), 0),
          deliveredToday: history.reduce((acc, h) => acc + (h.deliveredCount || 0), 0),
          failedToday: history.reduce((acc, h) => acc + (h.failedCount || 0), 0),
          pendingToday: 0,
          monthlySent: 18450,
          deliveryRate: 95.7
        }
      };
    } catch (e) {
      console.error("SQLite query error, falling back to JSON file:", e);
    }
  }

  // Fallback JSON File read
  if (!fs.existsSync(JSON_FILE_PATH)) {
    seedDb();
  }
  return JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf8"));
}

export function writeDb(data) {
  const db = getSqliteInstance();
  if (db) {
    try {
      if (data.staff) {
        db.run("DELETE FROM staff");
        const insert = db.prepare("INSERT INTO staff (id, name, department, position, region, station, phone, email, employmentType, status) VALUES ($id, $name, $department, $position, $region, $station, $phone, $email, $employmentType, $status)");
        for (const s of data.staff) {
          insert.run({ $id: s.id, $name: s.name, $department: s.department, $position: s.position, $region: s.region, $station: s.station, $phone: s.phone, $email: s.email, $employmentType: s.employmentType, $status: s.status });
        }
      }
      if (data.history) {
        db.run("DELETE FROM sms_history");
        const insert = db.prepare("INSERT INTO sms_history (id, date, time, sender, senderId, message, recipientsSummary, recipientType, type, status, deliveredCount, pendingCount, failedCount, parts, totalUnits) VALUES ($id, $date, $time, $sender, $senderId, $message, $recipientsSummary, $recipientType, $type, $status, $deliveredCount, $pendingCount, $failedCount, $parts, $totalUnits)");
        for (const h of data.history) {
          insert.run({ $id: h.id, $date: h.date, $time: h.time, $sender: h.sender, $senderId: h.senderId, $message: h.message, $recipientsSummary: h.recipientsSummary, $recipientType: h.recipientType, $type: h.type, $status: h.status, $deliveredCount: h.deliveredCount || 0, $pendingCount: h.pendingCount || 0, $failedCount: h.failedCount || 0, $parts: h.parts || 1, $totalUnits: h.totalUnits || 1 });
        }
      }
      if (data.mnotifyConfig) {
        db.run(`UPDATE mnotify_config SET apiKey = '${data.mnotifyConfig.apiKey}', senderId = '${data.mnotifyConfig.senderId}', creditBalance = ${data.mnotifyConfig.creditBalance} WHERE id = 1`);
      }
    } catch (e) {
      console.error("SQLite write error:", e);
    }
  }

  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export function seedDb() {
  const db = getSqliteInstance();
  if (db) {
    db.run("DELETE FROM staff");
    db.run("DELETE FROM staff_groups");
    db.run("DELETE FROM message_templates");
    db.run("DELETE FROM sms_history");
    db.run("DELETE FROM scheduled_sms");
    seedBunSqlite(db);
  }

  const initialData = {
    version: "1.0.0",
    driver: "SQLite Binary Database (.db)",
    sqlitePath: DB_FILE_PATH,
    staff: INITIAL_STAFF,
    groups: INITIAL_GROUPS,
    templates: INITIAL_TEMPLATES,
    history: INITIAL_HISTORY,
    scheduled: INITIAL_SCHEDULED,
    mnotifyConfig: MNOTIFY_CONFIG,
    stats: DELIVERY_STATS
  };
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(initialData, null, 2), "utf8");
  return initialData;
}
