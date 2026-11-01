import type { Application, ApplicationStatus, ParticipantExpense } from "@/lib/types";
import { getStore } from "@/lib/store";
import { daysBetween } from "@/lib/utils";

export interface DashboardStats {
  totals: {
    active: number;
    awaitingReview: number;
    revision: number;
    completedThisMonth: number;
    approved: number;
  };
  byStatus: Array<{ status: ApplicationStatus; label: string; value: number }>;
  byService: Array<{ service: string; value: number }>;
  monthly: Array<{ month: string; outbound: number; inbound: number; pdln: number }>;
  avgProcessingDays: number;
  quota: { outbound: number; inbound: number; pdln: number };
  countries: Array<{ country: string; value: number }>;
}

const MONTH_LABEL = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function computeStats(scope?: Application[]): DashboardStats {
  const store = getStore();
  const list = scope ?? store.applications;

  /* Anchor the reporting window on the newest record in the dataset, not
     on the wall clock: demo data must never render an empty chart because
     "today" sits months past the last seeded activity. */
  const stamps = list.flatMap((a) => [new Date(a.createdAt).getTime(), new Date(a.updatedAt).getTime()]).filter((n) => !Number.isNaN(n));
  const anchor = stamps.length ? new Date(Math.max(...stamps)) : new Date();
  const monthKeyOf = (value: string) => {
    const d = new Date(value);
    return `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
  };
  const anchorKey = `${anchor.getUTCFullYear()}-${anchor.getUTCMonth()}`;

  const byStatus: ApplicationStatus[] = [
    "draft",
    "submitted",
    "under_review",
    "revision_required",
    "forwarded_to_kui",
    "approved",
    "completed",
    "rejected"
  ];

  const label: Record<ApplicationStatus, string> = {
    draft: "Draf",
    submitted: "Terkirim",
    under_review: "Verifikasi",
    revision_required: "Perlu Revisi",
    forwarded_to_kui: "Diteruskan",
    approved: "Disetujui",
    completed: "Selesai",
    rejected: "Ditolak"
  };

  const monthly: DashboardStats["monthly"] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
    const rows = list.filter((a) => monthKeyOf(a.updatedAt || a.createdAt) === key);
    monthly.push({
      month: MONTH_LABEL[d.getUTCMonth()] ?? "",
      outbound: rows.filter((r) => r.service === "outbound").length,
      inbound: rows.filter((r) => r.service === "inbound").length,
      pdln: rows.filter((r) => r.service === "pdln").length
    });
  }

  const finished = list.filter((a) => a.status === "approved" || a.status === "completed");
  const avgProcessingDays = finished.length
    ? Math.round(
        finished.reduce((sum, a) => sum + daysBetween(a.submittedAt ?? a.createdAt, a.updatedAt), 0) / finished.length
      )
    : 0;

  const countryCount = new Map<string, number>();
  list.forEach((a) => countryCount.set(a.country, (countryCount.get(a.country) ?? 0) + 1));

  return {
    totals: {
      active: list.filter((a) => a.status !== "draft" && a.status !== "completed" && a.status !== "rejected").length,
      awaitingReview: list.filter((a) => a.status === "submitted" || a.status === "under_review").length,
      revision: list.filter((a) => a.status === "revision_required").length,
      completedThisMonth: list.filter((a) => {
        if (a.status !== "completed") return false;
        return monthKeyOf(a.updatedAt) === anchorKey;
      }).length,
      approved: finished.length
    },
    byStatus: byStatus.map((status) => ({
      status,
      label: label[status],
      value: list.filter((a) => a.status === status).length
    })),
    byService: [
      { service: "Outbound", value: list.filter((a) => a.service === "outbound").length },
      { service: "Inbound", value: list.filter((a) => a.service === "inbound").length },
      { service: "PDLN", value: list.filter((a) => a.service === "pdln").length }
    ],
    monthly,
    avgProcessingDays,
    quota: {
      outbound: store.settings.quotaOutbound,
      inbound: store.settings.quotaInbound,
      pdln: store.settings.quotaPdln
    },
    countries: [...countryCount.entries()]
      .map(([country, value]) => ({ country, value }))
      .sort((a, b) => b.value - a.value)
  };
}

/** Public transparency projection — no PII ever leaves the server. */
export function publicPdlNRow(app: Application) {
  return {
    id: app.id,
    registerNo: app.registerNo,
    title: app.title,
    country: app.country,
    city: app.city,
    startDate: app.startDate,
    endDate: app.endDate,
    status: app.status,
    ownerName: app.ownerName,
    participants: app.participants.map((p) => ({
      name: p.fullName,
      role: p.role,
      docStatus: p.docStatus
    }))
  };
}

export function emptyExpenses(participants: Array<{ id: string }>): ParticipantExpense[] {
  return participants.map((p) => ({
    participantId: p.id,
    ticket: 0,
    accommodation: 0,
    dailyAllowance: 0,
    insurance: 0,
    other: 0
  }));
}