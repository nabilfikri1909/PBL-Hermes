import type {
  Announcement,
  Application,
  AuditEntry,
  DocumentTemplate,
  FaqItem,
  HelpTicket,
  Participant,
  ParticipantExpense,
  RequirementDoc
} from "./types";
import type { StoreSettings } from "./store";
import { FORM_DEFS } from "./forms";

/* ── CMS defaults ─────────────────────────────────────────────── */

export const SEED_FAQS: FaqItem[] = [
  {
    id: "faq_1",
    question: "Berapa lama proses verifikasi berkas di KUI?",
    answer:
      "Verifikasi berkas memakan 2–3 hari kerja sejak status berubah menjadi Terkirim. Anda menerima notifikasi dan catatan revisi langsung pada halaman detail pengajuan.",
    topic: "Alur Pengajuan"
  },
  {
    id: "faq_2",
    question: "Apakah surat rekomendasi bisa diunduh sebelum berkas diverifikasi?",
    answer:
      "Bisa. Pratinjau A4 pada halaman pengisian sudah memakai format resmi KUI, tetapi surat dinyatakan sah setelah nomor register diterbitkan dan verifikator menandatangani berkas.",
    topic: "Dokumen"
  },
  {
    id: "faq_3",
    question: "Kenapa NIK dan nomor paspor anggota delegasi tidak terlihat publik?",
    answer:
      "Portal memisahkan data identitas dari data transparansi. Papan publik hanya menampilkan nama kegiatan, negara tujuan, dan jumlah peserta melalui dialog +N lagi.",
    topic: "Privasi"
  },
  {
    id: "faq_4",
    question: "Bagaimana pelaporan biaya setelah kegiatan selesai?",
    answer:
      "Setiap peserta mengisi realisasi biaya tiket, akomodasi, uang harian, dan asuransi pada barisnya sendiri. Total dihitung sistem tanpa pemukulan rata (lump sum).",
    topic: "PDLN"
  },
  {
    id: "faq_5",
    question: "Apakah data isian saya hilang jika koneksi terputus?",
    answer:
      "Tidak. Draf tersimpan otomatis 1,8 detik setelah Anda berhenti mengetik, baik di peramban maupun pada penyimpanan server.",
    topic: "Teknis"
  },
  {
    id: "faq_6",
    question: "Dokumen apa yang wajib untuk pengajuan visa?",
    answer:
      "Paspor aktif minimal 6 bulan, LoA mitra, bukti pendanaan, dan surat rekomendasi visa yang diterbitkan sistem setelah berkas disetujui KUI.",
    topic: "Outbound"
  }
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_1",
    title: "Pendaftaran IISMA 2026 Gelombang II Dibuka",
    excerpt:
      "KUI PNJ membuka pendampingan berkas IISMA gelombang kedua mulai 4 Februari 2026. Kuota pendampingan 40 mahasiswa.",
    body:
      "Pendampingan berkas IISMA 2026 gelombang II dibuka untuk seluruh mahasiswa aktif semester 4–6. Siapkan LoA/unconditional offer, transkrip, dan sertifikat bahasa. Seluruh berkas diunggah melalui portal Outbound.",
    publishedAt: "2026-02-04T02:00:00.000Z",
    pinned: true,
    tag: "Beasiswa"
  },
  {
    id: "ann_2",
    title: "Permensesneg No. 5/2017: Perubahan Format SPTJM",
    excerpt:
      "Mulai 1 Maret 2026 seluruh pengajuan PDLN wajib melampirkan SPTJM versi terbaru yang dihasilkan sistem.",
    body:
      "Format SPTJM terbaru menambahkan kolom pertanggungjawaban biaya per peserta. Berkas lama masih diterima hingga 28 Februari 2026.",
    publishedAt: "2026-01-28T03:30:00.000Z",
    pinned: false,
    tag: "Regulasi"
  },
  {
    id: "ann_3",
    title: "Kunjungan Balasan Lund University, 12–16 Mei 2026",
    excerpt:
      "Delegasi Lund University akan melakukan kunjungan balasan ke kampus PNJ Depok. Sesi kuliah tamu terbuka untuk 120 mahasiswa.",
    body:
      "Rangkaian kunjungan mencakup kuliah tamu, site visit laboratorium, dan penandatanganan perpanjangan MoU Teknik Informatika.",
    publishedAt: "2026-01-19T01:15:00.000Z",
    pinned: false,
    tag: "Kerja Sama"
  }
];

