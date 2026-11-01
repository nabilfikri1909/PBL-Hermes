import "server-only";
import { NextResponse } from "next/server";
import type { Role, ServiceKind } from "./types";
import { getSessionUser, type SessionUser } from "./auth";
import { addAudit, getStore } from "./store";

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
      ...(init?.headers ?? {})
    }
  });
}

export function fail(message: string, status = 400) {
  return json({ ok: false, error: message }, { status });
}

export async function requireUser(): Promise<{ user: SessionUser } | { response: NextResponse }> {
  const user = await getSessionUser();
  if (!user) return { response: fail("Sesi tidak ditemukan. Silakan masuk kembali.", 401) };
  return { user };
}

export async function requireStaff(): Promise<{ user: SessionUser } | { response: NextResponse }> {
  const user = await getSessionUser();
  if (!user) return { response: fail("Sesi tidak ditemukan. Silakan masuk kembali.", 401) };
  if (user.role !== "admin" && user.role !== "super_admin") {
    return { response: fail("Akses verifikator dibutuhkan untuk aksi ini.", 403) };
  }
  return { user };
}

export async function requireSuperAdmin(): Promise<{ user: SessionUser } | { response: NextResponse }> {
  const scope = await requireStaff();
  if ("response" in scope) return scope;
  if (scope.user.role !== "super_admin") {
    return { response: fail("Hanya Super Admin yang dapat melakukan aksi ini.", 403) };
  }
  return scope;
}

export function audit(
  user: SessionUser,
  action: "CREATE" | "UPDATE" | "STATUS_CHANGE" | "DELETE" | "DOWNLOAD" | "LOGIN" | "LOGIN_FAILED" | "ROLE_CHANGE",
  entity: string,
  ip = "10.20.0.1"
) {
  addAudit({ actorEmail: user.email, actorRole: user.role as Role, action, entity, ip, outcome: "success" });
}

export function clientIp(request: Request) {
  const header = request.headers.get("x-forwarded-for") ?? "";
  return header.split(",")[0]?.trim() || "127.0.0.1";
}

export function settings() {
  return getStore().settings;
}

export function parseService(value: unknown): ServiceKind | null {
  return value === "outbound" || value === "inbound" || value === "pdln" ? value : null;
}