import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApplicationStatus, Role, ServiceKind } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** Deterministic formatter — the server and the browser always agree. */
export function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDateShort(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${formatDate(value)} · ${hh}:${mm}`;
}

export function formatRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "—";
  if (start && end) return `${formatDateShort(start)} – ${formatDateShort(end)}`;
  return formatDateShort(start ?? end);
}

export function rupiah(value: number) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(value || 0));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function daysBetween(start?: string | null, end?: string | null) {
  if (!start || !end) return 0;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

/* ── Status & service vocabulary ──────────────────────────────── */

export const STATUS_META: Record<ApplicationStatus, { label: string; className: string; step: number }> = {
  draft: { label: "Draf", className: "bg-canvas-mist text-ink-soft border-hairline", step: 0 },
  submitted: { label: "Terkirim", className: "bg-info-50 text-info-700 border-info-200", step: 1 },
  under_review: { label: "Verifikasi Berkas", className: "bg-warn-50 text-warn-700 border-warn-200", step: 2 },
  revision_required: { label: "Perlu Revisi", className: "bg-stop-50 text-stop-700 border-stop-200", step: 3 },
  forwarded_to_kui: { label: "Diteruskan ke KUI", className: "bg-info-50 text-info-700 border-info-200", step: 4 },
  approved: { label: "Disetujui", className: "bg-ok-50 text-ok-700 border-ok-200", step: 5 },
  completed: { label: "Selesai", className: "bg-forest-50 text-forest-800 border-forest-200", step: 6 },
  rejected: { label: "Ditolak", className: "bg-stop-50 text-stop-700 border-stop-200", step: -1 }
};

export const SERVICE_META: Record<ServiceKind, { label: string; short: string; href: string; accent: string }> = {
  outbound: { label: "Outbound Mobility", short: "Outbound", href: "/outbound", accent: "text-forest-700" },
  inbound: { label: "Inbound International", short: "Inbound", href: "/inbound", accent: "text-forest-700" },
  pdln: { label: "PDLN Setneg", short: "PDLN", href: "/pdln", accent: "text-forest-700" }
};

export const ROLE_META: Record<Role, { label: string }> = {
  student: { label: "Mahasiswa PNJ" },
  foreign: { label: "Mahasiswa Asing" },
  lecturer: { label: "Dosen / Tendik" },
  admin: { label: "Verifikator KUI" },
  super_admin: { label: "Super Admin" }
};

/* ── Canonical country list (hydration-proof) ──────────────────
   The same literal strings are produced on the server and in the
   browser; no Intl.DisplayNames, no ICU drift on contested names. */

export const COUNTRIES = [
  { code: "AU", name: "Australia", region: "Oseania" },
  { code: "AT", name: "Austria", region: "Eropa" },
  { code: "BE", name: "Belgia", region: "Eropa" },
  { code: "BR", name: "Brasil", region: "Amerika" },
  { code: "CA", name: "Kanada", region: "Amerika" },
  { code: "CN", name: "Tiongkok", region: "Asia" },
  { code: "CZ", name: "Ceko", region: "Eropa" },
  { code: "DK", name: "Denmark", region: "Eropa" },
  { code: "EG", name: "Mesir", region: "Afrika" },
  { code: "FI", name: "Finlandia", region: "Eropa" },
  { code: "FR", name: "Prancis", region: "Eropa" },
  { code: "DE", name: "Jerman", region: "Eropa" },
  { code: "HK", name: "Hong Kong", region: "Asia" },
  { code: "IN", name: "India", region: "Asia" },
  { code: "ID", name: "Indonesia", region: "Asia" },
  { code: "IE", name: "Irlandia", region: "Eropa" },
  { code: "IT", name: "Italia", region: "Eropa" },
  { code: "JP", name: "Jepang", region: "Asia" },
  { code: "KR", name: "Korea Selatan", region: "Asia" },
  { code: "MY", name: "Malaysia", region: "Asia" },
  { code: "MO", name: "Makau", region: "Asia" },
  { code: "MX", name: "Meksiko", region: "Amerika" },
  { code: "NL", name: "Belanda", region: "Eropa" },
  { code: "NZ", name: "Selandia Baru", region: "Oseania" },
  { code: "NO", name: "Norwegia", region: "Eropa" },
  { code: "PH", name: "Filipina", region: "Asia" },
  { code: "PL", name: "Polandia", region: "Eropa" },
  { code: "PT", name: "Portugal", region: "Eropa" },
  { code: "SA", name: "Arab Saudi", region: "Asia" },
  { code: "SG", name: "Singapura", region: "Asia" },
  { code: "ES", name: "Spanyol", region: "Eropa" },
  { code: "SE", name: "Swedia", region: "Eropa" },
  { code: "CH", name: "Swiss", region: "Eropa" },
  { code: "TW", name: "Taiwan", region: "Asia" },
  { code: "TH", name: "Thailand", region: "Asia" },
  { code: "TR", name: "Turki", region: "Eropa" },
  { code: "AE", name: "Uni Emirat Arab", region: "Asia" },
  { code: "GB", name: "Britania Raya", region: "Eropa" },
  { code: "US", name: "Amerika Serikat", region: "Amerika" },
  { code: "VN", name: "Vietnam", region: "Asia" }
] as const;

/** Canonical override dictionary — the single source of truth for a
    country label in every runtime. */
export function countryName(code: string | null | undefined): string {
  if (!code) return "—";
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Detects whether an email belongs to the PNJ institutional domain
 * (e.g. nabil@student.pnj.ac.id or bagus@pnj.ac.id).
 */
export function isPnjEmail(email?: string | null): boolean {
  if (!email) return false;
  const parts = email.split("@");
  if (parts.length < 2 || !parts[1]) return false;
  const domain = parts[1].toLowerCase().trim();
  return domain === "pnj.ac.id" || domain.endsWith(".pnj.ac.id");
}

/**
 * Access policy per user requirement:
 * - Mahasiswa / civitas yang login menggunakan email PNJ hanya bisa Outbound dan PDLN.
 * - Pengguna yang login menggunakan email biasa bisa Outbound, Inbound, dan PDLN.
 */
export function allowedServicesForEmail(email?: string | null): ServiceKind[] {
  if (isPnjEmail(email)) {
    return ["outbound", "pdln"];
  }
  return ["outbound", "inbound", "pdln"];
}

export function isServiceAllowedForEmail(email: string | null | undefined, service: ServiceKind): boolean {
  return allowedServicesForEmail(email).includes(service);
}