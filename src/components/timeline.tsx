import { Check, Clock3, FileText, Send, ShieldCheck, Stamp, XCircle } from "lucide-react";
import { cn, formatDateTime, STATUS_META } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/lib/types";

const STEPS: Array<{ status: ApplicationStatus; label: string; body: string; icon: typeof Check }> = [
  { status: "draft", label: "Draf disusun", body: "Berkas dibuat dan dapat diubah kapan saja.", icon: FileText },
  { status: "submitted", label: "Terkirim ke KUI", body: "Berkas masuk antrean verifikasi.", icon: Send },
  { status: "under_review", label: "Verifikasi berkas", body: "Verifikator memeriksa keabsahan dokumen.", icon: Clock3 },
  { status: "approved", label: "Disetujui", body: "Surat rekomendasi resmi diterbitkan.", icon: ShieldCheck },
  { status: "completed", label: "Selesai", body: "Kegiatan tuntas dan laporan diterima.", icon: Stamp }
];

export function StatusTimeline({ app }: { app: Application }) {
  const currentStep = STATUS_META[app.status].step;
  const rejected = app.status === "rejected";
  const revision = app.status === "revision_required";

  return (
    <ol className="relative space-y-0">
      {STEPS.map((step, i) => {
        const done = currentStep > STATUS_META[step.status].step && !rejected;
        const active = app.status === step.status || (revision && step.status === "under_review");
        const Icon = step.icon;
        const isLast = i === STEPS.length - 1;
        return (
          <li key={step.status} className="relative flex gap-3.5 pb-5 last:pb-0">
            {!isLast ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[0.9375rem] top-8 h-[calc(100%-1.5rem)] w-px",
                  done ? "bg-forest-300" : "bg-hairline"
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-white",
                done && "bg-forest-100 text-forest-700",
                active && !rejected && "bg-forest-900 text-white",
                !done && !active && "bg-canvas-mist text-ink-mute"
              )}
            >
              <Icon className="size-3.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={cn("text-[0.8125rem] font-semibold", active ? "text-ink" : done ? "text-ink-soft" : "text-ink-mute")}>
                {step.label}
                {active ? (
                  <span className="ml-2 rounded-full bg-forest-50 px-2 py-0.5 text-[0.625rem] font-semibold text-forest-800">
                    {revision ? "Menunggu perbaikan Anda" : "Sedang di sini"}
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-ink-mute">{step.body}</p>
            </div>
          </li>
        );
      })}
      {rejected ? (
        <li className="flex gap-3.5 pt-1">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-stop-50 text-stop-700 ring-4 ring-white">
            <XCircle className="size-3.5" />
          </span>
          <div>
            <p className="text-[0.8125rem] font-semibold text-stop-700">Pengajuan ditolak</p>
            <p className="mt-0.5 text-[0.75rem] text-ink-mute">Lihat catatan verifikator di panel revisi.</p>
          </div>
        </li>
      ) : null}
    </ol>
  );
}

export function RevisionPanel({ app }: { app: Application }) {
  if (!app.revisions.length) return null;
  return (
    <div className="rounded-card border border-warn-200 bg-warn-50 p-4">
      <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-warn-700">
        <Clock3 className="size-4" />
        Catatan verifikator ({app.revisions.length})
      </p>
      <ul className="mt-3 space-y-3">
        {app.revisions.map((note) => (
          <li key={note.id} className="rounded-xl bg-white/80 px-3.5 py-3">
            <div className="flex flex-wrap items-center gap-2 text-[0.6875rem] text-ink-mute">
              <span className="rounded-full bg-canvas-mist px-2 py-0.5 font-semibold text-ink-soft">{note.target}</span>
              <span>{note.authorName}</span>
              <span>·</span>
              <span>{formatDateTime(note.createdAt)}</span>
              {note.resolved ? <span className="ml-auto font-semibold text-ok-700">Sudah diperbaiki</span> : <span className="ml-auto font-semibold text-stop-700">Belum</span>}
            </div>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">{note.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}