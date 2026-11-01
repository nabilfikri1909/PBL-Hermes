import type { LetterKind, ServiceKind } from "./types";

export type FieldType = "text" | "textarea" | "date" | "select" | "number" | "email" | "tel";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  span?: 1 | 2;
  money?: boolean;
}

export interface StepDef {
  id: "identity" | "activity" | "travel" | "documents" | "participants" | "review";
  title: string;
  caption: string;
  fields: FieldDef[];
}

export interface DocSlot {
  slot: string;
  label: string;
  required: boolean;
}

export interface FormDef {
  service: ServiceKind;
  title: string;
  intro: string;
  steps: StepDef[];
  docs: DocSlot[];
  /** PDLN-only: rombongan dengan pelaporan biaya riil per peserta. */
  delegation: boolean;
}

const FUNDING = [
  { value: "beasiswa", label: "Beasiswa / Hibah" },
  { value: "mandiri", label: "Pendanaan Mandiri" },
  { value: "institusi", label: "Anggaran Institusi PNJ" },
  { value: "mitra", label: "Sponsor Mitra / Industri" }
];

const CATEGORY_OUTBOUND = [
  { value: "exchange", label: "Student Exchange" },
  { value: "internship", label: "International Internship" },
  { value: "iisma", label: "IISMA Awardee" },
  { value: "dual-degree", label: "Joint / Dual Degree" },
  { value: "short-course", label: "Short Course / Summer School" }
];

const CATEGORY_INBOUND = [
  { value: "degree", label: "Program Gelar (Degree)" },
  { value: "non-degree", label: "Program Non-Gelar" },
  { value: "internship", label: "Magang Laboratorium" },
  { value: "research", label: "Penelitian Kolaboratif" },
  { value: "cultural", label: "Pertukaran Budaya" }
];

const CATEGORY_PDLN = [
  { value: "conference", label: "Konferensi / Seminar Internasional" },
  { value: "competition", label: "Kompetisi Internasional" },
  { value: "benchmarking", label: "Benchmarking Institusi" },
  { value: "partnership", label: "Penandatanganan Kerja Sama" },
  { value: "site-visit", label: "Kunjungan Kerja / Site Visit" }
];

