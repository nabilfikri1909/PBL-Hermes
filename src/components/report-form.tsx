"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, Loader2, Receipt, Send } from "lucide-react";
import { toast } from "sonner";
import { Btn, FieldLabel, inputClass, textareaClass } from "./ui";
import { cn, rupiah } from "@/lib/utils";
import type { Application, ParticipantExpense } from "@/lib/types";

const COLUMNS: Array<{ key: keyof Omit<ParticipantExpense, "participantId">; label: string }> = [
  { key: "ticket", label: "Tiket" },
  { key: "accommodation", label: "Akomodasi" },
  { key: "dailyAllowance", label: "Uang harian" },
  { key: "insurance", label: "Asuransi" },
  { key: "other", label: "Lain-lain" }
];

export function ReportForm({ app }: { app: Application }) {
  const router = useRouter();
  const people = app.participants.length
    ? app.participants
    : [{ id: "self", fullName: app.ownerName, role: "Ketua Delegasi" as const, institution: app.department, passportNo: "", docStatus: "valid" as const }];

  const [rows, setRows] = useState<ParticipantExpense[]>(() =>
    people.map((person) => {
      const existing = app.report.expenses.find((e) => e.participantId === person.id);
      return existing ?? { participantId: person.id, ticket: 0, accommodation: 0, dailyAllowance: 0, insurance: 0, other: 0 };
    })
  );
  const [summary, setSummary] = useState(app.report.summary);
  const [fileName, setFileName] = useState(app.report.fileName ?? "");
  const [saving, setSaving] = useState(false);

  const totals = useMemo(
    () => rows.map((row) => row.ticket + row.accommodation + row.dailyAllowance + row.insurance + row.other),
    [rows]
  );
  const grand = totals.reduce((a, b) => a + b, 0);
  const variance = app.budget - grand;

  const update = (index: number, key: keyof Omit<ParticipantExpense, "participantId">, value: string) => {
    const numeric = Number(value.replace(/[^0-9]/g, "")) || 0;
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: numeric } : row)));
  };

  const submit = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "report", applicationId: app.id, expenses: rows, summary, fileName })
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!payload.ok) {
        toast.error(payload.error ?? "Laporan gagal disimpan.");
        setSaving(false);
        return;
      }
      toast.success("Laporan akhir terkirim untuk divalidasi KUI.");
      router.refresh();
      setSaving(false);
    } catch {
      toast.error("Koneksi gagal.");
      setSaving(false);
    }
  };

  return (
    <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
            <Receipt className="size-4 text-forest-700" />
            Laporan akhir & realisasi biaya
          </p>
          <p className="mt-1 text-[0.75rem] text-ink-mute">Satu baris per peserta — tanpa pemukulan rata (lump sum).</p>
        </div>
        <span className={cn("rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold", app.report.validatedAt ? "bg-ok-50 text-ok-700" : app.report.submittedAt ? "bg-warn-50 text-warn-700" : "bg-canvas-mist text-ink-mute")}>
          {app.report.validatedAt ? "Tervalidasi KUI" : app.report.submittedAt ? "Menunggu validasi" : "Belum dikirim"}
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-[0.75rem]">
          <thead>
            <tr className="text-left text-[0.6875rem] uppercase tracking-[0.06em] text-ink-mute">
              <th className="pb-2 pr-3 font-semibold">Peserta</th>
              {COLUMNS.map((column) => (
                <th key={column.key} className="pb-2 pr-2 font-semibold">
                  {column.label}
                </th>
              ))}
              <th className="pb-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person, index) => (
              <tr key={person.id} className="border-t border-hairline-soft">
                <td className="py-2.5 pr-3">
                  <p className="font-semibold text-ink">{person.fullName}</p>
                  <p className="text-[0.6875rem] text-ink-mute">{person.role}</p>
                </td>
                {COLUMNS.map((column) => (
                  <td key={column.key} className="py-2.5 pr-2">
                    <input
                      inputMode="numeric"
                      value={rows[index]?.[column.key] ? String(rows[index]?.[column.key]) : ""}
                      onChange={(e) => update(index, column.key, e.target.value)}
                      placeholder="0"
                      className="h-8 w-full min-w-[4.5rem] rounded-lg border border-hairline bg-white px-2 text-right text-[0.75rem] tabular focus:border-forest-500 focus:outline-none"
                    />
                  </td>
                ))}
                <td className="py-2.5 text-right font-semibold tabular text-forest-900">{rupiah(totals[index] ?? 0)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-hairline">
              <td colSpan={2} className="pt-3 text-[0.75rem] font-semibold text-ink">
                Total realisasi
              </td>
              <td colSpan={COLUMNS.length} className="pt-3 text-right text-[0.8125rem] font-bold tabular text-forest-900">
                {rupiah(grand)}
              </td>
              <td className="pt-3" />
            </tr>
            <tr>
              <td colSpan={7} className="pt-1 text-right text-[0.6875rem] text-ink-mute">
                Pagu {rupiah(app.budget)} · selisih {rupiah(Math.abs(variance))} {variance >= 0 ? "di bawah pagu" : "di atas pagu"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <FieldLabel>Ringkasan hasil kegiatan</FieldLabel>
          <textarea className={textareaClass} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Capaian utama, hasil kerja sama, dan tindak lanjut setelah kegiatan." />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-forest-200 px-4 py-2 text-[0.8125rem] font-semibold text-forest-800 transition-colors hover:bg-forest-50">
            <CloudUpload className="size-4" />
            {fileName || "Unggah laporan PDF"}
            <input
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
              }}
            />
          </label>
          <input
            className={cn(inputClass, "h-10 max-w-[16rem]")}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="nama-berkas-laporan.pdf"
            aria-label="Nama berkas laporan"
          />
          <Btn type="button" onClick={submit} disabled={saving} className="ml-auto">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Kirim laporan
          </Btn>
        </div>
      </div>
    </div>
  );
}