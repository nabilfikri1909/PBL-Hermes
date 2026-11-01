import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { OnboardingForm } from "@/components/auth-forms";
import { getSessionUser, isStaff } from "@/lib/auth";
import { ROLE_META, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Profil Saya" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/profile");
  if (isStaff(user.role)) redirect("/admin");

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="student"
      title="Profil saya"
      subtitle="Identitas ini dipakai pada kepala surat rekomendasi dan rekap verifikator KUI."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
          <p className="text-[0.9375rem] font-bold text-ink">Perbarui data kampus</p>
          <p className="mt-1 mb-5 text-[0.75rem] text-ink-mute">Email dan peran hanya dapat diubah oleh Super Admin.</p>
          <OnboardingForm initial={{ nim: user.nim, department: user.department, phone: user.phone, fullName: user.fullName }} />
        </section>

        <section className="space-y-4">
          <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
            <p className="text-[0.9375rem] font-bold text-ink">Identitas akun</p>
            <dl className="mt-4 space-y-3">
              {[
                ["Nama lengkap", user.fullName],
                ["Email resmi", user.email],
                ["NIM / NIP", user.nim ?? "—"],
                ["Jurusan", user.department],
                ["Kewarganegaraan", user.nationality],
                ["Peran", ROLE_META[user.role].label],
                ["Terdaftar", formatDate(user.createdAt)]
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-hairline-soft pb-2.5 last:border-0 last:pb-0">
                  <dt className="text-[0.75rem] text-ink-mute">{label}</dt>
                  <dd className="max-w-[60%] truncate text-right text-[0.8125rem] font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-card-lg bg-forest-50 p-5">
            <p className="flex items-center gap-2 text-[0.8125rem] font-bold text-forest-800">
              <ShieldCheck className="size-4" />
              Keamanan data
            </p>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-forest-800/80">
              Nomor paspor hanya terlihat empat digit terakhir di antarmuka. Verifikator berwenang tetap dapat
              memeriksa data lengkap pada panel verifikasi.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}