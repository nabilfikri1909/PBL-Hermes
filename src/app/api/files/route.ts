import fs from "fs";
import path from "path";
import { getStore } from "@/lib/store";
import { buildPdf } from "@/lib/pdf";
import { addAudit } from "@/lib/store";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Serves the original KUI blanko as a printable PDF. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  const store = getStore();
  const template = store.templates.find((t) => t.id === id);
  if (!template) {
    return new Response("Template tidak ditemukan", { status: 404 });
  }

  // If there is an authentic template PDF file from KUI in public/templates
  if (template.fileName) {
    const filePath = path.join(process.cwd(), "public", "templates", template.fileName);
    if (fs.existsSync(filePath)) {
      const fileBuf = fs.readFileSync(filePath);
      const user = await getSessionUser();
      if (user) {
        addAudit({
          actorEmail: user.email,
          actorRole: user.role,
          action: "DOWNLOAD",
          entity: `TEMPLATE/${template.name}`,
          ip: "10.20.0.1",
          outcome: "success"
        });
      }
      return new Response(fileBuf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${template.fileName}"`,
          "Cache-Control": "private, no-store"
        }
      });
    }
  }

  const lines = [
    { text: "KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI", size: 10, bold: true },
    { text: "POLITEKNIK NEGERI JAKARTA", size: 12, bold: true },
    { text: "KANTOR URUSAN INTERNASIONAL", size: 10 },
    { text: "Jl. Prof. Dr. Ir. G.A. Siwabessy, Kampus UI Depok 16425", size: 9 },
    { text: "", size: 9 },
    { text: template.name.toUpperCase(), size: 13, bold: true },
    { text: `Format: ${template.format} · Versi ${template.version} · ${template.sizeLabel}`, size: 9 },
    { text: "", size: 9 },
    { text: "Blanko ini adalah format resmi KUI. Isi melalui portal agar nomor register,", size: 10 },
    { text: "stempel digital, dan QR verifikasi tercetak otomatis.", size: 10 },
    { text: "", size: 9 },
    { text: "Nomor Register : ................................................", size: 10 },
    { text: "Nama Pemohon  : ................................................", size: 10 },
    { text: "NIM / NIP     : ................................................", size: 10 },
    { text: "Program Studi : ................................................", size: 10 },
    { text: "Kegiatan      : ................................................", size: 10 },
    { text: "Negara Tujuan : ................................................", size: 10 },
    { text: "Periode       : ................................................", size: 10 },
    { text: "", size: 9 },
    { text: "Depok, ...................... 2026", size: 10 },
    { text: "Kepala Kantor Urusan Internasional", size: 10, bold: true },
    { text: "", size: 9 },
    { text: "Rina Kartika, M.I.Kom", size: 10, bold: true },
    { text: "NIP 199001152015032004", size: 9 }
  ];

  const pdf = buildPdf("BLANKO RESMI KUI PNJ", lines);
  const user = await getSessionUser();
  if (user) {
    addAudit({ actorEmail: user.email, actorRole: user.role, action: "DOWNLOAD", entity: `TEMPLATE/${template.name}`, ip: "10.20.0.1", outcome: "success" });
  }

  const body = new Uint8Array(pdf);
  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${template.name.replace(/[^a-zA-Z0-9]+/g, "-")}-${template.version}.pdf"`,
      "Cache-Control": "private, no-store"
    }
  });
}