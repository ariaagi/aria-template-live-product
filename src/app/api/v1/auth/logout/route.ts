import { NextResponse } from "next/server";

import { getRequestOrigin } from "@/lib/server/auth/app-origin";
import { clearTemplateGoogleSessionCookie } from "@/lib/server/auth/template-google-session";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<NextResponse> {
  const origin = getRequestOrigin(request);
  const res = NextResponse.redirect(new URL("/login", origin));
  clearTemplateGoogleSessionCookie(res);
  return res;
}
