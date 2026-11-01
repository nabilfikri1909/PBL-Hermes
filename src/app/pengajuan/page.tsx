import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ClipboardList, Clock3, Plane, ShieldCheck, Sparkles, Users } from "lucide-react";
import { PublicShell, PageBand } from "@/components/public-shell";
import { Reveal } from "@/components/motion";
import { BtnLink } from "@/components/ui";
import { getSessionUser, isStaff } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { cn, isServiceAllowedForEmail } from "@/lib/utils";
import type { ServiceKind } from "@/lib/types";

export const metadata: Metadata = { title: "Pilih Layanan" };
export const dynamic = "force-dynamic";

const OPTIONS = [
  {
    href: "/outbound/apply",
    info: "/outbound",
    icon: Plane,
    title: "Outbound Mobility",
    audience: "Mahasiswa PNJ",
    body: "Exchange, magang internasional, IISMA, joint degree, dan short course.",
    outputs: "Surat rekomendasi paspor · visa · jaminan dana"
  },
  {
    href: "/inbound/apply",
    info: "/inbound",
    icon: BookOpen,
    title: "Inbound International",
    audience: "Mahasiswa & peneliti asing",
    body: "Pendaftaran program gelar dan non-gelar di kampus PNJ Depok.",
    outputs: "Letter of Acceptance · kliring visa · e-Certificate"
  },
  {
    href: "/pdln/apply",
    info: "/pdln",
    icon: ShieldCheck,
    title: "Perjalanan Dinas Luar Negeri",
    audience: "Dosen, tendik, mahasiswa",
    body: "Izin dinas kenegaraan sesuai Permensesneg No. 5/2017, termasuk delegasi.",
    outputs: "Surat pengantar Setneg · daftar delegasi · SPTJM"
  }
];

export default async function PengajuanHub() {
  const user = await getSessionUser();
  const settings = getStore().settings;
  const open = {
    outbound: settings.openOutbound,
    inbound: settings.openInbound,
    pdln: settings.openPdln
  };

  return (
    <PublicShell>
      <PageBand
        eyebrow="Quick start"
        title="Pilih layanan yang ingin diajukan"
        description="Tiga layanan berbagi satu akun dan satu riwayat berkas. Pilih jalur di bawah — Anda dapat menyimpan draf dan melanjutkannya kapan saja."
        crumb={[{ href: "/pengajuan", label: "Layanan" }]}
        actions={
          user ? (
            <BtnLink href={isStaff(user.role) ? "/admin" : "/dashboard"} variant="onDark" size="lg">
              Buka {isStaff(user.role) ? "command center" : "dashboard"}
              <ArrowUpRight className="size-4" />
            </BtnLink>
          ) : (
            <BtnLink href="/login" variant="onDark" size="lg">
              Masuk akun demo
              <ArrowUpRight className="size-4" />
            </BtnLink>
          )
        }
      />

      <div className="mx-auto max-w-[78rem] px-5 pb-20 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {OPTIONS.map((option, i) => {
            const Icon = option.icon;
            const serviceKey = option.info.replace("/", "") as ServiceKind;
            const available = open[serviceKey];
            const allowed = user ? isServiceAllowedForEmail(user.email, serviceKey) : true;
            return (
              <Reveal key={option.href} delay={i * 90}>
                <article className={cn("group flex h-full flex-col rounded-panel bg-white p-7 shadow-[0_20px_50px_-40px_rgb(13_26_21_/_0.55)] transition-transform duration-500 hover:-translate-y-1", !allowed && "opacity-85")}>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-full bg-forest-900 text-white">
                      <Icon className="size-5" strokeWidth={1.7} />
                    </span>
                    {!allowed ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                        Khusus Email Non-PNJ
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-forest-600">{option.audience}</p>
                  <h2 className="display-card mt-1.5 text-ink">{option.title}</h2>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-mute">{option.body}</p>
                  <p className="mt-4 rounded-xl bg-canvas-soft px-3.5 py-2.5 text-[0.75rem] font-medium text-ink-soft">{option.outputs}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    {allowed ? (
                      <BtnLink href={option.href} size="sm">
                        Mulai pengajuan
                        <ArrowUpRight className="size-3.5" />
                      </BtnLink>
                    ) : (
                      <BtnLink href={option.info} variant="outline" size="sm">
                        Lihat persyaratan
                      </BtnLink>
                    )}
                    <Link href={option.info} className="text-[0.75rem] font-semibold text-ink-mute underline-grow hover:text-forest-800">
                      Informasi
                    </Link>
                  </div>
                  {!allowed ? (
                    <p className="mt-3 text-[0.6875rem] text-ink-mute">
                      Akun email PNJ difasilitasi untuk layanan <strong>Outbound</strong> dan <strong>PDLN</strong>. Inbound hanya untuk pendaftar asing (email biasa).
                    </p>
                  ) : !available ? (
                    <p className="mt-3 text-[0.6875rem] font-medium text-stop-700">Pendaftaran sedang ditutup sementara.</p>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 grid gap-6 rounded-panel bg-canvas-soft p-7 sm:grid-cols-3 sm:p-9">
            {[
              { icon: Clock3, title: "± 12 menit", body: "Rata-rata waktu pengisian satu berkas dengan draf tersimpan otomatis." },
              { icon: ClipboardList, title: "5 langkah", body: "Identitas, kegiatan, perjalanan, dokumen, lalu tinjau dan kirim." },
              { icon: Users, title: "Verifikator manusia", body: "Setiap keputusan diambil staf KUI dengan catatan yang dapat Anda baca." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3.5">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white text-forest-800">
                    <Icon className="size-4" strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[0.9375rem] font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-mute">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-[0.75rem] text-ink-mute">
            <Sparkles className="size-3.5 text-forest-600" />
            Data identitas delegasi tidak pernah dipublikasikan — hanya nama dan status verifikasi pada papan transparansi.
          </p>
        </Reveal>
      </div>
    </PublicShell>
  );
}