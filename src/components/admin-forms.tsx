"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Btn, FieldLabel, inputClass, selectClass, textareaClass } from "./ui";
import { cn, formatDate } from "@/lib/utils";
import type { Announcement, FaqItem, Role } from "@/lib/types";
import type { StoreSettings } from "@/lib/store";

const ROLES: Role[] = ["student", "foreign", "lecturer", "admin", "super_admin"];

async function post(body: Record<string, unknown>) {
  const response = await fetch("/api/command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return (await response.json()) as { ok: boolean; error?: string };
}

export function RoleSelect({ userId, role, disabled }: { userId: string; role: Role; disabled?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState<Role>(role);
  const [saving, setSaving] = useState(false);

  const change = async (next: Role) => {
    const previous = value;
    setValue(next);
    setSaving(true);
    const payload = await post({ action: "role-change", userId, role: next });
    setSaving(false);
    if (!payload.ok) {
      setValue(previous);
      toast.error(payload.error ?? "Peran gagal diubah.");
      return;
    }
    toast.success("Peran diperbarui.");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={disabled || saving}
        onChange={(e) => change(e.target.value as Role)}
        className="h-8 rounded-lg border border-hairline bg-white px-2 text-[0.75rem] font-medium text-ink-soft focus:outline-none disabled:opacity-60"
        aria-label="Ubah peran"
      >
        {ROLES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {saving ? <Loader2 className="size-3.5 animate-spin text-forest-700" /> : null}
    </div>
  );
}

export function AnnouncementManager({ rows }: { rows: Announcement[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ id: "", title: "", excerpt: "", body: "", tag: "Umum", pinned: false });
  const [busy, setBusy] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const payload = await post({ action: "announcement-save", ...form });
    setBusy(false);
    if (!payload.ok) {
      toast.error(payload.error ?? "Gagal menyimpan pengumuman.");
      return;
    }
    toast.success(form.id ? "Pengumuman diperbarui." : "Pengumuman diterbitkan.");
    setForm({ id: "", title: "", excerpt: "", body: "", tag: "Umum", pinned: false });
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Hapus pengumuman ini dari portal publik?")) return;
    const payload = await post({ action: "announcement-delete", id });
    if (!payload.ok) {
      toast.error(payload.error ?? "Gagal menghapus.");
      return;
    }
    toast.success("Pengumuman dihapus.");
    router.refresh();
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-card bg-white p-4 shadow-[0_14px_34px_-34px_rgb(13_26_21_/_0.5)]">
            <div className="flex flex-wrap items-center gap-2 text-[0.6875rem] text-ink-mute">
              <span className="rounded-full bg-forest-50 px-2 py-0.5 font-semibold text-forest-800">{row.tag}</span>
              <span>{formatDate(row.publishedAt)}</span>
              {row.pinned ? <span className="rounded-full bg-warn-50 px-2 py-0.5 font-semibold text-warn-700">Disematkan</span> : null}
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setForm({ id: row.id, title: row.title, excerpt: row.excerpt, body: row.body, tag: row.tag, pinned: row.pinned })}
                  className="rounded-full px-2 py-1 text-[0.6875rem] font-semibold text-forest-800 hover:bg-forest-50"
                >
                  Edit
                </button>
                <button type="button" onClick={() => remove(row.id)} className="rounded-full p-1.5 text-ink-mute hover:bg-stop-50 hover:text-stop-700" aria-label="Hapus">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-[0.875rem] font-semibold text-ink">{row.title}</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-mute">{row.excerpt}</p>
          </article>
        ))}
        {rows.length === 0 ? <p className="rounded-card bg-white p-6 text-center text-[0.8125rem] text-ink-mute">Belum ada pengumuman.</p> : null}
      </div>

      <form onSubmit={save} className="h-fit rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <p className="text-[0.9375rem] font-bold text-ink">{form.id ? "Ubah pengumuman" : "Pengumuman baru"}</p>
        <div className="mt-4 space-y-3">
          <div>
            <FieldLabel required>Judul</FieldLabel>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <FieldLabel required>Ringkasan</FieldLabel>
            <textarea className={cn(textareaClass, "min-h-[4.5rem]")} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
          </div>
          <div>
            <FieldLabel>Isi lengkap</FieldLabel>
            <textarea className={cn(textareaClass, "min-h-[6rem]")} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Tag</FieldLabel>
              <select className={selectClass} value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                {["Umum", "Beasiswa", "Regulasi", "Kerja Sama", "Agenda"].map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-end gap-2 pb-2.5 text-[0.75rem] text-ink-soft">
              <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="size-3.5 accent-[#1e6a47]" />
              Sematkan di atas
            </label>
          </div>
          <div className="flex gap-2">
            <Btn type="submit" size="sm" disabled={busy}>
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              {form.id ? "Simpan perubahan" : "Terbitkan"}
            </Btn>
            {form.id ? (
              <Btn type="button" size="sm" variant="ghost" onClick={() => setForm({ id: "", title: "", excerpt: "", body: "", tag: "Umum", pinned: false })}>
                Batal
              </Btn>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}

export function FaqManager({ rows }: { rows: FaqItem[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ id: "", question: "", answer: "", topic: "Umum" });
  const [busy, setBusy] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const payload = await post({ action: "faq-save", ...form });
    setBusy(false);
    if (!payload.ok) {
      toast.error(payload.error ?? "Gagal menyimpan FAQ.");
      return;
    }
    toast.success(form.id ? "FAQ diperbarui." : "FAQ ditambahkan.");
    setForm({ id: "", question: "", answer: "", topic: "Umum" });
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Hapus FAQ ini?")) return;
    const payload = await post({ action: "faq-delete", id });
    if (!payload.ok) {
      toast.error(payload.error ?? "Gagal menghapus.");
      return;
    }
    toast.success("FAQ dihapus.");
    router.refresh();
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
      <div className="divide-y divide-hairline rounded-card-lg bg-white p-2 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        {rows.map((row) => (
          <div key={row.id} className="p-4">
            <div className="flex items-center gap-2 text-[0.6875rem] text-ink-mute">
              <span className="rounded-full bg-forest-50 px-2 py-0.5 font-semibold text-forest-800">{row.topic}</span>
              <div className="ml-auto flex gap-1">
                <button type="button" onClick={() => setForm({ id: row.id, question: row.question, answer: row.answer, topic: row.topic })} className="rounded-full px-2 py-1 text-[0.6875rem] font-semibold text-forest-800 hover:bg-forest-50">
                  Edit
                </button>
                <button type="button" onClick={() => remove(row.id)} className="rounded-full p-1.5 text-ink-mute hover:bg-stop-50 hover:text-stop-700" aria-label="Hapus">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-1.5 text-[0.875rem] font-semibold text-ink">{row.question}</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-mute">{row.answer}</p>
          </div>
        ))}
        {rows.length === 0 ? <p className="p-6 text-center text-[0.8125rem] text-ink-mute">Belum ada FAQ.</p> : null}
      </div>

      <form onSubmit={save} className="h-fit rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <p className="text-[0.9375rem] font-bold text-ink">{form.id ? "Ubah FAQ" : "FAQ baru"}</p>
        <div className="mt-4 space-y-3">
          <div>
            <FieldLabel required>Pertanyaan</FieldLabel>
            <input className={inputClass} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
          </div>
          <div>
            <FieldLabel required>Jawaban</FieldLabel>
            <textarea className={textareaClass} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required />
          </div>
          <div>
            <FieldLabel>Topik</FieldLabel>
            <input className={inputClass} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Btn type="submit" size="sm" disabled={busy}>
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              {form.id ? "Simpan perubahan" : "Tambahkan"}
            </Btn>
            {form.id ? (
              <Btn type="button" size="sm" variant="ghost" onClick={() => setForm({ id: "", question: "", answer: "", topic: "Umum" })}>
                Batal
              </Btn>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const payload = await post({ action: "settings-save", settings: form });
    setBusy(false);
    if (!payload.ok) {
      toast.error(payload.error ?? "Gagal menyimpan pengaturan.");
      return;
    }
    toast.success("Parameter sistem disimpan.");
    router.refresh();
  };

  const numbers: Array<{ key: keyof StoreSettings; label: string; hint: string }> = [
    { key: "quotaOutbound", label: "Kuota Outbound", hint: "Jumlah maksimum pengajuan outbound per tahun" },
    { key: "quotaInbound", label: "Kuota Inbound", hint: "Jumlah maksimum peserta asing per tahun" },
    { key: "quotaPdln", label: "Kuota PDLN", hint: "Jumlah izin dinas luar negeri per tahun" },
    { key: "verificationSlaDays", label: "SLA verifikasi (hari)", hint: "Target hari kerja penyelesaian verifikasi" }
  ];

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <p className="text-[0.9375rem] font-bold text-ink">Kuota & SLA</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {numbers.map((item) => (
            <div key={item.key}>
              <FieldLabel>{item.label}</FieldLabel>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={String(form[item.key] ?? 0)}
                onChange={(e) => setForm({ ...form, [item.key]: Number(e.target.value) })}
              />
              <p className="mt-1 text-[0.6875rem] text-ink-mute">{item.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <p className="text-[0.9375rem] font-bold text-ink">Status pendaftaran layanan</p>
        <div className="mt-4 space-y-2.5">
          {([
            ["openOutbound", "Outbound Mobility"],
            ["openInbound", "Inbound International"],
            ["openPdln", "PDLN Setneg"]
          ] as Array<[keyof StoreSettings, string]>).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-3 rounded-xl bg-canvas-soft px-3.5 py-2.5">
              <span className="text-[0.8125rem] font-medium text-ink">{label}</span>
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="size-4 accent-[#1e6a47]"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <p className="text-[0.9375rem] font-bold text-ink">Banner pengumuman portal</p>
        <textarea className={cn(textareaClass, "mt-3 min-h-[5rem]")} value={form.announcementBanner} onChange={(e) => setForm({ ...form, announcementBanner: e.target.value })} />
      </div>

      <Btn type="submit" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Simpan pengaturan
      </Btn>
    </form>
  );
}