export const FORM_DEFS: Record<ServiceKind, FormDef> = {
  outbound: {
    service: "outbound",
    title: "Pengajuan Mobilitas Outbound",
    intro: "Satu formulir untuk exchange, magang, IISMA, joint degree, dan short course. Surat rekomendasi KUI diterbitkan dari data yang Anda isi di sini.",
    delegation: false,
    steps: [
      { id: "identity", title: "Data Pengaju", caption: "Identitas diambil dari akun PNJ Anda", fields: [] },
      {
        id: "activity",
        title: "Data Kegiatan",
        caption: "Program yang Anda ikuti",
        fields: [
          { key: "title", label: "Nama Program / Kegiatan", type: "text", required: true, span: 2, placeholder: "Global Summer Program in Sustainable Engineering 2026" },
          { key: "category", label: "Kategori Program", type: "select", options: CATEGORY_OUTBOUND, required: true },
          { key: "partnerInstitution", label: "Universitas / Institusi Mitra", type: "text", required: true, placeholder: "Tampere University" },
          { key: "country", label: "Negara Tujuan", type: "select", required: true, options: [] },
          { key: "city", label: "Kota Tujuan", type: "text", required: true, placeholder: "Tampere" }
        ]
      },
      {
        id: "travel",
        title: "Perjalanan & Pendanaan",
        caption: "Periode, sumber dana, dan paspor",
        fields: [
          { key: "startDate", label: "Tanggal Mulai", type: "date", required: true },
          { key: "endDate", label: "Tanggal Selesai", type: "date", required: true },
          { key: "fundingSource", label: "Sumber Pendanaan", type: "select", options: FUNDING, required: true },
          { key: "budget", label: "Estimasi Biaya (Rp)", type: "number", money: true, placeholder: "48000000" },
          { key: "passportNo", label: "Nomor Paspor", type: "text", placeholder: "C1234567" },
          { key: "summary", label: "Ringkasan Rencana Kegiatan", type: "textarea", span: 2, placeholder: "Tujuan, kegiatan utama, dan capaian yang diharapkan dari program ini." }
        ]
      },
      { id: "documents", title: "Dokumen Pendukung", caption: "LoA, transkrip, sertifikat bahasa, izin jurusan", fields: [] },
      { id: "review", title: "Tinjau & Kirim", caption: "Periksa surat rekomendasi lalu kirim", fields: [] }
    ],
    docs: [
      { slot: "loa", label: "Letter of Acceptance Mitra", required: true },
      { slot: "transcript", label: "Transkrip Nilai Terakhir", required: true },
      { slot: "english", label: "Sertifikat Kemampuan Bahasa Inggris", required: true },
      { slot: "permission", label: "Surat Izin Jurusan / Orang Tua", required: false }
    ]
  },
  inbound: {
    service: "inbound",
    title: "Pendaftaran Mahasiswa Asing",
    intro: "Pendaftaran mahasiswa, peneliti, dan peserta pertukaran asing yang akan belajar di Politeknik Negeri Jakarta.",
    delegation: false,
    steps: [
      { id: "identity", title: "Applicant Identity", caption: "Your registered applicant profile", fields: [] },
      {
        id: "activity",
        title: "Program Data",
        caption: "Program, home institution, and destination department",
        fields: [
          { key: "title", label: "Program / Study Plan", type: "text", required: true, span: 2, placeholder: "One-Semester Exchange in Software Engineering" },
          { key: "category", label: "Program Type", type: "select", options: CATEGORY_INBOUND, required: true },
          { key: "partnerInstitution", label: "Home University", type: "text", required: true, placeholder: "Lund University" },
          { key: "country", label: "Country of Origin", type: "select", required: true, options: [] },
          { key: "city", label: "City", type: "text", required: true, placeholder: "Lund" }
        ]
      },
      {
        id: "travel",
        title: "Arrival & Funding",
        caption: "Period of stay, funding, and passport",
        fields: [
          { key: "startDate", label: "Arrival Date", type: "date", required: true },
          { key: "endDate", label: "Departure Date", type: "date", required: true },
          { key: "fundingSource", label: "Funding Source", type: "select", options: FUNDING, required: true },
          { key: "budget", label: "Declared Budget (IDR)", type: "number", money: true, placeholder: "32000000" },
          { key: "passportNo", label: "Passport Number", type: "text", placeholder: "SE1234567" },
          { key: "summary", label: "Study Plan Summary", type: "textarea", span: 2, placeholder: "Courses to take at PNJ and the research or internship focus." }
        ]
      },
      { id: "documents", title: "Required Documents", caption: "Nomination letter, passport, funding proof, visa", fields: [] },
      { id: "review", title: "Review & Submit", caption: "Check the Letter of Acceptance draft", fields: [] }
    ],
    docs: [
      { slot: "admission", label: "Nomination Letter from Home University", required: true },
      { slot: "passport-scan", label: "Passport Identity Page", required: true },
      { slot: "financial", label: "Proof of Funding / Sponsorship", required: true },
      { slot: "visa", label: "Visa / ITAS Document", required: false }
    ]
  },
  pdln: {
    service: "pdln",
    title: "Pengajuan Izin PDLN",
    intro: "Perjalanan dinas luar negeri sivitas PNJ sesuai Permensesneg No. 5/2017. Dossier delegasi disiapkan sistem, diputuskan verifikator manusia.",
    delegation: true,
    steps: [
      { id: "identity", title: "Data Penanggung Jawab", caption: "Ketua delegasi / perwakilan pengaju", fields: [] },
      {
        id: "activity",
        title: "Data Penugasan",
        caption: "Kegiatan kenegaraan dan instansi tujuan",
        fields: [
          { key: "title", label: "Nama Penugasan", type: "text", required: true, span: 2, placeholder: "ASEAN TVET Conference 2026 — Delegasi PNJ" },
          { key: "category", label: "Kategori Penugasan", type: "select", options: CATEGORY_PDLN, required: true },
          { key: "partnerInstitution", label: "Instansi / Penyelenggara", type: "text", required: true, placeholder: "Ministry of Higher Education, Malaysia" },
          { key: "country", label: "Negara Tujuan", type: "select", required: true, options: [] },
          { key: "city", label: "Kota Tujuan", type: "text", required: true, placeholder: "Kuala Lumpur" }
        ]
      },
      {
        id: "travel",
        title: "Perjalanan & Anggaran",
        caption: "Periode, sumber anggaran, dan nomor paspor ketua",
        fields: [
          { key: "startDate", label: "Tanggal Berangkat", type: "date", required: true },
          { key: "endDate", label: "Tanggal Kembali", type: "date", required: true },
          { key: "fundingSource", label: "Sumber Anggaran", type: "select", options: FUNDING, required: true },
          { key: "budget", label: "Pagu Anggaran Delegasi (Rp)", type: "number", money: true, placeholder: "96000000" },
          { key: "passportNo", label: "Nomor Paspor Ketua", type: "text", placeholder: "B9876543" },
          { key: "summary", label: "Justifikasi Penugasan", type: "textarea", span: 2, placeholder: "Dasar penugasan, urgensi, dan kontribusi terhadap program studi." }
        ]
      },
      { id: "participants", title: "Anggota Delegasi", caption: "Data anggota terlindungi — hanya nama & status yang tampil publik", fields: [] },
      { id: "documents", title: "Kelengkapan Berkas", caption: "Undangan, surat tugas, SPTJM, rencana anggaran", fields: [] },
      { id: "review", title: "Tinjau & Kirim", caption: "Periksa surat Direktur lalu kirim", fields: [] }
    ],
    docs: [
      { slot: "invitation", label: "Undangan Resmi Penyelenggara", required: true },
      { slot: "assignment", label: "Surat Tugas Dekan / Direktur", required: true },
      { slot: "sptjm", label: "Surat Pernyataan Tanggung Jawab Mutlak", required: true },
      { slot: "budget-plan", label: "Rencana Anggaran Biaya Delegasi", required: false }
    ]
  }
};

