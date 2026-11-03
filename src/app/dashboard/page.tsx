import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CalendarClock, CheckCircle2, ClipboardList, FileStack, Megaphone, PlaneTakeoff } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ApplicationList, type ListRow } from "@/components/application-list";
import { getSessionUser, isStaff } from "@/lib/auth";
import { getStore, listApplications } from "@/lib/store";
import { countryName, formatDate, formatRange, isServiceAllowedForEmail, STATUS_META } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard");
  if (isStaff(user.role)) redirect("/admin");

  const all = listApplications();
  const mine = all.filter((a) => a.ownerId === user.id);
  const announcements = getStore().announcements.slice(0, 3);

  const rows: ListRow[] = mine.map((a) => ({
    id: a.id,
    registerNo: a.registerNo,
    title: a.title,
    service: a.service,
    country: a.country,
    city: a.city,
    status: a.status,
    partnerInstitution: a.partnerInstitution,
    ownerName: a.ownerName,
    updatedAt: a.updatedAt,
    submittedAt: a.submittedAt,
    participants: a.participants.length
  }));

  const metrics = [
    { label: "Draf tersimpan", value: mine.filter((a) => a.status === "draft").length, icon: FileStack },
    { label: "Sedang diverifikasi", value: mine.filter((a) => a.status === "submitted" || a.status === "under_review").length, icon: ClipboardList },
    { label: "Perlu perbaikan", value: mine.filter((a) => a.status === "revision_required").length, icon: CalendarClock },
    { label: "Disetujui / selesai", value: mine.filter((a) => a.status === "approved" || a.status === "completed").length, icon: CheckCircle2 }
  ];

  const active = mine.filter((a) => a.status !== "completed" && a.status !== "rejected").slice(0, 2);

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="student"
      title={`Selamat datang, ${user.fullName.split(" ")[0]}`}
      subtitle={`${user.department} · ${user.nim ?? "NIM belum diisi"}. Pantau status berkas dan catatan verifikator di halaman ini.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-card-lg bg-white p-5 shadow-[0_14px_36px_-34px_rgb(13_26_21_/_0.5)]">
              <span className="grid size-9 place-items-center rounded-full bg-canvas-soft text-forest-800">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
              <p className="mt-4 text-[1.75rem] font-bold leading-none tabular text-ink">{metric.value}</p>
              <p className="mt-1.5 text-[0.75rem] text-ink-mute">{metric.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid min-w-0 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="min-w-0 space-y-5">
          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.9375rem] font-bold text-ink">Pengajuan aktif</p>
              <Link href="/dashboard/applications" className="text-[0.75rem] font-semibold text-forest-800 underline-grow">
                Lihat semua
              </Link>
            </div>

            {active.length === 0 ? (
              <div className="mt-4 rounded-card bg-canvas-soft px-4 py-8 text-center">
                <p className="text-[0.875rem] font-semibold text-ink">Belum ada pengajuan berjalan</p>
                <p className="mx-auto mt-1 max-w-sm text-[0.75rem] text-ink-mute">
                  Mulai dari layanan yang sesuai status Anda — draf tersimpan otomatis sehingga bisa dilanjutkan kapan saja.
                </p>
                <Link href="/pengajuan" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-4 py-2 text-[0.75rem] font-semibold text-white">
                  Mulai pengajuan
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {active.map((app) => (
                  <li key={app.id}>
                    <Link href={`/dashboard/applications/${app.id}`} className="block rounded-card bg-canvas-soft p-4 transition-colors hover:bg-canvas-mist">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold ${STATUS_META[app.status].className}`}>
                          {STATUS_META[app.status].label}
                        </span>
                        <span className="text-[0.6875rem] text-ink-mute">{app.registerNo || "nomor belum terbit"}</span>
                        <span className="ml-auto text-[0.6875rem] text-ink-mute">{formatDate(app.updatedAt)}</span>
                      </div>
                      <p className="mt-2 text-[0.875rem] font-semibold text-ink">{app.title || "(draf tanpa judul)"}</p>
                      <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                        {app.partnerInstitution || "mitra belum diisi"} · {countryName(app.country)} · {formatRange(app.startDate, app.endDate)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="min-w-0">
            <p className="mb-3 text-[0.9375rem] font-bold text-ink">Semua pengajuan saya</p>
            <ApplicationList rows={rows} />
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <section className="rounded-card-lg bg-forest-900 p-5 text-white">
            <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-mint-300">
              <PlaneTakeoff className="size-3.5" />
              Layanan cepat
            </p>
            <div className="mt-4 space-y-2">
              {[
                { href: "/outbound/apply", service: "outbound" as const, label: "Ajukan Outbound", hint: "Exchange, magang, IISMA" },
                { href: "/inbound/apply", service: "inbound" as const, label: "Ajukan Inbound", hint: "Peserta asing ke PNJ" },
                { href: "/pdln/apply", service: "pdln" as const, label: "Ajukan PDLN", hint: "Izin dinas luar negeri" }
              ]
                .filter((item) => isServiceAllowedForEmail(user.email, item.service))
                .map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 rounded-xl bg-white/8 px-3.5 py-2.5 transition-colors hover:bg-white/14">
                    <span>
                      <span className="block text-[0.8125rem] font-semibold">{item.label}</span>
                      <span className="block text-[0.6875rem] text-mint-200/70">{item.hint}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-mint-300" />
                  </Link>
                ))}
            </div>
          </section>

          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
            <p className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
              <Megaphone className="size-4 text-forest-700" />
              Pengumuman KUI
            </p>
            <ul className="mt-4 space-y-3">
              {announcements.map((item) => (
                <li key={item.id} className="border-b border-hairline-soft pb-3 last:border-0 last:pb-0">
                  <p className="text-[0.8125rem] font-semibold leading-snug text-ink">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-[0.75rem] leading-relaxed text-ink-mute">{item.excerpt}</p>
                  <p className="mt-1 text-[0.6875rem] text-ink-mute">{formatDate(item.publishedAt)} · {item.tag}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card-lg bg-canvas-soft p-5">
            <p className="text-[0.9375rem] font-bold text-ink">Butuh bantuan?</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-mute">
              Kirim tiket ke verifikator KUI. Balasan muncul pada halaman Tanya Jawab.
            </p>
            <Link href="/dashboard/questions" className="mt-3 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-forest-800 underline-grow">
              Buka tanya jawab
              <ArrowUpRight className="size-3" />
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}