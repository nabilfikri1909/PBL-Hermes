# Product Requirements Document (PRD)
# Portal Program Internasional Politeknik Negeri Jakarta

> **Standar Acuan**: ISO/IEC/IEEE 29148:2018 (Systems and software engineering — Life cycle processes — Requirements engineering)  
> **Status Dokumen**: Approved / Implemented  
> **Versi**: 2.0 (Overhaul Total: Triplio Minimalist & iOS 27 Glassmorphism)  
> **Pemilik Produk**: Kantor Urusan Internasional (KUI) Politeknik Negeri Jakarta  
> **Tim Pengembang**: Kelompok 6 — ADSI D4 Teknik Informatika PNJ  

---

## 1. Pendahuluan & Latar Belakang

Politeknik Negeri Jakarta (PNJ) sebagai perguruan tinggi vokasi terkemuka di Indonesia aktif menjalin kemitraan global melalui berbagai program mobilitas internasional. Program-program tersebut melibatkan mahasiswa, dosen, tenaga kependidikan, serta mitra universitas luar negeri.

Sebelum sistem ini dibangun, proses operasional di KUI PNJ menghadapi kendala signifikan:
1. **Pemisahan Alur yang Terfragmentasi**: Pengurusan izin dinas kenegaraan (PDLN), mobilitas mahasiswa keluar negeri (Outbound), dan penerimaan mahasiswa asing (Inbound) berjalan secara manual atau menggunakan form terpisah yang membingungkan civitas.
2. **Ketiadaan Pratinjau Dokumen Langsung**: Pengaju harus menunggu berhari-hari hanya untuk mengetahui apakah format surat rekomendasi paspor atau visa mereka sudah benar.
3. **Kerentanan Privasi Data Delegasi**: Pada pengajuan rombongan, data sensitif (NIK, paspor, kontak) peserta sering kali terpapar secara terbuka.
4. **Discrepancy Anggaran**: Laporan biaya kegiatan sering dipukul rata (*lump sum*), padahal pengeluaran riil antar anggota delegasi berbeda.

Portal Program Internasional PNJ hadir sebagai solusi terpadu, menghadirkan platform digital satu pintu yang elegan, aman, transparan, dan memenuhi seluruh standar regulasi kenegaraan.

---

## 2. Tujuan & Sasaran Sistem (Business Objectives)

| ID | Sasaran Bisnis | Indikator Keberhasilan (KPI) |
| :--- | :--- | :--- |
| **OBJ-01** | Mengintegrasikan seluruh layanan KUI dalam satu portal | Tersedianya 3 modul inti (Outbound, Inbound, PDLN) dalam 1 domain terpadu. |
| **OBJ-02** | Mempercepat siklus penerbitan surat rekomendasi resmi | Pemohon dapat melihat pratinjau surat A4 secara *real-time* saat mengisi data; waktu verifikasi turun dari 7 hari menjadi 2-3 hari kerja. |
| **OBJ-03** | Menjamin 100% kepatuhan regulasi kenegaraan (PDLN) | Seluruh dossier delegasi memenuhi klausul Permensesneg No. 5/2017 sebelum diteruskan ke kementerian. |
| **OBJ-04** | Melindungi Privasi Identitas Pribadi (PII) delegasi | Zero exposure data NIK/Paspor pada halaman transparansi publik menggunakan pola modal **`+N lagi`**. |
| **OBJ-05** | Meningkatkan kenyamanan visual pengguna (*Visual Serenity*) | Mengadopsi tata letak modern minimalis ala Triplio dipadukan dengan efek *frosted glass* iOS 27 tanpa teks pengisi (*anti-slop*). |

---

## 3. Matriks Peran Pengguna (User Personas & RBAC)

Sistem menerapkan kontrol akses berbasis peran (*Role-Based Access Control* / RBAC) yang ketat:

