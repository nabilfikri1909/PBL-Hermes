"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { cn, countryName, formatDateShort, formatDate, SERVICE_META, STATUS_META } from "@/lib/utils";
import type { ApplicationStatus, ServiceKind } from "@/lib/types";

export interface ListRow {
  id: string;
  registerNo: string;
  title: string;
  service: ServiceKind;
  country: string;
  city: string;
  status: ApplicationStatus;
  partnerInstitution: string;
  ownerName: string;
  updatedAt: string;
  submittedAt: string | null;
  participants: number;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "revision_required",
  "forwarded_to_kui",
  "approved",
  "completed",
  "rejected"
];

export function ApplicationList({
  rows,
  variant = "student",
  basePath = "/dashboard/applications"
}: {
  rows: ListRow[];
  variant?: "student" | "staff";
  basePath?: string;
}) {
  const [query, setQuery] = useState("");
  const [service, setService] = useState<"all" | ServiceKind>("all");
  const [status, setStatus] = useState<"all" | ApplicationStatus>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter((row) => {
      if (service !== "all" && row.service !== service) return false;
      if (status !== "all" && row.status !== status) return false;
      if (q && !`${row.title} ${row.registerNo} ${row.partnerInstitution} ${row.ownerName}`.toLowerCase().includes(q)) return false;
      return true;
    });
    return list.sort((a, b) => (sort === "newest" ? (a.updatedAt < b.updatedAt ? 1 : -1) : a.updatedAt > b.updatedAt ? 1 : -1));
  }, [rows, query, service, status, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-[15rem] flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={variant === "staff" ? "Cari pemohon, kegiatan, atau nomor registrasi" : "Cari judul kegiatan atau mitra"}
            className="h-10 w-full rounded-full border border-hairline bg-white pl-10 pr-4 text-[0.8125rem] text-ink placeholder:text-ink-mute/70 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/15"
          />
        </label>

        <select
          value={service}
          onChange={(e) => setService(e.target.value as typeof service)}
          aria-label="Filter layanan"
          className="h-10 rounded-full border border-hairline bg-white px-3.5 text-[0.8125rem] font-medium text-ink-soft focus:outline-none"
        >
          <option value="all">Semua layanan</option>
          <option value="outbound">Outbound</option>
          <option value="inbound">Inbound</option>
          <option value="pdln">PDLN</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          aria-label="Filter status"
          className="h-10 rounded-full border border-hairline bg-white px-3.5 text-[0.8125rem] font-medium text-ink-soft focus:outline-none"
        >
          <option value="all">Semua status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {STATUS_META[option].label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
          className="h-10 rounded-full border border-hairline bg-white px-3.5 text-[0.8125rem] font-medium text-ink-soft transition-colors hover:border-forest-300"
        >
          {sort === "newest" ? "Terbaru dahulu" : "Terlama dahulu"}
        </button>
      </div>

      <p className="mt-4 text-[0.75rem] text-ink-mute">
        {filtered.length} dari {rows.length} pengajuan
      </p>

      <div className="mt-3 overflow-hidden rounded-card-lg bg-white shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left text-[0.8125rem]">
            <thead>
              <tr className="border-b border-hairline bg-canvas-soft text-[0.6875rem] uppercase tracking-[0.07em] text-ink-mute">
                <th className="px-4 py-3 font-semibold">Nomor</th>
                <th className="px-4 py-3 font-semibold">Kegiatan</th>
                {variant === "staff" ? <th className="px-4 py-3 font-semibold">Pemohon</th> : null}
                <th className="px-4 py-3 font-semibold">Negara</th>
                <th className="px-4 py-3 font-semibold">Diperbarui</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="group border-b border-hairline-soft transition-colors last:border-0 hover:bg-canvas-soft/60">
                  <td className="px-4 py-3.5">
                    <p className="font-medium tabular text-ink-soft">{row.registerNo || "belum terbit"}</p>
                    <p className="mt-0.5 text-[0.6875rem] text-ink-mute">{SERVICE_META[row.service].short}</p>
                  </td>
                  <td className="max-w-[18rem] px-4 py-3.5">
                    <Link href={`${basePath}/${row.id}`} className="block truncate font-semibold text-ink hover:text-forest-800">
                      {row.title || "(draf tanpa judul)"}
                    </Link>
                    <p className="mt-0.5 truncate text-[0.75rem] text-ink-mute">{row.partnerInstitution || "—"}</p>
                  </td>
                  {variant === "staff" ? <td className="px-4 py-3.5 text-ink-soft">{row.ownerName}</td> : null}
                  <td className="px-4 py-3.5 text-ink-soft">{countryName(row.country)}</td>
                  <td className="px-4 py-3.5 text-ink-soft">{formatDateShort(row.updatedAt)}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold", STATUS_META[row.status].className)}>
                      {STATUS_META[row.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`${basePath}/${row.id}`}
                      className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-forest-800 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Detail
                      <ArrowUpRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={variant === "staff" ? 7 : 6} className="px-4 py-14 text-center text-[0.8125rem] text-ink-mute">
                    Belum ada pengajuan yang cocok dengan filter ini.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {variant === "student" ? (
        <p className="mt-3 text-[0.75rem] text-ink-mute">
          Terakhir diperbarui {filtered[0] ? formatDate(filtered[0].updatedAt) : "—"} · waktu verifikasi dihitung pada hari kerja.
        </p>
      ) : null}
    </div>
  );
}