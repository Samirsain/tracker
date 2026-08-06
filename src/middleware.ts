import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authConfig } from "@/lib/auth.config";

// Middleware runs on the Edge runtime, so it uses a lightweight NextAuth
// instance (no Prisma adapter, no Node-only providers) built from the
// shared edge-safe config, instead of importing the full auth.ts.
const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/login", "/api/auth"];

// req.nextUrl.origin is the *internal* origin behind Vercel's proxy — it
// resolves to http://localhost:3000 in production, which sent every redirect
// to a dead address. The public origin only exists in the forwarded headers.
function publicOrigin(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return req.nextUrl.origin;
  const proto = req.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!req.auth && !isPublic) {
    // API routes get a real status code — redirecting a fetch/POST to an HTML
    // login page surfaces as an unparseable response on the client.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", publicOrigin(req));
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", publicOrigin(req)));
  }

  if (pathname.startsWith("/settings") && req.auth?.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", publicOrigin(req)));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
