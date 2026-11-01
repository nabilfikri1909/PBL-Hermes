import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSessionUser, isStaff } from "@/lib/auth";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/**
 * Public shell: the emerald field is always behind the navigation,
 * exactly as in the reference template — hero on the landing page,
 * a compact head band on every other public page.
 */
export async function PublicShell({
  children,
  bare = false
}: {
  children: ReactNode;
  bare?: boolean;
}) {
  const user = await getSessionUser();
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <div className="hero-aurora aurora-pan relative">
        <SiteHeader
          signedIn={Boolean(user)}
          staff={isStaff(user?.role)}
          name={user?.fullName}
          role={user?.role}
          membership={user?.nim ?? undefined}
        />
        {children}
      </div>
      {bare ? null : <SiteFooter />}
    </div>
  );
}

export function PageBand({
  title,
  description,
  eyebrow,
  crumb,
  actions,
  children
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  crumb?: Array<{ href: string; label: string }>;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[78rem] px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
      {crumb?.length ? (
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[0.75rem] text-mint-200/80">
          <Link href="/" className="transition-colors hover:text-white">
            Beranda
          </Link>
          {crumb.map((item) => (
            <span key={item.href} className="flex items-center gap-1.5">
              <ChevronRight className="size-3" />
              <Link href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </Link>
            </span>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-mint-300">{eyebrow}</p> : null}
          <h1 className="display-hero text-white">{title}</h1>
          {description ? <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-mint-100/80">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>

      {children}
    </div>
  );
}