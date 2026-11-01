import type { ServiceKind } from "./types";
import { PHOTOS } from "./media";

export interface ServiceContent {
  service: ServiceKind;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  facts: Array<{ label: string; value: string }>;
  eligibility: Array<{ title: string; body: string }>;
  outputs: Array<{ title: string; body: string }>;
  notes: string[];
}

export const SERVICE_CONTENT: Record<ServiceKind, ServiceContent> = {
  outbound: {
    service: "outbound",
    eyebrow: "Mobilitas keluar",
    title: "Outbound Mobility",
    description:
      "Jalur resmi mahasiswa PNJ menuju program internasional: pertukaran pelajar, magang industri, IISMA, joint degree, dan short course. Semua surat rekomendasi diterbitkan dari satu berkas.",
    image: PHOTOS.takeoff,
    imageAlt: "Pesawat lepas landas membawa mahasiswa menuju program internasional",
    facts: [
      { label: "Peserta", value: "Mahasiswa aktif PNJ" },
      { label: "Durasi umum", value: "3 minggu – 12 bulan" },
      { label: "Verifikasi", value: "2–3 hari kerja" },
      { label: "Output surat", value: "3 format resmi" }
    ],
    eligibility: [
      { title: "Status akademik", body: "Mahasiswa aktif minimal semester 2 dengan IPK ≥ 3.00 dan tidak sedang menjalani sanksi akademik." },
      { title: "LoA mitra", body: "Memiliki Letter of Acceptance atau conditional offer dari universitas/mitra tujuan yang mencantumkan periode kegiatan." },
      { title: "Kemampuan bahasa", body: "Sertifikat IELTS/TOEFL iBT/Duolingo maksimal 2 tahun terakhir, atau surat keterangan bahasa dari mitra." },
      { title: "Izin jurusan", body: "Surat izin tertulis dari ketua jurusan atau koordinator program studi, termasuk izin orang tua untuk peserta di bawah 21 tahun." },
      { title: "Pendanaan", body: "Bukti sumber dana: beasiswa, anggaran institusi, sponsor mitra, atau pernyataan pendanaan mandiri." },
      { title: "Paspor", body: "Paspor aktif minimal 6 bulan sebelum keberangkatan. Bila belum ada, sistem menerbitkan surat rekomendasi pembuatan paspor." }
    ],
    outputs: [
      { title: "Surat Rekomendasi Pembuatan Paspor", body: "Diterbitkan bila pemohon belum memiliki paspor aktif, dialamatkan ke Kantor Imigrasi." },
      { title: "Recommendation Letter for Visa", body: "Versi bilingual untuk kedutaan negara tujuan, dilengkapi lampiran rincian pendanaan." },
      { title: "Statement of Financial Guarantee", body: "Jaminan pendanaan resmi PNJ yang menyatakan tidak ada beban tambahan bagi institusi penerima." }
    ],
    notes: [
      "Seluruh surat memakai nomor register KUI/OTB/… yang tercetak otomatis setelah verifikasi.",
      "Pemohon dapat mencetak langsung dari portal tanpa menunggu pengambilan dokumen fisik di kantor."
    ]
  },
  inbound: {
    service: "inbound",
    eyebrow: "International admission",
    title: "Inbound International",
    description:
      "Pendaftaran mahasiswa, peneliti, dan peserta pertukaran asing yang akan belajar di Politeknik Negeri Jakarta — termasuk kliring visa, Letter of Acceptance ber-barcode, dan e-Certificate.",
    image: PHOTOS.collaboration,
    imageAlt: "Mahasiswa internasional berdiskusi dalam kelompok belajar",
    facts: [
      { label: "Applicants", value: "Foreign students & researchers" },
      { label: "Program", value: "Degree & non-degree" },
      { label: "Verification", value: "3 working days" },
      { label: "Output", value: "LoA, visa clearance, certificate" }
    ],
    eligibility: [
      { title: "Nomination letter", body: "Surat nominasi dari universitas asal yang menyatakan status mahasiswa aktif dan periode pertukaran." },
      { title: "Academic record", body: "Transkrip nilai terakhir dengan minimum 90 SKS atau setara, serta pernyataan kesesuaian bidang studi." },
      { title: "Language proficiency", body: "English or Indonesian proficiency evidence. Courses at PNJ are delivered in Indonesian with English materials." },
      { title: "Financial capacity", body: "Proof of funding covering living costs in Depok/Jakarta for the entire period of stay." },
      { title: "Health & insurance", body: "International health insurance valid in Indonesia and a health declaration form." },
      { title: "Passport validity", body: "Passport valid for at least 18 months from the arrival date, with at least two blank pages." }
    ],
    outputs: [
      { title: "Official Letter of Acceptance", body: "Keputusan penerimaan resmi PNJ dengan nomor unik, barcode, dan lampiran kliring visa." },
      { title: "Visa Clearance Support Letter", body: "Dukungan kliring visa untuk Kantor Imigrasi, memuat jaminan pemantauan keberadaan peserta." },
      { title: "Completion e-Certificate", body: "Sertifikat penyelesaian program yang diterbitkan otomatis setelah kegiatan berakhir." }
    ],
    notes: [
      "The portal interface follows the same flow as domestic applications; documents are submitted digitally.",
      "Arrival must be reported to the International Office within five working days."
    ]
  },
  pdln: {
    service: "pdln",
    eyebrow: "Perjalanan dinas luar negeri",
    title: "PDLN Setneg",
    description:
      "Fasilitasi izin perjalanan dinas luar negeri sivitas PNJ sesuai Permensesneg No. 5/2017: pengajuan delegasi, penerusan berkas ke Kemensetneg, hingga pelaporan realisasi biaya per peserta.",
    image: PHOTOS.meeting,
    imageAlt: "Rapat delegasi menyusun rencana perjalanan dinas luar negeri",
    facts: [
      { label: "Peserta", value: "Dosen, tendik, mahasiswa" },
      { label: "Landasan", value: "Permensesneg 5/2017" },
      { label: "Verifikasi", value: "Berjenjang KUI → Setneg" },
      { label: "Output", value: "SP Setneg & SPTJM" }
    ],
    eligibility: [
      { title: "Undangan resmi", body: "Undangan dari penyelenggara yang mencantumkan nama delegasi, tanggal, tempat, dan agenda kegiatan." },
      { title: "Surat tugas", body: "Surat tugas dari dekan atau direktur yang menyatakan dasar penugasan dan penanggung jawab kegiatan." },
      { title: "SPTJM", body: "Surat Pernyataan Tanggung Jawab Mutlak yang menyatakan biaya dibebankan pada anggaran PNJ, bukan Setneg." },
      { title: "Rencana anggaran", body: "RAB delegasi dengan rincian tiket, akomodasi, uang harian, dan asuransi per peserta." },
      { title: "Kepatuhan kuota", body: "Jumlah delegasi mengikuti kebijakan efisiensi dan kuota tahunan yang ditetapkan pimpinan." },
      { title: "Paspor & visa", body: "Paspor aktif seluruh anggota dan visa/kliring visa negara tujuan bila required." }
    ],
    outputs: [
      { title: "Surat Pengantar Izin Setneg", body: "Pengantar permohonan izin perjalanan dinas luar negeri kepada Kemensetneg RI, lengkap dengan lampiran justifikasi." },
      { title: "Daftar Delegasi Resmi", body: "Lampiran daftar peserta tanpa data identitas sensitif; data paspor disimpan pada arsip verifikasi." },
      { title: "SPTJM", body: "Pernyataan tanggung jawab mutlak yang wajib sebelum berkas diteruskan ke kementerian." }
    ],
    notes: [
      "Papan transparansi publik menampilkan nama kegiatan, negara, dan jumlah peserta — tanpa NIK atau nomor paspor.",
      "Realisasi biaya dilaporkan per peserta setelah kegiatan; sistem menghitung total tanpa pemukulan rata."
    ]
  }
};