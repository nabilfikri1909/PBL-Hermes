"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck, Users, X } from "lucide-react";
import { cn, countryName, formatRange, STATUS_META } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

export interface PublicRow {
  id: string;
  registerNo: string;
  title: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  status: ApplicationStatus;
  participants: Array<{ name: string; role: string; docStatus: string }>;
}

export function PublicApplicationsBoard({ rows }: { rows: PublicRow[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<PublicRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => `${row.title} ${row.registerNo} ${countryName(row.country)} ${row.city}`.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="relative flex-1 min-w-[16rem]">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kegiatan, negara, atau nomor registrasi"
            className="h-11 w-full rounded-full border border-hairline bg-white pl-10 pr-4 text-sm text-ink placeholder:text-ink-mute/70 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/15"
          />
        </label>
        <p className="text-[0.75rem] text-ink-mute">
          {filtered.length} izin dipublikasikan · data identitas tidak ditampilkan
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-card-lg bg-white shadow-[0_18px_44px_-36px_rgb(13_26_21_/_0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left text-[0.8125rem]">
            <thead>
              <tr className="border-b border-hairline bg-canvas-soft text-[0.6875rem] uppercase tracking-[0.07em] text-ink-mute">
                <th className="px-5 py-3 font-semibold">Nomor Registrasi</th>
                <th className="px-5 py-3 font-semibold">Judul Penugasan</th>
                <th className="px-5 py-3 font-semibold">Negara</th>
                <th className="px-5 py-3 font-semibold">Periode</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Peserta</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-hairline-soft transition-colors last:border-0 hover:bg-canvas-soft/60">
                  <td className="px-5 py-4 font-medium tabular text-ink-soft">{row.registerNo || "—"}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{row.title}</p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-mute">{row.city}</p>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{countryName(row.country)}</td>
                  <td className="px-5 py-4 text-ink-soft">{formatRange(row.startDate, row.endDate)}</td>
                  <td className="px-5 py-4">
                    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold", STATUS_META[row.status].className)}>
                      {STATUS_META[row.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setActive(row)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-[0.75rem] font-semibold text-forest-800 transition-colors hover:bg-forest-100"
                    >
                      <Users className="size-3.5" />
                      {row.participants.length} peserta
                      <span className="text-forest-600">+{Math.max(0, row.participants.length - 1)} lagi</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[0.8125rem] text-ink-mute">
                    Tidak ada izin yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {active ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Daftar peserta delegasi">
          <div className="animate-rise w-full max-w-lg rounded-t-panel bg-white p-6 shadow-[0_40px_80px_-40px_rgb(13_26_21_/_0.55)] sm:rounded-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-forest-600">Daftar peserta</p>
                <h3 className="mt-1 text-[1.0625rem] font-bold text-ink">{active.title}</h3>
                <p className="mt-1 text-[0.75rem] text-ink-mute">
                  {active.registerNo} · {countryName(active.country)} · {formatRange(active.startDate, active.endDate)}
                </p>
              </div>
              <button type="button" onClick={() => setActive(null)} className="rounded-full p-2 text-ink-mute transition-colors hover:bg-canvas-soft" aria-label="Tutup">
                <X className="size-5" />
              </button>
            </div>

            <ul className="mt-5 space-y-2">
              {active.participants.map((participant, i) => (
                <li key={participant.name + i} className="flex items-center justify-between gap-3 rounded-xl bg-canvas-soft px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[0.8125rem] font-semibold text-ink">{participant.name}</p>
                    <p className="text-[0.6875rem] text-ink-mute">{participant.role}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
                      participant.docStatus === "valid"
                        ? "bg-ok-50 text-ok-700"
                        : participant.docStatus === "revision"
                          ? "bg-stop-50 text-stop-700"
                          : "bg-warn-50 text-warn-700"
                    )}
                  >
                    {participant.docStatus === "valid" ? "Terverifikasi" : participant.docStatus === "revision" ? "Perlu Revisi" : "Menunggu"}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-center gap-2 rounded-xl bg-forest-50 px-3.5 py-2.5 text-[0.6875rem] leading-relaxed text-forest-800">
              <ShieldCheck className="size-3.5 shrink-0" />
              NIK, nomor paspor, email, dan nomor telepon peserta tidak pernah dikirim ke halaman publik ini.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}