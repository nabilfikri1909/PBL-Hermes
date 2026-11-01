import type { Metadata } from "next";
import { MessageSquareQuote, LifeBuoy } from "lucide-react";
import { PublicShell, PageBand } from "@/components/public-shell";
import { Reveal } from "@/components/motion";
import { Badge, BtnLink } from "@/components/ui";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Pusat Bantuan" };
export const dynamic = "force-dynamic";

export default function FaqPage() {
  const faqs = getStore().faqs;
  const topics = [...new Set(faqs.map((f) => f.topic))];

  return (
    <PublicShell>
      <PageBand
        eyebrow="Pusat bantuan"
        title="Semua yang perlu Anda tahu sebelum mengajukan"
        description="Kumpulan pertanyaan yang paling sering masuk ke Kantor Urusan Internasional, dikelola langsung oleh verifikator KUI."
        crumb={[{ href: "/faq", label: "Panduan" }]}
        actions={
          <BtnLink href="/dashboard/questions" variant="onDark" size="lg">
            Kirim tiket bantuan
          </BtnLink>
        }
      />

      <div className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[78rem] gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <aside>
            <div className="sticky top-24 space-y-6">
              <div className="rounded-panel bg-canvas-soft p-6">
                <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-forest-800">
                  <LifeBuoy className="size-4" />
                  Butuh jawaban personal?
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-mute">
                  Tiket Anda masuk ke antrean verifikator dan dijawab pada hari kerja. Sertakan nomor registrasi
                  agar penelusuran lebih cepat.
                </p>
                <BtnLink href="/dashboard/questions" size="sm" className="mt-4">
                  Buka helpdesk
                </BtnLink>
              </div>
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-mute">Topik</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <li key={topic}>
                      <Badge tone="forest">{topic}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div>
            {topics.map((topic, ti) => (
              <section key={topic} className={ti === 0 ? "" : "mt-12"}>
                <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-forest-700">{topic}</h2>
                <div className="mt-4 divide-y divide-hairline">
                  {faqs
                    .filter((faq) => faq.topic === topic)
                    .map((faq, i) => (
                      <Reveal key={faq.id} delay={i * 60}>
                        <details className="group py-5">
                          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[0.9375rem] font-semibold text-ink marker:hidden">
                            <span className="flex gap-2.5">
                              <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-forest-600" />
                              {faq.question}
                            </span>
                            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-canvas-soft text-forest-800 transition-transform duration-300 group-open:rotate-45">
                              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </span>
                          </summary>
                          <p className="mt-3 max-w-2xl pl-6.5 text-[0.875rem] leading-relaxed text-ink-mute">{faq.answer}</p>
                        </details>
                      </Reveal>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}