import type { Metadata } from "next";
import { Download, FileSpreadsheet, FileText, FileType2 } from "lucide-react";
import { PublicShell, PageBand } from "@/components/public-shell";
import { Reveal } from "@/components/motion";
import { Badge } from "@/components/ui";
import { getStore } from "@/lib/store";
import { SERVICE_META } from "@/lib/utils";
import type { ServiceKind } from "@/lib/types";

export const metadata: Metadata = { title: "Blanko & Format Dokumen" };
export const dynamic = "force-dynamic";

const ICONS = { PDF: FileText, DOCX: FileType2, XLSX: FileSpreadsheet } as const;

export default function TemplatesPage() {
  const templates = getStore().templates;
  const grouped = (["outbound", "inbound", "pdln"] as ServiceKind[]).map((service) => ({
    service,
    rows: templates.filter((t) => t.service === service)
  }));

  return (
    <PublicShell>
      <PageBand
        eyebrow="Repositori dokumen"
        title="Blanko resmi & format KUI"
        description="Unduh blanko asli untuk pengisian manual, atau gunakan portal agar nomor register, stempel digital, dan QR verifikasi tercetak otomatis."
        crumb={[{ href: "/templates", label: "Blanko" }]}
      />

      <div className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[78rem] space-y-14">
          {grouped.map((group, gi) => (
            <section key={group.service}>
              <Reveal delay={gi * 60}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-forest-700">
                      {SERVICE_META[group.service].short}
                    </p>
                    <h2 className="display-section mt-1 text-ink">{SERVICE_META[group.service].label}</h2>
                  </div>
                  <p className="hidden text-[0.75rem] text-ink-mute sm:block">{group.rows.length} dokumen</p>
                </div>
              </Reveal>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {group.rows.map((template, i) => {
                  const Icon = ICONS[template.format];
                  return (
                    <Reveal key={template.id} delay={i * 70}>
                      <a
                        href={`/api/files?id=${template.id}`}
                        className="group flex h-full items-start gap-4 rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-36px_rgb(13_26_21_/_0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_-36px_rgb(13_26_21_/_0.45)]"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-canvas-soft text-forest-800 transition-colors group-hover:bg-forest-900 group-hover:text-white">
                          <Icon className="size-4.5" strokeWidth={1.7} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-[0.9375rem] font-semibold text-ink">{template.name}</p>
                            <Badge tone="neutral">{template.format}</Badge>
                          </div>
                          <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-mute">{template.description}</p>
                          <p className="mt-2 text-[0.6875rem] text-ink-mute">
                            Versi {template.version} · {template.sizeLabel}
                          </p>
                        </div>
                        <Download className="mt-1 size-4 shrink-0 text-ink-mute transition-colors group-hover:text-forest-800" />
                      </a>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}