import { requireStaff } from "@/lib/api-helpers";
import { listApplications } from "@/lib/store";
import { countryName, SERVICE_META } from "@/lib/utils";

export const dynamic = "force-dynamic";

const cell = (value: string | number | null | undefined) => {
  const text = String(value ?? "");
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export async function GET(request: Request) {
  const scope = await requireStaff();
  if ("response" in scope) return scope.response;

  const url = new URL(request.url);
  const service = url.searchParams.get("service");
  const status = url.searchParams.get("status");

  let rows = listApplications();
  if (service) rows = rows.filter((r) => r.service === service);
  if (status) rows = rows.filter((r) => r.status === status);

  if (rows.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: "Tidak ada data untuk diekspor pada filter ini." }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  const header = [
    "Nomor Registrasi",
    "Layanan",
    "Judul Kegiatan",
    "Pemohon",
    "NIM/NIP",
    "Institusi Mitra",
    "Negara",
    "Kota",
    "Mulai",
    "Selesai",
    "Sumber Dana",
    "Anggaran",
    "Status",
    "Jumlah Peserta",
    "Tanggal Kirim"
  ];

  const body = rows.map((a) =>
    [
      a.registerNo || "—",
      SERVICE_META[a.service].label,
      a.title,
      a.ownerName,
      a.ownerNim ?? "—",
      a.partnerInstitution,
      countryName(a.country),
      a.city,
      a.startDate,
      a.endDate,
      a.fundingSource,
      a.budget,
      a.status,
      Math.max(1, a.participants.length),
      a.submittedAt ?? "—"
    ]
      .map(cell)
      .join(",")
  );

  const csv = `\uFEFF${[header.join(","), ...body].join("\r\n")}`;
  const filename = `rekap-pengajuan-kui-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
      "X-Total-Rows": String(rows.length)
    }
  });
}