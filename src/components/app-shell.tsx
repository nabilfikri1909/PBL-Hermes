"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookMarked,
  BookOpenCheck,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Menu,
  MessageSquare,
  Plane,
  Plus,
  Settings,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import { cn, ROLE_META } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { Avatar } from "./ui";
import { LogoutButton } from "./user-menu";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const STUDENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Ringkasan", icon: <LayoutDashboard className="size-4" /> },
  { href: "/dashboard/applications", label: "Pengajuan Saya", icon: <ClipboardList className="size-4" /> },
  { href: "/dashboard/templates", label: "Blanko Dokumen", icon: <BookMarked className="size-4" /> },
  { href: "/dashboard/questions", label: "Tanya Jawab", icon: <MessageSquare className="size-4" /> },
  { href: "/dashboard/profile", label: "Profil Saya", icon: <Users className="size-4" /> }
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Command Center", icon: <LayoutDashboard className="size-4" /> },
  { href: "/admin/applications", label: "Semua Pengajuan", icon: <ClipboardList className="size-4" /> },
  { href: "/admin/outbound", label: "Antrean Outbound", icon: <Plane className="size-4" /> },
  { href: "/admin/inbound", label: "Antrean Inbound", icon: <BookOpenCheck className="size-4" /> },
  { href: "/admin/pdln", label: "Antrean PDLN", icon: <ShieldCheck className="size-4" /> },
  { href: "/admin/statistics", label: "Statistik", icon: <BarChart3 className="size-4" /> },
  { href: "/admin/questions", label: "Helpdesk", icon: <LifeBuoy className="size-4" /> },
  { href: "/admin/announcements", label: "Pengumuman", icon: <Megaphone className="size-4" /> },
  { href: "/admin/faqs", label: "FAQ Manager", icon: <MessageSquare className="size-4" /> },
  { href: "/admin/admins", label: "Peran & Akun", icon: <Users className="size-4" /> },
  { href: "/admin/audit-logs", label: "Log Audit", icon: <ShieldCheck className="size-4" /> },
  { href: "/admin/settings", label: "Pengaturan", icon: <Settings className="size-4" /> }
];

export function AppShell({
  user,
  area,
  title,
  subtitle,
  actions,
  children
}: {
  user: { fullName: string; email: string; role: Role; department: string };
  area: "student" | "admin";
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = area === "admin" ? ADMIN_NAV : STUDENT_NAV;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard" || href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const sidebar = (
    <div className="flex h-full flex-col gap-6 bg-white px-4 py-5">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-white p-[3px] ring-1 ring-inset ring-hairline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pnj-logo.jpg" alt="Lambang PNJ" width={48} height={48} className="size-full rounded-[0.45rem] object-contain" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.8125rem] font-semibold text-ink">KUI PNJ</span>
          <span className="text-[0.6875rem] text-ink-mute">{area === "admin" ? "Verifikator Workspace" : "Portal Mahasiswa"}</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto" aria-label="Navigasi area kerja">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.8125rem] font-medium transition-colors",
              isActive(item.href) ? "bg-forest-50 text-forest-900" : "text-ink-soft hover:bg-canvas-soft hover:text-ink"
            )}
          >
            <span className={cn(isActive(item.href) ? "text-forest-700" : "text-ink-mute")}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="rounded-card bg-canvas-soft p-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={user.fullName} />
          <div className="min-w-0">
            <p className="truncate text-[0.8125rem] font-semibold text-ink">{user.fullName}</p>
            <p className="truncate text-[0.6875rem] text-ink-mute">{ROLE_META[user.role].label}</p>
          </div>
        </div>
        <LogoutButton
          className="mt-3 w-full justify-center bg-white py-2 text-ink-soft hover:bg-stop-50 hover:text-stop-700"
          label="Keluar"
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh overflow-x-clip bg-canvas-soft">
      <aside className="sticky top-0 hidden h-dvh w-[16.5rem] shrink-0 border-r border-hairline bg-white lg:block">{sidebar}</aside>

      {open ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-[17rem] border-r border-hairline bg-white">{sidebar}</div>
          <button type="button" aria-label="Tutup menu" className="flex-1 bg-ink/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
        <header className="sticky top-0 z-30 border-b border-hairline bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-9 place-items-center rounded-lg text-ink-soft hover:bg-canvas-soft lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[0.6875rem] text-ink-mute">
                <Link href={area === "admin" ? "/admin" : "/dashboard"} className="hover:text-forest-800">
                  {area === "admin" ? "Admin KUI" : "Dashboard"}
                </Link>
                <ChevronRight className="size-3" />
                <span className="truncate">{title}</span>
              </div>
              <h1 className="truncate text-[1.0625rem] font-bold tracking-tight text-ink">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {actions}
              {area !== "admin" ? (
                <Link
                  href="/pengajuan"
                  className="hidden items-center gap-1.5 rounded-full bg-forest-900 px-3.5 py-2 text-[0.75rem] font-semibold text-white transition-colors hover:bg-forest-800 sm:inline-flex"
                >
                  <Plus className="size-3.5" />
                  Pengajuan Baru
                </Link>
              ) : null}
            </div>
          </div>
          {subtitle ? <p className="px-4 pb-3 text-[0.75rem] text-ink-mute sm:px-6">{subtitle}</p> : null}
        </header>

        <main className="mx-auto w-full max-w-[80rem] min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

export function SidebarCloseIcon() {
  return <X className="size-5" />;
}