export const SEED_TEMPLATES: DocumentTemplate[] = [
  { id: "tpl_1", name: "Surat Rekomendasi Pembuatan Paspor", service: "outbound", format: "PDF", sizeLabel: "104 KB", version: "v3.2", description: "Blanko resmi rekomendasi paspor dari KUI PNJ.", fileName: "rekomendasi-paspor-outbound.pdf" },
  { id: "tpl_2", name: "Recommendation Letter for Visa Application", service: "outbound", format: "PDF", sizeLabel: "105 KB", version: "v3.2", description: "Official recommendation letter for visa application.", fileName: "visa-recommendation-outbound.pdf" },
  { id: "tpl_3", name: "Director Recommendation Letter", service: "outbound", format: "PDF", sizeLabel: "116 KB", version: "v3.2", description: "Official recommendation letter from the Director of PNJ.", fileName: "director-recommendation-outbound.pdf" },
  { id: "tpl_4", name: "Statement of Enrollment", service: "outbound", format: "PDF", sizeLabel: "104 KB", version: "v3.2", description: "Official active student enrollment statement from PNJ.", fileName: "statement-of-enrollment-outbound.pdf" },
  { id: "tpl_5", name: "Permohonan Izin Belajar - Inbound", service: "inbound", format: "PDF", sizeLabel: "106 KB", version: "v2.4", description: "Permohonan izin belajar WNA ke Ditjen Diktiristek.", fileName: "izin-belajar-inbound.pdf" },
  { id: "tpl_6", name: "Surat Pernyataan Penjamin - Inbound", service: "inbound", format: "PDF", sizeLabel: "118 KB", version: "v2.1", description: "Surat pernyataan penjamin bagi mahasiswa asing di PNJ.", fileName: "sp-penjamin-inbound.pdf" },
  { id: "tpl_7", name: "Surat Pengantar Izin Setneg", service: "pdln", format: "DOCX", sizeLabel: "132 KB", version: "v4.0", description: "Pengantar permohonan izin dinas ke Kemensetneg RI." },
  { id: "tpl_8", name: "Surat Pernyataan Tanggung Jawab Mutlak", service: "pdln", format: "PDF", sizeLabel: "118 KB", version: "v4.0", description: "SPTJM wajib sesuai Permensesneg No. 5/2017." },
  { id: "tpl_9", name: "Rencana Anggaran Biaya Delegasi", service: "pdln", format: "XLSX", sizeLabel: "64 KB", version: "v1.6", description: "Template RAB per peserta, siap unggah." }
];

export const SEED_TICKETS: HelpTicket[] = [
  {
    id: "tkt_1",
    fromEmail: "ayu@student.pnj.ac.id",
    fromName: "Ayu Larasati",
    subject: "Nama institusi mitra salah tulis di surat",
    message: "Nama mitra tertulis Tampere Universty, seharusnya Tampere University. Apakah harus revisi berkas?",
    createdAt: "2026-02-06T04:20:00.000Z",
    status: "answered",
    reply: "Sudah dibetulkan oleh verifikator pada berkas Anda; surat dapat diunduh ulang tanpa pengajuan baru."
  },
  {
    id: "tkt_2",
    fromEmail: "nabil@student.pnj.ac.id",
    fromName: "Muhammad Nabil Fikri",
    subject: "Perubahan tanggal kegiatan short course",
    message: "Jadwal program bergeser satu minggu. Bagaimana cara memperbarui tanggal pada pengajuan yang sudah terkirim?",
    createdAt: "2026-02-09T07:45:00.000Z",
    status: "open",
    reply: null
  }
];

export const SEED_SETTINGS: StoreSettings = {
  quotaOutbound: 120,
  quotaInbound: 60,
  quotaPdln: 40,
  openOutbound: true,
  openInbound: true,
  openPdln: true,
  verificationSlaDays: 3,
  announcementBanner:
    "Pendampingan berkas IISMA 2026 gelombang II dibuka — batas unggah 28 Februari 2026."
};

