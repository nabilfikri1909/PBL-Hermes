"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Btn, FieldLabel, inputClass, textareaClass } from "./ui";

export function TicketForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ticket-create", subject, message })
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!payload.ok) {
        toast.error(payload.error ?? "Tiket gagal dikirim.");
        setSending(false);
        return;
      }
      toast.success("Tiket terkirim ke verifikator KUI.");
      setSubject("");
      setMessage("");
      router.refresh();
      setSending(false);
    } catch {
      toast.error("Koneksi gagal.");
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
      <p className="text-[0.9375rem] font-bold text-ink">Tiket baru</p>
      <p className="mt-1 text-[0.75rem] text-ink-mute">Sertakan nomor registrasi bila pertanyaan terkait berkas tertentu.</p>
      <div className="mt-4 space-y-3">
        <div>
          <FieldLabel required>Subjek</FieldLabel>
          <input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Perubahan tanggal kegiatan" required />
        </div>
        <div>
          <FieldLabel required>Pesan</FieldLabel>
          <textarea className={textareaClass} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Jelaskan kendala Anda secara ringkas." required />
        </div>
        <Btn type="submit" size="sm" disabled={sending} className="w-full">
          {sending ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
          Kirim tiket
        </Btn>
      </div>
    </form>
  );
}

export function ReplyForm({ ticketId, existing }: { ticketId: string; existing: string | null }) {
  const router = useRouter();
  const [reply, setReply] = useState(existing ?? "");
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ticket-reply", id: ticketId, reply })
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!payload.ok) {
        toast.error(payload.error ?? "Balasan gagal disimpan.");
        setSending(false);
        return;
      }
      toast.success("Balasan terkirim.");
      router.refresh();
      setSending(false);
    } catch {
      toast.error("Koneksi gagal.");
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-end gap-2">
      <textarea
        className="min-h-[3.25rem] flex-1 resize-y rounded-xl border border-hairline bg-white px-3 py-2 text-[0.8125rem] focus:border-forest-500 focus:outline-none"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Tulis balasan verifikator…"
      />
      <Btn type="submit" size="sm" disabled={sending || !reply.trim()}>
        {sending ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
        Balas
      </Btn>
    </form>
  );
}