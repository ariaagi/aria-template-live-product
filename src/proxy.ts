import { NextRequest, NextResponse } from "next/server";

/**
 * App routes enforce auth in `(app)/layout.tsx`. Middleware stays a no-op so we
 * do not duplicate cookie/session logic here.
 */
export default function proxy(request: NextRequest): NextResponse {
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/billing/:path*", "/settings/:path*"],
};
