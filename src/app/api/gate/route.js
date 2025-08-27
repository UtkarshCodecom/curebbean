export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST(req) {
  let pw = "";
  try {
    const body = await req.json();
    pw = (body?.pw ?? "").trim();
  } catch {}

  const expected = (process.env.MVP_REVIEW_PASSWORD ?? "").trim();
  if (!expected) {
    return NextResponse.json({ ok: false, error: "PASSWORD_NOT_SET" }, { status: 500 });
  }
  if (pw !== expected) {
    return NextResponse.json({ ok: false, error: "INVALID_PASSWORD" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("mvp_pass", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // allow localhost http
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}
