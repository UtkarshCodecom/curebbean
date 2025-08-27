import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Protect all /check/* except the gate page itself (/check)
  const isCheckArea = path.startsWith("/check");
  const isGatePage = path === "/check";

  if (isCheckArea && !isGatePage) {
    const hasPass = req.cookies.get("mvp_pass")?.value === "1";
    if (!hasPass) {
      const to = new URL("/check", url);
      // remember where they wanted to go
      to.searchParams.set("next", path + (url.search || ""));
      return NextResponse.redirect(to);
    }
  }

  return NextResponse.next();
}

// run only on /check/**
export const config = {
  matcher: ["/check/:path*"],
};
