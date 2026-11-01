import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth-forms";
import { getSessionUser, homeForRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const user = await getSessionUser();
  if (user) redirect(next || homeForRole(user.role));

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
      <div className="hero-aurora relative hidden flex-col justify-between p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-white p-[3px] ring-1 ring-inset ring-white/25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pnj-logo.jpg" alt="Lambang PNJ" width={48} height={48} className="size-full rounded-[0.45rem] object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Kantor Urusan Internasional</span>
            <span className="text-[0.6875rem] text-mint-200">Politeknik Negeri Jakarta</span>
          </span>
        </Link>

        <div className="max-w-md">
          <h1 className="display-hero text-white">Satu akun untuk seluruh mobilitas internasional.</h1>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-mint-100/80">
            Pantau status berkas, pratinjau surat rekomendasi, dan simpan draf pengajuan lintas layanan dalam satu
            dashboard.
          </p>
          <div className="mt-8 squircle overflow-hidden">
            <img src="/pnj-landmark.jpg" alt="Landmark Politeknik Negeri Jakarta" className="h-44 w-full object-cover" />
          </div>
        </div>

        <p className="flex items-center gap-2 text-[0.75rem] text-mint-200/60">
          <ShieldCheck className="size-3.5" />
          Sesi dienkripsi · jejak audit setiap akses tercatat
        </p>
      </div>

      <div className="flex flex-col justify-center bg-canvas px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-mute transition-colors hover:text-forest-800">
            <ArrowLeft className="size-3.5" />
            Kembali ke beranda
          </Link>
          <h2 className="mt-6 text-[1.75rem] font-bold tracking-tight text-ink">Masuk ke portal</h2>
          <p className="mt-2 text-[0.875rem] text-ink-mute">
            Gunakan email kampus atau pilih akun demo untuk mencoba seluruh alur verifikasi.
          </p>
          <div className="mt-8">
            <LoginForm next={next} />
          </div>
        </div>
      </div>
    </div>
  );
}