# Design System & UI/UX Specification (DESAIN.md)
# Portal Program Internasional Politeknik Negeri Jakarta

> **Dokumen**: Panduan Sistem Desain & Antarmuka Pengguna (UI/UX Specification)  
> **Tema Desain**: Modern Minimalis (Triplio Aesthetic) x iOS 27 Frosted Glassmorphism  
> **Versi**: 2.0 (Desain Ulang Menyeluruh — Anti-Slop, Clean & High-Contrast)  
> **Proyek**: Final PBL Kelompok 6 — D4 Teknik Informatika PNJ  

---

## 1. Filosofi Desain: "Modern Minimalist Campus Serenity"

Desain antarmuka Portal Program Internasional PNJ dibangun di atas 4 (empat) pilar estetika utama:

1. **Triplio Modern Minimalist Architecture**:
   - Mengadopsi struktur visual bergengsi dari konsep *Triplio*: area hero yang megah dan lapang (*generous whitespace*), tipografi judul yang tebal dan berwibawa, bilah kapsul pencarian/navigasi cepat yang melayang (*floating action capsule*), serta kartu layanan vertikal (*tall destination cards*) bersudut lengkung halus.
2. **iOS 27 Frosted Glassmorphism**:
   - Menggunakan material tembus pandang bertekstur kaca (*frosted glass*) dengan parameter `backdrop-filter: blur(20px-24px) saturate(180%)`, latar translusen putih `rgba(255, 255, 255, 0.82 - 0.88)`, dan garis tepi tipis berspekular cahaya `border: 1px solid rgba(255, 255, 255, 0.75)`. Memberikan kesan kedalaman ruang (*depth*) yang mewah dan futuristik.
3. **Anti-Slop & Zero Clutter**:
   - Menghilangkan seluruh teks pengisi generik yang tidak berguna (seperti *"Isi sesuai dokumen..."* atau teks *"Berikutnya"* berulang pada stepper).
   - Menghilangkan bentuk-bentuk oval/lingkaran yang terdistorsi; seluruh komponen berbentuk kapsul atau kartu dengan jari-jari lengkung geometris yang presisi.
4. **Academic Prestige & Institutional Dignity**:
   - Menggunakan foto kampus asli PNJ (`foto-pnj.jpg` / `pnj.png`) sebagai identitas visual utama, dipadukan dengan palet warna resmi biru *PNJ Royal Navy*, memberikan rasa aman, resmi, dan kredibel bagi civitas maupun mitra internasional.

---

## 2. Palet Warna & Semantic Design Tokens

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PRIMARY BRAND COLORS (Identitas PNJ)                                                   │
│ • PNJ Royal Navy  : #0A2540 (bg-sky-950)   — Judul Hero, Header Utama, Top Navigation   │
│ • Deep Sapphire   : #0F172A (bg-slate-900) — Tombol Kapsul Aksi Utama, Teks Headline   │
│ • Vibrant Azure   : #0284C7 (bg-sky-600)   — Aksen Interaktif, Indikator Aktif, Links   │
│ • Ice Blue Soft   : #F0F9FF (bg-sky-50)    — Highlight Badge, Active Step Background    │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ FROSTED GLASS SURFACE TOKENS (Efek Kaca iOS 27)                                        │
│ • Glass Base Card : rgba(255, 255, 255, 0.86) + backdrop-filter: blur(24px) sat(180%) │
│ • Glass Border    : 1px solid rgba(255, 255, 255, 0.75) / rgba(226, 232, 240, 0.8)    │
│ • Glass Shadow    : 0 10px 32px -4px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(0,0,0,0.02)│
│ • Glass Nav Pill  : rgba(255, 255, 255, 0.70) + border: 1px solid rgba(255,255,255,0.6)│
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ NEUTRAL CANVAS & TYPOGRAPHY                                                            │
│ • Page Backdrop   : #F8FAFC (Slate 50) dengan latar kampus foto-pnj.jpg tertaut        │
│ • Pure Surface    : #FFFFFF (White)        — Lembar Dokumen A4 & Modal Popover         │
│ • Text Heading    : #0F172A (Slate 900)    — Judul Halaman & Label Wajib (Kontras Max) │
│ • Text Body       : #334155 (Slate 700)    — Paragraf Konten & Isian Dokumen Resmi     │
│ • Text Secondary  : #64748B (Slate 500)    — Metadata, Subtitle, & Panduan             │
│ • Border Subtle   : #E2E8F0 (Slate 200)    — Garis Pembatas Tabel & Kolom Input        │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ SEMANTIC FEEDBACK BADGES                                                               │
│ • Submitted / Info : bg-sky-50    text-sky-700    border-sky-200    (Pengajuan Masuk)   │
│ • In Review        : bg-amber-50  text-amber-700  border-amber-200  (Sedang Diverifikasi)│
│ • Revision Required: bg-rose-50   text-rose-700   border-rose-200   (Perlu Revisi)      │
│ • Approved         : bg-emerald-50 text-emerald-700 border-emerald-200 (Disetujui KUI) │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tipografi & Skala Hirarki