```
┌─────────────────────────┬──────────────┬─────────────────────────────────────────────────────────────┐
│ Peran (Role)            │ Identifier   │ Deskripsi & Batas Akses                                     │
├─────────────────────────┼──────────────┼─────────────────────────────────────────────────────────────┤
│ Mahasiswa PNJ           │ student      │ Mengakses Outbound & PDLN, mengisi form, memantau status,  │
│                         │              │ melihat pratinjau A4, mengedit draf, mengunduh rekomendasi. │
│ Mahasiswa Asing         │ foreign      │ Mengakses portal Inbound berbahasa Inggris, mendaftar,     │
│                         │              │ mengunggah berkas visa, mengunduh LoA & e-Certificate.      │
│ Dosen / Tenaga Pengajar │ lecturer     │ Mengajukan izin dinas PDLN (delegasi/individu), mengunggah  │
│                         │              │ laporan kegiatan & pertanggungjawaban biaya riil 3NF.      │
│ Verifikator KUI         │ admin        │ Memeriksa berkas pendaftaran, memberikan catatan revisi,   │
│                         │              │ menyetujui/menolak, meneruskan berkas ke kementerian.      │
│ Super Admin             │ super_admin  │ Akses penuh: manajemen role admin, pemantauan audit log,   │
│                         │              │ konfigurasi parameter sistem, dan pengelolaan CMS FAQ.      │
└─────────────────────────┴──────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 4. Spesifikasi Kebutuhan Fungsional per Fitur & Halaman

### 4.1 Halaman Publik (Landing Page & Informasi)

#### Halaman Beranda (`/` - Landing Page)
- **Triplio Hero Banner**: Menampilkan tipografi tebal bernapas, latar foto kampus PNJ beresolusi tinggi (`foto-pnj.jpg`) dengan sentuhan gradien navy, dan *floating capsule search/filter bar*.
- **Capsule Program Switcher**: Memungkinkan pengunjung memilih program (*Outbound*, *Inbound*, *PDLN Setneg*), melihat sasaran dan output dokumen, serta langsung menuju form via tombol kapsul navy ber-ikon panah melingkar (`↗`).
- **3 Tall Service Cards (Aspect Ratio ~3:4)**: Kartu informasi program dengan sudut membulat (*rounded-2xl*), latar gambar tematik, badge audiens melayang, dan efek interaksi *hover zoom*.
- **Workflow Diagram Interaktif**: Visualisasi 4 langkah pengajuan transparan (Pendaftaran -> Verifikasi KUI -> Penerusan Resmi -> Surat Rekomendasi).
- **Statistik Mobilitas Global**: Angka realisasi mahasiswa outbound, inbound, dan negara mitra.
- **Pusat Bantuan & Pengumuman**: Accordion FAQ dan daftar buletin resmi terbaru dari KUI.

#### Halaman Khusus Tiap Program (`/outbound`, `/inbound`, `/pdln`)
- **Penjelasan Alur Resmi**: Rincian kriteria eligibilitas, dokumen yang wajib dipersiapkan, dan jadwal pembukaan program.
- **Action Button Prominen**: Tombol CTA dinamis ("Mulai Pengajuan Sekarang") yang mengarahkan pengguna ke form wizard terkait.

#### Halaman Transparansi PDLN (`/pdln/public-applications`)
- Papan akuntabilitas publik untuk pemantauan surat persetujuan dinas luar negeri sivitas PNJ.
- **Privasi Terproteksi**: Hanya menampilkan Nomor Registrasi, Judul Penugasan, Negara Tujuan, Tanggal, dan Badge Jumlah Peserta.
- **Modal Dialog `+N lagi`**: Mengklik badge peserta membuka modal yang **hanya menampilkan nama peserta dan status verifikasi**, tanpa membocorkan NIK, nomor paspor, atau kontak pribadi.

---

### 4.2 Modul Pengisian Formulir & Live A4 Engine

#### Wizard Formulir Multi-Langkah (`/outbound/apply`, `/inbound/apply`, `/pdln/apply`)
- **Struktur Bertahap**:
  1. *Data Pengaju*: Nama lengkap, NIM/NIP, Jurusan, Program Studi, Email resmi, Nomor Telepon.
  2. *Data Kegiatan*: Nama program/kegiatan, Universitas/Institusi Mitra, Negara Tujuan, Kota, Periode (Tanggal Mulai & Akhir).
  3. *Perjalanan & Visa*: Kategori kegiatan, sumber pendanaan (Beasiswa/Mandiri/Institusi), nomor paspor.
  4. *Dokumen Pendukung*: Unggah LoA mitra, transkrip nilai, sertifikat bahasa Inggris, surat izin orang tua/jurusan.
  5. *Anggota Rombongan (Khusus PDLN/Kelompok)*: Penambahan anggota delegasi, peranan, dan pengelolaannya dengan dialog konfirmasi penghapusan.
  6. *Tinjau & Kirim*: Pratinjau ringkasan isian, persetujuan syarat ketentuan, dan tombol submit akhir.
- **Poka-Yoke Autosave Engine**:
  - Menyimpan draf secara otomatis ke `localStorage` dan server `.data/mock-applications.json` dengan jeda debounce 1.8 detik.
  - Indikator status penyimpanan di pojok kanan atas (*"Draf tersimpan"* / *"Menyimpan..."*).
- **Anti-Slop Clean UI**:
  - Kolom input bersih tanpa pengulangan teks bantuan generik.
  - Stepper vertikal minimalis yang hanya menandai langkah aktif (*"Sedang diisi"*) dan langkah tuntas (*"Selesai"*).
- **Pencegah Error Hidrasi (Hydration-Safe)**:
  - Dropdown negara menggunakan kamus kanonikal deterministik (`countryName`) yang menjamin kesamaan nama antara server Node.js dan browser client (contoh: "Hong Kong" dan "Makau" tanpa sufiks DAK/SAR).
  - Dilengkapi atribut `suppressHydrationWarning`.

#### Engine Pratinjau Dokumen A4 (`LiveDocumentPreview`)
- **Sinkronisasi Dua Arah (*Real-Time Two-Way Binding*)**: Setiap karakter yang diketikkan pengguna pada form langsung tercermin pada lembar surat resmi di sebelah kanan (latar kertas A4 putih dengan rasio 1 : 1.414).
- **Toolbar iOS 27 Glass 1-Baris**:
  - Pill navigasi nomor lembar (`1`, `2`, `3`, `4`, `5`) untuk melompat antar lembar surat dalam 1 klik.
  - Dropdown format template surat.
  - Tombol **Unduh Blanko PDF Asli** (mengambil file fisik blanko asli dari KUI).
  - Tombol **Cetak PDF** (memicu browser print dialog untuk menyimpan hasil isian sebagai PDF berkualitas cetak tinggi).
  - Kontrol pembesaran (*Zoom Controls*: `-`, persentase, `+`, `reset`).
- **Koleksi Template Surat Resmi**:
  - *Outbound*: Surat Rekomendasi Pembuatan Paspor, Recommendation Letter for Visa Application, Statement of Financial Guarantee.
  - *Inbound*: Official Letter of Acceptance (LoA) PNJ, Visa Clearance Support Letter, Completion Certificate.
  - *PDLN*: Surat Pengantar Permohonan Izin Setneg ke Direktur PNJ, Daftar Delegasi Resmi, Surat Pernyataan Tanggung Jawab Mutlak (SPTJM).

---

### 4.3 Modul Mahasiswa & Civitas (Dashboard User)

#### Beranda Pengguna (`/dashboard`)
- Menampilkan kartu ringkasan status pengajuan aktif (*Draft*, *Submitted*, *Under Review*, *Approved*).
- Akses cepat menuju draf terakhir yang belum diselesaikan.

#### Daftar Pengajuan Saya (`/dashboard/applications`)
- Tabel riwayat pengajuan dengan fitur penyortiran (*Newest First* secara default), filter berdasarkan program dan status, serta pencarian instan.
- Kolom tabel: Nomor Pengajuan, Judul Kegiatan, Negara, Tanggal Kirim, Status terkini (Badge warna semantik), dan Tombol Aksi (*Detail* / *Edit Draf*).

#### Detail Pengajuan (`/dashboard/applications/[id]`)
- Linimasa visual perjalanan berkas:
  `Draf` -> `Terkirim` -> `Verifikasi Berkas` -> `Perlu Revisi (jika ada)` -> `Diteruskan ke KUI/Setneg` -> `Disetujui` -> `Selesai`.
- **Panel Catatan Revisi**: Jika status berkas adalah `revision_required`, panel kuning interaktif menampilkan instruksi perbaikan dari verifikator admin KUI.
- Tombol aksi menuju mode perbaikan (`/dashboard/applications/[id]/edit`).

#### Pelaporan Akhir & Realisasi Biaya (`/dashboard/applications/[id]` - Pasca Kegiatan)
- Formulir pengunggahan Laporan Akhir Kegiatan (*Final Report PDF*).
- **Tabel Biaya Riil per Anggota Delegasi (3NF)**:
  - Input biaya tiket, akomodasi, uang harian, dan asuransi secara terpisah untuk masing-masing peserta.
  - Validasi angka non-negatif dengan kalkulasi otomatis total pengeluaran kegiatan.

---

### 4.4 Modul Admin & Verifikator KUI (`/admin`)

#### Command Center Admin (`/admin`)
- Ringkasan KPI: Total pengajuan aktif, berkas menunggu verifikasi, permohonan revisi, dan pengajuan selesai bulan berjalan.
- Shortcut antrean kerja verifikator berdasarkan kategori (Outbound, Inbound, PDLN).

#### Verifikasi Berkas Split-Pane (`/admin/applications/[id]`)
- Antarmuka inspeksi berkas yang membagi layar menjadi 2 bagian:
  - **Kiri**: Berkas digital pemohon dan dokumen A4 yang dihasilkan sistem.
  - **Kanan**: Panel instrumen verifikator (Checklist keabsahan dokumen, input catatan revisi spesifik, pemilihan keputusan gateway).
- **Keputusan Gateway**:
  - *Minta Perbaikan*: Menolak berkas sementara dan mewajibkan catatan revisi sebelum status beralih ke `revision_required`.
  - *Setujui & Teruskan*: Memvalidasi kelayakan berkas dan memindahkan status ke `approved` atau `forwarded_to_kui`.
  - *Unggah Surat Keputusan*: Mengunggah Surat Persetujuan (SP) Setneg atau LoA resmi bertandatangan pimpinan.

#### Statistik & Analisis Interaktif (`/admin/statistics`)
- Visualisasi data berbasis pustaka Recharts:
  - *Grafik Batang Mobilitas*: Volume permohonan Outbound, Inbound, dan PDLN per bulan.
  - *Grafik Donat Status*: Distribusi persentase pengajuan berdasarkan status operasional.
  - *KPI Durasi*: Rata-rata hari pemrosesan berkas dari submit hingga persetujuan akhir.
- Fitur ekspor seluruh data pengajuan ke format `.CSV` (`/api/export`).

#### Log Audit Keamanan (`/admin/audit-logs`)
- Catatan kejadian keamanan yang bersifat *append-only* (tidak dapat diedit atau dihapus).
- Merekam: Waktu kejadian (*timestamp*), ID Pengguna, Alamat IP, Aksi yang dilakukan (*CREATE*, *UPDATE*, *STATUS_CHANGE*, *DELETE*, *DOWNLOAD*), serta entitas terkait.

#### CMS Pengumuman & FAQ (`/admin/announcements`, `/admin/faqs`)
- Pengelolaan konten publik dinamis untuk artikel pengumuman resmi dan pertanyaan umum civitas kampus.

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 5.1 Keamanan & Kepatuhan Regulasi (Security & Compliance)
- **Otorisasi Ketat**: Seluruh endpoint API data privat (`/api/data?kind=applications`, `/api/command`) dilindungi middleware verifikasi sesi pengguna.
- **Pencegahan SQL Injection & XSS**: Menggunakan parameter binding Supabase/PostgreSQL dan sanitasi input React/DOMPurify.
- **Perlindungan PII**: NIK dan nomor paspor dienkripsi dan dibatasi aksesnya hanya untuk verifikator berwenang.

### 5.2 Performa & Keandalan (Performance & Reliability)
- **Target Latensi**: Halaman publik dan dashboard memuat di bawah 1.5 detik (First Contentful Paint < 800ms).
- **Anti-Stale Caching**: Header HTTP `Cache-Control: private, no-store, no-cache, max-age=0, must-revalidate` diterapkan pada seluruh API data dinamis untuk mencegah penayangan data usang di browser.
- **Offline / Local Persistence**: Didukung engine penyimpanan ganda (Memori runtime `globalThis` dan file disk lokal `.data/mock-applications.json`) agar sistem tetap berfungsi sempurna dalam skenario demo luring tanpa koneksi cloud Supabase.

### 5.3 Aksesibilitas & Kompatibilitas Antarmuka (Usability & a11y)
- Memenuhi kualifikasi WCAG 2.1 Level AA (kontras warna teks minimal 4.5:1 untuk teks normal).
- Seluruh kontrol form dan dialog dapat dioperasikan penuh menggunakan navigasi keyboard (`Tab`, `Enter`, `Escape`).
- Tata letak responsif (*Mobile-First to Desktop Canvas*): Pratinjau A4 dapat dibuka secara ergonomis melalui laci geser (*drawer*) pada layar ponsel.

---

## 6. Kriteria Penerimaan & Verifikasi Pengujian

| Komponen | Skenario Pengujian | Kriteria Lulus (Pass Criteria) |
| :--- | :--- | :--- |
| **Formulir Pengajuan** | Pengguna mengisi form dan menutup browser sebelum submit | Data terpulihkan otomatis saat form dibuka kembali (*Poka-Yoke Autosave*). |
| **Pratinjau A4** | Pengguna mengetik nama instansi mitra di form | Nama instansi langsung muncul di badan surat A4 tanpa keterlambatan visual. |
| **Pengajuan Outbound** | Pengguna menekan tombol "Kirim Pengajuan" | Pengajuan baru langsung muncul di baris teratas "Pengajuan Saya" dengan status *submitted*. |
| **Papan Transparansi** | Pengunjung umum membuka daftar izin PDLN | NIK dan nomor paspor tidak pernah terkirim ke browser (hanya nama dan status di modal). |
| **Dropdown Negara** | SSR vs Browser Hydration di berbagai browser | Tidak terjadi error *Hydration Mismatch* pada opsi negara mana pun. |
| **Kompilasi & Test** | Menjalankan test suite Vitest dan build Next.js | 28/28 pengujian unit lulus dan seluruh 47 rute berhasil di-*build* tanpa error. |
