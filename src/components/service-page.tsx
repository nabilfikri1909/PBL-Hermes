import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, FileCheck2, FileText, Info, ShieldCheck } from "lucide-react";
import { PublicShell, PageBand } from "./public-shell";
import { Reveal } from "./motion";
import { Badge, BtnLink, SectionHead } from "./ui";
import { FORM_DEFS, lettersFor } from "@/lib/forms";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { photo } from "@/lib/media";
import { SERVICE_META } from "@/lib/utils";
import type { ServiceKind } from "@/lib/types";

export function ServicePage({ service }: { service: ServiceKind }) {
  const content = SERVICE_CONTENT[service];
  const def = FORM_DEFS[service];
  const letters = lettersFor(service);

  return (
    <PublicShell>
      <PageBand
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        crumb={[{ href: SERVICE_META[service].href, label: SERVICE_META[service].short }]}
        actions={
          <>
            <BtnLink href={`${SERVICE_META[service].href}/apply`} variant="onDark" size="lg" className="sheen">
              Mulai pengajuan
              <ArrowUpRight className="size-4" />
            </BtnLink>
            <BtnLink href="/templates" variant="outlineDark" size="lg">
              Unduh blanko
            </BtnLink>
          </>
        }
      />

      {/* Facts strip */}
      <div className="mx-auto max-w-[78rem] px-5 pb-16 sm:px-8">
        <div className="grid gap-6 rounded-panel bg-white/8 p-6 backdrop-blur-sm ring-1 ring-inset ring-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {content.facts.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 80}>
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-mint-300">{fact.label}</p>
                <p className="mt-1.5 text-[0.9375rem] font-semibold text-white">{fact.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Intro */}
      <section className="bg-canvas px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[78rem] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div className="squircle overflow-hidden">
              <img src={photo(content.image, 1000)} alt={content.imageAlt} className="h-[22rem] w-full object-cover transition-transform duration-[1200ms] hover:scale-105 sm:h-[26rem]" />
            </div>
          </Reveal>
          <div>
            <Reveal delay={80}>
              <SectionHead title="Siapa yang dapat mengajukan?" description="Kriteria di bawah diperiksa verifikator KUI satu per satu pada tahap verifikasi berkas." align="left" />
            </Reveal>
            <ul className="mt-8 space-y-5">
              {content.eligibility.map((item, i) => (
                <Reveal key={item.title} delay={i * 70}>
                  <li className="flex gap-3.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-700">
                      <Check className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-[0.9375rem] font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-mute">{item.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Documents + outputs */}
      <section className="bg-canvas-soft px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[78rem] gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-panel bg-white p-7 shadow-[0_18px_44px_-36px_rgb(13_26_21_/_0.4)]">
              <span className="grid size-10 place-items-center rounded-full bg-canvas-soft text-forest-800">
                <FileText className="size-5" strokeWidth={1.6} />
              </span>
              <h2 className="display-card mt-4 text-ink">Dokumen yang diunggah</h2>
              <p className="mt-2 text-[0.875rem] text-ink-mute">Semua berkas diunggah digital; verifikator memeriksa keabsahannya secara manual.</p>
              <ul className="mt-5 space-y-2.5">
                {def.docs.map((doc) => (
                  <li key={doc.slot} className="flex items-start justify-between gap-3 rounded-xl bg-canvas-soft px-3.5 py-2.5">
                    <span className="text-[0.875rem] text-ink-soft">{doc.label}</span>
                    <Badge tone={doc.required ? "stop" : "neutral"}>{doc.required ? "Wajib" : "Opsional"}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="h-full rounded-panel bg-forest-900 p-7 text-white">
              <span className="grid size-10 place-items-center rounded-full bg-white/10 text-mint-300">
                <FileCheck2 className="size-5" strokeWidth={1.6} />
              </span>
              <h2 className="display-card mt-4">Surat yang diterbitkan</h2>
              <p className="mt-2 text-[0.875rem] text-mint-200/80">Format resmi KUI, siap dicetak, dengan nomor register dan stempel digital.</p>
              <ul className="mt-5 space-y-4">
                {letters.map((letter) => (
                  <li key={letter.kind} className="rounded-xl bg-white/8 px-3.5 py-3">
                    <p className="text-[0.875rem] font-semibold text-white">{letter.title}</p>
                    <p className="mt-0.5 text-[0.75rem] text-mint-200/70">{letter.sheets} lembar A4 · pratinjau langsung di formulir</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Notes + CTA */}
      <section className="bg-canvas px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[78rem]">
          <div className="grid gap-8 rounded-panel bg-canvas-soft p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-forest-800">
                <ShieldCheck className="size-4" />
                Catatan penting
              </p>
              <ul className="mt-4 space-y-3">
                {content.notes.map((note) => (
                  <li key={note} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-ink-soft">
                    <Info className="mt-0.5 size-4 shrink-0 text-forest-600" />
                    {note}
                  </li>
                ))}
              </ul>
              {service === "pdln" ? (
                <Link href="/pdln/public-applications" className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-forest-800 underline-grow">
                  Lihat papan transparansi izin PDLN
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : null}
            </div>
            <div className="text-left lg:text-right">
              <p className="text-[0.9375rem] font-semibold text-ink">Siap mengisi berkas?</p>
              <p className="mt-1 text-[0.8125rem] text-ink-mute">Draf tersimpan otomatis — Anda bisa melanjutkan kapan saja.</p>
              <BtnLink href={`${SERVICE_META[service].href}/apply`} size="lg" className="mt-4">
                Buka formulir pengajuan
                <ArrowUpRight className="size-4" />
              </BtnLink>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}