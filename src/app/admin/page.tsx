import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3, Download, FileCheck2, Inbox, ShieldAlert, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MobilityChart } from "@/components/admin-charts";
import { requireStaffPage } from "@/lib/auth";
import { getStore, listApplications } from "@/lib/store";
import { computeStats } from "@/lib/stats";
import { countryName, formatDate, formatDateTime, SERVICE_META, STATUS_META } from "@/lib/utils";

export const metadata: Metadata = { title: "Command Center" };
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const user = await requireStaffPage("/admin");
  const apps = listApplications();
  const stats = computeStats();
  const store = getStore();
  const queue = apps.filter((a) => a.status === "submitted" || a.status === "under_review");
  const revision = apps.filter((a) => a.status === "revision_required");

  const kpis = [
    { label: "Pengajuan aktif", value: stats.totals.active, icon: Inbox, href: "/admin/applications" },
    { label: "Menunggu verifikasi", value: stats.totals.awaitingReview, icon: Clock3, href: "/admin/applications" },
    { label: "Perlu perbaikan", value: stats.totals.revision, icon: ShieldAlert, href: "/admin/applications" },
    { label: "Selesai bulan ini", value: stats.totals.completedThisMonth, icon: FileCheck2, href: "/admin/statistics" }
  ];

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title="Command center KUI"
      subtitle={`${stats.totals.awaitingReview} berkas menunggu, ${revision.length} menunggu perbaikan pemohon. Rata-rata penyelesaian ${stats.avgProcessingDays} hari.`}
      actions={
        <a href="/api/export" className="hidden items-center gap-1.5 rounded-full border border-hairline px-3.5 py-2 text-[0.75rem] font-semibold text-ink-soft transition-colors hover:border-forest-300 sm:inline-flex">
          <Download className="size-3.5" />
          Ekspor CSV
        </a>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} href={kpi.href} className="group rounded-card-lg bg-white p-5 shadow-[0_14px_36px_-34px_rgb(13_26_21_/_0.5)] transition-transform duration-300 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <span className="grid size-9 place-items-center rounded-full bg-canvas-soft text-forest-800 group-hover:bg-forest-900 group-hover:text-white">
                  <Icon className="size-4" strokeWidth={1.8} />
                </span>
                <ArrowUpRight className="size-4 text-ink-mute opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-4 text-[1.75rem] font-bold leading-none tabular text-ink">{kpi.value}</p>
              <p className="mt-1.5 text-[0.75rem] text-ink-mute">{kpi.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid min-w-0 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="min-w-0 rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.9375rem] font-bold text-ink">Volume pengajuan 6 bulan</p>
              <p className="mt-0.5 text-[0.75rem] text-ink-mute">Outbound, inbound, dan PDLN per bulan</p>
            </div>
            <Link href="/admin/statistics" className="text-[0.75rem] font-semibold text-forest-800 underline-grow">
              Statistik lengkap
            </Link>
          </div>
          <div className="mt-4">
            <MobilityChart data={stats.monthly} />
          </div>
        </section>

        <section className="min-w-0 rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <p className="text-[0.9375rem] font-bold text-ink">Antrean per layanan</p>
          <div className="mt-4 space-y-2.5">
            {(["outbound", "inbound", "pdln"] as const).map((service) => {
              const rows = apps.filter((a) => a.service === service);
              const pending = rows.filter((a) => a.status === "submitted" || a.status === "under_review").length;
              return (
                <Link key={service} href={`/admin/${service}`} className="flex items-center justify-between gap-3 rounded-xl bg-canvas-soft px-3.5 py-3 transition-colors hover:bg-canvas-mist">
                  <span>
                    <span className="block text-[0.8125rem] font-semibold text-ink">{SERVICE_META[service].label}</span>
                    <span className="block text-[0.6875rem] text-ink-mute">{rows.length} berkas total</span>
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-bold text-forest-800">{pending}</span>
                </Link>
              );
            })}
          </div>

          <p className="mt-5 text-[0.9375rem] font-bold text-ink">Aktivitas terbaru</p>
          <ul className="mt-3 space-y-2.5">
            {store.audit.slice(0, 4).map((entry) => (
              <li key={entry.id} className="text-[0.75rem]">
                <p className="font-medium text-ink-soft">
                  {entry.action} · <span className="text-ink-mute">{entry.entity}</span>
                </p>
                <p className="text-[0.6875rem] text-ink-mute">{entry.actorEmail} · {formatDateTime(entry.at)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-5 rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.9375rem] font-bold text-ink">Menunggu keputusan verifikator</p>
          <Link href="/admin/applications" className="text-[0.75rem] font-semibold text-forest-800 underline-grow">
            Semua pengajuan
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left text-[0.8125rem]">
            <thead>
              <tr className="border-b border-hairline text-[0.6875rem] uppercase tracking-[0.07em] text-ink-mute">
                <th className="pb-2 pr-3 font-semibold">Nomor</th>
                <th className="pb-2 pr-3 font-semibold">Kegiatan</th>
                <th className="pb-2 pr-3 font-semibold">Pemohon</th>
                <th className="pb-2 pr-3 font-semibold">Negara</th>
                <th className="pb-2 pr-3 font-semibold">Masuk</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {queue.slice(0, 6).map((app) => (
                <tr key={app.id} className="border-b border-hairline-soft last:border-0">
                  <td className="py-3 pr-3 font-medium tabular text-ink-soft">{app.registerNo || "—"}</td>
                  <td className="py-3 pr-3">
                    <Link href={`/admin/applications/${app.id}`} className="font-semibold text-ink hover:text-forest-800">
                      {app.title}
                    </Link>
                    <p className="text-[0.6875rem] text-ink-mute">{app.partnerInstitution}</p>
                  </td>
                  <td className="py-3 pr-3 text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-ink-mute" />
                      {app.ownerName}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-ink-soft">{countryName(app.country)}</td>
                  <td className="py-3 pr-3 text-ink-soft">{formatDate(app.submittedAt)}</td>
                  <td className="py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold ${STATUS_META[app.status].className}`}>
                      {STATUS_META[app.status].label}
                    </span>
                  </td>
                </tr>
              ))}
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[0.8125rem] text-ink-mute">
                    Tidak ada berkas menunggu verifikasi.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}