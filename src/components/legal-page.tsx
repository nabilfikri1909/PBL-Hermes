import { PublicShell, PageBand } from "./public-shell";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export function LegalPage({
  eyebrow,
  title,
  description,
  updatedAt,
  sections
}: {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <PublicShell>
      <PageBand eyebrow={eyebrow} title={title} description={description} crumb={[{ href: "/faq", label: "Panduan" }]} />
      <div className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-mute">Terakhir diperbarui {updatedAt}</p>
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-[1.0625rem] font-bold tracking-tight text-ink">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="text-[0.9375rem] leading-relaxed text-ink-soft">
                      {paragraph}
                    </p>
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