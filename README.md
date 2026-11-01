# Portal Program Internasional PNJ

Portal satu pintu Kantor Urusan Internasional (KUI) Politeknik Negeri Jakarta — **Outbound Mobility**, **Inbound International**, dan **Perjalanan Dinas Luar Negeri (PDLN)**.

Dibangun sesuai `PROMPT.md`, `PRD.md`, dan `DESIGN.md`, dengan template visual mengikuti mockup referensi: field emerald gelap, seksi kertas putih, citra *squircle*, kontrol pill, dan elevasi lembut.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript strict
- Tailwind CSS v4 (`@theme` tokens, `@utility` kustom)
- Radix-free primitives buatan sendiri + `lucide-react` + `sonner`
- Recharts untuk statistik admin
- Persistensi ganda: memori `globalThis` + file disk `.data/store.json` (demo offline, tanpa Supabase)
- Vitest untuk unit test

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3210
npm run build && npm start
npm run typecheck  # tsc --noEmit
npm test           # 31 unit test
```

## Akun demo (tombol masuk cepat di /login)

| Peran | Email | Sandi |
| --- | --- | --- |
| Mahasiswa | nabil@student.pnj.ac.id | demo123 |
| Dosen | bagus@pnj.ac.id | demo123 |
| Mahasiswa asing | emma@lund.se | demo123 |
| Verifikator KUI | rina@kui.pnj.ac.id | admin123 |
| Super Admin | hendra@kui.pnj.ac.id | admin123 |

## Peta rute (47)

**Publik** — `/`, `/pengajuan`, `/outbound`, `/inbound`, `/pdln`, `/pdln/public-applications`, `/faq`, `/templates`, `/privacy`, `/terms`, `/login`, `/register`, `/onboarding`

**Formulir** — `/outbound/apply`, `/inbound/apply`, `/pdln/apply` (split-screen wizard + Live A4)

**Mahasiswa** — `/dashboard`, `/dashboard/applications`, `/dashboard/applications/[id]`, `/dashboard/applications/[id]/edit`, `/dashboard/profile`, `/dashboard/templates`, `/dashboard/questions`

**Verifikator** — `/admin`, `/admin/applications`, `/admin/applications/[id]`, `/admin/outbound`, `/admin/inbound`, `/admin/pdln`, `/admin/statistics`, `/admin/audit-logs`, `/admin/admins`, `/admin/announcements`, `/admin/faqs`, `/admin/questions`, `/admin/settings`

**API** — `/api/auth/{login,register,logout,demo,session}`, `/api/data`, `/api/command`, `/api/export`, `/api/files`

## Prinsip yang ditegakkan

1. **Swimlane separation** — sistem hanya memvalidasi skema & mencatat transisi status; keputusan setuju/tolak/revisi milik verifikator manusia (`src/lib/workflow.ts`).
2. **Privasi delegasi** — endpoint publik (`/api/data?kind=public-pdln`) memproyeksikan hanya nama, peran, dan status verifikasi; NIK/paspor/kontak tidak pernah diserialisasi (`src/lib/stats.ts` → `publicPdlNRow`).
3. **Biaya riil per peserta (3NF)** — laporan akhir menyimpan satu baris pengeluaran per peserta, total dihitung sistem, tanpa lump sum.
4. **Split-screen Live A4** — 9 format surat resmi terbentuk saat mengetik, toolbar glass dengan nomor lembar, zoom, unduh blanko PDF, dan cetak (`src/lib/letters.ts`, `src/components/live-document-preview.tsx`).
5. **Poka-yoke autosave** — debounce 1,8 detik ke `localStorage` + server, indikator status penyimpanan.
6. **Hydration-proof** — daftar negara memakai kamus kanonikal deterministik (`countryName`), `suppressHydrationWarning` pada `<option>`/`<select>`.
7. **Audit append-only** — setiap CREATE/UPDATE/STATUS_CHANGE/DOWNLOAD/LOGIN tercatat di `/admin/audit-logs`.
8. **Animasi berlapis** — reveal on scroll, counter, parallax, tilt, marquee, aurora pan, page transition, float, sheen; semuanya menghormati `prefers-reduced-motion`.

## Struktur

```
src/
├── app/            # 47 rute + API handlers
├── components/     # ui, motion, shell, form wizard, A4 engine, panel admin
└── lib/            # types, store, auth, workflow, forms, letters, stats, seed, pdf
tests/              # vitest: workflow, formatter, A4 engine, privasi, statistik, seed
```

`.data/store.json` dibuat otomatis saat pertama dijalankan; hapus folder `.data` untuk mengembalikan data demo awal.
