import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";

// Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (same
// execution model — runs before rendering, Node.js runtime by default here,
// which is why ioredis/jose "just work" without an edge-runtime workaround).

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/buy-gold",
  "/sell-gold",
  "/wallet",
  "/transactions",
  "/kyc",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const { allowed } = await checkRateLimit(`${ip}:${pathname}`, 60, 60);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests, please slow down" },
        { status: 429 }
      );
    }
    return NextResponse.next();
  }

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isProtectedRoute =
    isAdminRoute || PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isProtectedRoute) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/buy-gold/:path*",
    "/sell-gold/:path*",
    "/wallet/:path*",
    "/transactions/:path*",
    "/kyc/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
};
