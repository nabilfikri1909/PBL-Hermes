import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type {
  Announcement,
  Application,
  AuditEntry,
  DocumentTemplate,
  FaqItem,
  HelpTicket,
  Role,
  User
} from "./types";
import { SEED_ANNOUNCEMENTS, SEED_APPLICATIONS, SEED_AUDIT, SEED_FAQS, SEED_SETTINGS, SEED_TEMPLATES, SEED_TICKETS } from "./seed";

export interface StoreSettings {
  quotaOutbound: number;
  quotaInbound: number;
  quotaPdln: number;
  openOutbound: boolean;
  openInbound: boolean;
  openPdln: boolean;
  verificationSlaDays: number;
  announcementBanner: string;
}

export interface Store {
  users: (User & { password?: string })[];
  applications: Application[];
  audit: AuditEntry[];
  faqs: FaqItem[];
  announcements: Announcement[];
  templates: DocumentTemplate[];
  tickets: HelpTicket[];
  settings: StoreSettings;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

/** globalThis survives HMR in dev and route-module isolation in prod. */
const globalRef = globalThis as unknown as { __pnjStore?: Store };

/* ── Demo-date rebasing ────────────────────────────────────────
   The seed is authored with fixed timestamps. A demo shown months
   later must not render a stale queue and an empty chart, so every
   seed date is shifted by one offset that lands the newest seed
   activity on today. The relative spacing of all records is kept. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?$/;

/** Only activity timestamps anchor the demo clock. Planned dates
 *  (`startDate`, `endDate`) describe the future by design and must not
 *  drag the whole dataset backwards. */
const ACTIVITY_KEYS = new Set(["createdAt", "updatedAt", "submittedAt", "publishedAt", "at", "uploadedAt", "validatedAt"]);

function collectDates(value: unknown, out: number[] = [], key = ""): number[] {
  if (typeof value === "string") {
    if (ACTIVITY_KEYS.has(key) && ISO_DATE.test(value)) {
      const t = new Date(value).getTime();
      if (!Number.isNaN(t)) out.push(t);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectDates(v, out, key));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) collectDates(v, out, k);
  }
  return out;
}

function shiftDates<T>(value: T, deltaMs: number): T {
  if (typeof value === "string") {
    if (!ISO_DATE.test(value)) return value;
    const original = new Date(value);
    if (Number.isNaN(original.getTime())) return value;
    const shifted = new Date(original.getTime() + deltaMs);
    // Date-only strings stay date-only; timestamps keep their time-of-day.
    return (value.includes("T") ? shifted.toISOString() : shifted.toISOString().slice(0, 10)) as unknown as T;
  }
  if (Array.isArray(value)) return value.map((v) => shiftDates(v, deltaMs)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = shiftDates(v, deltaMs);
    return out as unknown as T;
  }
  return value;
}

/** Offset that places the newest seed record on today (midday). */
function demoDateOffset(dataset: unknown): number {
  const stamps = collectDates(dataset);
  if (!stamps.length) return 0;
  const newest = Math.max(...stamps);
  const target = new Date();
  target.setHours(12, 0, 0, 0);
  return target.getTime() - newest;
}

function emptyStore(): Store {
  const raw = {
    applications: SEED_APPLICATIONS,
    audit: SEED_AUDIT,
    announcements: SEED_ANNOUNCEMENTS,
    tickets: SEED_TICKETS
  };
  const delta = demoDateOffset(raw);
  const year = new Date().getFullYear();
  const applications = shiftDates(SEED_APPLICATIONS.map((app) => ({ ...app })), delta).map((app) => ({
    ...app,
    // Register numbers carry the year they were issued in; keep them consistent
    // with the rebased dates instead of a hard-coded 2026.
    registerNo: app.registerNo.replace(/(PNJ-KUI\/)\d{4}(\/)/, `$1${year}$2`)
  }));
  return {
    users: [],
    applications,
    audit: shiftDates([...SEED_AUDIT], delta),
    faqs: [...SEED_FAQS],
    announcements: shiftDates([...SEED_ANNOUNCEMENTS], delta),
    templates: [...SEED_TEMPLATES],
    tickets: shiftDates([...SEED_TICKETS], delta),
    settings: { ...SEED_SETTINGS }
  };
}

