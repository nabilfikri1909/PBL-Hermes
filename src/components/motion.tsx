"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Scroll reveal ─────────────────────────────────────────────
   One observer per element, unobserves after the first hit, and
   the content is never left hidden if scripting is unavailable
   (the server renders it visible; only `.is-hidden` hides it). */

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as: Tag = "div",
  once = true
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const Component = Tag as "div";
  return (
    <Component
      ref={ref}
      className={cn(className, shown ? "reveal-in" : "reveal-out")}
      style={{ transitionDelay: `${delay}ms`, ["--reveal-y" as string]: `${y}px` }}
    >
      {children}
    </Component>
  );
}

/* ── Number counter ───────────────────────────────────────────── */

export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1400,
  decimals = 0,
  className
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(to * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          run();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
      {suffix}
    </span>
  );
}

/* ── Marquee rail ─────────────────────────────────────────────── */

export function Marquee({
  items,
  className,
  speed = 38
}: {
  items: ReactNode[];
  className?: string;
  speed?: number;
}) {
  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}
    >
      <div className="marquee-track flex w-max items-center gap-10 hover:[animation-play-state:paused]" style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap text-[0.8125rem] font-medium text-mint-100/85">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Scroll progress bar ──────────────────────────────────────── */

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent" aria-hidden>
      <div className="h-full bg-mint-400 transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}

/* ── Parallax layer ───────────────────────────────────────────── */

export function Parallax({ children, strength = 18, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const onScroll = () => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const centre = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset((-centre / window.innerHeight) * strength);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      <div style={{ transform: `translate3d(0, ${offset.toFixed(2)}px, 0)` }} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}

/* ── Tilt on pointer (fine pointers only) ─────────────────────── */

export function Tilt({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg) translateY(-4px)`;
  };

  const reset = () => {
    const node = ref.current;
    if (node) node.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn("transition-transform duration-300 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  );
}