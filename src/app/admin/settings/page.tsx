import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { SettingsForm } from "@/components/admin-forms";
import { requireStaffPage } from "@/lib/auth";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Pengaturan Sistem" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await requireStaffPage("/admin/settings");
  const settings = getStore().settings;
  const readOnly = user.role !== "super_admin";

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title="Pengaturan sistem"
      subtitle={
        readOnly
          ? "Parameter hanya dapat diubah Super Admin. Nilai di bawah bersifat baca-saja untuk verifikator."
          : "Kuota tahunan, status pembukaan layanan, dan banner pengumuman portal."
      }
    >
      {readOnly ? (
        <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["Kuota Outbound", settings.quotaOutbound],
              ["Kuota Inbound", settings.quotaInbound],
              ["Kuota PDLN", settings.quotaPdln],
              ["SLA verifikasi (hari)", settings.verificationSlaDays],
              ["Outbound dibuka", settings.openOutbound ? "Ya" : "Tidak"],
              ["Inbound dibuka", settings.openInbound ? "Ya" : "Tidak"],
              ["PDLN dibuka", settings.openPdln ? "Ya" : "Tidak"],
              ["Banner", settings.announcementBanner]
            ].map(([label, value]) => (
              <div key={String(label)}>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-ink-mute">{label}</dt>
                <dd className="mt-0.5 text-[0.875rem] font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <SettingsForm settings={settings} />
      )}
    </AppShell>
  );
}