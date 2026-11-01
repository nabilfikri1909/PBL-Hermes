import type { LetterKind } from "./types";
import { countryName, formatDate, rupiah, ROLE_META } from "./utils";

/* ── Document model shared by the A4 engine ───────────────────── */

export type Block =
  | { type: "heading"; text: string }
  | { type: "para"; text: string }
  | { type: "kv"; rows: Array<[string, string]> }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "note"; text: string }
  | { type: "signature"; forLabel: string; name: string; role: string; nip?: string };

export interface Sheet {
  no: number;
  title: string;
  blocks: Block[];
}

export interface LetterData {
  registerNo: string;
  applicantName: string;
  applicantNim: string;
  department: string;
  email: string;
  phone: string;
  passportNo: string;
  nationality: string;
  title: string;
  category: string;
  partner: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  funding: string;
  budget: number;
  summary: string;
  participants: Array<{ name: string; role: string; institution: string; docStatus: string }>;
  role: string;
  issueDate: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  exchange: "Student Exchange",
  internship: "International Internship",
  iisma: "IISMA Awardee",
  "dual-degree": "Joint / Dual Degree",
  "short-course": "Short Course / Summer School",
  degree: "Program Gelar (Degree)",
  "non-degree": "Program Non-Gelar",
  research: "Penelitian Kolaboratif",
  cultural: "Pertukaran Budaya",
  conference: "Konferensi / Seminar Internasional",
  competition: "Kompetisi Internasional",
  benchmarking: "Benchmarking Institusi",
  partnership: "Penandatanganan Kerja Sama",
  "site-visit": "Kunjungan Kerja / Site Visit"
};

export const FUNDING_LABELS: Record<string, string> = {
  beasiswa: "Beasiswa / Hibah",
  mandiri: "Pendanaan Mandiri",
  institusi: "Anggaran Institusi PNJ",
  mitra: "Sponsor Mitra / Industri"
};

const DIRECTOR = { name: "Dr. Syamsurizal, S.E., M.M.", role: "Direktur Politeknik Negeri Jakarta", nip: "196510101990031003" };
const ACADEMIC_VICE = { name: "Prof. Iwan Susanto, M.T., Ph.D.", role: "Wakil Direktur Bidang Akademik", nip: "197905042006041002" };
const KUI_HEAD = { name: "Rina Kartika, M.I.Kom", role: "Kepala Kantor Urusan Internasional", nip: "199001152015032004" };

function period(d: LetterData) {
  return `${formatDate(d.startDate)} s.d. ${formatDate(d.endDate)}`;
}

const identityBlock = (d: LetterData): Block => ({
  type: "kv",
  rows: [
    ["Nama", d.applicantName],
    ["NIM / NIP", d.applicantNim || "—"],
    ["Program Studi", d.department],
    ["Email Resmi", d.email],
    ["Nomor Telepon", d.phone],
    ["Nomor Paspor", d.passportNo || "—"]
  ]
});

const activityBlock = (d: LetterData): Block => ({
  type: "kv",
  rows: [
    ["Nama Kegiatan", d.title || "—"],
    ["Kategori", CATEGORY_LABELS[d.category] ?? d.category],
    ["Institusi Mitra", d.partner || "—"],
    ["Negara / Kota Tujuan", `${countryName(d.country)}${d.city ? ` — ${d.city}` : ""}`],
    ["Periode Kegiatan", period(d)],
    ["Sumber Pendanaan", FUNDING_LABELS[d.funding] ?? d.funding]
  ]
});

function delegationTable(d: LetterData): Block {
  return {
    type: "table",
    head: ["No", "Nama Lengkap", "Peran", "Unit Kerja", "Status Berkas"],
    rows: d.participants.length
      ? d.participants.map((p, i) => [String(i + 1), p.name, p.role, p.institution || "—", p.docStatus === "valid" ? "Terverifikasi" : p.docStatus === "revision" ? "Perlu Revisi" : "Menunggu"])
      : [["1", d.applicantName, "Ketua Delegasi", d.department, "Menunggu"]]
  };
}