export function uid(prefix = "id") {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

export function nowISO() {
  return new Date().toISOString();
}

function readFromDisk(): Store | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    if (!raw.trim()) return null;
    const parsed = JSON.parse(raw) as Partial<Store>;
    const base = emptyStore();
    return {
      users: parsed.users ?? base.users,
      applications: parsed.applications ?? base.applications,
      audit: parsed.audit ?? base.audit,
      faqs: parsed.faqs ?? base.faqs,
      announcements: parsed.announcements ?? base.announcements,
      templates: parsed.templates ?? base.templates,
      tickets: parsed.tickets ?? base.tickets,
      settings: { ...base.settings, ...(parsed.settings ?? {}) }
    };
  } catch {
    return null;
  }
}

export function getStore(): Store {
  if (!globalRef.__pnjStore) {
    globalRef.__pnjStore = readFromDisk() ?? emptyStore();
    // Seed demo accounts once so the live demo is always reachable.
    if (globalRef.__pnjStore.users.length === 0) {
      globalRef.__pnjStore.users = demoUsers();
      persist();
    }
  }
  return globalRef.__pnjStore;
}

export function persist() {
  const store = globalRef.__pnjStore;
  if (!store) return;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch {
    /* Read-only filesystem: the in-memory store still serves the demo. */
  }
}

/** Mutate and flush in one call — the only write path in the app. */
export function mutate<T>(fn: (store: Store) => T): T {
  const store = getStore();
  const result = fn(store);
  persist();
  return result;
}

/* ── Demo identities ──────────────────────────────────────────── */

function demoUsers(): (User & { password?: string })[] {
  const created = "2026-01-12T08:00:00.000Z";
  const rows: Array<[string, string, Role, string, string]> = [
    ["Muhammad Nabil Fikri", "nabil@student.pnj.ac.id", "student", "2207421021", "Teknik Informatika"],
    ["Ayu Larasati", "ayu@student.pnj.ac.id", "student", "2207421044", "Administrasi Bisnis"],
    ["Dr. Bagus Prakoso", "bagus@pnj.ac.id", "lecturer", "198403122010121002", "Teknik Mesin"],
    ["Rina Kartika, M.I.Kom", "rina@kui.pnj.ac.id", "admin", "199001152015032004", "Kantor Urusan Internasional"],
    ["Hendra Wijaya, S.Kom", "hendra@kui.pnj.ac.id", "super_admin", "198711202012011003", "Kantor Urusan Internasional"],
    ["Emma Lindqvist", "emma@lund.se", "foreign", "LUND-2026-0117", "Lund University"]
  ];
  return rows.map(([fullName, email, role, nim, department], i) => ({
    id: `usr_${i + 1}`,
    fullName,
    email,
    role,
    nim,
    department,
    studyProgram: department,
    phone: `+62 812 0000 00${i + 1}`,
    nationality: role === "foreign" ? "Swedia" : "Indonesia",
    avatarInitials: fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join(""),
    createdAt: created,
    password: role.startsWith("super") || role === "admin" ? "admin123" : "demo123"
  }));
}

export function findUserByEmail(email: string) {
  const target = email.trim().toLowerCase();
  return getStore().users.find((u) => u.email.toLowerCase() === target) ?? null;
}

export function findUserById(id: string) {
  return getStore().users.find((u) => u.id === id) ?? null;
}

export function addAudit(entry: Omit<AuditEntry, "id" | "at">) {
  mutate((store) => {
    store.audit.unshift({ id: uid("aud"), at: nowISO(), ...entry });
    store.audit = store.audit.slice(0, 400);
  });
}

/* ── Application helpers ──────────────────────────────────────── */

export function nextRegisterNo(service: string) {
  const store = getStore();
  const year = new Date().getFullYear();
  const prefix = service === "outbound" ? "OTB" : service === "inbound" ? "INB" : "PDLN";
  const count = store.applications.filter((a) => a.service === service).length + 1;
  return `${prefix}/PNJ-KUI/${year}/${String(count).padStart(3, "0")}`;
}

export function listApplications() {
  return [...getStore().applications].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getApplicationById(id: string) {
  return getStore().applications.find((a) => a.id === id) ?? null;
}