export const SEED_AUDIT: AuditEntry[] = [
  { id: "aud_1", at: "2026-02-10T02:14:00.000Z", actorEmail: "rina@kui.pnj.ac.id", actorRole: "admin", action: "STATUS_CHANGE", entity: "APP/OTB/PNJ-KUI/2026/001 → approved", ip: "10.20.4.11", outcome: "success" },
  { id: "aud_2", at: "2026-02-09T08:02:00.000Z", actorEmail: "nabil@student.pnj.ac.id", actorRole: "student", action: "CREATE", entity: "APP/OTB/PNJ-KUI/2026/004", ip: "10.20.7.64", outcome: "success" },
  { id: "aud_3", at: "2026-02-09T03:51:00.000Z", actorEmail: "rina@kui.pnj.ac.id", actorRole: "admin", action: "DOWNLOAD", entity: "TEMPLATE/SPTJM v4.0", ip: "10.20.4.11", outcome: "success" },
  { id: "aud_4", at: "2026-02-08T21:36:00.000Z", actorEmail: "unknown@mail.com", actorRole: "student", action: "LOGIN_FAILED", entity: "AUTH", ip: "103.28.14.7", outcome: "failure" },
  { id: "aud_5", at: "2026-02-08T05:12:00.000Z", actorEmail: "hendra@kui.pnj.ac.id", actorRole: "super_admin", action: "ROLE_CHANGE", entity: "USER/ayu@student.pnj.ac.id → student", ip: "10.20.4.9", outcome: "success" },
  { id: "aud_6", at: "2026-02-07T09:40:00.000Z", actorEmail: "bagus@pnj.ac.id", actorRole: "lecturer", action: "UPDATE", entity: "APP/PDLN/PNJ-KUI/2026/002", ip: "10.20.9.21", outcome: "success" }
];

/* ── Demo pengajuan ───────────────────────────────────────────── */

function docsFor(service: "outbound" | "inbound" | "pdln", state: "full" | "partial"): RequirementDoc[] {
  return FORM_DEFS[service].docs.map((slot, index) => {
    const missing = state === "partial" && index > 1;
    return {
      id: `${service}_${slot.slot}`,
      slot: slot.slot,
      label: slot.label,
      fileName: missing ? null : `${slot.slot}-${service}-2026.pdf`,
      sizeLabel: missing ? null : `${420 + index * 137} KB`,
      status: missing ? ("pending" as const) : index === 1 && state === "partial" ? ("revision" as const) : ("valid" as const),
      uploadedAt: missing ? null : "2026-02-05T03:00:00.000Z",
      note:
        index === 1 && state === "partial"
          ? "Halaman kedua terpotong. Mohon unggah ulang seluruh halaman tanpa watermark."
          : undefined
    };
  });
}

const EMPTY_REPORT = { fileName: null, summary: "", submittedAt: null, expenses: [] as ParticipantExpense[], validatedAt: null };

function mkParticipants(list: Array<[string, Participant["role"], string]>): Participant[] {
  return list.map(([fullName, role, institution], i) => ({
    id: `prt_${i + 1}`,
    fullName,
    passportNo: `B${9200000 + i * 3711}`,
    role,
    institution,
    docStatus: i === 0 ? "valid" : i === 1 ? "pending" : "valid"
  }));
}

function mk(
  partial: Partial<Application> & Pick<Application, "id" | "registerNo" | "service" | "ownerId" | "ownerName" | "ownerEmail" | "title" | "status">
): Application {
  const base = FORM_DEFS[partial.service];
  return {
    ownerNim: null,
    department: "Teknik Informatika",
    category: base.steps[1]?.fields[0]?.options?.[0]?.value ?? "exchange",
    partnerInstitution: "—",
    country: "JP",
    city: "—",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    fundingSource: "beasiswa",
    budget: 0,
    passportNo: "C0000000",
    summary: "",
    participants: [],
    documents: docsFor(partial.service, "full"),
    revisions: [],
    report: { ...EMPTY_REPORT },
    setneg: null,
    createdAt: "2026-02-01T02:00:00.000Z",
    updatedAt: "2026-02-01T02:00:00.000Z",
    submittedAt: "2026-02-01T02:10:00.000Z",
    ...partial
  };
}

