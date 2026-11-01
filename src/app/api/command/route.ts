import { audit, fail, json, requireStaff, requireUser } from "@/lib/api-helpers";
import {
  getApplicationById,
  getStore,
  mutate,
  nextRegisterNo,
  nowISO,
  uid
} from "@/lib/store";
import { EMPTY_REPORT_FACTORY } from "@/lib/command-helpers";
import { findRule, type Verdict } from "@/lib/workflow";
import { isServiceAllowedForEmail } from "@/lib/utils";
import type {
  Application,
  ApplicationStatus,
  Participant,
  ParticipantExpense,
  RequirementDoc,
  Role,
  ServiceKind
} from "@/lib/types";

export const dynamic = "force-dynamic";

type Body = Record<string, unknown>;

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0) => (typeof v === "number" ? v : Number(v) || fallback);

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return fail("Permintaan tidak valid.");
  }
  const action = str(body.action);
  const scope = await requireUser();
  if ("response" in scope) return scope.response;
  const { user } = scope;
  const staff = user.role === "admin" || user.role === "super_admin";

  switch (action) {
    /* ── Applicant writes ─────────────────────────────────────── */
    case "save-draft":
    case "submit": {
      const service = str(body.service) as ServiceKind;
      if (!["outbound", "inbound", "pdln"].includes(service)) return fail("Layanan tidak dikenali.");
      if (!isServiceAllowedForEmail(user.email, service)) {
        return fail(
          "Akun dengan email PNJ (@student.pnj.ac.id / @pnj.ac.id) hanya berwenang mengajukan Outbound dan PDLN. Layanan Inbound dikhususkan bagi mahasiswa/peserta asing.",
          403
        );
      }
      const values = (body.values as Record<string, string>) ?? {};
      const participants = (body.participants as Participant[]) ?? [];
      const docs = (body.docs as RequirementDoc[]) ?? [];
      const requestedId = str(body.applicationId);

      const saved = mutate((store) => {
        let app =
          (requestedId ? store.applications.find((a) => a.id === requestedId && a.ownerId === user.id) : undefined) ??
          store.applications.find((a) => a.ownerId === user.id && a.service === service && a.status === "draft");
        if (!app) {
          const draft: Application = {
            id: uid("app"),
            registerNo: "",
            service,
            ownerId: user.id,
            ownerName: user.fullName,
            ownerEmail: user.email,
            ownerNim: user.nim,
            department: user.department,
            title: "",
            category: "",
            partnerInstitution: "",
            country: "",
            city: "",
            startDate: "",
            endDate: "",
            fundingSource: "beasiswa",
            budget: 0,
            passportNo: "",
            summary: "",
            status: "draft",
            participants: [],
            documents: [],
            revisions: [],
            report: EMPTY_REPORT_FACTORY(),
            setneg: null,
            createdAt: nowISO(),
            updatedAt: nowISO(),
            submittedAt: null
          };
          store.applications.unshift(draft);
          app = draft;
        }

        app.title = str(values.title, app.title);
        app.category = str(values.category, app.category);
        app.partnerInstitution = str(values.partnerInstitution, app.partnerInstitution);
        app.country = str(values.country, app.country);
        app.city = str(values.city, app.city);
        app.startDate = str(values.startDate, app.startDate);
        app.endDate = str(values.endDate, app.endDate);
        app.fundingSource = str(values.fundingSource, app.fundingSource);
        app.budget = num(values.budget, app.budget);
        app.passportNo = str(values.passportNo, app.passportNo);
        app.summary = str(values.summary, app.summary);
        app.updatedAt = nowISO();

        if (Array.isArray(participants) && participants.length) app.participants = participants;
        if (Array.isArray(docs) && docs.length) app.documents = docs;

        if (action === "submit") {
          app.status = app.status === "revision_required" ? "submitted" : "submitted";
          app.submittedAt = nowISO();
          if (!app.registerNo) app.registerNo = nextRegisterNo(service);
          app.documents = app.documents.map((doc) =>
            doc.fileName && doc.status === "pending" ? { ...doc, status: "valid" as const } : doc
          );
        }
        return app;
      });

      audit(user, action === "submit" ? "CREATE" : "UPDATE", `APP/${saved.service.toUpperCase()}/${saved.id}`);
      return json({ ok: true, applicationId: saved.id, registerNo: saved.registerNo, status: saved.status });
    }

    case "report": {
      const app = getApplicationById(str(body.applicationId));
      if (!app) return fail("Pengajuan tidak ditemukan.", 404);
      if (app.ownerId !== user.id && !staff) return fail("Akses ditolak.", 403);
      const expenses = (body.expenses as ParticipantExpense[]) ?? [];
      mutate(() => {
        app.report = {
          fileName: str(body.fileName) || app.report.fileName,
          summary: str(body.summary, app.report.summary),
          submittedAt: nowISO(),
          expenses,
          validatedAt: null
        };
        app.updatedAt = nowISO();
      });
      audit(user, "UPDATE", `APP/${app.registerNo}/REPORT`);
      return json({ ok: true });
    }

    case "profile-save": {
      const nim = str(body.nim).trim();
      const department = str(body.department).trim();
      const phone = str(body.phone).trim();
      const fullName = str(body.fullName).trim();
      mutate((store) => {
        const target = store.users.find((u) => u.id === user.id);
        if (!target) return;
        if (nim) target.nim = nim;
        if (department) {
          target.department = department;
          target.studyProgram = department;
        }
        if (phone) target.phone = phone;
        if (fullName) {
          target.fullName = fullName;
          target.avatarInitials = fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]!.toUpperCase())
            .join("");
        }
      });
      audit(user, "UPDATE", `USER/${user.email}/PROFILE`);
      return json({ ok: true });
    }

    case "ticket-create": {
      const subject = str(body.subject).trim();
      const message = str(body.message).trim();
      if (!subject || !message) return fail("Subjek dan pesan wajib diisi.");
      mutate((store) => {
        store.tickets.unshift({
          id: uid("tkt"),
          fromEmail: user.email,
          fromName: user.fullName,
          subject,
          message,
          createdAt: nowISO(),
          status: "open",
          reply: null
        });
      });
      audit(user, "CREATE", "TICKET");
      return json({ ok: true });
    }

    /* ── Verifier decisions (human swimlane) ──────────────────── */
    case "verify": {
      if (!staff) return fail("Akses verifikator dibutuhkan.", 403);
      const app = getApplicationById(str(body.applicationId));
      if (!app) return fail("Pengajuan tidak ditemukan.", 404);
      const verdict = str(body.verdict) as Verdict;
      const rule = findRule(verdict);
      if (!rule) return fail("Keputusan tidak dikenali.");
      if (!rule.roles.includes(user.role)) return fail("Peran Anda tidak berwenang atas keputusan ini.", 403);
      if (!rule.from.includes(app.status)) return fail(`Status berkas saat ini (${app.status}) tidak dapat menuju keputusan tersebut.`);
      const note = str(body.note).trim();
      if (rule.requiresNote && !note) return fail("Catatan wajib diisi untuk keputusan ini.");

      mutate(() => {
        app.status = rule.to as ApplicationStatus;
        app.updatedAt = nowISO();
        if (rule.verdict === "request_revision" || rule.verdict === "reject") {
          app.revisions.unshift({
            id: uid("rev"),
            target: str(body.target, "berkas"),
            message: note,
            createdAt: nowISO(),
            authorName: user.fullName,
            resolved: false
          });
        }
        if (rule.verdict === "resubmit") {
          app.revisions = app.revisions.map((r) => ({ ...r, resolved: true }));
        }
      });
      audit(user, "STATUS_CHANGE", `APP/${app.registerNo} → ${app.status}`);
      return json({ ok: true, status: app.status });
    }

    case "setneg": {
      if (!staff) return fail("Akses verifikator dibutuhkan.", 403);
      const app = getApplicationById(str(body.applicationId));
      if (!app) return fail("Pengajuan tidak ditemukan.", 404);
      mutate(() => {
        app.setneg = {
          letterNo: str(body.letterNo),
          issuedAt: str(body.issuedAt) || nowISO(),
          fileName: str(body.fileName) || "SP-Setneg.pdf",
          valid: true
        };
        app.status = "forwarded_to_kui";
        app.updatedAt = nowISO();
      });
      audit(user, "UPDATE", `APP/${app.registerNo}/SETNEG`);
      return json({ ok: true });
    }

    case "validate-report": {
      if (!staff) return fail("Akses verifikator dibutuhkan.", 403);
      const app = getApplicationById(str(body.applicationId));
      if (!app) return fail("Pengajuan tidak ditemukan.", 404);
      mutate(() => {
        app.report.validatedAt = nowISO();
        app.updatedAt = nowISO();
      });
      audit(user, "UPDATE", `APP/${app.registerNo}/REPORT-VALIDATED`);
      return json({ ok: true });
    }

    /* ── CMS ──────────────────────────────────────────────────── */
    case "faq-save": {
      if (!staff) return fail("Akses verifikator dibutuhkan.", 403);
      const id = str(body.id);
      mutate((store) => {
        if (id) {
          const target = store.faqs.find((f) => f.id === id);
          if (target) {
            target.question = str(body.question, target.question);
            target.answer = str(body.answer, target.answer);
            target.topic = str(body.topic, target.topic);
          }
        } else {
          store.faqs.unshift({
            id: uid("faq"),
            question: str(body.question),
            answer: str(body.answer),
            topic: str(body.topic) || "Umum"
          });
        }
      });
      audit(user, id ? "UPDATE" : "CREATE", "FAQ");
      return json({ ok: true });
    }

    case "faq-delete": {
      if (!staff) return fail("Akses verifikator dibutuhkan.", 403);
      const id = str(body.id);
      mutate((store) => {
        store.faqs = store.faqs.filter((f) => f.id !== id);
      });
      audit(user, "DELETE", `FAQ/${id}`);
      return json({ ok: true });
    }

    case "announcement-save": {
      if (!staff) return fail("Akses verifikator dibutuhkan.", 403);
      const id = str(body.id);
      mutate((store) => {
        if (id) {
          const target = store.announcements.find((a) => a.id === id);
          if (target) {
            target.title = str(body.title, target.title);
            target.excerpt = str(body.excerpt, target.excerpt);
            target.body = str(body.body, target.body);
            target.tag = str(body.tag, target.tag);
            target.pinned = Boolean(body.pinned ?? target.pinned);
          }
        } else {
          store.announcements.unshift({
            id: uid("ann"),
            title: str(body.title),
            excerpt: str(body.excerpt),
            body: str(body.body),
            tag: str(body.tag) || "Umum",
            pinned: Boolean(body.pinned),
            publishedAt: nowISO()
          });
        }
      });
      audit(user, id ? "UPDATE" : "CREATE", "ANNOUNCEMENT");
      return json({ ok: true });
    }

    case "announcement-delete": {
      if (!staff) return fail("Akses verifikator dibutuhkan.", 403);
      const id = str(body.id);
      mutate((store) => {
        store.announcements = store.announcements.filter((a) => a.id !== id);
      });
      audit(user, "DELETE", `ANNOUNCEMENT/${id}`);
      return json({ ok: true });
    }

    case "ticket-reply": {
      if (!staff) return fail("Akses verifikator dibutuhkan.", 403);
      const id = str(body.id);
      mutate((store) => {
        const target = store.tickets.find((t) => t.id === id);
        if (target) {
          target.reply = str(body.reply);
          target.status = "answered";
        }
      });
      audit(user, "UPDATE", `TICKET/${id}`);
      return json({ ok: true });
    }

    /* ── Super admin ──────────────────────────────────────────── */
    case "role-change": {
      if (user.role !== "super_admin") return fail("Hanya Super Admin yang dapat mengubah peran.", 403);
      const userId = str(body.userId);
      const role = str(body.role) as Role;
      if (!["student", "foreign", "lecturer", "admin", "super_admin"].includes(role)) return fail("Peran tidak valid.");
      mutate((store) => {
        const target = store.users.find((u) => u.id === userId);
        if (target) target.role = role;
      });
      audit(user, "ROLE_CHANGE", `USER/${userId} → ${role}`);
      return json({ ok: true });
    }

    case "settings-save": {
      if (user.role !== "super_admin") return fail("Hanya Super Admin yang dapat mengubah parameter sistem.", 403);
      const patch = (body.settings as Record<string, unknown>) ?? {};
      mutate((store) => {
        store.settings = {
          ...store.settings,
          quotaOutbound: num(patch.quotaOutbound, store.settings.quotaOutbound),
          quotaInbound: num(patch.quotaInbound, store.settings.quotaInbound),
          quotaPdln: num(patch.quotaPdln, store.settings.quotaPdln),
          verificationSlaDays: num(patch.verificationSlaDays, store.settings.verificationSlaDays),
          openOutbound: Boolean(patch.openOutbound ?? store.settings.openOutbound),
          openInbound: Boolean(patch.openInbound ?? store.settings.openInbound),
          openPdln: Boolean(patch.openPdln ?? store.settings.openPdln),
          announcementBanner: str(patch.announcementBanner, store.settings.announcementBanner)
        };
      });
      audit(user, "UPDATE", "SETTINGS");
      return json({ ok: true });
    }

    default:
      return fail("Aksi tidak dikenali.", 400);
  }
}