Sistem menggunakan font keluarga **Inter / System UI (-apple-system, BlinkMacSystemFont)** yang dioptimalkan untuk keterbacaan tinggi di berbagai resolusi layar:

| Level | Ukuran (Desktop) | Weight | Line Height | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 3.25rem — 3.75rem (52-60px) | 800 (Extrabold) | 1.1 | Judul Utama Landing Page (*"Uncover Global Horizons"*) |
| **Section Title** | 2.00rem (32px) | 750 (Bold) | 1.25 | Judul Bagian (*"Program Internasional PNJ"*) |
| **Card / Step Title** | 1.25rem — 1.35rem (20-22px)| 700 (Bold) | 1.35 | Judul Kartu Layanan, Judul Langkah Formulir |
| **Form Label** | 0.875rem (14px) | 650 (Semibold) | 1.4 | Label Kolom Input Formulir |
| **Body Regular** | 0.9375rem (15px) | 450 (Regular) | 1.55 | Teks Paragraf & Isi Dokumen A4 |
| **Badge / Caption** | 0.75rem (12px) | 600 (Semibold) | 1.4 | Tag Kategori, Nomor Langkah, Status Pengajuan |

---

## 4. Anatomi Komponen Kunci (Component Anatomy)

### 4.1 Bilah Kapsul Aksi Hero (Triplio Floating Capsule)
- **Struktur**: Kontainer melayang berbentuk kapsul (*rounded-full*) di tengah hero banner dengan latar putih kaca (`rgba(255, 255, 255, 0.92)`).
- **Tiga Segmen**:
  1. *Layanan*: Dropdown pilihan program (Outbound, Inbound, PDLN) berikon pesawat lepas landas (`PlaneTakeoff`).
  2. *Sasaran*: Indikator teks singkat sasaran civitas (Mahasiswa Aktif PNJ / Mahasiswa Asing / Delegasi Sivitas).
  3. *Output*: Indikator dokumen resmi yang akan diterbitkan (Surat Rekomendasi KUI / LoA / SP Setneg).
- **Tombol Aksi**: Kapsul biru gelap (*deep navy*) dengan teks *"Mulai Pengajuan"* dan tombol bulat panah serong melingkar (`↗`).

### 4.2 Kartu Layanan Triplio (Tall Destination Cards)
- **Rasio Aspek**: ~3:4 vertikal proporsional.
- **Visual**: Latar gambar fotografi beresolusi tinggi dengan efek *zoom* lembut saat kursor mouse melintas (*hover scale 1.04*).
- **Lapisan Gradien**: Gradien gelap transparan dari bawah ke atas memastikan teks judul putih selalu terbaca jelas (*accessible contrast*).
- **Badge Audiens Melayang**: Kapsul kaca transparan di pojok kiri atas kartu.

### 4.3 Formulir Multi-Langkah & Stepper Anti-Slop
- **Stepper Vertikal (Kiri)**:
  - Lingkaran nomor/ikon langkah dengan garis penghubung halus.
  - Langkah aktif: Lingkaran biru dengan cincin cahaya (*focus glow*), teks judul tebal, dan label kecil *"Sedang diisi"*.
  - Langkah selesai: Lingkaran hijau lembut berikon centang (`Check`), dan label *"Selesai"*.
  - Langkah belum diisi: Teks judul netral tanpa teks berulang *"Berikutnya"*, menjaga antarmuka tetap bersih.
