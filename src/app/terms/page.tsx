import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Syarat & Ketentuan" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Ketentuan layanan"
      title="Syarat & ketentuan penggunaan"
      description="Ketentuan ini mengatur penggunaan Portal Program Internasional Politeknik Negeri Jakarta oleh mahasiswa, dosen, tenaga kependidikan, dan peserta asing."
      updatedAt="Februari 2026"
      sections={[
        {
          title: "1. Ruang lingkup layanan",
          paragraphs: [
            "Portal menyediakan tiga layanan: pengajuan mobilitas keluar (Outbound), pendaftaran peserta asing (Inbound), dan izin perjalanan dinas luar negeri (PDLN).",
            "Portal menerbitkan draf dokumen resmi. Dokumen dinyatakan sah setelah verifikator KUI menyetujui berkas dan nomor register diterbitkan."
          ]
        },
        {
          title: "2. Kewajiban pengguna",
          paragraphs: [
            "Pengguna wajib mengisi data yang benar dan mengunggah dokumen asli yang masih berlaku. Pemalsuan dokumen berakibat penolakan berkas dan proses disiplin sesuai peraturan akademik.",
            "Pengguna bertanggung jawab menjaga kerahasiaan kata sandi akun dan seluruh aktivitas yang dilakukan melalui akun tersebut."
          ]
        },
        {
          title: "3. Keputusan verifikasi",
          paragraphs: [
            "Sistem tidak melakukan penilaian kualitatif otomatis. Keputusan menyetujui, menolak, atau meminta perbaikan sepenuhnya berada pada verifikator KUI sebagai manusia yang berwenang.",
            "Verifikator wajib menyertakan catatan spesifik ketika meminta perbaikan. Catatan tersebut tampil pada halaman detail pengajuan Anda."
          ]
        },
        {
          title: "4. Perjalanan dinas luar negeri",
          paragraphs: [
            "Pengajuan PDLN wajib melampirkan Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) yang menyatakan pembiayaan dibebankan pada anggaran PNJ, bukan anggaran Kementerian Sekretariat Negara.",
            "Pelaporan akhir kegiatan wajib memuat realisasi biaya per peserta. Biaya tidak boleh dilaporkan secara lump-sum."
          ]
        },
        {
          title: "5. Batasan tanggung jawab",
          paragraphs: [
            "PNJ tidak bertanggung jawab atas keputusan pihak ketiga seperti kedutaan, imigrasi, atau penyelenggara program. Keterlambatan yang disebabkan kelengkapan berkas pengguna bukan tanggung jawab portal.",
            "Portal dapat menutup sementara pendaftaran suatu layanan untuk pemeliharaan atau penyesuaian kuota tahunan."
          ]
        },
        {
          title: "6. Perubahan ketentuan",
          paragraphs: [
            "Perubahan ketentuan diumumkan melalui halaman pengumuman KUI pada portal. Penggunaan layanan setelah pengumuman dianggap sebagai persetujuan atas ketentuan yang berlaku."
          ]
        }
      ]}
    />
  );
}