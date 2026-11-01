import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/auth-forms";
import { getSessionUser, homeForRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Daftar Akun" };
export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect(homeForRole(user.role));

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
      <div className="hero-aurora hidden flex-col justify-between p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-white p-[3px] ring-1 ring-inset ring-white/25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pnj-logo.jpg" alt="Lambang PNJ" width={48} height={48} className="size-full rounded-[0.45rem] object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Portal Program Internasional</span>
            <span className="text-[0.6875rem] text-mint-200">Politeknik Negeri Jakarta</span>
          </span>
        </Link>
        <div className="max-w-md">
          <h1 className="display-hero text-white">Mulai perjalanan akademik internasional Anda.</h1>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-mint-100/80">
            Pendaftaran akun hanya butuh satu menit. Setelah itu Anda dapat mengajukan Outbound, Inbound, maupun
            izin PDLN dengan identitas yang sama.
          </p>
          <div className="mt-8 squircle overflow-hidden">
            <img src="/pnj-gedung.jpg" alt="Gedung Politeknik Negeri Jakarta" className="h-44 w-full object-cover" />
          </div>
        </div>
        <p className="text-[0.75rem] text-mint-200/60">Data Anda hanya dipakai untuk penerbitan surat resmi KUI.</p>
      </div>

      <div className="flex flex-col justify-center bg-canvas px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-mute transition-colors hover:text-forest-800">
            <ArrowLeft className="size-3.5" />
            Kembali ke beranda
          </Link>
          <h2 className="mt-6 text-[1.75rem] font-bold tracking-tight text-ink">Daftar akun mahasiswa</h2>
          <p className="mt-2 mb-8 text-[0.875rem] text-ink-mute">Sudah punya akun? <Link href="/login" className="font-semibold text-forest-800 underline-grow">Masuk di sini</Link>.</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}