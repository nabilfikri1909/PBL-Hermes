import type { Metadata } from "next";
import { PublicShell, PageBand } from "@/components/public-shell";
import { PublicApplicationsBoard, type PublicRow } from "@/components/public-applications";
import { BtnLink } from "@/components/ui";
import { getStore } from "@/lib/store";
import { publicPdlNRow } from "@/lib/stats";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Papan Transparansi PDLN" };
export const dynamic = "force-dynamic";

export default function PublicApplicationsPage() {
  const rows: PublicRow[] = getStore()
    .applications.filter((a) => a.service === "pdln" && a.status !== "draft")
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .map((a) => {
      const row = publicPdlNRow(a);
      return {
        id: row.id,
        registerNo: row.registerNo,
        title: row.title,
        country: row.country,
        city: row.city,
        startDate: row.startDate,
        endDate: row.endDate,
        status: row.status,
        participants: row.participants
      };
    });

  const approved = rows.filter((r) => r.status === "approved" || r.status === "forwarded_to_kui" || r.status === "completed").length;

  return (
    <PublicShell>
      <PageBand
        eyebrow="Akuntabilitas publik"
        title="Papan transparansi izin PDLN"
        description="Daftar perjalanan dinas luar negeri sivitas PNJ yang telah diajukan. Nama kegiatan, negara tujuan, dan jumlah peserta ditampilkan — data identitas tetap tertutup."
        crumb={[{ href: "/pdln", label: "PDLN" }]}
        actions={
          <BtnLink href="/pdln/apply" variant="onDark" size="lg">
            Ajukan izin PDLN
          </BtnLink>
        }
      />

      <div className="mx-auto max-w-[78rem] px-5 pb-16 sm:px-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Total izin", rows.length],
            ["Disetujui / diteruskan", approved],
            ["Negara tujuan", new Set(rows.map((r) => r.country)).size]
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-capsule bg-white/8 px-5 py-3 ring-1 ring-inset ring-white/15">
              <p className="text-[0.6875rem] uppercase tracking-[0.09em] text-mint-300">{label}</p>
              <p className="mt-0.5 text-lg font-bold text-white tabular">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-canvas-soft px-5 pb-24 pt-10 sm:px-8">
        <div className="mx-auto max-w-[78rem]">
          <PublicApplicationsBoard rows={rows} />
          <p className="mt-5 flex items-start gap-2 rounded-card bg-white p-4 text-[0.75rem] leading-relaxed text-ink-mute">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-600" />
            Sesuai prinsip perlindungan data pribadi, modal +N lagi hanya menampilkan nama anggota dan status verifikasi.
            Nomor paspor, NIK, dan kontak pribadi tersimpan pada arsip verifikasi KUI yang aksesnya dibatasi.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}