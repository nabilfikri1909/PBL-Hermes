import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role, User } from "./types";
import { findUserById } from "./store";

const COOKIE = "pnj_session";
const SECRET = process.env.PNJ_SESSION_SECRET ?? "pnj-kui-adsi-kelompok-6-dev-secret";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
}

export function makeToken(userId: string) {
  return `${userId}.${sign(userId)}`;
}

export function parseToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [userId, mac] = token.split(".");
  if (!userId || !mac) return null;
  return sign(userId) === mac ? userId : null;
}

/** Full record minus the password. */
export type SessionUser = Omit<User, never>;

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const userId = parseToken(jar.get(COOKIE)?.value);
  if (!userId) return null;
  const record = findUserById(userId);
  if (!record) return null;
  const { password: _password, ...user } = record;
  return user;
}

export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, makeToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function isStaff(role: Role | undefined | null) {
  return role === "admin" || role === "super_admin";
}

export function homeForRole(role: Role) {
  return isStaff(role) ? "/admin" : "/dashboard";
}

/** Page-level guard: session + staff role, redirecting when either fails. */
export async function requireStaffPage(nextPath: string) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${nextPath}`);
  if (!isStaff(user.role)) redirect("/dashboard");
  return user;
}