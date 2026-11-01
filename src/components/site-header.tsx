"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { BtnLink } from "./ui";
import { PnjMark } from "./pnj-mark";
import { LogoutButton, UserMenu } from "./user-menu";

const LINKS = [
  { href: "/pengajuan", label: "Layanan" },
  { href: "/outbound", label: "Outbound" },
  { href: "/inbound", label: "Inbound" },
  { href: "/pdln", label: "PDLN" },
  { href: "/faq", label: "Panduan" }
];

export function SiteHeader({
  signedIn,
  staff,
  name,
  role,
  membership
}: {
  signedIn: boolean;
  staff: boolean;
  name?: string;
  role?: Role;
  membership?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const showMenu = Boolean(signedIn && name && role);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled ? "glass-dark border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[78rem] items-center justify-between gap-6 px-5 sm:px-8">
        <PnjMark href="/" size="md" withText className="min-w-0" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[0.8125rem] font-medium transition-colors",
                  active ? "bg-white/12 text-white" : "text-mint-100/85 hover:bg-white/8 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {showMenu ? (
            <>
              <BtnLink href={staff ? "/admin" : "/dashboard"} variant="outlineDark" size="sm">
                {staff ? "Command Center" : "Dashboard"}
              </BtnLink>
              <UserMenu name={name!} role={role!} membership={membership} />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-3.5 py-2 text-[0.8125rem] font-medium text-mint-100 hover:text-white">
                Masuk
              </Link>
              <BtnLink href="/pengajuan" variant="onDark" size="sm">
                Ajukan
                <ArrowUpRight className="size-3.5" />
              </BtnLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="grid size-10 place-items-center rounded-full text-white ring-1 ring-inset ring-white/25 md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="animate-fade border-t border-white/10 bg-forest-950/95 px-5 pb-6 pt-3 backdrop-blur-xl md:hidden">
          {showMenu ? (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-white/8 px-3.5 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-[0.8125rem] font-semibold text-white">{name}</p>
                <p className="truncate text-[0.6875rem] text-mint-200/80">{membership ?? (staff ? "Verifikator KUI" : "Mahasiswa PNJ")}</p>
              </div>
              <LogoutButton className="shrink-0 bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/16" label="Keluar" />
            </div>
          ) : null}

          <nav className="flex flex-col" aria-label="Navigasi seluler">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl px-2 py-3 text-sm font-medium text-mint-100 hover:bg-white/8 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2">
            {showMenu ? (
              <BtnLink href={staff ? "/admin" : "/dashboard"} variant="onDark">
                {staff ? "Command Center" : "Dashboard"}
              </BtnLink>
            ) : (
              <>
                <BtnLink href="/login" variant="outlineDark">
                  Masuk
                </BtnLink>
                <BtnLink href="/pengajuan" variant="onDark">
                  Mulai Pengajuan
                </BtnLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}