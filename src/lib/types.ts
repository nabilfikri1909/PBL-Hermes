/* ═══════════════════════════════════════════════════════════════
   Domain contracts — one type per ERD entity, plus workflow enums.
   Nothing here is decorative: every field is read by a page.
   ═══════════════════════════════════════════════════════════════ */

export type Role = "student" | "foreign" | "lecturer" | "admin" | "super_admin";

export type ServiceKind = "outbound" | "inbound" | "pdln";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "revision_required"
  | "approved"
  | "forwarded_to_kui"
  | "completed"
  | "rejected";

export type DocStatus = "pending" | "valid" | "revision";

/* ── Pengguna ─────────────────────────────────────────────── */
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  nim: string | null;
  department: string;
  studyProgram: string;
  phone: string;
  nationality: string;
  avatarInitials: string;
  createdAt: string;
}

/* ── Peserta_Delegasi ─────────────────────────────────────── */
export interface Participant {
  id: string;
  fullName: string;
  /** Never serialised to a public page. */
  passportNo: string;
  role: "Ketua Delegasi" | "Anggota" | "Pendamping";
  institution: string;
  /** Only names + verification status reach the public modal. */
  docStatus: DocStatus;
}

/* ── Dokumen_Persyaratan ──────────────────────────────────── */
export interface RequirementDoc {
  id: string;
  /** Matches a key in FORM_DEFS so the wizard and the list agree. */
  slot: string;
  label: string;
  fileName: string | null;
  sizeLabel: string | null;
  status: DocStatus;
  uploadedAt: string | null;
  /** Verifier note, shown to the applicant only when status === "revision". */
  note?: string;
}

/* ── Biaya_Peserta (3NF, one row per participant) ─────────── */
export interface ParticipantExpense {
  participantId: string;
  ticket: number;
  accommodation: number;
  dailyAllowance: number;
  insurance: number;
  other: number;
}

/* ── Laporan_Akhir ────────────────────────────────────────── */
export interface FinalReport {
  fileName: string | null;
  summary: string;
  submittedAt: string | null;
  expenses: ParticipantExpense[];
  validatedAt: string | null;
}

/* ── Catatan_Revisi ───────────────────────────────────────── */
export interface RevisionNote {
  id: string;
  /** Which doc slot or form field the note is attached to. */
  target: string;
  message: string;
  createdAt: string;
  authorName: string;
  resolved: boolean;
}

/* ── SP_Setneg ────────────────────────────────────────────── */
export interface SetnegApproval {
  letterNo: string;
  issuedAt: string;
  fileName: string;
  valid: boolean;
}

/* ── Pengajuan (all three services share one record) ──────── */
export interface Application {
  id: string;
  registerNo: string;
  service: ServiceKind;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerNim: string | null;
  department: string;
  title: string;
  category: string;
  partnerInstitution: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  fundingSource: string;
  budget: number;
  passportNo: string;
  summary: string;
  status: ApplicationStatus;
  participants: Participant[];
  documents: RequirementDoc[];
  revisions: RevisionNote[];
  report: FinalReport;
  setneg: SetnegApproval | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
}

/* ── Audit log (append-only) ──────────────────────────────── */
export interface AuditEntry {
  id: string;
  at: string;
  actorEmail: string;
  actorRole: Role;
  action:
    | "CREATE"
    | "UPDATE"
    | "STATUS_CHANGE"
    | "DELETE"
    | "DOWNLOAD"
    | "LOGIN"
    | "LOGIN_FAILED"
    | "ROLE_CHANGE";
  entity: string;
  ip: string;
  outcome: "success" | "failure";
}

/* ── CMS content ──────────────────────────────────────────── */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  topic: string;
}

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  pinned: boolean;
  tag: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  service: ServiceKind;
  format: "PDF" | "DOCX" | "XLSX";
  sizeLabel: string;
  version: string;
  description: string;
  fileName?: string;
}

export interface HelpTicket {
  id: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "open" | "answered";
  reply: string | null;
}

/* ── Country (hydration-safe canonical list) ──────────────── */
export interface Country {
  code: string;
  /** Canonical label — identical on server and client. */
  name: string;
  region: string;
}

/* ── Letter formats rendered by the A4 engine ─────────────── */
export type LetterKind =
  | "outbound-passport"
  | "outbound-visa"
  | "outbound-financial"
  | "inbound-loa"
  | "inbound-visa"
  | "inbound-certificate"
  | "pdln-director"
  | "pdln-delegation"
  | "pdln-sptjm";
