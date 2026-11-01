"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, MessageSquare, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { cn, ROLE_META } from "@/lib/utils";
import type { Role } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Single logout path for the whole app: POST, then hard-navigate home. */
async function signOut() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Accept": "application/json" },
    redirect: "follow"
  });
  return response;
}

export function LogoutButton({
  className,
  label = "Keluar",
  iconOnly = false
}: {
  className?: string;
  label?: string;
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
      toast.success("Anda telah keluar dari portal.");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Gagal keluar. Coba lagi.");
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={run}
      disabled={busy}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full text-[0.75rem] font-semibold transition-colors disabled:opacity-60",
        iconOnly ? "size-8" : "px-3 py-2",
        className
      )}
    >
      <LogOut className={cn("size-3.5", busy && "animate-pulse")} />
      {iconOnly ? null : <span>{busy ? "Keluar…" : label}</span>}
    </button>
  );
}

export function UserMenu({
  name,
  role,
  membership
}: {
  name: string;
  role: Role;
  membership?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);
  const staff = role === "admin" || role === "super_admin";

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { href: staff ? "/admin" : "/dashboard", label: staff ? "Command Center" : "Dashboard", icon: LayoutDashboard },
    { href: staff ? "/admin/settings" : "/dashboard/profile", label: "Profil & pengaturan", icon: UserRound },
    { href: staff ? "/admin/questions" : "/dashboard/questions", label: "Helpdesk", icon: MessageSquare }
  ];

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-2.5 text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/16"
      >
        <span className="grid size-7 place-items-center rounded-full bg-mint-300 text-[0.6875rem] font-bold text-forest-900">
          {initials(name)}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">{name.split(" ")[0]}</span>
        <ChevronDown className={cn("size-3.5 text-mint-200 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="menu"
          className="animate-rise absolute right-0 top-[calc(100%+0.5rem)] w-[16rem] overflow-hidden rounded-card border border-hairline bg-white shadow-[0_24px_50px_-24px_rgb(13_26_21_/_0.4)]"
        >
          <div className="border-b border-hairline-soft px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-mute">
              <ShieldCheck className="size-3.5 text-forest-600" />
              {ROLE_META[role].label}
              {membership ? ` · ${membership}` : ""}
            </p>
          </div>

          <div className="p-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-canvas-soft hover:text-ink"
                >
                  <Icon className="size-4 text-ink-mute" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-hairline-soft p-1.5">
            <LogoutButton
              className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium text-stop-700 hover:bg-stop-50"
              label="Keluar dari akun"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}