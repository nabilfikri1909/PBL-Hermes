import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  CalendarClock,
  Compass,
  FileCheck2,
  Globe2,
  GraduationCap,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { Counter, Marquee, Parallax, Reveal, ScrollProgress, Tilt } from "@/components/motion";
import { Badge, BtnLink, SectionHead, StatusBadge } from "@/components/ui";
import { getStore, listApplications } from "@/lib/store";
import { formatDate, formatRange, formatDateShort } from "@/lib/utils";
import { PHOTOS, photo } from "@/lib/media";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    icon: Users,
    title: "Verifikator manusia, bukan algoritma",
    body: "Setiap keputusan menyetujui, menolak, atau meminta perbaikan diambil oleh verifikator KUI. Sistem hanya memvalidasi skema dan mencatat jejak audit."
  },
  {
    icon: Globe2,
    title: "Tiga layanan dalam satu akun",
    body: "Outbound, Inbound, dan PDLN berbagi identitas, riwayat berkas, serta notifikasi yang sama — tanpa formulir berulang."
  },
  {
    icon: FileCheck2,
    title: "Pratinjau surat A4 langsung",
    body: "Nomor register, kepala surat, dan isi paragraf terbentuk saat Anda mengetik. Unduh blangko resmi atau cetak PDF seketika."
  },
  {
    icon: ShieldCheck,
    title: "Privasi & data delegasi terjaga",
    body: "NIK dan nomor paspor anggota rombongan tidak pernah dikirim ke peramban publik. Papan transparansi hanya menampilkan nama dan status."
  }
];

const PILLARS = [
  {
    href: "/outbound",
    image: PHOTOS.takeoff,
    tag: "Untuk mahasiswa PNJ",
    title: "Outbound Mobility",
    body: "Exchange, magang internasional, IISMA, joint degree, dan short course — lengkap dengan surat rekomendasi paspor serta visa.",
    meta: "Surat Rekomendasi KUI"
  },
  {
    href: "/inbound",
    image: PHOTOS.collaboration,
    tag: "Untuk mahasiswa asing",
    title: "Inbound International",
    body: "Pendaftaran mahasiswa dan peneliti asing, kliring visa, hingga penerbitan Letter of Acceptance ber-barcode dan e-Certificate.",
    meta: "Letter of Acceptance PNJ"
  },
  {
    href: "/pdln",
    image: PHOTOS.meeting,
    tag: "Untuk dosen & tendik",
    title: "Perjalanan Dinas Luar Negeri",
    body: "Izin dinas kenegaraan sesuai Permensesneg No. 5/2017, penerusan berkas ke Kemensetneg, dan pelaporan biaya riil per peserta.",
    meta: "SP Setneg & SPTJM"
  }
];

const FLOW = [
  { title: "Pendaftaran akun", body: "Masuk dengan akun PNJ atau daftar sebagai peserta asing, lalu lengkapi profil kampus." },
  { title: "Isi & kirim berkas", body: "Wizard bertahap dengan pratinjau surat A4 dan penyimpanan draf otomatis setiap 1,8 detik." },
  { title: "Verifikasi KUI", body: "Verifikator memeriksa keabsahan dokumen, meminta perbaikan, atau menyetujui berkas." },
  { title: "Surat resmi terbit", body: "Nomor register, stempel digital, dan QR verifikasi tercetak pada surat rekomendasi Anda." }
];

const PARTNERS = [
  "Tampere University",
  "Lund University",
  "Saxion University",
  "Universiti Teknologi Malaysia",
  "NTUST Taiwan",
  "Penang Skills Development Centre",
  "Universiti Malaya",
  "Hochschule Bremen"
];

