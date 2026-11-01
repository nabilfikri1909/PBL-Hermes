import type { Metadata } from "next";
import { Download, Timer, TrendingUp, Globe2, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MobilityChart, StatusDonut, TrendChart } from "@/components/admin-charts";
import { requireStaffPage } from "@/lib/auth";
import { computeStats } from "@/lib/stats";
import { countryName } from "@/lib/utils";

export const metadata: Metadata = { title: "Statistik & Analisis" };
export const dynamic = "force-dynamic";

export default async function AdminStatisticsPage() {
  const user = await requireStaffPage("/admin/statistics");
  const stats = computeStats();
  const totalApps = stats.byService.reduce((sum, row) => sum + row.value, 0);

  const kpis = [
    { label: "Total pengajuan", value: totalApps, icon: Users, hint: "seluruh layanan" },
    { label: "Rata-rata penyelesaian", value: `${stats.avgProcessingDays} hari`, icon: Timer, hint: "submit → keputusan" },
    { label: "Berkas disetujui", value: stats.totals.approved, icon: TrendingUp, hint: "approved + completed" },
    { label: "Negara tujuan", value: stats.countries.length, icon: Globe2, hint: "unik pada data" }
  ];

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title="Statistik mobilitas"
      subtitle="Analisis data pengajuan lintas layanan. Angka dihitung langsung dari basis data portal."
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
            <div key={kpi.label} className="rounded-card-lg bg-white p-5 shadow-[0_14px_36px_-34px_rgb(13_26_21_/_0.5)]">
              <span className="grid size-9 place-items-center rounded-full bg-canvas-soft text-forest-800">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
              <p className="mt-4 text-[1.6rem] font-bold leading-none tabular text-ink">{kpi.value}</p>
              <p className="mt-1.5 text-[0.75rem] text-ink-mute">{kpi.label}</p>
              <p className="mt-0.5 text-[0.6875rem] text-ink-mute/80">{kpi.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <p className="text-[0.9375rem] font-bold text-ink">Volume permohonan per layanan</p>
          <p className="mt-0.5 text-[0.75rem] text-ink-mute">Enam bulan terakhir</p>
          <div className="mt-4">
            <MobilityChart data={stats.monthly} />
          </div>
        </section>

        <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <p className="text-[0.9375rem] font-bold text-ink">Distribusi status</p>
          <p className="mt-0.5 text-[0.75rem] text-ink-mute">Seluruh berkas yang tercatat</p>
          <div className="mt-4">
            <StatusDonut data={stats.byStatus} />
          </div>
        </section>

        <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <p className="text-[0.9375rem] font-bold text-ink">Tren total pengajuan</p>
          <div className="mt-4">
            <TrendChart data={stats.monthly} />
          </div>
        </section>

        <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <p className="text-[0.9375rem] font-bold text-ink">Negara tujuan teratas</p>
          <ul className="mt-4 space-y-2.5">
            {stats.countries.slice(0, 6).map((row) => {
              const max = stats.countries[0]?.value ?? 1;
              return (
                <li key={row.country} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-[0.8125rem] text-ink-soft">{countryName(row.country)}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-canvas-mist">
                    <span className="block h-full rounded-full bg-forest-600" style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }} />
                  </span>
                  <span className="w-6 shrink-0 text-right text-[0.75rem] font-semibold tabular text-ink">{row.value}</span>
                </li>
              );
            })}
            {stats.countries.length === 0 ? <li className="text-[0.8125rem] text-ink-mute">Belum ada data negara.</li> : null}
          </ul>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-hairline pt-4 text-center">
            {stats.byService.map((row) => (
              <div key={row.service}>
                <p className="text-[1.1rem] font-bold tabular text-ink">{row.value}</p>
                <p className="text-[0.6875rem] text-ink-mute">{row.service}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}