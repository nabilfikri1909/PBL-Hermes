"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CloudUpload,
  FileText,
  Loader2,
  Plus,
  Trash2,
  UserPlus,
  X
} from "lucide-react";
import { toast } from "sonner";
import { FORM_DEFS } from "@/lib/forms";
import { buildSheets, type LetterData } from "@/lib/letters";
import { COUNTRIES, cn, formatRange, rupiah } from "@/lib/utils";
import type { Application, Participant, RequirementDoc, ServiceKind } from "@/lib/types";
import { LiveDocumentPreview } from "./live-document-preview";
import { Btn, FieldLabel, inputClass, Progress, selectClass, textareaClass } from "./ui";

type Values = Record<string, string>;
type SavingState = "idle" | "saving" | "saved" | "error";

const ROLE_OPTIONS: Array<Participant["role"]> = ["Ketua Delegasi", "Anggota", "Pendamping"];

export function ApplicationForm({
  service,
  user,
  existing
}: {
  service: ServiceKind;
  user: {
    id: string;
    fullName: string;
    email: string;
    nim: string | null;
    department: string;
    phone: string;
    nationality: string;
  };
  existing?: Application | null;
}) {
  const def = FORM_DEFS[service];
  const router = useRouter();
  const storageKey = `pnj:draft:${service}:${user.id}`;

  const [values, setValues] = useState<Values>(() => ({
    title: existing?.title ?? "",
    category: existing?.category ?? "",
    partnerInstitution: existing?.partnerInstitution ?? "",
    country: existing?.country ?? "",
    city: existing?.city ?? "",
    startDate: existing?.startDate ?? "",
    endDate: existing?.endDate ?? "",
    fundingSource: existing?.fundingSource ?? "beasiswa",
    budget: existing?.budget ? String(existing.budget) : "",
    passportNo: existing?.passportNo ?? "",
    summary: existing?.summary ?? ""
  }));
  const [participants, setParticipants] = useState<Participant[]>(existing?.participants ?? []);
  const [docs, setDocs] = useState<RequirementDoc[]>(() =>
    existing?.documents?.length
      ? existing.documents
      : def.docs.map((slot) => ({
          id: `${service}_${slot.slot}`,
          slot: slot.slot,
          label: slot.label,
          fileName: null,
          sizeLabel: null,
          status: "pending" as const,
          uploadedAt: null
        }))
  );
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState<SavingState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(existing?.id ?? null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const hydrated = useRef(false);

  /* ── Restore draft (Poka-Yoke) ─────────────────────────────── */
  useEffect(() => {
    if (existing) {
      hydrated.current = true;
      return;
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { values?: Values; participants?: Participant[]; docs?: RequirementDoc[]; step?: number; applicationId?: string };
        if (parsed.values) setValues((prev) => ({ ...prev, ...parsed.values }));
        if (parsed.participants?.length) setParticipants(parsed.participants);
        if (parsed.docs?.length) setDocs(parsed.docs);
        if (parsed.applicationId) setApplicationId(parsed.applicationId);
        if (typeof parsed.step === "number") setStep(Math.min(parsed.step, def.steps.length - 1));
        toast.info("Draf pengisian sebelumnya dipulihkan.");
      }
    } catch {
      /* ignore corrupt drafts */
    }
    hydrated.current = true;
  }, [existing, storageKey, def.steps.length]);

  /* ── Autosave: 1.8s debounce to disk + server ──────────────── */
  const persist = useCallback(
    async (silent = true) => {
      setSaving("saving");
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ values, participants, docs, step, applicationId }));
      } catch {
        /* quota */
      }
      try {
        const response = await fetch("/api/command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save-draft", service, values, participants, docs, applicationId })
        });
        const payload = (await response.json()) as { ok: boolean; applicationId?: string };
        if (payload.ok && payload.applicationId) setApplicationId(payload.applicationId);
        setSaving("saved");
        if (!silent) toast.success("Draf tersimpan di server.");
      } catch {
        setSaving("error");
      }
    },
    [storageKey, values, participants, docs, step, applicationId, service]
  );

  useEffect(() => {
    if (!hydrated.current) return;
    const timer = window.setTimeout(() => {
      void persist(true);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [values, participants, docs, persist]);

  const set = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  /* ── Progress ─────────────────────────────────────────────── */
  const requiredKeys = def.steps.flatMap((s) => s.fields.filter((f) => f.required).map((f) => f.key));
  const filled = requiredKeys.filter((key) => (values[key] ?? "").trim().length > 0).length;
  const docsReady = docs.filter((d) => d.fileName).length;
  const requiredDocs = docs.filter((d) => def.docs.find((slot) => slot.slot === d.slot)?.required).length;
  const stepCount = def.steps.length;
  const progress = Math.round(
    ((filled + Math.min(docsReady, requiredDocs) + (participants.length ? 1 : 0)) /
      Math.max(1, requiredKeys.length + requiredDocs + (def.delegation ? 1 : 0))) *
      100
  );

  /* ── Letter data for the live preview ─────────────────────── */
  const letterData: LetterData = useMemo(
    () => ({
      registerNo: existing?.registerNo ?? "",
      applicantName: user.fullName,
      applicantNim: user.nim ?? "",
      department: user.department,
      email: user.email,
      phone: user.phone,
      passportNo: values.passportNo ?? "",
      nationality: user.nationality,
      title: values.title ?? "",
      category: values.category ?? "",
      partner: values.partnerInstitution ?? "",
      country: values.country ?? "",
      city: values.city ?? "",
      startDate: values.startDate ?? "",
      endDate: values.endDate ?? "",
      funding: values.fundingSource ?? "",
      budget: Number(values.budget ?? 0),
      summary: values.summary ?? "",
      participants: participants.map((p) => ({ name: p.fullName, role: p.role, institution: p.institution, docStatus: p.docStatus })),
      role: "student",
      issueDate: new Date().toISOString()
    }),
    [existing?.registerNo, user, values, participants]
  );

  /* ── Submit ───────────────────────────────────────────────── */
  const submit = async () => {
    if (!agreed) {
      toast.error("Centang pernyataan kebenaran data sebelum mengirim.");
      return;
    }
    const missing = requiredKeys.filter((key) => !(values[key] ?? "").trim());
    const noDocs = def.docs.filter((slot) => slot.required && !docs.find((d) => d.slot === slot.slot && d.fileName));
    if (missing.length || noDocs.length) {
      const parts: string[] = [];
      if (missing.length) parts.push(`${missing.length} kolom wajib`);
      if (noDocs.length) parts.push(`${noDocs.length} dokumen wajib`);
      toast.error(`Lengkapi ${parts.join(" dan ")} sebelum mengirim.`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", service, values, participants, docs, applicationId })
      });
      const payload = (await response.json()) as { ok: boolean; applicationId?: string; registerNo?: string; error?: string };
      if (!payload.ok || !payload.applicationId) {
        toast.error(payload.error ?? "Pengajuan gagal dikirim.");
        setSubmitting(false);
        return;
      }
      window.localStorage.removeItem(storageKey);
      toast.success(`Pengajuan terkirim — nomor ${payload.registerNo ?? "baru"}.`);
      router.push(`/dashboard/applications/${payload.applicationId}`);
    } catch {
      toast.error("Koneksi gagal. Draf tetap tersimpan.");
      setSubmitting(false);
    }
  };

  /* ── Participants ─────────────────────────────────────────── */
  const [draftParticipant, setDraftParticipant] = useState({ fullName: "", role: "Anggota" as Participant["role"], institution: "", passportNo: "" });

  const addParticipant = () => {
    if (!draftParticipant.fullName.trim()) {
      toast.error("Nama anggota wajib diisi.");
      return;
    }
    setParticipants((prev) => [
      ...prev,
      {
        id: `prt_${Date.now()}`,
        fullName: draftParticipant.fullName.trim(),
        role: draftParticipant.role,
        institution: draftParticipant.institution,
        passportNo: draftParticipant.passportNo,
        docStatus: "pending"
      }
    ]);
    setDraftParticipant({ fullName: "", role: "Anggota", institution: "", passportNo: "" });
  };

  const current = def.steps[step] ?? def.steps[0]!;
  const isLast = step === stepCount - 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] xl:gap-8">
      {/* ── Left: wizard ─────────────────────────────────────── */}
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-4 rounded-capsule bg-white px-4 py-2.5 shadow-[0_10px_30px_-24px_rgb(13_26_21_/_0.4)]">
          <div className="flex min-w-0 items-center gap-2.5">
            <ProgressDots count={stepCount} active={step} />
            <span className="truncate text-[0.75rem] font-semibold text-ink-soft">
              Langkah {step + 1} dari {stepCount}
            </span>
          </div>
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
              saving === "saving" && "bg-canvas-mist text-ink-mute",
              saving === "saved" && "bg-ok-50 text-ok-700",
              saving === "error" && "bg-stop-50 text-stop-700",
              saving === "idle" && "bg-canvas-mist text-ink-mute"
            )}
          >
            {saving === "saving" ? <Loader2 className="size-3 animate-spin" /> : <CloudUpload className="size-3" />}
            {saving === "saving" ? "Menyimpan…" : saving === "saved" ? "Draf tersimpan" : saving === "error" ? "Gagal menyimpan" : "Autosave aktif"}
          </span>
        </div>

        <div className="mt-5 rounded-card-lg bg-white p-5 shadow-[0_18px_44px_-34px_rgb(13_26_21_/_0.4)] sm:p-6">
          <h2 className="text-[1.125rem] font-bold tracking-tight text-ink">{current.title}</h2>
          <p className="mt-1 text-[0.8125rem] text-ink-mute">{current.caption}</p>

          <div className="mt-6">
            {current.id === "identity" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <ReadOnly label="Nama lengkap" value={user.fullName} />
                <ReadOnly label="NIM / NIP" value={user.nim ?? "—"} />
                <ReadOnly label="Program studi / unit" value={user.department} />
                <ReadOnly label="Email resmi" value={user.email} />
                <ReadOnly label="Nomor telepon" value={user.phone} />
                <ReadOnly label="Kewarganegaraan" value={user.nationality} />
                <p className="sm:col-span-2 text-[0.75rem] text-ink-mute">
                  Data identitas mengikuti profil akun. Ubah melalui halaman profil bila ada kekeliruan.
                </p>
              </div>
            ) : null}

            {current.fields.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {current.fields.map((field) => (
                  <div key={field.key} className={field.span === 2 || field.type === "textarea" ? "sm:col-span-2" : undefined}>
                    <FieldLabel required={field.required}>{field.label}</FieldLabel>
                    {field.type === "select" ? (
                      <select
                        value={values[field.key] ?? ""}
                        onChange={(e) => set(field.key, e.target.value)}
                        className={selectClass}
                        suppressHydrationWarning
                      >
                        <option value="">Pilih {field.label.toLowerCase()}</option>
                        {(field.key === "country" ? COUNTRIES.map((c) => ({ value: c.code, label: c.name })) : field.options ?? []).map((option) => (
                          <option key={option.value} value={option.value} suppressHydrationWarning>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={values[field.key] ?? ""}
                        onChange={(e) => set(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={textareaClass}
                      />
                    ) : field.money ? (
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8125rem] font-semibold text-ink-mute">Rp</span>
                        <input
                          type="number"
                          min={0}
                          value={values[field.key] ?? ""}
                          onChange={(e) => set(field.key, e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder={field.placeholder}
                          className={cn(inputClass, "pl-10 tabular")}
                        />
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        value={values[field.key] ?? ""}
                        onChange={(e) => set(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            {current.id === "documents" ? (
              <div className="space-y-3">
                <div className="rounded-card border border-hairline bg-white p-4">
                  <p className="text-[0.8125rem] font-semibold text-ink">Berkas yang Anda unggah sendiri</p>
                  <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-mute">
                    Dokumen di bawah berasal dari institusi mitra, kampus asal, atau Anda pribadi (LoA, transkrip,
                    sertifikat bahasa). Ini berbeda dengan{" "}
                    <a href="/templates" className="font-semibold text-forest-800 underline decoration-forest-300 underline-offset-2 hover:text-forest-900">
                      blanko resmi KUI
                    </a>{" "}
                    yang diterbitkan kantor dan tinggal diunduh.
                  </p>
                  {existing ? (
                    <p className="mt-2.5 rounded-md bg-canvas-soft px-3 py-2 text-[0.75rem] leading-relaxed text-ink-soft">
                      Berkas yang sudah terisi berasal dari pengajuan <strong>{existing.registerNo || "draf tersimpan"}</strong>{" "}
                      yang Anda lanjutkan. Hapus berkas dengan tombol silang bila ingin mengunggah yang baru.
                    </p>
                  ) : null}
                </div>
                {docs.map((doc) => {
                  const slot = def.docs.find((d) => d.slot === doc.slot);
                  return (
                    <div key={doc.slot} className="flex flex-wrap items-center gap-3 rounded-card bg-canvas-soft p-3.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-forest-800">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.8125rem] font-semibold text-ink">
                          {doc.label}
                          {slot?.required ? <span className="ml-1 text-stop-700">*</span> : null}
                        </p>
                        <p className="truncate text-[0.6875rem] text-ink-mute">
                          {doc.fileName ? `${doc.fileName} · ${doc.sizeLabel ?? "—"}` : "Belum ada berkas"}
                        </p>
                      </div>
                      {doc.fileName ? (
                        <button
                          type="button"
                          onClick={() => setDocs((prev) => prev.map((d) => (d.slot === doc.slot ? { ...d, fileName: null, sizeLabel: null, status: "pending" } : d)))}
                          className="rounded-full p-2 text-ink-mute transition-colors hover:bg-white hover:text-stop-700"
                          aria-label={`Hapus ${doc.label}`}
                        >
                          <X className="size-4" />
                        </button>
                      ) : null}
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-forest-800 transition-colors hover:bg-mint-100">
                        <CloudUpload className="size-3.5" />
                        {doc.fileName ? "Ganti" : "Unggah"}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
                            const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
                            if (!allowed.includes(ext)) {
                              toast.error("Format berkas harus PDF, JPG, atau PNG.");
                              event.target.value = "";
                              return;
                            }
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error("Ukuran berkas maksimal 10 MB.");
                              event.target.value = "";
                              return;
                            }
                            setDocs((prev) =>
                              prev.map((d) =>
                                d.slot === doc.slot
                                  ? {
                                      ...d,
                                      fileName: file.name,
                                      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
                                      status: "pending",
                                      uploadedAt: new Date().toISOString()
                                    }
                                  : d
                              )
                            );
                            toast.success(`${doc.label} siap diverifikasi.`);
                          }}
                        />
                      </label>
                    </div>
                  );
                })}
                <p className="text-[0.75rem] text-ink-mute">
                  Format PDF, JPG, atau PNG hingga 10 MB per berkas. Verifikator memeriksa keabsahan dokumen, bukan sistem.
                </p>
              </div>
            ) : null}

            {current.id === "participants" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {participants.length === 0 ? (
                    <p className="rounded-card bg-canvas-soft p-4 text-[0.8125rem] text-ink-mute">
                      Belum ada anggota. Ketua delegasi otomatis tercatat sebagai pengaju.
                    </p>
                  ) : null}
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 rounded-card bg-canvas-soft p-3.5">
                      <span className="grid size-9 place-items-center rounded-full bg-forest-900 text-[0.6875rem] font-bold text-white">
                        {participant.fullName.split(" ").slice(0, 2).map((p) => p[0]).join("")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.8125rem] font-semibold text-ink">{participant.fullName}</p>
                        <p className="truncate text-[0.6875rem] text-ink-mute">
                          {participant.role} · {participant.institution || "PNJ"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Hapus ${participant.fullName} dari delegasi?`)) {
                            setParticipants((prev) => prev.filter((p) => p.id !== participant.id));
                          }
                        }}
                        className="rounded-full p-2 text-ink-mute transition-colors hover:bg-white hover:text-stop-700"
                        aria-label={`Hapus ${participant.fullName}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-card border border-dashed border-forest-200 p-4">
                  <p className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-forest-800">
                    <UserPlus className="size-4" />
                    Tambah anggota
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input className={inputClass} placeholder="Nama lengkap" value={draftParticipant.fullName} onChange={(e) => setDraftParticipant((p) => ({ ...p, fullName: e.target.value }))} />
                    <select className={selectClass} value={draftParticipant.role} onChange={(e) => setDraftParticipant((p) => ({ ...p, role: e.target.value as Participant["role"] }))}>
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <input className={inputClass} placeholder="Unit kerja / program studi" value={draftParticipant.institution} onChange={(e) => setDraftParticipant((p) => ({ ...p, institution: e.target.value }))} />
                    <input className={inputClass} placeholder="Nomor paspor (internal)" value={draftParticipant.passportNo} onChange={(e) => setDraftParticipant((p) => ({ ...p, passportNo: e.target.value }))} />
                  </div>
                  <Btn type="button" size="sm" variant="outline" className="mt-3" onClick={addParticipant}>
                    <Plus className="size-3.5" />
                    Tambahkan ke delegasi
                  </Btn>
                  <p className="mt-2 text-[0.6875rem] text-ink-mute">
                    Nomor paspor anggota tidak pernah dikirim ke halaman publik. Papan transparansi hanya menampilkan nama dan status.
                  </p>
                </div>
              </div>
            ) : null}

            {current.id === "review" ? (
              <div className="space-y-5">
                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {[
                    ["Judul kegiatan", values.title || "—"],
                    ["Institusi mitra", values.partnerInstitution || "—"],
                    ["Negara & kota", `${COUNTRIES.find((c) => c.code === values.country)?.name ?? "—"}${values.city ? ` · ${values.city}` : ""}`],
                    ["Periode", formatRange(values.startDate, values.endDate)],
                    ["Sumber dana", values.fundingSource || "—"],
                    ["Anggaran", Number(values.budget) ? rupiah(Number(values.budget)) : "—"],
                    ["Nomor paspor", values.passportNo || "—"],
                    ["Anggota delegasi", `${participants.length || 1} orang`]
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-ink-mute">{label}</dt>
                      <dd className="mt-0.5 text-[0.875rem] font-medium text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>

                <label className="flex cursor-pointer items-start gap-3 rounded-card bg-canvas-soft p-4">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 size-4 accent-[#1e6a47]" />
                  <span className="text-[0.8125rem] leading-relaxed text-ink-soft">
                    Saya menyatakan seluruh data dan dokumen yang diunggah benar. Saya memahami keputusan verifikasi
                    berada pada verifikator KUI dan dapat meminta perbaikan berkas.
                  </span>
                </label>

                <div className="rounded-card bg-forest-50 p-4 text-[0.75rem] leading-relaxed text-forest-800">
                  Surat rekomendasi resmi akan memakai nomor register {existing?.registerNo || "baru"} dan dapat
                  diunduh / dicetak dari panel pratinjau di sebelah kanan.
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <Btn
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="size-4" />
              Kembali
            </Btn>

            <div className="flex items-center gap-2">
              <Btn type="button" variant="ghost" size="sm" onClick={() => void persist(false)}>
                Simpan draf
              </Btn>
              {isLast ? (
                <Btn type="button" onClick={submit} disabled={submitting} className="min-w-[9.5rem]">
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                  {submitting ? "Mengirim…" : "Kirim pengajuan"}
                </Btn>
              ) : (
                <Btn type="button" onClick={() => setStep((s) => Math.min(stepCount - 1, s + 1))}>
                  Lanjut
                  <ArrowRight className="size-4" />
                </Btn>
              )}
            </div>
          </div>

          <p className="mt-4 text-center text-[0.6875rem] text-ink-mute">
            Progres kelengkapan {progress}% · draf tersimpan otomatis setiap 1,8 detik
          </p>
          <Progress value={progress} className="mt-2" />
        </div>
      </div>

      {/* ── Right: live A4 ───────────────────────────────────── */}
      <div className="hidden min-w-0 lg:block">
        <div className="sticky top-24">
          <LiveDocumentPreview service={service} data={letterData} registerNo={existing?.registerNo} />
        </div>
      </div>

      {/* ── Mobile preview drawer ────────────────────────────── */}
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-forest-900 px-4 py-3 text-[0.8125rem] font-semibold text-white shadow-[0_18px_40px_-18px_rgb(13_26_21_/_0.6)] lg:hidden"
      >
        <FileText className="size-4" />
        Lihat lembar A4
      </button>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-canvas lg:hidden">
          <div className="flex items-center justify-between border-b border-hairline bg-white px-4 py-3">
            <p className="text-[0.875rem] font-semibold text-ink">Pratinjau dokumen A4</p>
            <button type="button" onClick={() => setPreviewOpen(false)} className="rounded-full p-2 text-ink-mute" aria-label="Tutup pratinjau">
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-3">
            <LiveDocumentPreview service={service} data={letterData} registerNo={existing?.registerNo} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-ink-mute">{label}</p>
      <p className="mt-1 rounded-xl bg-canvas-soft px-3.5 py-2.5 text-[0.875rem] font-medium text-ink">{value}</p>
    </div>
  );
}

function ProgressDots({ count, active }: { count: number; active: number }) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === active ? "w-5 bg-forest-800" : i < active ? "w-1.5 bg-forest-300" : "w-1.5 bg-hairline"
          )}
        />
      ))}
    </span>
  );
}

export function SubmissionSuccessBanner({ registerNo }: { registerNo: string }) {
  return (
    <div className="flex items-center gap-2 rounded-capsule bg-ok-50 px-4 py-2 text-[0.8125rem] font-medium text-ok-700">
      <CheckCircle2 className="size-4" />
      Pengajuan {registerNo} terkirim.
    </div>
  );
}

export { buildSheets };