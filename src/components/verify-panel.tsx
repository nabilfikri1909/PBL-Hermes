"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, Send, ShieldCheck, Stamp } from "lucide-react";
import { toast } from "sonner";
import { Btn, FieldLabel, inputClass, selectClass, textareaClass } from "./ui";
import { cn, formatDate, SERVICE_META } from "@/lib/utils";
import type { Application, ApplicationStatus, Role } from "@/lib/types";
import { availableVerdicts, type Verdict } from "@/lib/workflow";

export function VerifyPanel({ app, role }: { app: Application; role: Role }) {
  const router = useRouter();
  const verdicts = availableVerdicts(app.status, role);
  const [note, setNote] = useState("");
  const [target, setTarget] = useState(app.documents[0]?.slot ?? "berkas");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<Verdict | null>(null);
  const [setneg, setSetneg] = useState({ letterNo: app.setneg?.letterNo ?? "", issuedAt: app.setneg?.issuedAt?.slice(0, 10) ?? "", fileName: app.setneg?.fileName ?? "" });

  const send = async (verdict: Verdict) => {
    const rule = verdicts.find((r) => r.verdict === verdict);
    if (rule?.requiresNote && !note.trim()) {
      toast.error("Catatan verifikator wajib diisi untuk keputusan ini.");
      return;
    }
    setBusy(verdict);
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", applicationId: app.id, verdict, note, target })
      });
      const payload = (await response.json()) as { ok: boolean; status?: ApplicationStatus; error?: string };
      if (!payload.ok) {
        toast.error(payload.error ?? "Keputusan gagal disimpan.");
        setBusy(null);
        return;
      }
      toast.success(`Status berkas kini: ${payload.status}.`);
      setNote("");
      router.refresh();
      setBusy(null);
    } catch {
      toast.error("Koneksi gagal.");
      setBusy(null);
    }
  };

  const saveSetneg = async () => {
    setBusy("forward");
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setneg", applicationId: app.id, ...setneg })
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!payload.ok) {
        toast.error(payload.error ?? "Gagal menyimpan surat persetujuan.");
        setBusy(null);
        return;
      }
      toast.success("Surat Persetujuan Setneg dicatat.");
      router.refresh();
      setBusy(null);
    } catch {
      toast.error("Koneksi gagal.");
      setBusy(null);
    }
  };

  const validateReport = async () => {
    setBusy("complete");
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "validate-report", applicationId: app.id })
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!payload.ok) {
        toast.error(payload.error ?? "Validasi gagal.");
        setBusy(null);
        return;
      }
      toast.success("Laporan akhir divalidasi.");
      router.refresh();
      setBusy(null);
    } catch {
      toast.error("Koneksi gagal.");
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <p className="flex items-center gap-2 text-[0.875rem] font-bold text-ink">
          <ShieldCheck className="size-4 text-forest-700" />
          Instrumen verifikasi
        </p>
        <p className="mt-1 text-[0.75rem] text-ink-mute">
          {SERVICE_META[app.service].label} · status saat ini {app.status}
        </p>

        <div className="mt-4 space-y-2">
          {app.documents.map((doc) => (
            <label key={doc.slot} className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-canvas-soft px-3 py-2.5">
              <input
                type="checkbox"
                checked={checklist[doc.slot] ?? doc.status === "valid"}
                onChange={(e) => setChecklist((prev) => ({ ...prev, [doc.slot]: e.target.checked }))}
                className="mt-0.5 size-3.5 accent-[#1e6a47]"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] font-medium text-ink">{doc.label}</span>
                <span className="block truncate text-[0.6875rem] text-ink-mute">{doc.fileName ?? "belum diunggah"}</span>
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold",
                  doc.status === "valid" ? "bg-ok-50 text-ok-700" : doc.status === "revision" ? "bg-stop-50 text-stop-700" : "bg-warn-50 text-warn-700"
                )}
              >
                {doc.status === "valid" ? "Valid" : doc.status === "revision" ? "Revisi" : "Menunggu"}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <FieldLabel>Catatan untuk pemohon</FieldLabel>
          <textarea className={cn(textareaClass, "min-h-[5.5rem]")} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Wajib untuk keputusan minta perbaikan atau penolakan." />
        </div>

        <div className="mt-3">
          <FieldLabel>Ditujukan pada bagian</FieldLabel>
          <select className={selectClass} value={target} onChange={(e) => setTarget(e.target.value)}>
            {app.documents.map((doc) => (
              <option key={doc.slot} value={doc.slot}>
                {doc.label}
              </option>
            ))}
            <option value="berkas">Berkas umum</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {verdicts.length === 0 ? <p className="text-[0.75rem] text-ink-mute">Tidak ada keputusan tersedia untuk status ini.</p> : null}
          {verdicts.map((rule) => {
            const danger = rule.verdict === "reject" || rule.verdict === "request_revision";
            return (
              <Btn
                key={rule.verdict}
                type="button"
                size="sm"
                variant={danger ? "outline" : "primary"}
                onClick={() => send(rule.verdict)}
                disabled={busy !== null}
              >
                {busy === rule.verdict ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                {rule.label}
              </Btn>
            );
          })}
        </div>
      </div>

      {app.service === "pdln" ? (
        <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <p className="flex items-center gap-2 text-[0.875rem] font-bold text-ink">
            <Stamp className="size-4 text-forest-700" />
            Surat Persetujuan Setneg
          </p>
          <div className="mt-3 grid gap-3">
            <div>
              <FieldLabel>Nomor SP</FieldLabel>
              <input className={inputClass} value={setneg.letterNo} onChange={(e) => setSetneg({ ...setneg, letterNo: e.target.value })} placeholder="SP/Setneg/0412/2026" />
            </div>
            <div>
              <FieldLabel>Tanggal terbit</FieldLabel>
              <input type="date" className={inputClass} value={setneg.issuedAt} onChange={(e) => setSetneg({ ...setneg, issuedAt: e.target.value })} />
            </div>
            <div>
              <FieldLabel>Nama berkas</FieldLabel>
              <input className={inputClass} value={setneg.fileName} onChange={(e) => setSetneg({ ...setneg, fileName: e.target.value })} placeholder="SP-Setneg-0412-2026.pdf" />
            </div>
            <Btn type="button" size="sm" onClick={saveSetneg} disabled={busy !== null}>
              <Send className="size-3.5" />
              Catat & teruskan ke Setneg
            </Btn>
          </div>
          {app.setneg ? (
            <p className="mt-3 rounded-xl bg-ok-50 px-3 py-2 text-[0.6875rem] text-ok-700">
              Tercatat {app.setneg.letterNo} · {formatDate(app.setneg.issuedAt)}
            </p>
          ) : null}
        </div>
      ) : null}

      {app.report.submittedAt ? (
        <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
          <p className="text-[0.875rem] font-bold text-ink">Laporan akhir</p>
          <p className="mt-1 text-[0.75rem] text-ink-mute">
            {app.report.fileName || "berkas belum dinamai"} · realisasi {app.report.expenses.length} baris peserta
          </p>
          {app.report.validatedAt ? (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-ok-50 px-3 py-2 text-[0.6875rem] text-ok-700">
              <CheckCircle2 className="size-3.5" />
              Tervalidasi {formatDate(app.report.validatedAt)}
            </p>
          ) : (
            <Btn type="button" size="sm" className="mt-3" onClick={validateReport} disabled={busy !== null}>
              {busy === "complete" ? <Loader2 className="size-3.5 animate-spin" /> : <AlertTriangle className="size-3.5" />}
              Validasi laporan & biaya
            </Btn>
          )}
        </div>
      ) : null}
    </div>
  );
}