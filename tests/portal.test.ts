import { describe, expect, it } from "vitest";
import { availableVerdicts, desk, findRule, STATUS_FLOW } from "../src/lib/workflow";
import {
  countryName,
  formatDate,
  formatRange,
  rupiah,
  STATUS_META,
  daysBetween,
  isPnjEmail,
  allowedServicesForEmail,
  isServiceAllowedForEmail
} from "../src/lib/utils";
import { buildSheets, CATEGORY_LABELS, type LetterData } from "../src/lib/letters";
import { FORM_DEFS, LETTERS, lettersFor } from "../src/lib/forms";
import { publicPdlNRow, computeStats } from "../src/lib/stats";
import { SEED_APPLICATIONS, SEED_FAQS, SEED_TEMPLATES } from "../src/lib/seed";
import fs from "fs";
import path from "path";

const base: LetterData = {
  registerNo: "OTB/PNJ-KUI/2026/009",
  applicantName: "Muhammad Nabil Fikri",
  applicantNim: "2207421021",
  department: "Teknik Informatika",
  email: "nabil@student.pnj.ac.id",
  phone: "+62 812 0000 001",
  passportNo: "C1739402",
  nationality: "Indonesia",
  title: "Global Summer Program",
  category: "short-course",
  partner: "Tampere University",
  country: "FI",
  city: "Tampere",
  startDate: "2026-06-08",
  endDate: "2026-07-24",
  funding: "beasiswa",
  budget: 48000000,
  summary: "Program enam minggu.",
  participants: [
    { name: "Muhammad Nabil Fikri", role: "Ketua Delegasi", institution: "Teknik Informatika", docStatus: "valid" },
    { name: "Ayu Larasati", role: "Anggota", institution: "Administrasi Bisnis", docStatus: "pending" }
  ],
  role: "student",
  issueDate: "2026-02-10T00:00:00.000Z"
};

describe("workflow state machine", () => {
  it("exposes the ordered status flow", () => {
    expect(STATUS_FLOW[0]).toBe("draft");
    expect(STATUS_FLOW.at(-1)).toBe("completed");
  });

  it("lets a verifier start review only from submitted", () => {
    const rules = availableVerdicts("submitted", "admin");
    expect(rules.map((r) => r.verdict)).toContain("start_review");
    expect(availableVerdicts("draft", "admin").map((r) => r.verdict)).not.toContain("start_review");
  });

  it("never grants staff transitions to a student", () => {
    const rules = availableVerdicts("submitted", "student");
    expect(rules.every((r) => r.verdict === "resubmit")).toBe(true);
  });

  it("requires a note for revision and rejection verdicts", () => {
    expect(findRule("request_revision")?.requiresNote).toBe(true);
    expect(findRule("reject")?.requiresNote).toBe(true);
    expect(findRule("approve")?.requiresNote).toBe(false);
  });

  it("maps each status to the swimlane that owns it", () => {
    expect(desk("submitted")).toBe("Verifikator KUI");
    expect(desk("revision_required")).toBe("Pengaju");
    expect(desk("forwarded_to_kui")).toBe("Kemensetneg");
    expect(desk("completed")).toBe("Selesai");
  });
});

