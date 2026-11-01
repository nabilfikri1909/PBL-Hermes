import { fail, json, requireStaff, requireUser } from "@/lib/api-helpers";
import { getApplicationById, getStore, listApplications } from "@/lib/store";
import { computeStats, publicPdlNRow } from "@/lib/stats";
import type { Application } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") ?? "";
  const store = getStore();

  /* Public endpoints — sanitised payloads, no session required. */
  if (kind === "public-pdln") {
    const rows = listApplications()
      .filter((a) => a.service === "pdln" && a.status !== "draft")
      .map(publicPdlNRow);
    return json({ ok: true, rows });
  }
  if (kind === "faqs") return json({ ok: true, rows: store.faqs });
  if (kind === "announcements") return json({ ok: true, rows: store.announcements });
  if (kind === "templates") return json({ ok: true, rows: store.templates });
  if (kind === "settings-public") {
    const s = store.settings;
    return json({
      ok: true,
      row: {
        openOutbound: s.openOutbound,
        openInbound: s.openInbound,
        openPdln: s.openPdln,
        announcementBanner: s.announcementBanner
      }
    });
  }
  if (kind === "landing-stats") {
    const apps = listApplications();
    return json({
      ok: true,
      row: {
        applications: apps.length,
        approved: apps.filter((a) => a.status === "approved" || a.status === "completed").length,
        countries: new Set(apps.map((a) => a.country)).size,
        participants: apps.reduce((sum, a) => sum + Math.max(1, a.participants.length), 0)
      }
    });
  }

  /* Everything below requires a session. */
  const scope = await requireUser();
  if ("response" in scope) return scope.response;
  const { user } = scope;
  const staff = user.role === "admin" || user.role === "super_admin";

  switch (kind) {
    case "applications": {
      const service = url.searchParams.get("service");
      const status = url.searchParams.get("status");
      const q = (url.searchParams.get("q") ?? "").toLowerCase();
      let rows: Application[] = staff ? listApplications() : listApplications().filter((a) => a.ownerId === user.id);
      if (service) rows = rows.filter((a) => a.service === service);
      if (status) rows = rows.filter((a) => a.status === status);
      if (q) rows = rows.filter((a) => `${a.title} ${a.registerNo} ${a.partnerInstitution} ${a.ownerName}`.toLowerCase().includes(q));
      return json({ ok: true, rows });
    }
    case "application": {
      const app = getApplicationById(url.searchParams.get("id") ?? "");
      if (!app) return fail("Pengajuan tidak ditemukan.", 404);
      if (!staff && app.ownerId !== user.id) return fail("Anda tidak berhak membuka pengajuan ini.", 403);
      return json({ ok: true, row: app });
    }
    case "stats": {
      if (!staff) return fail("Statistik hanya untuk verifikator.", 403);
      return json({ ok: true, row: computeStats() });
    }
    case "my-stats": {
      const mine = listApplications().filter((a) => a.ownerId === user.id);
      return json({ ok: true, row: computeStats(mine) });
    }
    case "audit": {
      if (!staff) return fail("Log audit hanya untuk verifikator.", 403);
      return json({ ok: true, rows: store.audit });
    }
    case "users": {
      if (!staff) return fail("Akses ditolak.", 403);
      const rows = store.users.map(({ password: _password, ...rest }) => rest);
      return json({ ok: true, rows });
    }
    case "questions": {
      const rows = staff ? store.tickets : store.tickets.filter((t) => t.fromEmail === user.email);
      return json({ ok: true, rows });
    }
    case "settings": {
      if (!staff) return fail("Akses ditolak.", 403);
      return json({ ok: true, row: store.settings });
    }
    default:
      return fail("Parameter kind tidak dikenali.", 400);
  }
}

export async function POST() {
  const scope = await requireStaff();
  if ("response" in scope) return scope.response;
  return json({ ok: true });
}