import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { OnboardingForm } from "@/components/auth-forms";
import { PublicShell } from "@/components/public-shell";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Lengkapi Profil" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/onboarding");

  return (
    <PublicShell bare>
      <div className="mx-auto max-w-lg px-5 pb-24 pt-12 sm:px-8">
        <div className="rounded-panel bg-white p-7 shadow-[0_30px_70px_-40px_rgb(13_26_21_/_0.5)] sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-50 px-3 py-1.5 text-[0.6875rem] font-semibold text-forest-800">
            <Sparkles className="size-3.5" />
            Langkah terakhir
          </span>
          <h1 className="mt-5 text-[1.5rem] font-bold tracking-tight text-ink">Lengkapi profil kampus</h1>
          <p className="mt-2 mb-7 text-[0.875rem] leading-relaxed text-ink-mute">
            NIM dan jurusan dipakai pada kepala surat rekomendasi serta rekap verifikator. Anda dapat mengubahnya
            kapan pun dari halaman profil.
          </p>
          <OnboardingForm initial={{ nim: user.nim, department: user.department, phone: user.phone, fullName: user.fullName }} />
        </div>
      </div>
    </PublicShell>
  );
}