- **Card Input Formulir (Tengah/Kanan)**:
  - Kartu kaca berlatar putih translusen dengan sudut melengkung 16px (*rounded-2xl*).
  - Kolom input dengan garis tepi halus (`#E2E8F0`) yang bertransformasi menjadi biru tegas saat fokus (*focus ring #0284C7*).
  - Teks bantuan hanya muncul jika ada panduan format spesifik (contoh: format nomor telepon internasional).

### 4.4 Pratinjau Dokumen A4 Resmi (Live Document Preview)
- **Karakteristik Kertas**: Rasio standar internasional A4 (1 : 1.414), latar putih murni, bayangan lembut fotorealistik (*drop-shadow*), kepala surat resmi Politeknik Negeri Jakarta, garis pemisah ganda, stempel digital KUI PNJ, dan blok tanda tangan pimpinan.
- **Toolbar iOS 27 Glass (1-Baris)**:
  - *Status*: Indikator lampu hijau berkedip *"Live A4"*.
  - *Pills Nomor Lembar*: Tombol kapsul nomor (`1`, `2`, `3`, `4`, `5`) untuk berpindah surat seketika.
  - *Dropdown Format*: Memilih jenis surat resmi yang ingin ditinjau.
  - *Tombol Blanko*: Mengunduh blanko asli PDF resmi KUI.
  - *Tombol Cetak PDF*: Mencetak langsung atau menyimpan hasil isian ke PDF berkualitas cetak tinggi (*browser print*).
  - *Zoom Controls*: Mengatur persentase ukuran dokumen (- 85% + ↺).

---

## 5. Tata Letak Halaman demi Halaman (Page-by-Page Breakdown)

### 5.1 Landing Page (`/`)
1. **Header Navigasi**: Logo resmi PNJ, navigasi menu (Layanan, Alur, Panduan, Transparansi PDLN), pemilih bahasa (ID/EN), dan tombol Masuk/Dashboard.
2. **Hero Section**: Judul inspiratif, sub-deskripsi ringkas, dan Triplio Action Capsule.
3. **Bagian Program Unggulan**: 3 kartu vertikal (Outbound Mobility, Inbound International, PDLN Setneg).
4. **Diagram Alur Pengajuan**: Stepper interaktif 4 langkah menuju surat resmi.
5. **Pusat Bantuan & Pengumuman**: Tata letak 2 kolom memadukan FAQ akordeon dengan kartu buletin pengumuman KUI.
6. **Footer**: Informasi kontak resmi KUI PNJ, alamat kampus Kukusan Depok, tautan regulasi, dan hak cipta.

### 5.2 Formulir Pengajuan Split-Screen (`/outbound/apply`, `/inbound/apply`, `/pdln/apply`)
- **Desktop (Layar Lebar >= 1024px)**:
  - Kolom Kiri (Lebar 45%): Stepper tahapan formulir, kartu progres persentase, dan kartu input data.
  - Kolom Kanan (Lebar 55%): Pratinjau dokumen A4 live yang terus diperbarui secara real-time saat pengguna mengetik.
- **Mobile / Tablet (< 1024px)**:
  - Form mengisi layar penuh untuk kenyamanan mengetik.
  - *Floating Action Button (FAB)* di pojok kanan bawah bertuliskan *"Lihat Lembar Dokumen (A4)"*. Mengetuk tombol ini akan membuka laci geser (*sheet drawer*) berisi pratinjau A4 lengkap dengan toolbar zoom dan cetak.

### 5.3 Papan Transparansi PDLN Publik (`/pdln/public-applications`)
- **Tabel Akuntabilitas Publik**: Menampilkan pengajuan izin luar negeri civitas PNJ yang telah disetujui atau sedang dalam proses di Kemensetneg.
- **Komponen Transparansi Privasi**: Badge delegasi interaktif. Mengetuk badge membuka modal kaca (*glass modal*) berisikan nama anggota tanpa membocorkan NIK atau paspor.

### 5.4 Dashboard Mahasiswa (`/dashboard` & `/dashboard/applications`)
- **Bilah Ringkasan Kinerja**: Kartu metrik jumlah draf, berkas terkirim, dan berkas disetujui.
- **Tabel "Pengajuan Saya"**: Filter multi-kategori (Layanan, Status, Pencarian, Negara), tabel responsif dengan badge warna semantik, dan tombol aksi detail/edit.

### 5.5 Antarmuka Verifikator Admin (`/admin/applications/[id]`)
- **Workspace Tinjau Dokumen**: Layar terbelah yang menampilkan berkas pemohon di sisi kiri dan formulir verifikasi verifikator di sisi kanan.
- **Instrumen Aksi Verifikator**:
  - Catatan revisi per bagian yang langsung dikirimkan ke dashboard pemohon.
  - Tombol persetujuan berjenjang: *Minta Revisi*, *Setujui & Teruskan*, atau *Selesaikan Program*.

---

## 6. Prinsip Responsivitas & Kenyamanan Antarmuka (UX Guidelines)

1. **Pencegahan Kehilangan Data (Zero Data Loss)**:
   - Draf otomatis tersimpan setiap 1.8 detik saat pengguna berhenti mengetik.
   - Peringatan konfirmasi modal sebelum pengguna menghapus anggota rombongan atau membatalkan pengajuan.
2. **Keterbacaan & Kontras Tinggi**:
   - Seluruh teks pada kartu kaca menggunakan warna slate gelap (`#0F172A` atau `#334155`) di atas latar putih translusen, memastikan standar kontras teks minimal 4.5:1 terpenuhi.
3. **Umpan Balik Instan (Instant Visual Feedback)**:
   - Notifikasi *toast* (via pustaka Sonner) di pojok kanan atas untuk setiap aksi penting (Draf tersimpan, Berkas berhasil dikirim, Dokumen diunduh).
