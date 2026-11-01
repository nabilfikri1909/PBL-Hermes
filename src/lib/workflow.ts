import type { ApplicationStatus, Role } from "./types";

/**
 * State machine for a berkas pengajuan.
 * The SYSTEM only declares transitions; a human verifier owns every
 * subjective decision (dosen rule / BPMN swimlane separation).
 */
export const STATUS_FLOW: ApplicationStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "revision_required",
  "forwarded_to_kui",
  "approved",
  "completed"
];

export type Verdict = "start_review" | "request_revision" | "approve" | "forward" | "complete" | "reject" | "resubmit";

interface Rule {
  verdict: Verdict;
  from: ApplicationStatus[];
  to: ApplicationStatus;
  roles: Role[];
  label: string;
  /** Admin must write a note for this verdict. */
  requiresNote: boolean;
}

export const RULES: Rule[] = [
  { verdict: "start_review", from: ["submitted"], to: "under_review", roles: ["admin", "super_admin"], label: "Mulai Verifikasi", requiresNote: false },
  { verdict: "request_revision", from: ["submitted", "under_review"], to: "revision_required", roles: ["admin", "super_admin"], label: "Minta Perbaikan", requiresNote: true },
  { verdict: "approve", from: ["under_review", "submitted"], to: "approved", roles: ["admin", "super_admin"], label: "Setujui Berkas", requiresNote: false },
  { verdict: "forward", from: ["approved"], to: "forwarded_to_kui", roles: ["admin", "super_admin"], label: "Teruskan ke Kemensetneg", requiresNote: false },
  { verdict: "complete", from: ["approved", "forwarded_to_kui"], to: "completed", roles: ["admin", "super_admin"], label: "Selesaikan Program", requiresNote: false },
  { verdict: "reject", from: ["submitted", "under_review"], to: "rejected", roles: ["admin", "super_admin"], label: "Tolak Pengajuan", requiresNote: true },
  { verdict: "resubmit", from: ["revision_required", "draft"], to: "submitted", roles: ["student", "foreign", "lecturer"], label: "Kirim Ulang Berkas", requiresNote: false }
];

export function availableVerdicts(status: ApplicationStatus, role: Role): Rule[] {
  return RULES.filter((rule) => rule.from.includes(status) && rule.roles.includes(role));
}

export function findRule(verdict: Verdict): Rule | undefined {
  return RULES.find((rule) => rule.verdict === verdict);
}

/** The swimlane the berkas currently sits in — shown on the timeline. */
export function desk(status: ApplicationStatus): "Pengaju" | "Verifikator KUI" | "Kemensetneg" | "Selesai" {
  switch (status) {
    case "draft":
    case "revision_required":
      return "Pengaju";
    case "submitted":
    case "under_review":
    case "approved":
      return "Verifikator KUI";
    case "forwarded_to_kui":
      return "Kemensetneg";
    case "completed":
      return "Selesai";
    default:
      return "Verifikator KUI";
  }
}