export const SEED_APPLICATIONS: Application[] = [
  mk({
    id: "app_1",
    registerNo: "OTB/PNJ-KUI/2026/001",
    service: "outbound",
    ownerId: "usr_1",
    ownerName: "Muhammad Nabil Fikri",
    ownerEmail: "nabil@student.pnj.ac.id",
    ownerNim: "2207421021",
    title: "Global Summer Program in Sustainable Engineering",
    category: "short-course",
    partnerInstitution: "Tampere University",
    country: "FI",
    city: "Tampere",
    startDate: "2026-06-08",
    endDate: "2026-07-24",
    budget: 48000000,
    passportNo: "C1739402",
    summary:
      "Program enam minggu berfokus pada rekayasa berkelanjutan: audit energi kampus, prototipe sensor IoT, dan presentasi akhir di hadapan fakultas Tampere University.",
    status: "approved",
    createdAt: "2026-01-14T03:00:00.000Z",
    updatedAt: "2026-02-10T02:14:00.000Z",
    submittedAt: "2026-01-20T06:30:00.000Z",
    revisions: [
      {
        id: "rev_1",
        target: "english",
        message: "Sertifikat IELTS yang diunggah sudah kedaluwarsa. Mohon unggah hasil tes maksimal 2 tahun terakhir.",
        createdAt: "2026-01-23T04:00:00.000Z",
        authorName: "Rina Kartika, M.I.Kom",
        resolved: true
      }
    ]
  }),
  mk({
    id: "app_2",
    registerNo: "OTB/PNJ-KUI/2026/002",
    service: "outbound",
    ownerId: "usr_1",
    ownerName: "Muhammad Nabil Fikri",
    ownerEmail: "nabil@student.pnj.ac.id",
    ownerNim: "2207421021",
    title: "International Internship — Full-Stack Engineering",
    category: "internship",
    partnerInstitution: "Grab Singapore Regional Tech Centre",
    country: "SG",
    city: "Singapura",
    startDate: "2026-04-06",
    endDate: "2026-07-10",
    budget: 36000000,
    passportNo: "C1739402",
    summary:
      "Magang tiga bulan pada tim reliability platform: observability pipeline, dashboard SLO, dan rotasi on-call bersama mentor engineering.",
    status: "revision_required",
    documents: docsFor("outbound", "partial"),
    createdAt: "2026-01-26T02:20:00.000Z",
    updatedAt: "2026-02-08T09:10:00.000Z",
    submittedAt: "2026-02-02T04:00:00.000Z",
    revisions: [
      {
        id: "rev_2",
        target: "transcript",
        message: "Transkrip yang diunggah hanya memuat semester 1–3. Wajib melampirkan transkrip lengkap sampai semester terakhir.",
        createdAt: "2026-02-08T09:10:00.000Z",
        authorName: "Rina Kartika, M.I.Kom",
        resolved: false
      },
      {
        id: "rev_3",
        target: "loa",
        message: "Surat LoA dari mitra belum mencantumkan periode magang secara eksplisit.",
        createdAt: "2026-02-08T09:12:00.000Z",
        authorName: "Rina Kartika, M.I.Kom",
        resolved: false
      }
    ]
  }),
  mk({
    id: "app_3",
    registerNo: "OTB/PNJ-KUI/2026/003",
    service: "outbound",
    ownerId: "usr_2",
    ownerName: "Ayu Larasati",
    ownerEmail: "ayu@student.pnj.ac.id",
    ownerNim: "2207421044",
    department: "Administrasi Bisnis",
    title: "IISMA Awardee — Saxion University of Applied Sciences",
    category: "iisma",
    partnerInstitution: "Saxion University of Applied Sciences",
    country: "NL",
    city: "Deventer",
    startDate: "2026-09-01",
    endDate: "2027-01-31",
    budget: 85000000,
    passportNo: "C8812903",
    summary:
      "Satu semester pertukaran pada program International Business, termasuk proyek konsultasi bersama UKM mitra dan kelas Dutch Business Culture.",
    status: "under_review",
    createdAt: "2026-01-30T06:00:00.000Z",
    updatedAt: "2026-02-09T02:40:00.000Z",
    submittedAt: "2026-02-03T02:15:00.000Z"
  }),
  mk({
    id: "app_4",
    registerNo: "OTB/PNJ-KUI/2026/004",
    service: "outbound",
    ownerId: "usr_2",
    ownerName: "Ayu Larasati",
    ownerEmail: "ayu@student.pnj.ac.id",
    ownerNim: "2207421044",
    department: "Administrasi Bisnis",
    title: "AIMS Summer School — Supply Chain Analytics",
    category: "short-course",
    partnerInstitution: "Universiti Teknologi Malaysia",
    country: "MY",
    city: "Johor Bahru",
    startDate: "2026-07-06",
    endDate: "2026-07-31",
    budget: 21000000,
    passportNo: "C8812903",
    summary: "Empat minggu analitik rantai pasok dengan studi kasus pelabuhan Johor dan kunjungan industri.",
    status: "submitted",
    createdAt: "2026-02-06T03:00:00.000Z",
    updatedAt: "2026-02-06T03:20:00.000Z",
    submittedAt: "2026-02-06T03:20:00.000Z"
  }),
  mk({
    id: "app_5",
    registerNo: "INB/PNJ-KUI/2026/001",
    service: "inbound",
    ownerId: "usr_6",
    ownerName: "Emma Lindqvist",
    ownerEmail: "emma@lund.se",
    ownerNim: "LUND-2026-0117",
    department: "Teknik Informatika",
    title: "One-Semester Exchange in Software Engineering",
    category: "degree",
    partnerInstitution: "Lund University",
    country: "SE",
    city: "Lund",
    startDate: "2026-08-24",
    endDate: "2026-12-18",
    budget: 32000000,
    passportNo: "SE4471902",
    summary:
      "Enam mata kuliah semester 5 Teknik Informatika, termasuk proyek capstone bersama tim mahasiswa PNJ.",
    status: "under_review",
    createdAt: "2026-02-02T08:00:00.000Z",
    updatedAt: "2026-02-07T07:30:00.000Z",
    submittedAt: "2026-02-04T02:10:00.000Z"
  }),
  mk({
    id: "app_6",
    registerNo: "INB/PNJ-KUI/2026/002",
    service: "inbound",
    ownerId: "usr_6",
    ownerName: "Emma Lindqvist",
    ownerEmail: "emma@lund.se",
    ownerNim: "LUND-2026-0117",
    title: "Research Attachment — Computer Vision Lab",
    category: "research",
    partnerInstitution: "Lund University",
    country: "SE",
    city: "Lund",
    startDate: "2026-03-02",
    endDate: "2026-05-29",
    budget: 18000000,
    passportNo: "SE4471902",
    summary: "Penelitian tiga bulan pada deteksi kualitas hasil las menggunakan visi komputer di laboratorium PNJ.",
    status: "approved",
    createdAt: "2026-01-18T01:00:00.000Z",
    updatedAt: "2026-02-05T04:00:00.000Z",
    submittedAt: "2026-01-22T02:00:00.000Z"
  }),
  mk({
    id: "app_7",
    registerNo: "PDLN/PNJ-KUI/2026/001",
    service: "pdln",
    ownerId: "usr_3",
    ownerName: "Dr. Bagus Prakoso",
    ownerEmail: "bagus@pnj.ac.id",
    ownerNim: "198403122010121002",
    department: "Teknik Mesin",
    title: "ASEAN TVET Conference 2026 — Delegasi PNJ",
    category: "conference",
    partnerInstitution: "Ministry of Higher Education Malaysia",
    country: "MY",
    city: "Kuala Lumpur",
    startDate: "2026-05-18",
    endDate: "2026-05-22",
    budget: 96000000,
    passportNo: "B9876543",
    summary:
      "Pemaparan model pembelajaran vokasi PNJ pada forum TVET ASEAN, dilanjutkan penjajakan kerja sama dengan tiga politeknik Malaysia.",
    status: "under_review",
    participants: mkParticipants([
      ["Dr. Bagus Prakoso", "Ketua Delegasi", "Teknik Mesin"],
      ["Rina Kartika, M.I.Kom", "Anggota", "Kantor Urusan Internasional"],
      ["Ahmad Fauzan, M.T.", "Anggota", "Teknik Elektro"],
      ["Siti Rahmawati, M.M.", "Pendamping", "Administrasi Bisnis"]
    ]),
    createdAt: "2026-02-03T02:00:00.000Z",
    updatedAt: "2026-02-09T03:00:00.000Z",
    submittedAt: "2026-02-03T02:30:00.000Z"
  }),
  mk({
    id: "app_8",
    registerNo: "PDLN/PNJ-KUI/2026/002",
    service: "pdln",
    ownerId: "usr_3",
    ownerName: "Dr. Bagus Prakoso",
    ownerEmail: "bagus@pnj.ac.id",
    ownerNim: "198403122010121002",
    department: "Teknik Mesin",
    title: "Benchmarking Laboratorium Manufaktur — Penang",
    category: "benchmarking",
    partnerInstitution: "Penang Skills Development Centre",
    country: "MY",
    city: "Penang",
    startDate: "2026-04-13",
    endDate: "2026-04-17",
    budget: 72000000,
    passportNo: "B9876543",
    summary:
      "Studi banding tata kelola laboratorium manufaktur terpadu sebagai dasar revitalisasi workshop Teknik Mesin PNJ.",
    status: "forwarded_to_kui",
    participants: mkParticipants([
      ["Dr. Bagus Prakoso", "Ketua Delegasi", "Teknik Mesin"],
      ["Hendra Wijaya, S.Kom", "Anggota", "Kantor Urusan Internasional"],
      ["Dewi Anggraini, M.T.", "Anggota", "Teknik Mesin"]
    ]),
    setneg: {
      letterNo: "SP/Setneg/0412/2026",
      issuedAt: "2026-02-11T00:00:00.000Z",
      fileName: "SP-Setneg-0412-2026.pdf",
      valid: true
    },
    createdAt: "2026-01-21T01:00:00.000Z",
    updatedAt: "2026-02-11T01:00:00.000Z",
    submittedAt: "2026-01-24T02:00:00.000Z"
  }),
  mk({
    id: "app_9",
    registerNo: "PDLN/PNJ-KUI/2026/003",
    service: "pdln",
    ownerId: "usr_1",
    ownerName: "Muhammad Nabil Fikri",
    ownerEmail: "nabil@student.pnj.ac.id",
    ownerNim: "2207421021",
    title: "Student Mobility Forum — Universiti Malaya",
    category: "site-visit",
    partnerInstitution: "Universiti Malaya",
    country: "MY",
    city: "Kuala Lumpur",
    startDate: "2026-06-15",
    endDate: "2026-06-19",
    budget: 28000000,
    passportNo: "C1739402",
    summary: "",
    status: "draft",
    participants: mkParticipants([
      ["Muhammad Nabil Fikri", "Ketua Delegasi", "Teknik Informatika"],
      ["Ayu Larasati", "Anggota", "Administrasi Bisnis"]
    ]),
    createdAt: "2026-02-12T02:00:00.000Z",
    updatedAt: "2026-02-12T02:05:00.000Z",
    submittedAt: null
  }),
  mk({
    id: "app_10",
    registerNo: "OTB/PNJ-KUI/2025/018",
    service: "outbound",
    ownerId: "usr_1",
    ownerName: "Muhammad Nabil Fikri",
    ownerEmail: "nabil@student.pnj.ac.id",
    ownerNim: "2207421021",
    title: "Winter School — Applied Data Science",
    category: "short-course",
    partnerInstitution: "National Taiwan University of Science and Technology",
    country: "TW",
    city: "Taipei",
    startDate: "2025-12-01",
    endDate: "2025-12-20",
    budget: 39500000,
    passportNo: "C1739402",
    summary: "Program tiga minggu rekayasa data terapan dengan proyek akhir prediksi kualitas produksi.",
    status: "completed",
    createdAt: "2025-09-08T02:00:00.000Z",
    updatedAt: "2026-01-09T04:00:00.000Z",
    submittedAt: "2025-09-12T02:00:00.000Z",
    report: {
      fileName: "Laporan-Akhir-Winter-School-Taipei.pdf",
      summary:
        "Seluruh sesi terselesaikan dengan predikat distinction. Realisasi biaya di bawah pagu karena penghematan akomodasi.",
      submittedAt: "2026-01-06T03:00:00.000Z",
      validatedAt: "2026-01-08T02:00:00.000Z",
      expenses: [
        { participantId: "prt_1", ticket: 9600000, accommodation: 7800000, dailyAllowance: 4200000, insurance: 850000, other: 400000 }
      ]
    }
  })
];