# Skrip Demo — Portal Program Internasional PNJ

**Untuk:** Presentasi PBL ke Admin KUI & Bu Anita
**URL:** http://localhost:3210
**Persiapan:** `npm run dev` (tunggu sampai muncul `Ready`)

---

## 0. Sebelum Mulai (2 menit sebelum masuk ruangan)

- [ ] Jalankan `npm run dev` di `C:\Kuliah\AI\PBL-Hermes`
- [ ] Buka `http://localhost:3210` di Chrome, **tab terpisah** untuk tiap peran:
  - Tab 1: belum login (landing)
  - Tab 2: login Mahasiswa
  - Tab 3: login Verifikator KUI
- [ ] Tutup semua notifikasi Windows & tab lain
- [ ] Pastikan baterai / charger aman
- [ ] **Jangan** hapus folder `.data/` setelah demo dimulai (data demo hilang)

**Akun demo** (tombol cepat tersedia di halaman login):

| Peran | Email | Sandi |
|---|---|---|
| Mahasiswa | nabil@student.pnj.ac.id | demo123 |
| Dosen | bagus@pnj.ac.id | demo123 |
| Mahasiswa asing | emma@lund.se | demo123 |
| Verifikator KUI | rina@kui.pnj.ac.id | admin123 |
| Super Admin | hendra@kui.pnj.ac.id | admin123 |

---

## 1. Pembuka — Landing Page (2 menit)

**Katakan:** "Portal ini satu pintu untuk tiga layanan internasional PNJ: Outbound, Inbound, dan PDLN Setneg."

**Lakukan:**
1. Scroll pelan dari atas ke bawah.
2. Berhenti di bagian **tiga pilar layanan** — tunjuk kartu Outbound / Inbound / PDLN.
3. Lanjut ke **pita angka** (36 Prodi, 7 Jurusan, 38 Ribu+ alumni, SLA 3 hari).

**Poin yang ditonjolkan:**
- Angkanya bukan hiasan — ditarik dari data portal.
- Marqueé mitra kampus berjalan (Tampere, Lund, Saxion, UTM, NTUST, dll).

---

## 2. Alur Mahasiswa — Ajukan Outbound (5 menit) ⭐ PALING PENTING

**Katakan:** "Sekarang saya tunjukkan apa yang dialami mahasiswa saat mengajukan."

**Lakukan:**
1. Klik **Masuk** → pilih tombol **"Mahasiswa · Nabil"** (login sekali klik untuk demo).
2. Tunjukkan **Dashboard**: draf tersimpan, sedang diverifikasi, perlu perbaikan, disetujui.
3. Klik **Pengajuan Baru** → pilih **Outbound**.
4. Isi wizard **5 langkah** pelan-pelan, tunjukkan:
   - **Langkah 1** — data penanggung jawab terisi otomatis dari profil.
   - **Langkah 2** — detail kegiatan (judul, institusi mitra, negara, periode).
   - **Langkah 3** — dokumen: klik **Unggah**, pilih file PDF apa pun.
   - **Langkah 4** — daftar delegasi.
   - **Langkah 5** — **tinjau & kirim**.

**JUAL UTAMA di sini:** sepanjang wizard, panel kanan menampilkan **pratinjau surat A4 hidup** — nomor surat, kepala surat, dan isi paragraf terbentuk mengikuti ketikan. Tunjukkan tombol **Cetak** dan **Lihat lembar A4**.

5. Centang pernyataan kebenaran data → klik **Kirim pengajuan**.
6. Sistem menampilkan nomor registrasi dan langsung membuka halaman detail berkas.

**Kalau ditanya "kalau berkas kurang?":**
- Klik Kirim tanpa centang → muncul peringatan merah *"Centang pernyataan kebenaran data sebelum mengirim."*
- Klik Kirim dengan dokumen kurang → *"Lengkapi 1 dokumen wajib sebelum mengirim."*
- Ini bukti validasi berlapis, bukan tombol mati tanpa penjelasan.

---

## 3. Alur Verifikator KUI — Keputusan Berkas (5 menit) ⭐

**Katakan:** "Sekarang sisi KUI. Sistem tidak pernah memutuskan sendiri — keputusan selalu oleh manusia."