/* ── Letter formats rendered by the A4 engine ─────────────────── */

export interface LetterMeta {
  kind: LetterKind;
  service: ServiceKind;
  title: string;
  file: string;
  sheets: number;
}

export const LETTERS: LetterMeta[] = [
  { kind: "outbound-passport", service: "outbound", title: "Surat Rekomendasi Pembuatan Paspor", file: "Rekomendasi-Paspor", sheets: 1 },
  { kind: "outbound-visa", service: "outbound", title: "Recommendation Letter for Visa Application", file: "Visa-Recommendation", sheets: 2 },
  { kind: "outbound-financial", service: "outbound", title: "Statement of Financial Guarantee", file: "Financial-Guarantee", sheets: 1 },
  { kind: "inbound-loa", service: "inbound", title: "Official Letter of Acceptance (LoA)", file: "Letter-of-Acceptance", sheets: 2 },
  { kind: "inbound-visa", service: "inbound", title: "Visa Clearance Support Letter", file: "Visa-Clearance", sheets: 1 },
  { kind: "inbound-certificate", service: "inbound", title: "Program Completion e-Certificate", file: "Completion-Certificate", sheets: 1 },
  { kind: "pdln-director", service: "pdln", title: "Surat Pengantar Izin Setneg ke Direktur PNJ", file: "Pengantar-Setneg", sheets: 2 },
  { kind: "pdln-delegation", service: "pdln", title: "Daftar Delegasi Resmi", file: "Daftar-Delegasi", sheets: 1 },
  { kind: "pdln-sptjm", service: "pdln", title: "Surat Pernyataan Tanggung Jawab Mutlak", file: "SPTJM", sheets: 1 }
];

export function lettersFor(service: ServiceKind) {
  return LETTERS.filter((l) => l.service === service);
}