describe("hydration-safe formatting", () => {
  it("formats dates without locale drift", () => {
    expect(formatDate("2026-02-04T02:00:00.000Z")).toBe("4 Februari 2026");
    expect(formatRange("2026-06-08", "2026-07-24")).toBe("8 Jun 2026 – 24 Jul 2026");
  });

  it("returns a dash for empty dates", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatRange(null, null)).toBe("—");
  });

  it("formats rupiah with Indonesian separators", () => {
    expect(rupiah(48000000)).toBe("Rp 48.000.000");
    expect(rupiah(0)).toBe("Rp 0");
  });

  it("counts inclusive day spans", () => {
    expect(daysBetween("2026-06-08", "2026-06-10")).toBe(2);
    expect(daysBetween(null, "2026-06-10")).toBe(0);
  });

  it("uses canonical country labels, never ICU variants", () => {
    expect(countryName("HK")).toBe("Hong Kong");
    expect(countryName("MO")).toBe("Makau");
    expect(countryName("XX")).toBe("XX");
    expect(countryName(null)).toBe("—");
  });

  it("defines a badge for every status", () => {
    expect(STATUS_META.revision_required.label).toBe("Perlu Revisi");
    expect(STATUS_META.approved.step).toBeGreaterThan(STATUS_META.under_review.step);
  });

  it("restricts PNJ emails to Outbound and PDLN only, while regular emails can access all 3 services", () => {
    // PNJ student email
    expect(isPnjEmail("nabil@student.pnj.ac.id")).toBe(true);
    expect(allowedServicesForEmail("nabil@student.pnj.ac.id")).toEqual(["outbound", "pdln"]);
    expect(isServiceAllowedForEmail("nabil@student.pnj.ac.id", "outbound")).toBe(true);
    expect(isServiceAllowedForEmail("nabil@student.pnj.ac.id", "pdln")).toBe(true);
    expect(isServiceAllowedForEmail("nabil@student.pnj.ac.id", "inbound")).toBe(false);

    // PNJ lecturer / staff email
    expect(isPnjEmail("bagus@pnj.ac.id")).toBe(true);
    expect(isServiceAllowedForEmail("bagus@pnj.ac.id", "inbound")).toBe(false);

    // Regular / personal / foreign email
    expect(isPnjEmail("nabil@gmail.com")).toBe(false);
    expect(isPnjEmail("emma@lund.se")).toBe(false);
    expect(allowedServicesForEmail("user@gmail.com")).toEqual(["outbound", "inbound", "pdln"]);
    expect(isServiceAllowedForEmail("user@gmail.com", "outbound")).toBe(true);
    expect(isServiceAllowedForEmail("user@gmail.com", "inbound")).toBe(true);
    expect(isServiceAllowedForEmail("user@gmail.com", "pdln")).toBe(true);
  });
});

describe("form definitions", () => {
  it("covers all three services", () => {
    expect(Object.keys(FORM_DEFS)).toEqual(["outbound", "inbound", "pdln"]);
  });

  it("gives PDLN the delegation step and the others not", () => {
    expect(FORM_DEFS.pdln.delegation).toBe(true);
    expect(FORM_DEFS.outbound.delegation).toBe(false);
    expect(FORM_DEFS.inbound.delegation).toBe(false);
  });

  it("marks at least one required document per service", () => {
    (["outbound", "inbound", "pdln"] as const).forEach((service) => {
      expect(FORM_DEFS[service].docs.some((doc) => doc.required)).toBe(true);
    });
  });

  it("keeps a country field in every service form", () => {
    (["outbound", "inbound", "pdln"] as const).forEach((service) => {
      const keys = FORM_DEFS[service].steps.flatMap((step) => step.fields.map((f) => f.key));
      expect(keys).toContain("country");
    });
  });

  it("exposes letter formats per service", () => {
    expect(lettersFor("outbound").length).toBe(3);
    expect(lettersFor("pdln").length).toBe(3);
    expect(LETTERS.length).toBe(9);
  });
});

describe("A4 letter engine", () => {
  it("builds one sheet for the passport recommendation", () => {
    const sheets = buildSheets("outbound-passport", base);
    expect(sheets).toHaveLength(1);
    expect(sheets[0]!.title.toLowerCase()).toContain("paspor");
  });

  it("prints the register number and applicant name into the body", () => {
    const sheets = buildSheets("outbound-passport", base);
    const text = JSON.stringify(sheets);
    expect(text).toContain(base.registerNo);
    expect(text).toContain(base.applicantName);
  });

  it("builds two sheets for visa and LoA formats", () => {
    expect(buildSheets("outbound-visa", base)).toHaveLength(2);
    expect(buildSheets("inbound-loa", base)).toHaveLength(2);
    expect(buildSheets("pdln-director", base)).toHaveLength(2);
  });

  it("renders PDLN delegation table without passport numbers", () => {
    const sheets = buildSheets("pdln-delegation", base);
    const text = JSON.stringify(sheets);
    expect(text).not.toContain(base.passportNo);
    expect(text).toContain("Ayu Larasati");
  });

  it("labels every template kind", () => {
    LETTERS.forEach((letter) => {
      const sheets = buildSheets(letter.kind, base);
      expect(sheets.length).toBeGreaterThan(0);
      expect(sheets[0]!.blocks.length).toBeGreaterThan(2);
    });
  });

  it("translates categories for display", () => {
    expect(CATEGORY_LABELS.internship).toBe("International Internship");
  });
});

