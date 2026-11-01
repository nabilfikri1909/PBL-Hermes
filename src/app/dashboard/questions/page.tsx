import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LifeBuoy, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { TicketForm } from "@/components/ticket-form";
import { getSessionUser, isStaff } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Tanya Jawab" };
export const dynamic = "force-dynamic";

export default async function DashboardQuestionsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/questions");
  if (isStaff(user.role)) redirect("/admin/questions");

  const tickets = getStore().tickets.filter((t) => t.fromEmail === user.email);

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="student"
      title="Tanya jawab dengan KUI"
      subtitle="Tiket dijawab verifikator pada hari kerja. Riwayat percakapan tersimpan di sini."
    >
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section>
          {tickets.length === 0 ? (
            <div className="rounded-card-lg bg-white p-8 text-center shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-canvas-soft text-forest-800">
                <LifeBuoy className="size-5" strokeWidth={1.7} />
              </span>
              <p className="mt-4 text-[0.9375rem] font-semibold text-ink">Belum ada tiket</p>
              <p className="mx-auto mt-1 max-w-sm text-[0.8125rem] text-ink-mute">
                Gunakan formulir di samping untuk bertanya tentang berkas, regulasi PDLN, atau jadwal verifikasi.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {tickets.map((ticket) => (
                <li key={ticket.id} className="rounded-card-lg bg-white p-5 shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[0.625rem] font-semibold ${ticket.status === "answered" ? "bg-ok-50 text-ok-700" : "bg-warn-50 text-warn-700"}`}>
                      {ticket.status === "answered" ? "Dijawab" : "Menunggu jawaban"}
                    </span>
                    <span className="text-[0.6875rem] text-ink-mute">{formatDateTime(ticket.createdAt)}</span>
                  </div>
                  <p className="mt-2.5 flex items-center gap-2 text-[0.875rem] font-semibold text-ink">
                    <MessageSquare className="size-4 text-forest-700" />
                    {ticket.subject}
                  </p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">{ticket.message}</p>
                  {ticket.reply ? (
                    <div className="mt-3 rounded-xl bg-forest-50 px-4 py-3">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-forest-700">Balasan KUI</p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-forest-800">{ticket.reply}</p>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <TicketForm />
          <div className="mt-4 rounded-card-lg bg-canvas-soft p-5">
            <p className="text-[0.8125rem] font-bold text-ink">Waktu respons</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-ink-mute">
              Senin–Jumat, 08.00–16.00 WIB. Tiket di luar jam kerja dijawab pada hari kerja berikutnya.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}