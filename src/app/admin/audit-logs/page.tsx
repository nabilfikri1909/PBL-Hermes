import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireStaffPage } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Log Audit" };
export const dynamic = "force-dynamic";

const TONES: Record<string, string> = {
  CREATE: "bg-ok-50 text-ok-700",
  UPDATE: "bg-info-50 text-info-700",
  STATUS_CHANGE: "bg-warn-50 text-warn-700",
  DELETE: "bg-stop-50 text-stop-700",
  DOWNLOAD: "bg-canvas-mist text-ink-soft",
  LOGIN: "bg-forest-50 text-forest-800",
  LOGIN_FAILED: "bg-stop-50 text-stop-700",
  ROLE_CHANGE: "bg-info-50 text-info-700"
};

export default async function AuditLogsPage() {
  const user = await requireStaffPage("/admin/audit-logs");
  const entries = getStore().audit;

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title="Log audit keamanan"
      subtitle="Catatan append-only — tidak dapat diedit atau dihapus dari antarmuka."
    >
      <div className="rounded-card-lg bg-white shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <div className="flex items-center gap-2 border-b border-hairline px-5 py-4">
          <ShieldCheck className="size-4 text-forest-700" />
          <p className="text-[0.875rem] font-bold text-ink">Kejadian terbaru</p>
          <span className="ml-auto text-[0.75rem] text-ink-mute">{entries.length} entri</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse text-left text-[0.8125rem]">
            <thead>
              <tr className="border-b border-hairline text-[0.6875rem] uppercase tracking-[0.07em] text-ink-mute">
                <th className="px-5 py-3 font-semibold">Waktu</th>
                <th className="px-4 py-3 font-semibold">Aktor</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
                <th className="px-4 py-3 font-semibold">Entitas</th>
                <th className="px-4 py-3 font-semibold">IP</th>
                <th className="px-4 py-3 font-semibold">Hasil</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-hairline-soft last:border-0 hover:bg-canvas-soft/60">
                  <td className="whitespace-nowrap px-5 py-3 text-ink-soft">{formatDateTime(entry.at)}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{entry.actorEmail}</p>
                    <p className="text-[0.6875rem] text-ink-mute">{entry.actorRole}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.625rem] font-semibold ${TONES[entry.action] ?? "bg-canvas-mist text-ink-soft"}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="max-w-[20rem] truncate px-4 py-3 text-ink-soft">{entry.entity}</td>
                  <td className="px-4 py-3 tabular text-ink-mute">{entry.ip}</td>
                  <td className="px-4 py-3">
                    <span className={entry.outcome === "success" ? "text-ok-700" : "text-stop-700"}>
                      {entry.outcome === "success" ? "Berhasil" : "Gagal"}
                    </span>
                  </td>
                </tr>
              ))}
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[0.8125rem] text-ink-mute">
                    Belum ada kejadian tercatat.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}