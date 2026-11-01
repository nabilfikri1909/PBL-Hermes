import { NextResponse } from "next/server";
import { findUserByEmail, mutate, nowISO, uid, addAudit } from "@/lib/store";
import { setSessionCookie } from "@/lib/auth";
import { clientIp } from "@/lib/api-helpers";
import type { User } from "@/lib/types";

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = (await request.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 });
  }

  const fullName = (body.fullName ?? "").trim();
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  const nim = (body.nim ?? "").trim();
  const department = (body.department ?? "").trim();
  const phone = (body.phone ?? "").trim();

  if (!fullName || !email || password.length < 6) {
    return NextResponse.json({ ok: false, error: "Nama, email, dan kata sandi minimal 6 karakter wajib diisi." }, { status: 400 });
  }
  if (findUserByEmail(email)) {
    return NextResponse.json({ ok: false, error: "Email sudah terdaftar. Gunakan halaman masuk." }, { status: 409 });
  }

  const record: User & { password: string } = {
    id: uid("usr"),
    fullName,
    email,
    role: "student",
    nim: nim || null,
    department: department || "Belum diisi",
    studyProgram: department || "Belum diisi",
    phone,
    nationality: "Indonesia",
    avatarInitials: fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join(""),
    createdAt: nowISO(),
    password
  };

  mutate((store) => {
    store.users.push(record);
  });
  await setSessionCookie(record.id);
  addAudit({
    actorEmail: record.email,
    actorRole: "student",
    action: "CREATE",
    entity: `USER/${record.email}`,
    ip: clientIp(request),
    outcome: "success"
  });

  return NextResponse.json({ ok: true, redirect: nim && department ? "/dashboard" : "/onboarding" });
}