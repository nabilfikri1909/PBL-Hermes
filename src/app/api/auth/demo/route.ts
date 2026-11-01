import { NextResponse } from "next/server";
import { findUserByEmail, addAudit, getStore } from "@/lib/store";
import { homeForRole, setSessionCookie } from "@/lib/auth";
import { clientIp } from "@/lib/api-helpers";
import type { Role } from "@/lib/types";

const DEMO_BY_ROLE: Record<Role, string> = {
  student: "nabil@student.pnj.ac.id",
  foreign: "emma@lund.se",
  lecturer: "bagus@pnj.ac.id",
  admin: "rina@kui.pnj.ac.id",
  super_admin: "hendra@kui.pnj.ac.id"
};

export async function POST(request: Request) {
  let role: Role = "student";
  try {
    const body = (await request.json()) as { role?: Role };
    if (body.role && body.role in DEMO_BY_ROLE) role = body.role;
  } catch {
    /* default student */
  }

  getStore();
  const user = findUserByEmail(DEMO_BY_ROLE[role]);
  if (!user) return NextResponse.json({ ok: false, error: "Akun demo tidak tersedia." }, { status: 404 });

  await setSessionCookie(user.id);
  addAudit({
    actorEmail: user.email,
    actorRole: user.role,
    action: "LOGIN",
    entity: `AUTH/DEMO_SWITCH/${role}`,
    ip: clientIp(request),
    outcome: "success"
  });

  return NextResponse.json({ ok: true, redirect: homeForRole(user.role), user: { fullName: user.fullName, role: user.role } });
}