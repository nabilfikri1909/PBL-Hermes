import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

/**
 * One logout path, three callers (site header menu, app shell sidebar,
 * a plain form fallback). Browser navigations get a 303 back to the home
 * page; fetch callers get JSON so they can route client-side.
 */
function wantsJson(request: Request) {
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("application/json");
}

export async function POST(request: Request) {
  await clearSessionCookie();
  if (wantsJson(request)) {
    return NextResponse.json(
      { ok: true, redirect: "/" },
      { headers: { "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate" } }
    );
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}

export async function GET(request: Request) {
  await clearSessionCookie();
  if (wantsJson(request)) {
    return NextResponse.json({ ok: true, redirect: "/" }, { headers: { "Cache-Control": "private, no-store" } });
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}