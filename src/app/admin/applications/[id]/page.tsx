import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Mail, Phone, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LiveDocumentPreview } from "@/components/live-document-preview";
import { VerifyPanel } from "@/components/verify-panel";
import { RevisionPanel, StatusTimeline } from "@/components/timeline";
import { requireStaffPage } from "@/lib/auth";
import { getApplicationById } from "@/lib/store";
import { CATEGORY_LABELS, FUNDING_LABELS, type LetterData } from "@/lib/letters";
import { countryName, formatDate, formatDateTime, formatRange, rupiah, SERVICE_META, STATUS_META } from "@/lib/utils";

export const metadata: Metadata = { title: "Verifikasi Berkas" };
export const dynamic = "force-dynamic";

export default async function AdminVerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireStaffPage(`/admin/applications/${id}`);
  const app = getApplicationById(id);
  if (!app) notFound();

  const letterData: LetterData = {
    registerNo: app.registerNo,
    applicantName: app.ownerName,
    applicantNim: app.ownerNim ?? "",
    department: app.department,
    email: app.ownerEmail,
    phone: "—",
    passportNo: app.passportNo,
    nationality: "Indonesia",
    title: app.title,
    category: app.category,
    partner: app.partnerInstitution,
    country: app.country,
    city: app.city,
    startDate: app.startDate,
    endDate: app.endDate,
    funding: app.fundingSource,
    budget: app.budget,
    summary: app.summary,
    participants: app.participants.map((p) => ({ name: p.fullName, role: p.role, institution: p.institution, docStatus: p.docStatus })),
    role: user.role,
    issueDate: app.updatedAt
  };

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title={app.title || "Pengajuan tanpa judul"}
      subtitle={`${app.registerNo || "nomor belum terbit"} · ${SERVICE_META[app.service].label} · ${app.ownerName}`}
      actions={
        <span className={`hidden rounded-full border px-3 py-1.5 text-[0.6875rem] font-semibold sm:inline-flex ${STATUS_META[app.status].className}`}>
          {STATUS_META[app.status].label}
        </span>
      }
    >
      <Link href="/admin/applications" className="mb-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-mute transition-colors hover:text-forest-800">
        <ArrowLeft className="size-3.5" />
        Kembali ke daftar pengajuan
      </Link>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="min-w-0 space-y-5">
          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
            <p className="text-[0.9375rem] font-bold text-ink">Data pemohon</p>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                ["Nama lengkap", app.ownerName],
                ["NIM / NIP", app.ownerNim ?? "—"],
                ["Jurusan / unit", app.department],
                ["Email", app.ownerEmail],
                ["Nomor paspor", app.passportNo || "—"],
                ["Kategori", CATEGORY_LABELS[app.category] ?? (app.category || "—")],
                ["Institusi mitra", app.partnerInstitution || "—"],
                ["Negara & kota", `${countryName(app.country)}${app.city ? ` · ${app.city}` : ""}`],
                ["Periode", formatRange(app.startDate, app.endDate)],
                ["Sumber dana", FUNDING_LABELS[app.fundingSource] ?? app.fundingSource],
                ["Anggaran", rupiah(app.budget)],
                ["Dikirim", app.submittedAt ? formatDateTime(app.submittedAt) : "belum dikirim"]
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-ink-mute">{label}</dt>
                  <dd className="mt-0.5 truncate text-[0.875rem] font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            {app.summary ? <p className="mt-4 rounded-xl bg-canvas-soft px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-soft">{app.summary}</p> : null}
            <div className="mt-4 flex flex-wrap gap-3 text-[0.75rem] text-ink-mute">
              <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" />{app.ownerEmail}</span>
            </div>
          </section>

          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
            <p className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
              <FileText className="size-4 text-forest-700" />
              Berkas yang diunggah
            </p>
            <ul className="mt-4 space-y-2">
              {app.documents.map((doc) => (
                <li key={doc.slot} className="flex items-center justify-between gap-3 rounded-xl bg-canvas-soft px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[0.8125rem] font-medium text-ink">{doc.label}</p>
                    <p className="truncate text-[0.6875rem] text-ink-mute">{doc.fileName ?? "belum diunggah"}{doc.sizeLabel ? ` · ${doc.sizeLabel}` : ""}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold ${doc.status === "valid" ? "bg-ok-50 text-ok-700" : doc.status === "revision" ? "bg-stop-50 text-stop-700" : "bg-warn-50 text-warn-700"}`}>
                    {doc.status === "valid" ? "Valid" : doc.status === "revision" ? "Revisi" : "Menunggu"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {app.participants.length ? (
            <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
              <p className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
                <Users className="size-4 text-forest-700" />
                Delegasi ({app.participants.length}) — akses verifikator
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-left text-[0.75rem]">
                  <thead>
                    <tr className="text-[0.6875rem] uppercase tracking-[0.06em] text-ink-mute">
                      <th className="pb-2 pr-3 font-semibold">Nama</th>
                      <th className="pb-2 pr-3 font-semibold">Peran</th>
                      <th className="pb-2 pr-3 font-semibold">Unit</th>
                      <th className="pb-2 font-semibold">Paspor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {app.participants.map((participant) => (
                      <tr key={participant.id} className="border-t border-hairline-soft">
                        <td className="py-2.5 pr-3 font-medium text-ink">{participant.fullName}</td>
                        <td className="py-2.5 pr-3 text-ink-soft">{participant.role}</td>
                        <td className="py-2.5 pr-3 text-ink-soft">{participant.institution || "PNJ"}</td>
                        <td className="py-2.5 tabular text-ink-soft">{participant.passportNo || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[0.6875rem] text-ink-mute">
                <ShieldCheck className="size-3.5" />
                Data ini tidak pernah ditampilkan pada halaman publik maupun dashboard anggota lain.
              </p>
            </section>
          ) : null}

          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
            <p className="text-[0.9375rem] font-bold text-ink">Pratinjau dokumen yang akan terbit</p>
            <div className="mt-4">
              <LiveDocumentPreview service={app.service} data={letterData} registerNo={app.registerNo} />
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <VerifyPanel app={app} role={user.role} />
          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
            <p className="text-[0.9375rem] font-bold text-ink">Linimasa</p>
            <div className="mt-4">
              <StatusTimeline app={app} />
            </div>
          </section>
          <RevisionPanel app={app} />
          <section className="rounded-card-lg bg-canvas-soft p-5 text-[0.75rem] leading-relaxed text-ink-mute">
            Keputusan tetap berada pada verifikator manusia. Sistem hanya mencatat transisi status dan jejak audit —
            tidak ada persetujuan otomatis. Berkas {app.registerNo || "ini"} terakhir diperbarui {formatDate(app.updatedAt)}.
          </section>
        </div>
      </div>
    </AppShell>
  );
}