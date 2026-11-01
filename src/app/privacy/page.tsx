import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Kebijakan Privasi" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Perlindungan data"
      title="Kebijakan privasi & data pribadi"
      description="Portal ini memproses data pribadi sivitas akademika PNJ untuk keperluan layanan mobilitas internasional. Berikut rincian data yang dikumpulkan, dasar pemrosesan, dan cara Anda mengendalikannya."
      updatedAt="Februari 2026"
      sections={[
        {
          title: "1. Data yang kami kumpulkan",
          paragraphs: [
            "Data identitas: nama lengkap, NIM/NIP, program studi, email kampus, nomor telepon, kewarganegaraan, dan nomor paspor untuk keperluan penerbitan surat resmi.",
            "Data berkas: Letter of Acceptance mitra, transkrip nilai, sertifikat kemampuan bahasa, surat izin jurusan, undangan resmi, hingga laporan akhir kegiatan beserta realisasi biaya per peserta.",
            "Data teknis: jejak audit akses (waktu, alamat IP, aksi) yang bersifat append-only dan tidak dapat diubah pengguna."
          ]
        },
        {
          title: "2. Dasar pemrosesan",
          paragraphs: [
            "Data diproses untuk pelaksanaan layanan akademik dan tugas kedinasan institusi, pemenuhan kewajiban regulasi perjalanan dinas luar negeri (Permensesneg No. 5/2017), serta penerbitan dokumen resmi yang Anda minta.",
            "Nomor paspor dan identitas kependudukan anggota delegasi hanya dapat diakses verifikator KUI yang berwenang."
          ]
        },
        {
          title: "3. Pembatasan publikasi",
          paragraphs: [
            "Papan transparansi PDLN publik hanya menampilkan nomor registrasi, judul penugasan, negara tujuan, periode, status, dan jumlah peserta.",
            "Dialog +N lagi hanya membuka nama anggota dan status verifikasinya. NIK, nomor paspor, email pribadi, dan nomor telepon tidak pernah dikirim ke peramban publik."
          ]
        },
        {
          title: "4. Penyimpanan & retensi",
          paragraphs: [
            "Data disimpan pada penyimpanan server portal beserta berkas pendukung. Berkas pengajuan disimpan minimal 5 tahun untuk keperluan audit dan pertanggungjawaban kegiatan.",
            "Draf pengisian disimpan pada peramban Anda (localStorage) dan penyimpanan server dengan jeda autosave 1,8 detik."
          ]
        },
        {
          title: "5. Hak Anda",
          paragraphs: [
            "Anda dapat memperbarui data profil, meminta koreksi berkas melalui mode revisi, atau mengajukan pertanyaan terkait pemrosesan data melalui tiket di dashboard.",
            "Permintaan penghapusan data yang sudah menjadi bagian dari dokumen resmi akan diproses sesuai ketentuan kearsipan institusi."
          ]
        },
        {
          title: "6. Kontak",
          paragraphs: [
            "Kantor Urusan Internasional PNJ — Gedung Direktorat, Kampus PNJ Kukusan, Beji, Depok 16425. Email: kui@pnj.ac.id."
          ]
        }
      ]}
    />
  );
}