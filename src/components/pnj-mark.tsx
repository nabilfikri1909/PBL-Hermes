import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The official PNJ emblem ships as a JPG on a solid white ground, so it is
 * always seated inside a white chip — on the emerald field it reads as a
 * deliberate plaque rather than a cut-out asset with a stray white box.
 */
export function PnjMark({
  href = "/",
  size = "md",
  withText = false,
  className
}: {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
}) {
  const box = { sm: "size-8", md: "size-10", lg: "size-14" }[size];
  const text = { sm: "text-[0.8125rem]", md: "text-sm", lg: "text-base" }[size];

  const inner = (
    <span className="flex items-center gap-2.5">
      <span className={cn("grid shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-white p-[3px] shadow-[0_2px_10px_-4px_rgb(0_0_0_/_0.45)] ring-1 ring-inset ring-black/5", box)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pnj-logo.jpg" alt="Lambang Politeknik Negeri Jakarta" width={64} height={64} className="size-full rounded-[0.45rem] object-contain" />
      </span>
      {withText ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className={cn("truncate font-semibold tracking-tight text-white", text)}>Kantor Urusan Internasional</span>
          <span className="mt-1 truncate text-[0.6875rem] text-mint-200">Politeknik Negeri Jakarta</span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return <span className={className}>{inner}</span>;
  return (
    <Link href={href} className={cn("inline-flex shrink-0", className)} aria-label="Kembali ke beranda portal KUI PNJ">
      {inner}
    </Link>
  );
}

/** Dark-ink variant for white surfaces (footer is dark, legal pages are not). */
export function PnjMarkInk({ withText = true, className }: { withText?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-white p-[3px] ring-1 ring-inset ring-hairline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pnj-logo.jpg" alt="Lambang Politeknik Negeri Jakarta" width={64} height={64} className="size-full rounded-[0.45rem] object-contain" />
      </span>
      {withText ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="truncate text-sm font-semibold tracking-tight text-ink">Kantor Urusan Internasional</span>
          <span className="mt-1 truncate text-[0.6875rem] text-ink-mute">Politeknik Negeri Jakarta</span>
        </span>
      ) : null}
    </span>
  );
}