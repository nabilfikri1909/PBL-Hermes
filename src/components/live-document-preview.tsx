"use client";

import { useMemo, useState } from "react";
import { Download, Minus, Plus, Printer, RotateCcw } from "lucide-react";
import { buildSheets, type Block, type LetterData } from "@/lib/letters";
import { LETTERS } from "@/lib/forms";
import { cn, formatDate, SERVICE_META } from "@/lib/utils";
import type { LetterKind, ServiceKind } from "@/lib/types";

const ZOOM_STEPS = [0.7, 0.8, 0.9, 1, 1.1, 1.2];

export function LiveDocumentPreview({
  service,
  data,
  registerNo,
  className
}: {
  service: ServiceKind;
  data: LetterData;
  registerNo?: string;
  className?: string;
}) {
  const letters = useMemo(() => LETTERS.filter((l) => l.service === service), [service]);
  const [kind, setKind] = useState<LetterKind>(letters[0]?.kind ?? "outbound-passport");
  const [sheetNo, setSheetNo] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(3);

  const sheets = useMemo(() => buildSheets(kind, { ...data, registerNo: registerNo || data.registerNo }), [kind, data, registerNo]);
  const active = sheets.find((s) => s.no === sheetNo) ?? sheets[0];
  const zoom = ZOOM_STEPS[zoomIndex] ?? 1;
  const blankoId = service === "outbound" ? "tpl_1" : service === "inbound" ? "tpl_4" : "tpl_6";

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* iOS-style glass toolbar, one row */}
      <div className="glass-light sticky top-[4.5rem] z-20 flex flex-wrap items-center gap-2 rounded-full border border-white/70 px-3 py-2 shadow-[0_10px_30px_-18px_rgb(13_26_21_/_0.35)]">
        <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-forest-800">
          <span className="live-dot size-1.5 rounded-full bg-mint-500" />
          Live A4
        </span>

        {sheets.length > 1 ? (
          <div className="flex items-center gap-1 rounded-full bg-white/70 p-0.5">
            {sheets.map((s) => (
              <button
                key={s.no}
                type="button"
                onClick={() => setSheetNo(s.no)}
                aria-label={`Lembar ${s.no}`}
                className={cn(
                  "grid size-6 place-items-center rounded-full text-[0.6875rem] font-semibold transition-colors",
                  sheetNo === s.no ? "bg-forest-900 text-white" : "text-ink-mute hover:bg-white"
                )}
              >
                {s.no}
              </button>
            ))}
          </div>
        ) : null}

        <select
          value={kind}
          onChange={(e) => {
            setKind(e.target.value as LetterKind);
            setSheetNo(1);
          }}
          aria-label="Format surat"
          className="h-7 min-w-0 flex-1 rounded-full border border-hairline bg-white px-2.5 text-[0.6875rem] font-medium text-ink-soft focus:outline-none"
        >
          {letters.map((l) => (
            <option key={l.kind} value={l.kind}>
              {l.title}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-0.5 rounded-full bg-white/70 p-0.5 text-ink-soft">
          <button type="button" aria-label="Perkecil" onClick={() => setZoomIndex((i) => Math.max(0, i - 1))} className="grid size-6 place-items-center rounded-full hover:bg-white">
            <Minus className="size-3" />
          </button>
          <span className="w-9 text-center text-[0.6875rem] font-semibold tabular">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Perbesar" onClick={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))} className="grid size-6 place-items-center rounded-full hover:bg-white">
            <Plus className="size-3" />
          </button>
          <button type="button" aria-label="Reset zoom" onClick={() => setZoomIndex(3)} className="grid size-6 place-items-center rounded-full hover:bg-white">
            <RotateCcw className="size-3" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <a
            href={`/api/files?id=${blankoId}`}
            className="inline-flex h-7 items-center gap-1 rounded-full bg-white px-2.5 text-[0.6875rem] font-semibold text-forest-800 transition-colors hover:bg-mint-100"
          >
            <Download className="size-3" />
            Blanko
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-7 items-center gap-1 rounded-full bg-forest-900 px-2.5 text-[0.6875rem] font-semibold text-white transition-colors hover:bg-forest-800"
          >
            <Printer className="size-3" />
            Cetak
          </button>
        </div>
      </div>

      {/* Sheet */}
      <div className="mt-4 flex-1 overflow-auto rounded-card bg-canvas-soft p-3 sm:p-5">
        <div className="mx-auto origin-top transition-transform duration-300" style={{ transform: `scale(${zoom})`, width: zoom > 1 ? `${100 / zoom}%` : "100%" }}>
          <div data-print-sheet className="sheet-a4 mx-auto w-full max-w-[34rem] px-[7%] py-[6%] text-[#111]">
            <header className="border-b-[3px] border-double border-[#0a3527] pb-3 text-center">
              <div className="flex items-center justify-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/pnj-logo.jpg" alt="Lambang Politeknik Negeri Jakarta" width={40} height={40} className="size-9 rounded-full object-contain" />
                <div className="text-left leading-tight">
                  <p className="text-[0.5rem] uppercase tracking-[0.14em] text-[#3a4a43]">Kementerian Pendidikan Tinggi, Sains, dan Teknologi</p>
                  <p className="text-[0.75rem] font-bold tracking-tight text-[#0a3527]">POLITEKNIK NEGERI JAKARTA</p>
                  <p className="text-[0.5rem] text-[#3a4a43]">Kantor Urusan Internasional · Kampus UI Depok 16425</p>
                </div>
              </div>
            </header>

            <div className="mt-4 space-y-2">
              {active?.blocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>

            <footer className="mt-4 flex items-end justify-between gap-3 border-t border-[#d8e2dc] pt-2">
              <div className="text-[0.4375rem] leading-tight text-[#6b7c74]">
                <p>Dokumen dihasilkan Portal Internasional PNJ.</p>
                <p>Verifikasi keaslian melalui KUI · kui@pnj.ac.id</p>
                <p className="mt-0.5">{SERVICE_META[service].label} · {formatDate(data.issueDate)}</p>
              </div>
              <QrStamp seed={`${data.registerNo}-${kind}`} />
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return <p className="text-center text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-[#0a3527]">{block.text}</p>;
    case "para":
      return <p className="text-justify text-[0.5625rem] leading-[1.7] text-[#1f2b25]">{block.text}</p>;
    case "kv":
      return (
        <table className="w-full border-collapse text-[0.5625rem]">
          <tbody>
            {block.rows.map(([label, value]) => (
              <tr key={label}>
                <td className="w-[34%] py-[2px] align-top font-semibold text-[#3a4a43]">{label}</td>
                <td className="w-[2%] py-[2px] align-top">:</td>
                <td className="py-[2px] align-top text-[#111]">{value || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "list":
      return (
        <ol className="list-decimal space-y-1 pl-4 text-[0.5625rem] leading-[1.65] text-[#1f2b25]">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "table":
      return (
        <table className="w-full border-collapse text-[0.5rem]">
          <thead>
            <tr>
              {block.head.map((h) => (
                <th key={h} className="border border-[#c9d6cf] bg-[#eef6f1] px-1 py-1 text-left font-semibold text-[#0a3527]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-[#dbe5df] px-1 py-1 align-top text-[#1f2b25]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "note":
      return <p className="rounded-sm bg-[#f4f8f5] px-2 py-1.5 text-[0.5rem] italic leading-relaxed text-[#3a4a43]">{block.text}</p>;
    case "signature":
      return (
        <div className="mt-4 flex justify-end">
          <div className="w-[46%] text-center text-[0.5625rem] leading-relaxed">
            <p className="text-[#3a4a43]">{block.forLabel},</p>
            <div className="my-2 grid h-9 place-items-center rounded-sm border border-dashed border-[#b9c9c0] text-[0.4375rem] text-[#93a49b]">
              tanda tangan & stempel digital
            </div>
            <p className="font-bold text-[#0a3527] underline decoration-1 underline-offset-2">{block.name}</p>
            <p className="text-[#3a4a43]">{block.role}</p>
            {block.nip ? <p className="text-[#6b7c74]">NIP {block.nip}</p> : null}
          </div>
        </div>
      );
    default:
      return null;
  }
}

/** Deterministic pseudo-QR so the sheet reads as a real signed document. */
function QrStamp({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    const out: boolean[] = [];
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
    for (let i = 0; i < 49; i += 1) {
      hash = (hash * 1103515245 + 12345) % 2147483647;
      out.push(hash % 3 !== 0 || i % 8 === 0);
    }
    return out;
  }, [seed]);

  return (
    <div className="text-center">
      <div className="grid grid-cols-7 gap-[1px] rounded-[2px] bg-white p-[2px] ring-1 ring-[#c9d6cf]">
        {cells.map((on, i) => (
          <span key={i} className={cn("size-[3px]", on ? "bg-[#0a3527]" : "bg-white")} />
        ))}
      </div>
      <p className="mt-1 text-[0.375rem] uppercase tracking-[0.1em] text-[#6b7c74]">Scan verifikasi</p>
    </div>
  );
}