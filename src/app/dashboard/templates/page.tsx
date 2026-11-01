import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Download, FileSpreadsheet, FileText, FileType2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui";
import { getSessionUser, isStaff } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { SERVICE_META } from "@/lib/utils";

export const metadata: Metadata = { title: "Blanko Dokumen" };
export const dynamic = "force-dynamic";

const ICONS = { PDF: FileText, DOCX: FileType2, XLSX: FileSpreadsheet } as const;

export default async function DashboardTemplatesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/templates");
  if (isStaff(user.role)) redirect("/admin");

  const templates = getStore().templates;

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="student"
      title="Blanko dokumen resmi"
      subtitle="Unduhan blanko asli KUI. Versi terisi dengan nomor register diterbitkan otomatis lewat portal."
    >
      <div className="space-y-8">
        {(["outbound", "inbound", "pdln"] as const).map((service) => (
          <section key={service}>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-forest-700">{SERVICE_META[service].short}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {templates
                .filter((t) => t.service === service)
                .map((template) => {
                  const Icon = ICONS[template.format];
                  return (
                    <a
                      key={template.id}
                      href={`/api/files?id=${template.id}`}
                      className="group flex items-start gap-3.5 rounded-card bg-white p-4 shadow-[0_14px_34px_-34px_rgb(13_26_21_/_0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-34px_rgb(13_26_21_/_0.5)]"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-canvas-soft text-forest-800 transition-colors group-hover:bg-forest-900 group-hover:text-white">
                        <Icon className="size-4" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[0.875rem] font-semibold text-ink">{template.name}</p>
                          <Badge>{template.format}</Badge>
                        </div>
                        <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-mute">{template.description}</p>
                        <p className="mt-1.5 text-[0.6875rem] text-ink-mute">v{template.version} · {template.sizeLabel}</p>
                      </div>
                      <Download className="mt-1 size-4 shrink-0 text-ink-mute transition-colors group-hover:text-forest-800" />
                    </a>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}