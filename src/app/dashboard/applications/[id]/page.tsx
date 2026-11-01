import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, FileText, Printer, Stamp, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LiveDocumentPreview } from "@/components/live-document-preview";
import { ReportForm } from "@/components/report-form";
import { StatusTimeline, RevisionPanel } from "@/components/timeline";
import { BtnLink } from "@/components/ui";
import { getSessionUser, isStaff } from "@/lib/auth";
import { getApplicationById } from "@/lib/store";
import { CATEGORY_LABELS, FUNDING_LABELS, type LetterData } from "@/lib/letters";
import { countryName, formatDate, formatDateTime, formatRange, rupiah, SERVICE_META, STATUS_META } from "@/lib/utils";

export const metadata: Metadata = { title: "Detail Pengajuan" };
export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/dashboard/applications/${id}`);

  const app = getApplicationById(id);
  if (!app) notFound();
  if (app.ownerId !== user.id && !isStaff(user.role)) redirect("/dashboard/applications");

  const letterData: LetterData = {
    registerNo: app.registerNo,
    applicantName: app.ownerName,
    applicantNim: app.ownerNim ?? "",
    department: app.department,
    email: app.ownerEmail,
    phone: user.phone,
    passportNo: app.passportNo,
    nationality: user.nationality,
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

  const canReport = app.status === "approved" || app.status === "completed" || app.status === "forwarded_to_kui";
  const editable = app.status === "draft" || app.status === "revision_required";

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="student"
      title={app.title || "Pengajuan tanpa judul"}
      subtitle={`${app.registerNo || "nomor belum terbit"} · ${SERVICE_META[app.service].label} · diperbarui ${formatDateTime(app.updatedAt)}`}
      actions={
        <span className={`hidden rounded-full border px-3 py-1.5 text-[0.6875rem] font-semibold sm:inline-flex ${STATUS_META[app.status].className}`}>
          {STATUS_META[app.status].label}
        </span>
      }
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/applications" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-mute transition-colors hover:text-forest-800">
          <ArrowLeft className="size-3.5" />
          Kembali ke daftar
        </Link>
        <div className="flex flex-wrap gap-2">
          {editable ? (
            <BtnLink href={`/dashboard/applications/${app.id}/edit`} size="sm">
              {app.status === "draft" ? "Lanjutkan pengisian" : "Perbaiki berkas"}
            </BtnLink>
          ) : null}
          {app.status === "approved" || app.status === "completed" ? (
            <BtnLink href={`/api/files?id=${app.service === "outbound" ? "tpl_1" : app.service === "inbound" ? "tpl_4" : "tpl_6"}`} size="sm" variant="outline">
              <Download className="size-3.5" />
              Unduh blanko
            </BtnLink>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
            <p className="text-[0.9375rem] font-bold text-ink">Ringkasan berkas</p>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                ["Kategori", CATEGORY_LABELS[app.category] ?? (app.category || "—")],
                ["Institusi mitra", app.partnerInstitution || "—"],
                ["Negara & kota", `${countryName(app.country)}${app.city ? ` · ${app.city}` : ""}`],
                ["Periode", formatRange(app.startDate, app.endDate)],
                ["Sumber dana", FUNDING_LABELS[app.fundingSource] ?? app.fundingSource],
                ["Anggaran", rupiah(app.budget)],
                ["Nomor paspor", app.passportNo ? `••••${app.passportNo.slice(-4)}` : "—"],
                ["Tanggal kirim", app.submittedAt ? formatDate(app.submittedAt) : "belum dikirim"]
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-ink-mute">{label}</dt>
                  <dd className="mt-0.5 text-[0.875rem] font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            {app.summary ? <p className="mt-4 rounded-xl bg-canvas-soft px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-soft">{app.summary}</p> : null}
          </section>

          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
            <p className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
              <FileText className="size-4 text-forest-700" />
              Berkas persyaratan
            </p>
            <ul className="mt-4 space-y-2">
              {app.documents.map((doc) => (
                <li key={doc.slot} className="flex items-center justify-between gap-3 rounded-xl bg-canvas-soft px-3.5 py-2.5">
                  <span className="min-w-0">
                    <span className="block truncate text-[0.8125rem] font-medium text-ink">{doc.label}</span>
                    <span className="block truncate text-[0.6875rem] text-ink-mute">{doc.fileName ?? "belum diunggah"}{doc.sizeLabel ? ` · ${doc.sizeLabel}` : ""}</span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold ${
                      doc.status === "valid" ? "bg-ok-50 text-ok-700" : doc.status === "revision" ? "bg-stop-50 text-stop-700" : "bg-warn-50 text-warn-700"
                    }`}
                  >
                    {doc.status === "valid" ? "Terverifikasi" : doc.status === "revision" ? "Revisi" : "Menunggu"}
                  </span>
                </li>
              ))}
              {app.documents.length === 0 ? <li className="text-[0.8125rem] text-ink-mute">Belum ada dokumen terunggah.</li> : null}
            </ul>
          </section>

          {app.participants.length ? (
            <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
              <p className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
                <Users className="size-4 text-forest-700" />
                Anggota delegasi ({app.participants.length})
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {app.participants.map((participant) => (
                  <li key={participant.id} className="rounded-xl bg-canvas-soft px-3.5 py-2.5">
                    <p className="text-[0.8125rem] font-semibold text-ink">{participant.fullName}</p>
                    <p className="text-[0.6875rem] text-ink-mute">{participant.role} · {participant.institution || "PNJ"}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {canReport ? <ReportForm app={app} /> : null}

          {app.status === "approved" || app.status === "completed" ? (
            <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
                  <Printer className="size-4 text-forest-700" />
                  Pratinjau surat resmi
                </p>
                <span className="text-[0.6875rem] text-ink-mute">Gunakan tombol Cetak untuk menyimpan PDF</span>
              </div>
              <div className="mt-4">
                <LiveDocumentPreview service={app.service} data={letterData} registerNo={app.registerNo} />
              </div>
            </section>
          ) : null}
        </div>

        <div className="space-y-5">
          <section className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
            <p className="text-[0.9375rem] font-bold text-ink">Linimasa berkas</p>
            <div className="mt-4">
              <StatusTimeline app={app} />
            </div>
          </section>

          <RevisionPanel app={app} />

          {app.setneg ? (
            <section className="rounded-card-lg bg-forest-50 p-5">
              <p className="flex items-center gap-2 text-[0.8125rem] font-bold text-forest-800">
                <Stamp className="size-4" />
                Surat Persetujuan Setneg
              </p>
              <p className="mt-2 text-[0.75rem] text-forest-800/80">{app.setneg.letterNo} · {formatDate(app.setneg.issuedAt)}</p>
              <p className="mt-1 text-[0.6875rem] text-forest-700">{app.setneg.fileName}</p>
            </section>
          ) : null}

          <section className="rounded-card-lg bg-canvas-soft p-5">
            <p className="text-[0.8125rem] font-bold text-ink">Butuh perubahan data?</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-mute">
              Berkas yang sudah dikirim dapat diperbarui setelah verifikator meminta perbaikan. Untuk kasus lain,
              kirim tiket agar KUI membuka akses edit.
            </p>
            <Link href="/dashboard/questions" className="mt-3 inline-flex text-[0.75rem] font-semibold text-forest-800 underline-grow">
              Kirim tiket
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}