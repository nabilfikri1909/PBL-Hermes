import { NextResponse } from "next/server";
import { findUserByEmail, addAudit, getStore } from "@/lib/store";
import { setSessionCookie, homeForRole } from "@/lib/auth";
import { clientIp } from "@/lib/api-helpers";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email dan kata sandi wajib diisi." }, { status: 400 });
  }

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    addAudit({
      actorEmail: email,
      actorRole: "student",
      action: "LOGIN_FAILED",
      entity: "AUTH",
      ip: clientIp(request),
      outcome: "failure"
    });
    return NextResponse.json({ ok: false, error: "Kombinasi email dan kata sandi tidak cocok." }, { status: 401 });
  }

  await setSessionCookie(user.id);
  addAudit({
    actorEmail: user.email,
    actorRole: user.role,
    action: "LOGIN",
    entity: "AUTH",
    ip: clientIp(request),
    outcome: "success"
  });
  getStore();
  return NextResponse.json({ ok: true, redirect: homeForRole(user.role) });
}