**Lakukan:**
1. Pindah ke **tab Verifikator** (login: **"Verifikator KUI · Rina"**).
2. Tunjukkan **Command Center**: 3 berkas menunggu, 1 menunggu perbaikan, chart volume 6 bulan.
3. Klik **Semua Pengajuan** → buka salah satu berkas berstatus **Verifikasi Berkas**.
4. Tunjukkan panel detail: data pemohon, dokumen yang diunggah, riwayat status.
5. Klik **Setujui Berkas** → status berubah menjadi **Disetujui**.
6. Kembali ke **Log Audit** → tunjukkan baris baru tercatat (siapa, kapan, aksi apa).

**JUAL UTAMA:** tiga tombol keputusan — **Setujui / Minta Perbaikan / Tolak** — semuanya menuntut alasan tertulis dan tercatat permanen di audit log.

**Kalau ditanya "bisa dibatalkan?":**
- Jelaskan: audit log bersifat *append-only*; koreksi dilakukan dengan keputusan baru, bukan menghapus riwayat.

---

## 4. PDLN — Alur Setneg (3 menit)

**Katakan:** "PDLN punya alur paling ketat karena menyangkut izin ke Kementerian Sekretariat Negara."

**Lakukan:**
1. Pindah ke tab mahasiswa/dosen → buka menu **PDLN**.
2. Tunjukkan **6 langkah** wizard + **3 format surat** di panel A4 (Surat Pengantar Setneg, Daftar Delegasi, SPTJM).
3. Buka **PDLN → Papan Transparansi** (public-applications).
4. Tunjukkan bahwa **NIK dan nomor paspor tidak pernah tampil publik** — hanya nama, peran, dan status.

**JUAL UTAMA:** privasi data delegasi. Ini sering jadi pertanyaan pertama dari pihak kampus.

---

## 5. Statistik & Ekspor (2 menit)

1. Buka **Statistik** → jelaskan: total pengajuan, rata-rata penyelesaian, negara tujuan unik, distribusi status.
2. Klik **Ekspor CSV** → file langsung terunduh, bisa dibuka di Excel.

**Katakan:** "Angka di halaman ini dihitung langsung dari basis data portal, bukan angka statis."

---

## 6. Penutup (2 menit)

**Katakan:**
- "Tiga layanan, satu akun, satu riwayat berkas."
- "Keputusan tetap di tangan verifikator manusia; sistem hanya memvalidasi skema dan mencatat jejak audit."
- "Pratinjau surat A4 terbentuk saat mengetik — tidak perlu mengetik ulang di Word."
- "Data delegasi dipisahkan dari papan transparansi publik."

**Siapkan jawaban untuk 3 pertanyaan yang paling mungkin muncul:**

| Pertanyaan | Jawaban |
|---|---|
| "Datanya tersimpan di mana?" | Untuk prototipe ini: berkas JSON di server (`.data/store.json`). Untuk produksi: tinggal ganti lapisan penyimpanan ke PostgreSQL — struktur data sudah relasional (8 entitas sesuai ERD). |
| "Bisa login pakai akun PNJ asli?" | Arsitektur autentikasi sudah dipisah di `src/lib/auth.ts`; tinggal disambungkan ke SSO kampus / Google OAuth. Saat ini memakai akun demo. |
| "Kalau berkasnya ratusan?" | Tabel sudah punya filter layanan, filter status, dan pengurutan. Pagination dan pencarian adalah pekerjaan lanjutan yang sudah disiapkan di lapisan data. |

---

## Catatan Teknis Kalau Ditanya Detail

- **Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4.
- **Uji:** 34 unit test lulus (`npm test`), typecheck bersih (`npm run typecheck`), build produksi bersih (`npm run build`).
- **Rute:** 47 halaman — publik, dashboard pemohon, panel verifikator, dan 9 API.
- **Audit log:** setiap CREATE / UPDATE / STATUS_CHANGE / DOWNLOAD / LOGIN tercatat.

---

## Jangan Dilakukan Saat Demo

- ❌ Jangan hapus folder `.data/` — data demo hilang, harus restart.
- ❌ Jangan buka DevTools di depan penguji.
- ❌ Jangan klaim "sudah terhubung ke database kampus" — akui masih prototipe dengan data demo.
- ❌ Jangan demo upload file > 10 MB (akan ditolak validasi — itu fitur, tapi bisa jadi distraksi).
