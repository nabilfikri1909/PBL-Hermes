import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ReplyForm } from "@/components/ticket-form";
import { requireStaffPage } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Helpdesk Verifikator" };
export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const user = await requireStaffPage("/admin/questions");
  const tickets = getStore().tickets;
  const open = tickets.filter((t) => t.status === "open").length;

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title="Helpdesk tanya jawab"
      subtitle={`${open} tiket menunggu jawaban · ${tickets.length} total tiket.`}
    >
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <article key={ticket.id} className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
            <div className="flex flex-wrap items-center gap-2 text-[0.6875rem]">
              <span className={`rounded-full px-2.5 py-1 font-semibold ${ticket.status === "answered" ? "bg-ok-50 text-ok-700" : "bg-warn-50 text-warn-700"}`}>
                {ticket.status === "answered" ? "Dijawab" : "Menunggu"}
              </span>
              <span className="text-ink-mute">{ticket.fromName} · {ticket.fromEmail}</span>
              <span className="ml-auto text-ink-mute">{formatDateTime(ticket.createdAt)}</span>
            </div>
            <p className="mt-2.5 text-[0.875rem] font-semibold text-ink">{ticket.subject}</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">{ticket.message}</p>
            <ReplyForm ticketId={ticket.id} existing={ticket.reply} />
          </article>
        ))}
        {tickets.length === 0 ? (
          <p className="rounded-card-lg bg-white p-8 text-center text-[0.8125rem] text-ink-mute">Belum ada tiket masuk.</p>
        ) : null}
      </div>
    </AppShell>
  );
}