export default async function LandingPage() {
  const store = getStore();
  const apps = listApplications();
  const faqs = store.faqs.slice(0, 5);
  const announcements = [...store.announcements].sort((a, b) => (a.pinned === b.pinned ? (a.publishedAt < b.publishedAt ? 1 : -1) : a.pinned ? -1 : 1)).slice(0, 3);
  const publicPdl = apps.filter((a) => a.service === "pdln" && a.status !== "draft").slice(0, 3);
  const approvedCount = apps.filter((a) => a.status === "approved" || a.status === "completed").length;
  const countries = new Set(apps.map((a) => a.country)).size;

  return (
    <PublicShell>
      <ScrollProgress />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 size-[26rem] rounded-full bg-mint-400/20 blur-[110px] drift" aria-hidden />
        <div className="pointer-events-none absolute -right-20 bottom-0 size-[22rem] rounded-full bg-forest-400/20 blur-[100px] drift" aria-hidden />

        <div className="mx-auto grid max-w-[78rem] gap-14 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-14">
          <div>
            <div className="animate-rise inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[0.75rem] font-medium text-mint-100 ring-1 ring-inset ring-white/20">
              <Sparkles className="size-3.5 text-mint-300" />
              KUI Politeknik Negeri Jakarta
            </div>

            <h1 className="display-hero mt-6 text-white animate-rise" style={{ animationDelay: "90ms" }}>
              Gerbang mobilitas internasional PNJ
            </h1>

            <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-mint-100/90 animate-rise" style={{ animationDelay: "180ms" }}>
              Satu portal untuk program luar negeri mahasiswa, penerimaan peserta asing, dan perjalanan dinas
              kenegaraan — dengan surat rekomendasi resmi yang terbit begitu Anda mengisi formulir.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 animate-rise" style={{ animationDelay: "260ms" }}>
              <BtnLink href="/pengajuan" variant="onDark" size="lg" className="sheen">
                Mulai Pengajuan
                <ArrowUpRight className="size-4" />
              </BtnLink>
              <BtnLink href="#alur" variant="outlineDark" size="lg">
                Lihat alur layanan
              </BtnLink>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 animate-rise" style={{ animationDelay: "340ms" }}>
              <div>
                <dd className="text-2xl font-bold text-white">
                  <Counter to={36} suffix=" Prodi" />
                </dd>
                <dt className="mt-1.5 text-[0.8125rem] leading-snug text-mint-200/90">Pendidikan vokasi PNJ</dt>
              </div>
              <div>
                <dd className="text-2xl font-bold text-white">
                  <Counter to={7} suffix=" Jurusan" />
                </dd>
                <dt className="mt-1.5 text-[0.8125rem] leading-snug text-mint-200/90">Rekayasa & tata niaga</dt>
              </div>
              <div>
                <dd className="text-2xl font-bold text-white">
                  <Counter to={store.settings.verificationSlaDays} suffix=" hari" />
                </dd>
                <dt className="mt-1.5 text-[0.8125rem] leading-snug text-mint-200/90">SLA verifikasi KUI</dt>
              </div>
            </dl>
          </div>

          {/* Squircle collage — the reference template's signature */}
          <Parallax strength={26} className="relative">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              <div className="space-y-3.5 sm:space-y-4">
                <Reveal delay={40} y={26}>
                  <div className="squircle floaty h-[13rem] overflow-hidden bg-forest-700/40 sm:h-[15.5rem]">
                    <img src="/pnj-landmark.jpg" alt="Landmark utama Politeknik Negeri Jakarta" className="size-full object-cover transition-transform duration-700 hover:scale-105" loading="eager" />
                  </div>
                </Reveal>
                <Reveal delay={140} y={26}>
                  <div className="squircle floaty-slow h-[10.5rem] overflow-hidden bg-forest-700/40 sm:h-[12rem]">
                    <img src={photo(PHOTOS.groupStudy, 640)} alt="Kelompok mahasiswa belajar bersama" className="size-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                  </div>
                </Reveal>
                <Reveal delay={220} y={26}>
                  <div className="squircle overflow-hidden ring-1 ring-inset ring-white/20">
                    <div className="flex h-[5.5rem] flex-col justify-center gap-1 bg-white/10 px-5 backdrop-blur-sm">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-mint-300">Berkas terlacak</p>
                      <p className="text-sm font-semibold text-white">Setiap perubahan status tercatat</p>
                    </div>
                  </div>
                </Reveal>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <Reveal delay={90} y={26}>
                  <div className="squircle floaty-slow h-[9.5rem] overflow-hidden bg-forest-700/40 sm:h-[10.5rem]">
                    <img src={photo(PHOTOS.classroom, 640)} alt="Sesi kelas internasional di PNJ" className="size-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                  </div>
                </Reveal>
                <Reveal delay={170} y={26}>
                  <div className="squircle floaty h-[14rem] overflow-hidden bg-forest-700/40 sm:h-[17rem]">
                    <img src="/pnj-gedung.jpg" alt="Gedung Direktorat dan fasilitas kampus Politeknik Negeri Jakarta" className="size-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                  </div>
                </Reveal>
                <Reveal delay={250} y={26}>
                  <div className="squircle overflow-hidden ring-1 ring-inset ring-white/20">
                    <div className="flex h-[5.5rem] flex-col justify-center gap-1.5 bg-white/10 px-5 backdrop-blur-sm">
                      <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-mint-300">
                        <span className="live-dot size-1.5 rounded-full bg-mint-400" />
                        Aktif sekarang
                      </p>
                      <p className="text-[0.9375rem] font-semibold leading-snug text-white">
                        {apps.filter((a) => a.status === "under_review" || a.status === "submitted").length} berkas sedang diverifikasi
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </Parallax>
        </div>

        {/* Partner marquee on the emerald field */}
        <div className="border-t border-white/10 py-5">
          <Marquee
            items={PARTNERS.map((name) => (
              <span key={name} className="flex items-center gap-2.5 text-[0.8125rem] font-medium text-mint-100/90">
                <GraduationCap className="size-4 text-mint-400" />
                {name}
              </span>
            ))}
          />
        </div>
      </section>

      {/* ── Why choose ───────────────────────────────────────── */}
      <section className="bg-canvas px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[78rem]">
          <Reveal>
            <SectionHead
              title="Mengapa mengajukan lewat portal KUI?"
              description="Kantor Urusan Internasional membangun portal ini agar tidak ada lagi berkas hilang, surat yang salah format, atau data delegasi yang bocor."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={i * 90}>
                  <Tilt className="h-full">
                    <article className="group h-full rounded-card-lg bg-white p-6 shadow-[0_1px_2px_rgb(13_26_21_/_0.04),0_14px_34px_-26px_rgb(13_26_21_/_0.35)] transition-shadow duration-500 hover:shadow-[0_24px_50px_-30px_rgb(13_26_21_/_0.4)]">
                      <span className="grid size-11 place-items-center rounded-full bg-canvas-soft text-forest-800 transition-colors duration-300 group-hover:bg-forest-900 group-hover:text-white">
                        <Icon className="size-5" strokeWidth={1.6} />
                      </span>
                      <h3 className="display-card mt-5 text-ink">{feature.title}</h3>
                      <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-mute">{feature.body}</p>
                    </article>
                  </Tilt>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Three pillars ────────────────────────────────────── */}
      <section className="bg-canvas-soft px-5 py-24 sm:px-8 sm:py-28" id="layanan">
        <div className="mx-auto max-w-[78rem]">
          <Reveal>
            <SectionHead
              title="Tiga pilar layanan internasional"
              description="Pilih jalur yang sesuai dengan status Anda. Setiap pilar memiliki skema berkas, surat resmi, dan verifikator yang berbeda."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.href} delay={i * 110}>
                <Tilt max={5}>
                  <Link href={pillar.href} className="group block overflow-hidden rounded-card-lg bg-white shadow-[0_1px_2px_rgb(13_26_21_/_0.04),0_18px_40px_-30px_rgb(13_26_21_/_0.45)] transition-shadow duration-500 hover:shadow-[0_28px_60px_-32px_rgb(13_26_21_/_0.45)]">
                    <div className="relative h-52 overflow-hidden">
                      <img src={photo(pillar.image, 900)} alt={pillar.title} className="size-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-transparent to-transparent" />
                      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[1100ms] group-hover:translate-x-full" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[0.6875rem] font-semibold text-forest-900 backdrop-blur-sm">
                        {pillar.tag}
                      </span>
                    </div>
                    <div className="p-6">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-forest-600">{pillar.meta}</p>
                      <h3 className="display-card mt-2 text-ink">{pillar.title}</h3>
                      <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-mute">{pillar.body}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-forest-800">
                        Lihat persyaratan
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flow ─────────────────────────────────────────────── */}
      <section className="bg-canvas px-5 py-24 sm:px-8 sm:py-28" id="alur">
        <div className="mx-auto max-w-[78rem]">
          <Reveal>
            <SectionHead title="Empat langkah menuju surat resmi" description="Alur yang sama berlaku untuk ketiga layanan. Anda dapat menghentikan pengisian kapan saja — draf tersimpan otomatis." />
          </Reveal>

          <div className="mt-14 grid gap-4 lg:grid-cols-4">
            {FLOW.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="relative h-full rounded-card-lg bg-canvas-soft p-6 transition-colors duration-300 hover:bg-white hover:shadow-[0_18px_40px_-30px_rgb(13_26_21_/_0.4)]">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-forest-900 text-[0.8125rem] font-bold text-white">
                      {i + 1}
                    </span>
                    {i < FLOW.length - 1 ? <span className="hidden h-px flex-1 bg-gradient-to-r from-forest-200 to-transparent lg:block" /> : null}
                  </div>
                  <h3 className="mt-4 text-[0.9375rem] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-mute">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Numbers band ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forest-950 px-5 py-20 sm:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-70 drift" aria-hidden>
          <div className="absolute left-1/4 top-0 size-[24rem] rounded-full bg-mint-500/15 blur-[120px]" />
          <div className="absolute right-10 bottom-0 size-[20rem] rounded-full bg-forest-400/20 blur-[110px]" />
        </div>
        <div className="relative mx-auto grid max-w-[78rem] gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              value: 36,
              suffix: " Prodi",
              label: "7 Jurusan & 36 Program Studi",
              sub: "Pendidikan tinggi vokasi terakreditasi nasional & internasional",
              icon: BookOpenCheck
            },
            {
              display: "UNGGUL",
              label: "Akreditasi Institusi PNJ",
              sub: "Peringkat akreditasi tertinggi BAN-PT untuk mutu pendidikan",
              icon: Award
            },
            {
              value: 38,
              suffix: " Ribu+",
              label: "Alumni Berkiprah Global",
              sub: "Terserap di industri multinasional, riset internasional, dan BUMN",
              icon: GraduationCap
            },
            {
              value: 3,
              suffix: " Hari",
              label: "SLA Verifikasi Dokumen KUI",
              sub: "Penerbitan surat rekomendasi resmi dan rekomendasi izin Setneg",
              icon: ShieldCheck
            }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.label} delay={i * 90}>
                <div className="text-white">
                  <Icon className="size-5 text-mint-300" strokeWidth={1.7} />
                  <div className="mt-4 flex items-baseline gap-1 text-[2.1rem] font-bold leading-none tracking-tight">
                    {stat.display ? (
                      <span>{stat.display}</span>
                    ) : (
                      <Counter to={stat.value!} suffix={stat.suffix} />
                    )}
                  </div>
                  <p className="mt-2 text-[0.875rem] font-semibold text-mint-100">{stat.label}</p>
                  <p className="mt-1 text-[0.75rem] leading-relaxed text-mint-200/70">{stat.sub}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Announcements + FAQ ──────────────────────────────── */}
      <section className="bg-canvas px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[78rem] gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <SectionHead title="Pertanyaan yang paling sering masuk" description="Belum terjawab? Kirim tiket dari dashboard — verifikator KUI menjawab pada hari kerja." align="left" />
            </Reveal>
            <div className="mt-8 divide-y divide-hairline">
              {faqs.map((faq, i) => (
                <Reveal key={faq.id} delay={i * 70}>
                  <details className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[0.9375rem] font-semibold text-ink marker:hidden">
                      {faq.question}
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-canvas-soft text-forest-800 transition-transform duration-300 group-open:rotate-45">
                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-ink-mute">{faq.answer}</p>
                  </details>
                </Reveal>
              ))}
            </div>
            <Link href="/faq" className="mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-forest-800 underline-grow">
              Buka pusat bantuan lengkap
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div>
            <Reveal delay={80}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="display-section text-ink">Pengumuman KUI</h2>
                <Link href="/templates" className="hidden text-[0.8125rem] font-semibold text-forest-800 underline-grow sm:inline-flex">
                  Semua blanko
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 space-y-4">
              {announcements.map((item, i) => (
                <Reveal key={item.id} delay={i * 90}>
                  <article className="group rounded-card-lg bg-canvas-soft p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_44px_-32px_rgb(13_26_21_/_0.45)]">
                    <div className="flex items-center gap-2 text-[0.6875rem] text-ink-mute">
                      <Badge tone="forest">{item.tag}</Badge>
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="size-3" />
                        {formatDate(item.publishedAt)}
                      </span>
                      {item.pinned ? <span className="ml-auto text-forest-700">Disematkan</span> : null}
                    </div>
                    <h3 className="mt-3 text-[0.9375rem] font-semibold leading-snug text-ink">{item.title}</h3>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-mute">{item.excerpt}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={220}>
              <div className="mt-5 rounded-card-lg bg-forest-900 p-6 text-white">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-mint-300">Transparansi PDLN</p>
                <p className="mt-2 text-[0.9375rem] font-semibold leading-snug">Papan publik izin dinas luar negeri</p>
                <ul className="mt-4 space-y-3">
                  {publicPdl.map((row) => (
                    <li key={row.id} className="flex items-center justify-between gap-3 text-[0.8125rem]">
                      <span className="min-w-0 truncate text-mint-100/85">{row.title}</span>
                      <span className="shrink-0 text-mint-300">{row.participants.length} peserta</span>
                    </li>
                  ))}
                  {publicPdl.length === 0 ? <li className="text-[0.8125rem] text-mint-200/70">Belum ada izin PDLN yang dipublikasikan.</li> : null}
                </ul>
                <Link href="/pdln/public-applications" className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-white">
                  Buka papan transparansi
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="bg-canvas px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-[78rem] overflow-hidden rounded-panel bg-canvas-soft">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="display-section text-ink">Ajukan hari ini, surat rekomendasi siap dipratinjau hari ini juga.</h2>
                <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-ink-mute">
                  Masuk dengan akun demo bila ingin mencoba seluruh alur tanpa data pribadi. Verifikator KUI memproses
                  berkas pada hari kerja sesuai SLA {store.settings.verificationSlaDays} hari.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <BtnLink href="/pengajuan" size="lg">
                    Mulai pengajuan
                    <ArrowUpRight className="size-4" />
                  </BtnLink>
                  <BtnLink href="/login" variant="outline" size="lg">
                    Masuk akun demo
                  </BtnLink>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="squircle overflow-hidden shadow-sm">
                  <img src="/pnj-landmark.jpg" alt="Landmark Politeknik Negeri Jakarta" className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105 lg:h-64" loading="lazy" />
                </div>
                <div className="squircle overflow-hidden shadow-sm">
                  <img src="/pnj-gedung.jpg" alt="Gedung kampus Politeknik Negeri Jakarta" className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105 lg:h-64" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PublicShell>
  );
}