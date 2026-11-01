import Link from "next/link";
import { Compass } from "lucide-react";
import { BtnLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="hero-aurora grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-white/10 text-mint-300 ring-1 ring-inset ring-white/20">
          <Compass className="size-6" strokeWidth={1.6} />
        </span>
        <p className="mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-mint-300">404</p>
        <h1 className="display-hero mt-3 text-white">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-mint-100/80">
          Tautan yang Anda buka tidak tersedia atau berkas pengajuan telah dipindahkan. Kembali ke beranda atau buka
          dashboard Anda.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <BtnLink href="/" variant="onDark" size="lg">
            Kembali ke beranda
          </BtnLink>
          <BtnLink href="/pengajuan" variant="outlineDark" size="lg">
            Pilih layanan
          </BtnLink>
        </div>
        <p className="mt-6 text-[0.75rem] text-mint-200/60">
          Butuh bantuan?{" "}
          <Link href="/faq" className="font-semibold text-white underline-grow">
            Pusat bantuan KUI
          </Link>
        </p>
      </div>
    </div>
  );
}