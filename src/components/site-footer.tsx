import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { PnjMark } from "./pnj-mark";

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Layanan",
    links: [
      { href: "/outbound", label: "Outbound Mobility" },
      { href: "/inbound", label: "Inbound International" },
      { href: "/pdln", label: "PDLN Setneg" },
      { href: "/pdln/public-applications", label: "Transparansi PDLN" }
    ]
  },
  {
    title: "Panduan",
    links: [
      { href: "/faq", label: "Pusat Bantuan" },
      { href: "/templates", label: "Blanko Dokumen" },
      { href: "/privacy", label: "Kebijakan Privasi" },
      { href: "/terms", label: "Syarat & Ketentuan" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-forest-950 text-mint-100">
      <div className="mx-auto max-w-[78rem] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <PnjMark href={null} size="lg" withText />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mint-200/80">
              Satu pintu layanan mobilitas internasional sivitas Politeknik Negeri Jakarta. Dikelola Kantor Urusan Internasional.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-mint-200/70">
              <span>Permensesneg No. 5/2017</span>
              <span>ISO/IEC/IEEE 29148:2018</span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-mint-300/70">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-mint-100/85 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-mint-300/70">Kontak KUI</p>
            <ul className="mt-4 space-y-3 text-sm text-mint-100/85">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-mint-300" />
                <span>Gedung Direktorat, Kampus PNJ Kukusan, Beji, Depok 16425</span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-mint-300" />
                <span>kui@pnj.ac.id</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-mint-300" />
                <span>+62 21 7863 199</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.75rem] text-mint-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Politeknik Negeri Jakarta — Kantor Urusan Internasional</p>
          <p>Dikembangkan Kelompok 6 ADSI, D4 Teknik Informatika PNJ</p>
        </div>
      </div>
    </footer>
  );
}