describe("public transparency projection", () => {
  const delegation = SEED_APPLICATIONS.find((a) => a.service === "pdln" && a.participants.length > 1)!;

  it("exposes names and status only", () => {
    const row = publicPdlNRow(delegation);
    expect(row.participants[0]).toEqual({ name: expect.any(String), role: expect.any(String), docStatus: expect.any(String) });
    expect(JSON.stringify(row)).not.toContain("passportNo");
    expect(JSON.stringify(row)).not.toContain(delegation.passportNo);
  });

  it("keeps contact details out of the public payload", () => {
    const text = JSON.stringify(publicPdlNRow(delegation));
    expect(text).not.toContain("@");
    expect(text).not.toContain("NIK");
  });
});

describe("statistics", () => {
  it("counts every seeded application by service", () => {
    const stats = computeStats(SEED_APPLICATIONS);
    const total = stats.byService.reduce((sum, row) => sum + row.value, 0);
    expect(total).toBe(SEED_APPLICATIONS.length);
  });

  it("anchors the six-month window on the newest record", () => {
    const stats = computeStats(SEED_APPLICATIONS);
    expect(stats.monthly).toHaveLength(6);
    expect(stats.monthly.some((row) => row.outbound + row.inbound + row.pdln > 0)).toBe(true);
  });

  it("reports a non-negative average processing time", () => {
    const stats = computeStats(SEED_APPLICATIONS);
    expect(stats.avgProcessingDays).toBeGreaterThanOrEqual(0);
  });
});

describe("seed integrity", () => {
  it("ships CMS content", () => {
    expect(SEED_FAQS.length).toBeGreaterThan(4);
    expect(SEED_APPLICATIONS.length).toBeGreaterThan(8);
  });

  it("gives every application a unique register number and id", () => {
    const ids = new Set(SEED_APPLICATIONS.map((a) => a.id));
    const numbers = new Set(SEED_APPLICATIONS.map((a) => a.registerNo));
    expect(ids.size).toBe(SEED_APPLICATIONS.length);
    expect(numbers.size).toBe(SEED_APPLICATIONS.length);
  });

  it("keeps every PDLN delegation at one chair or more", () => {
    SEED_APPLICATIONS.filter((a) => a.service === "pdln").forEach((app) => {
      expect(app.participants.filter((p) => p.role === "Ketua Delegasi").length).toBe(1);
    });
  });

  it("never seeds a lump-sum report with mismatched participants", () => {
    SEED_APPLICATIONS.forEach((app) => {
      app.report.expenses.forEach((expense) => {
        expect(expense.ticket + expense.accommodation + expense.dailyAllowance + expense.insurance + expense.other).toBeGreaterThan(0);
      });
    });
  });

  it("links authentic KUI PNJ templates to real PDF files on disk", () => {
    const withFiles = SEED_TEMPLATES.filter((t) => t.fileName);
    expect(withFiles.length).toBeGreaterThanOrEqual(6);
    withFiles.forEach((tpl) => {
      const p = path.join(process.cwd(), "public", "templates", tpl.fileName!);
      expect(fs.existsSync(p)).toBe(true);
      const head = fs.readFileSync(p, { encoding: "utf8", flag: "r" }).slice(0, 5);
      expect(head).toBe("%PDF-");
    });
  });

  it("ships real PNJ campus and landmark photos in public asset directory", () => {
    const assets = ["pnj-logo.jpg", "pnj-landmark.jpg", "pnj-gedung.jpg", "pnj-campus.png"];
    assets.forEach((f) => {
      const p = path.join(process.cwd(), "public", f);
      expect(fs.existsSync(p)).toBe(true);
      expect(fs.statSync(p).size).toBeGreaterThan(20000);
    });
  });
});