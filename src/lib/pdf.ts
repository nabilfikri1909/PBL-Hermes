/** Minimal single-page PDF writer — no dependencies, valid PDF 1.4 output. */

const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

export interface PdfLine {
  text: string;
  size?: number;
  bold?: boolean;
  gap?: number;
}

export function buildPdf(title: string, lines: PdfLine[]): Buffer {
  const content: string[] = ["BT", "40 800 Td"];

  content.push(`/F2 16 Tf 16 TL (${escape(title)}) Tj T*`);
  content.push("ET");

  let y = 760;
  for (const line of lines) {
    const size = line.size ?? 11;
    const font = line.bold ? "/F2" : "/F1";
    content.push("BT");
    content.push(`0 -${y} Td`);
    content.push(`${font} ${size} Tf`);
    content.push(`(${escape(line.text)}) Tj`);
    content.push("ET");
    y += (line.gap ?? 20) + size;
    if (y > 806) break;
  }

  const stream = content.join("\n");
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}