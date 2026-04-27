import { NextRequest, NextResponse } from "next/server";
import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

export default function proxy(request: NextRequest) {
  const bypass = process.env.E2E_BYPASS_AUTH === "true";
  const hasNeonAuth = Boolean(process.env.NEON_AUTH_BASE_URL);

  if (bypass || !hasNeonAuth) {
    return NextResponse.next();
  }

  const protectedMiddleware = neonAuthMiddleware({
    loginUrl: "/login",
  });

  return protectedMiddleware(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/billing/:path*", "/settings/:path*"],
};
