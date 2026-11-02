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

/** Shift ISO dates by `deltaMs`. When `cutoff` is given, values newer than the
 *  cutoff are left untouched: an edit made today must not be pushed into the
 *  future by a rebase that targets month-old seed data. */
function shiftDates<T>(value: T, deltaMs: number, cutoff?: number): T {
  if (typeof value === "string") {
    if (!ISO_DATE.test(value)) return value;
    const original = new Date(value);
    if (Number.isNaN(original.getTime())) return value;
    if (cutoff !== undefined && original.getTime() > cutoff) return value;
    const shifted = new Date(original.getTime() + deltaMs);
    // Date-only strings stay date-only; timestamps keep their time-of-day.
    return (value.includes("T") ? shifted.toISOString() : shifted.toISOString().slice(0, 10)) as unknown as T;
  }
  if (Array.isArray(value)) return value.map((v) => shiftDates(v, deltaMs, cutoff)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = shiftDates(v, deltaMs, cutoff);
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

/** Copy of the demo announcement corpus, used to refresh a store whose CMS
 *  content predates the current seed (e.g. an older .data on the server). */
function seedAnnouncementText() {
  return new Map(SEED_ANNOUNCEMENTS.map((a) => [a.id, a]));
}

/** Ids that belong to the shipped demo dataset. Only these anchor staleness:
 *  audit rows and drafts created while testing must never make a store that is
 *  full of February records look "fresh". */
const SEED_APP_IDS = new Set(SEED_APPLICATIONS.map((a) => a.id));
const SEED_ANN_IDS = new Set(SEED_ANNOUNCEMENTS.map((a) => a.id));

/** `createdAt` is immutable, so opening and autosaving a demo draft (which bumps
 *  `updatedAt` to today) cannot mask a dataset that is months old. */
function demoAnchors(store: Store): number[] {
  const out: number[] = [];
  const push = (value: string | null | undefined) => {
    if (!value) return;
    const t = new Date(value).getTime();
    if (!Number.isNaN(t)) out.push(t);
  };
  store.applications.forEach((a) => {
    if (SEED_APP_IDS.has(a.id)) push(a.createdAt);
  });
  store.announcements.forEach((a) => {
    if (SEED_ANN_IDS.has(a.id)) push(a.publishedAt);
  });
  return out;
}

/** Offset that lands the newest demo record on today (midday). */
function demoAnchorOffset(store: Store): number {
  const anchors = demoAnchors(store);
  if (!anchors.length) return 0;
  const newest = Math.max(...anchors);
  const target = new Date();
  target.setHours(12, 0, 0, 0);
  return target.getTime() - newest;
}

export function uid(prefix = "id") {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

export function nowISO() {
  return new Date().toISOString();
}

function readFromDisk(): { store: Store; migrated: boolean } | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    if (!raw.trim()) return null;
    const parsed = JSON.parse(raw) as Partial<Store>;
    const base = emptyStore();
    const store: Store = {
      users: parsed.users ?? base.users,
      applications: parsed.applications ?? base.applications,
      audit: parsed.audit ?? base.audit,
      faqs: parsed.faqs ?? base.faqs,
      announcements: parsed.announcements ?? base.announcements,
      templates: parsed.templates ?? base.templates,
      tickets: parsed.tickets ?? base.tickets,
      settings: { ...base.settings, ...(parsed.settings ?? {}) }
    };
    const rebased = rebaseIfStale(store);
    return { store: rebased.store, migrated: rebased.changed };
  } catch {
    return null;
  }
}

/** A store written months ago makes the demo look abandoned: empty chart,
 *  queued files dated in the past. Staleness is measured on the shipped demo
 *  records only — a test login that writes an audit row today must not make a
 *  February dataset look current. */
const STALE_AFTER_DAYS = 45;

function rebaseIfStale(store: Store): { store: Store; changed: boolean } {
  const anchors = demoAnchors(store);
  if (!anchors.length) return { store, changed: false };

  const newest = Math.max(...anchors);
  const ageDays = (Date.now() - newest) / 86_400_000;
  if (ageDays <= STALE_AFTER_DAYS) return { store, changed: false };

  const delta = demoAnchorOffset(store);
  if (delta <= 0) return { store, changed: false };

  const year = new Date().getFullYear();
  const seedAnn = seedAnnouncementText();
  /* Anything already newer than the newest seed record is live activity from
     this session (a draft opened today, an audit row from a test login): keep
     it where it is instead of pushing it into the future. */
  const cutoff = newest;
  return {
    changed: true,
    store: {
      ...store,
      applications: shiftDates(store.applications, delta, cutoff).map((app) => ({
        ...app,
        registerNo: app.registerNo.replace(/(PNJ-KUI\/)\d{4}(\/)/, `$1${year}$2`)
      })),
      /* Demo announcements are editorial copy, not user data: take the current
         wording (dates inside the text would otherwise stay stale) but keep the
         rebased publish timestamps and the admin's pinned/edited state. */
      announcements: shiftDates(store.announcements, delta, cutoff).map((a) => {
        const fresh = seedAnn.get(a.id);
        return fresh ? { ...fresh, publishedAt: a.publishedAt, pinned: a.pinned } : a;
      }),
      tickets: shiftDates(store.tickets, delta, cutoff),
      audit: shiftDates(store.audit, delta, cutoff),
      /* The banner is seeded editorial copy too: refresh wording when it still
         carries an absolute date, but never overwrite an admin's own edit. */
      settings: /\b20\d{2}\b/.test(store.settings.announcementBanner ?? "")
        ? { ...store.settings, announcementBanner: SEED_SETTINGS.announcementBanner }
        : store.settings
    }
  };
}

export function getStore(): Store {
  if (!globalRef.__pnjStore) {
    const fromDisk = readFromDisk();
    globalRef.__pnjStore = fromDisk?.store ?? emptyStore();
    // Persist when seeding accounts or when the demo dates were rebased,
    // so the correction sticks across restarts.
    if (globalRef.__pnjStore.users.length === 0 || fromDisk?.migrated) {
      if (globalRef.__pnjStore.users.length === 0) globalRef.__pnjStore.users = demoUsers();
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