/** Builds the printable sheets for any letter kind. Pure & deterministic. */
export function buildSheets(kind: LetterKind, d: LetterData): Sheet[] {
  const y = d.issueDate ? new Date(d.issueDate).getUTCFullYear() : new Date().getUTCFullYear();
  const nomor = `${d.registerNo || `KUI/PNJ/${y}/000`}`;
  const lanjut = `Demikian surat ini kami sampaikan untuk dipergunakan sebagaimana mestinya. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.`;

  switch (kind) {
    case "outbound-passport":
      return [
        {
          no: 1,
          title: "Surat Rekomendasi Pembuatan Paspor",
          blocks: [
            { type: "heading", text: "SURAT REKOMENDASI PEMBUATAN PASPOR" },
            { type: "para", text: `Nomor: ${nomor}` },
            { type: "para", text: "Yang bertanda tangan di bawah ini, Kepala Kantor Urusan Internasional Politeknik Negeri Jakarta, dengan ini menerangkan bahwa:" },
            identityBlock(d),
            { type: "para", text: "Adalah benar mahasiswa aktif Politeknik Negeri Jakarta dan yang bersangkutan memerlukan paspor Republik Indonesia untuk keperluan kegiatan internasional berikut:" },
            activityBlock(d),
            { type: "para", text: "Sehubungan dengan hal tersebut, kami merekomendasikan yang bersangkutan untuk memperoleh pelayanan penerbitan paspor pada Kantor Imigrasi sesuai ketentuan yang berlaku." },
            { type: "para", text: lanjut },
            { type: "signature", forLabel: "Kepala Kantor Urusan Internasional", name: KUI_HEAD.name, role: KUI_HEAD.role, nip: KUI_HEAD.nip }
          ]
        }
      ];

    case "outbound-visa":
      return [
        {
          no: 1,
          title: "Recommendation Letter for Visa Application",
          blocks: [
            { type: "heading", text: "RECOMMENDATION LETTER FOR VISA APPLICATION" },
            { type: "para", text: `Number: ${nomor}` },
            { type: "para", text: "To the Attention of the Visa Section," },
            { type: "para", text: "We, the International Office of Politeknik Negeri Jakarta (PNJ), hereby confirm that the following student is an active member of our academic community and is recommended for a visa application:" },
            identityBlock(d),
            { type: "para", text: "The applicant has been officially accepted in the following programme:" },
            activityBlock(d),
            { type: "para", text: `The applicant is expected to arrive on ${formatDate(d.startDate)} and remain in ${countryName(d.country)} until ${formatDate(d.endDate)} for the sole purpose of participating in the programme described above. PNJ guarantees that the applicant will comply with the immigration regulations of the host country and will return to Indonesia upon completion of the programme.` },
            { type: "para", text: "Should you require further verification, please contact the International Office at kui@pnj.ac.id." },
            { type: "signature", forLabel: "Head of International Office", name: KUI_HEAD.name, role: KUI_HEAD.role, nip: KUI_HEAD.nip }
          ]
        },
        {
          no: 2,
          title: "Lampiran: Rincian Pendanaan",
          blocks: [
            { type: "heading", text: "LAMPIRAN — STATEMENT OF FUNDING" },
            { type: "para", text: `Lampiran surat nomor ${nomor}` },
            {
              type: "kv",
              rows: [
                ["Sumber Pendanaan", FUNDING_LABELS[d.funding] ?? d.funding],
                ["Nilai Pendanaan", rupiah(d.budget)],
                ["Penanggung Jawab", d.applicantName],
                ["Rekening / Lembaga", "Politeknik Negeri Jakarta — KUI"]
              ]
            },
            { type: "para", text: "Dana tersebut di atas dialokasikan untuk tiket perjalanan, akomodasi, uang harian, asuransi perjalanan, dan biaya kegiatan sesuai rencana anggaran yang dilampirkan pada berkas pengajuan." },
            { type: "note", text: "Lampiran ini merupakan bagian tidak terpisahkan dari surat rekomendasi visa." },
            { type: "signature", forLabel: "Head of International Office", name: KUI_HEAD.name, role: KUI_HEAD.role, nip: KUI_HEAD.nip }
          ]
        }
      ];

    case "outbound-financial":
      return [
        {
          no: 1,
          title: "Statement of Financial Guarantee",
          blocks: [
            { type: "heading", text: "STATEMENT OF FINANCIAL GUARANTEE" },
            { type: "para", text: `Number: ${nomor}` },
            { type: "para", text: "This statement is issued to confirm the financial arrangement of the student named below during the international mobility programme:" },
            identityBlock(d),
            activityBlock(d),
            { type: "para", text: `The total funding allocated for this programme is ${rupiah(d.budget)} (${FUNDING_LABELS[d.funding] ?? d.funding}). The funding covers return airfare, accommodation, daily allowance, travel insurance, and programme fees for the entire period of ${period(d)}.` },
            { type: "para", text: "Politeknik Negeri Jakarta confirms that no additional financial burden will be placed upon the host institution or the host country during the programme." },
            { type: "signature", forLabel: "Direktur Politeknik Negeri Jakarta", name: DIRECTOR.name, role: DIRECTOR.role, nip: DIRECTOR.nip }
          ]
        }
      ];

    case "inbound-loa":
      return [
        {
          no: 1,
          title: "Official Letter of Acceptance (LoA)",
          blocks: [
            { type: "heading", text: "OFFICIAL LETTER OF ACCEPTANCE" },
            { type: "para", text: `Number: ${nomor}` },
            { type: "para", text: "Dear Applicant," },
            { type: "para", text: "On behalf of Politeknik Negeri Jakarta (PNJ), we are pleased to inform you that your application has been reviewed and accepted. You are hereby admitted as an international participant in the programme described below:" },
            identityBlock(d),
            activityBlock(d),
            { type: "para", text: "Your acceptance is granted with the following conditions:" },
            {
              type: "list",
              items: [
                "The participant must complete the visa and stay-permit process in accordance with Indonesian immigration regulations before arrival.",
                "The participant must report to the International Office no later than five working days after arrival at the PNJ Kukusan campus.",
                "The participant must maintain full-time enrolment and comply with all academic regulations of Politeknik Negeri Jakarta."
              ]
            },
            { type: "para", text: "We look forward to welcoming you at our campus in Depok, Indonesia." },
            { type: "signature", forLabel: "Direktur Politeknik Negeri Jakarta", name: DIRECTOR.name, role: DIRECTOR.role, nip: DIRECTOR.nip }
          ]
        },
        {
          no: 2,
          title: "Lampiran: Visa & Kedatangan",
          blocks: [
            { type: "heading", text: "ANNEX — VISA CLEARANCE & ARRIVAL" },
            { type: "para", text: `Annex to Letter of Acceptance number ${nomor}` },
            {
              type: "kv",
              rows: [
                ["Jenis Visa", "Visa Pelajar / Visa Kunjungan Terbatas (VITAS)"],
                ["Negara Asal", countryName(d.country)],
                ["Tanggal Kedatangan", formatDate(d.startDate)],
                ["Tanggal Berakhir Program", formatDate(d.endDate)],
                ["Unit Penanggung Jawab", "Kantor Urusan Internasional PNJ"],
                ["Kontak Kliring Visa", "kui@pnj.ac.id · +62 21 7863 199"]
              ]
            },
            { type: "para", text: "Skrining kedatangan dilakukan setelah peserta menyerahkan salinan paspor dan dokumen kliring visa pada portal Inbound. Kegagalan memenuhi dokumen kliring visa mengakibatkan penerimaan dinyatakan tidak berlaku." },
            { type: "signature", forLabel: "Head of International Office", name: KUI_HEAD.name, role: KUI_HEAD.role, nip: KUI_HEAD.nip }
          ]
        }
      ];

    case "inbound-visa":
      return [
        {
          no: 1,
          title: "Visa Clearance Support Letter",
          blocks: [
            { type: "heading", text: "VISA CLEARANCE SUPPORT LETTER" },
            { type: "para", text: `Number: ${nomor}` },
            { type: "para", text: "To the Indonesian Immigration Office," },
            { type: "para", text: "We confirm that the following foreign participant has been accepted to join a programme at Politeknik Negeri Jakarta and requires visa clearance support:" },
            identityBlock(d),
            activityBlock(d),
            { type: "para", text: "PNJ undertakes to monitor the participant's presence for the entire programme period and to report any change of status to the local immigration office." },
            { type: "signature", forLabel: "Head of International Office", name: KUI_HEAD.name, role: KUI_HEAD.role, nip: KUI_HEAD.nip }
          ]
        }
      ];

    case "inbound-certificate":
      return [
        {
          no: 1,
          title: "Program Completion e-Certificate",
          blocks: [
            { type: "heading", text: "CERTIFICATE OF COMPLETION" },
            { type: "para", text: `Certificate Number: ${nomor}` },
            { type: "para", text: "This is to certify that" },
            { type: "heading", text: d.applicantName || "Participant Name" },
            { type: "para", text: `has successfully completed the programme "${d.title || "—"}" at Politeknik Negeri Jakarta, held from ${formatDate(d.startDate)} to ${formatDate(d.endDate)}, and has fulfilled all academic and administrative requirements of the programme.` },
            {
              type: "kv",
              rows: [
                ["Program Studi Tujuan", d.department],
                ["Institusi Asal", d.partner],
                ["Negara Asal", countryName(d.country)],
                ["Kota Pelaksanaan", d.city || "Depok"]
              ]
            },
            { type: "signature", forLabel: "Direktur Politeknik Negeri Jakarta", name: DIRECTOR.name, role: DIRECTOR.role, nip: DIRECTOR.nip }
          ]
        }
      ];

    case "pdln-director":
      return [
        {
          no: 1,
          title: "Surat Pengantar Izin Setneg",
          blocks: [
            { type: "heading", text: "SURAT PENGANTAR PERMOHONAN IZIN PERJALANAN DINAS LUAR NEGERI" },
            { type: "para", text: `Nomor: ${nomor}` },
            { type: "para", text: "Kepada Yth. Menteri Sekretaris Negara Republik Indonesia c.q. Deputi Bidang Protokol dan Perjalanan, di Jakarta" },
            { type: "para", text: "Dengan hormat, dalam rangka pelaksanaan tugas kedinasan dan pengembangan kapasitas institusi, kami mengajukan permohonan izin perjalanan dinas luar negeri bagi sivitas akademika Politeknik Negeri Jakarta dengan rincian sebagai berikut:" },
            activityBlock(d),
            { type: "para", text: "Susunan delegasi yang diusulkan adalah sebagai berikut:" },
            delegationTable(d),
            { type: "para", text: "Pengajuan ini dilengkapi dengan Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) serta rencana anggaran biaya delegasi sebagaimana ketentuan Permensesneg Nomor 5 Tahun 2017 tentang Perjalanan Dinas Luar Negeri." },
            { type: "signature", forLabel: "Direktur Politeknik Negeri Jakarta", name: DIRECTOR.name, role: DIRECTOR.role, nip: DIRECTOR.nip }
          ]
        },
        {
          no: 2,
          title: "Lampiran: Justifikasi & Anggaran",
          blocks: [
            { type: "heading", text: "LAMPIRAN — JUSTIFIKASI PENUGASAN & ANGGARAN" },
            { type: "para", text: `Lampiran surat nomor ${nomor}` },
            { type: "para", text: d.summary || "Penugasan ini dilaksanakan untuk mendukung pencapaian indikator kinerja institusi pada bidang kerja sama internasional dan penguatan pembelajaran vokasi." },
            {
              type: "kv",
              rows: [
                ["Pagu Anggaran Delegasi", rupiah(d.budget)],
                ["Sumber Anggaran", FUNDING_LABELS[d.funding] ?? d.funding],
                ["Jumlah Peserta", `${d.participants.length || 1} orang`],
                ["Durasi Penugasan", period(d)],
                ["Negara Tujuan", countryName(d.country)]
              ]
            },
            { type: "note", text: "Realisasi biaya dilaporkan per peserta pada laporan akhir kegiatan, bukan sebagai biaya lump sum." },
            { type: "signature", forLabel: "Direktur Politeknik Negeri Jakarta", name: DIRECTOR.name, role: DIRECTOR.role, nip: DIRECTOR.nip }
          ]
        }
      ];

    case "pdln-delegation":
      return [
        {
          no: 1,
          title: "Daftar Delegasi Resmi",
          blocks: [
            { type: "heading", text: "DAFTAR DELEGASI RESMI" },
            { type: "para", text: `Lampiran surat nomor ${nomor}` },
            { type: "para", text: `Kegiatan: ${d.title || "—"} · ${countryName(d.country)} · ${period(d)}` },
            delegationTable(d),
            { type: "note", text: "Data nomor paspor dan identitas kependudukan tidak dicetak pada lampiran publik. Dossier lengkap disimpan pada arsip verifikasi KUI." },
            { type: "signature", forLabel: "Kepala Kantor Urusan Internasional", name: KUI_HEAD.name, role: KUI_HEAD.role, nip: KUI_HEAD.nip }
          ]
        }
      ];

    case "pdln-sptjm":
      return [
        {
          no: 1,
          title: "Surat Pernyataan Tanggung Jawab Mutlak",
          blocks: [
            { type: "heading", text: "SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK" },
            { type: "para", text: `Nomor: ${nomor}` },
            { type: "para", text: "Yang bertanda tangan di bawah ini, Direktur Politeknik Negeri Jakarta, menyatakan dengan sesungguhnya bahwa:" },
            { type: "kv", rows: [["Nama Kegiatan", d.title || "—"], ["Negara Tujuan", countryName(d.country)], ["Periode", period(d)], ["Penanggung Jawab", d.applicantName]] },
            { type: "para", text: "1. Seluruh biaya perjalanan dinas luar negeri dibebankan pada anggaran Politeknik Negeri Jakarta dan/atau sumber dana lain yang sah, bukan pada anggaran Kementerian Sekretariat Negara." },
            { type: "para", text: "2. Seluruh anggota delegasi akan kembali ke Indonesia paling lambat 7 (tujuh) hari kerja setelah kegiatan berakhir." },
            { type: "para", text: "3. Apabila terjadi penyimpangan, maka menjadi tanggung jawab penuh penerbit pernyataan sesuai peraturan perundang-undangan." },
            { type: "para", text: "Demikian pernyataan ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya." },
            { type: "signature", forLabel: "Direktur Politeknik Negeri Jakarta", name: DIRECTOR.name, role: DIRECTOR.role, nip: DIRECTOR.nip }
          ]
        }
      ];
  }
}

export const DOC_LABEL: Record<string, string> = {
  valid: "Terverifikasi",
  pending: "Menunggu",
  revision: "Perlu Revisi"
};

export function roleLabel(role: string) {
  return ROLE_META[role as keyof typeof ROLE_META]?.label ?? role;
}