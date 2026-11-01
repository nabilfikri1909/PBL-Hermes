import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { PublicShell, PageBand } from "./public-shell";
import { ApplicationForm } from "./application-form";
import { BtnLink } from "./ui";
import { getSessionUser } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { FORM_DEFS } from "@/lib/forms";
import { isServiceAllowedForEmail, SERVICE_META } from "@/lib/utils";
import type { ServiceKind } from "@/lib/types";

export async function ApplyPage({ service }: { service: ServiceKind }) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${SERVICE_META[service].href}/apply`);

  if (!isServiceAllowedForEmail(user.email, service)) {
    return (
      <PublicShell bare>
        <PageBand
          eyebrow={`${SERVICE_META[service].short} · Akses Layanan`}
          title="Layanan Khusus Peserta Asing"
          description="Akun civitas akademika Politeknik Negeri Jakarta (@student.pnj.ac.id / @pnj.ac.id) terdaftar sebagai mahasiswa/dosen domestik PNJ, sehingga difasilitasi untuk layanan Outbound Mobility dan Perjalanan Dinas Luar Negeri (PDLN)."
          crumb={[{ href: "/pengajuan", label: "Layanan" }]}
        />
        <div className="bg-canvas-soft pb-24">
          <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6">
            <div className="rounded-panel border border-hairline bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgb(13_26_21_/_0.3)]">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-mint-100 text-forest-800">
                <ShieldAlert className="size-7 text-forest-800" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-ink">Inbound Hanya Untuk Email Non-PNJ</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-mute">
                Layanan Inbound International diperuntukkan bagi mahasiswa atau peserta luar negeri yang mendaftar ke kampus PNJ menggunakan email umum / institusi asal (email non-PNJ). Mahasiswa dengan email PNJ dapat mengajukan Outbound atau PDLN.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <BtnLink href="/outbound/apply" size="md">
                  Ajukan Outbound Mobility
                  <ArrowUpRight className="size-4" />
                </BtnLink>
                <BtnLink href="/pdln/apply" variant="outline" size="md">
                  Ajukan PDLN
                </BtnLink>
                <BtnLink href="/pengajuan" variant="ghost" size="md">
                  Kembali ke pilihan layanan
                </BtnLink>
              </div>
            </div>
          </div>
        </div>
      </PublicShell>
    );
  }

  const existing =
    getStore().applications.find(
      (a) => a.ownerId === user.id && a.service === service && (a.status === "draft" || a.status === "revision_required")
    ) ?? null;
  const def = FORM_DEFS[service];

  return (
    <PublicShell bare>
      <PageBand
        eyebrow={`${SERVICE_META[service].short} · Formulir`}
        title={`Pengajuan ${SERVICE_META[service].label}`}
        description={def.intro}
        crumb={[{ href: SERVICE_META[service].href, label: SERVICE_META[service].short }]}
      />
      <div className="bg-canvas-soft pb-24">
        <div className="mx-auto max-w-[82rem] px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href={SERVICE_META[service].href} className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:text-forest-800">
              <ArrowLeft className="size-3.5" />
              Kembali ke informasi layanan
            </Link>
            {existing ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.75rem] font-medium text-ink-soft">
                <ShieldCheck className="size-3.5 text-forest-700" />
                Melanjutkan draf {existing.registerNo || "yang belum terkirim"}
              </span>
            ) : null}
          </div>

          <ApplicationForm
            service={service}
            existing={existing}
            user={{
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              nim: user.nim,
              department: user.department,
              phone: user.phone,
              nationality: user.nationality
            }}
          />
        </div>
      </div>
    </PublicShell>
  );
}