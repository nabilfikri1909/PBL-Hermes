import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn, STATUS_META } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

/* ── Buttons ──────────────────────────────────────────────────── */

type Variant = "primary" | "onDark" | "outlineDark" | "outline" | "ghost" | "mint";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-forest-900 text-white hover:bg-forest-800",
  onDark: "bg-white text-forest-900 hover:bg-mint-100",
  outlineDark: "border border-white/60 text-white hover:bg-white/12 hover:border-white/85",
  outline: "border border-forest-200 text-forest-800 hover:border-forest-400 hover:bg-forest-50",
  ghost: "text-forest-800 hover:bg-forest-50",
  mint: "bg-mint-300 text-forest-900 hover:bg-mint-400"
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-[0.9375rem]"
};

export function Btn({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function BtnLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link href={href} className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
    </Link>
  );
}

/* ── Badges ───────────────────────────────────────────────────── */

export function Badge({
  children,
  className,
  tone = "neutral"
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "forest" | "mint" | "ok" | "warn" | "stop" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-canvas-mist text-ink-soft border-hairline",
    forest: "bg-forest-50 text-forest-800 border-forest-100",
    mint: "bg-mint-100 text-forest-800 border-mint-200",
    ok: "bg-ok-50 text-ok-700 border-ok-200",
    warn: "bg-warn-50 text-warn-700 border-warn-200",
    stop: "bg-stop-50 text-stop-700 border-stop-200",
    info: "bg-info-50 text-info-700 border-info-200"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: ApplicationStatus; className?: string }) {
  const meta = STATUS_META[status];
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold", meta.className, className)}>{meta.label}</span>;
}

/* ── Surfaces ─────────────────────────────────────────────────── */

export function Card({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cn("paper p-6", className)} {...rest}>
      {children}
    </div>
  );
}

export function FlatPanel({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cn("rounded-card bg-canvas-soft p-5", className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionHead({
  title,
  description,
  align = "center",
  className,
  action
}: {
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex gap-5",
        align === "center" ? "flex-col items-center text-center" : "flex-col items-start text-left sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(align === "center" ? "max-w-2xl" : "max-w-xl")}>
        <h2 className="display-section text-ink">{title}</h2>
        {description ? <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-mute">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ── Identity ─────────────────────────────────────────────────── */

export function Avatar({ name, className }: { name: string; className?: string }) {
  const parts = name.split(" ").filter(Boolean);
  const label = (parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "");
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-forest-900 text-[0.6875rem] font-bold uppercase tracking-wide text-white",
        className
      )}
    >
      {label}
    </span>
  );
}

/* ── Data display ─────────────────────────────────────────────── */

export function KV({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-mute">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-ink">{children}</dd>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card-lg bg-canvas-soft px-8 py-14 text-center">
      {icon ? <div className="text-forest-600">{icon}</div> : null}
      <p className="text-base font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-mute">{description}</p>
      {action}
    </div>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-canvas-mist", className)}>
      <div className="h-full rounded-full bg-forest-700 transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ── Form primitives (used inside client wizard) ──────────────── */

export const inputClass =
  "h-11 w-full rounded-xl border border-hairline bg-white px-3.5 text-sm text-ink placeholder:text-ink-mute/70 transition-colors focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/15";

export const selectClass = cn(inputClass, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7c74%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9");

export const textareaClass =
  "min-h-[7.5rem] w-full resize-y rounded-xl border border-hairline bg-white px-3.5 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-mute/70 transition-colors focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/15";

export function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-[0.8125rem] font-semibold text-ink-soft">
      {children}
      {required ? <span className="ml-0.5 text-stop-700">*</span> : null}
    </span>
  );
}