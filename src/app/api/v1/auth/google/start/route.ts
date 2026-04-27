/** Starts Google OAuth (same redirect URI pattern as aria-dapp). */
import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { getRequestOrigin } from "@/lib/server/auth/app-origin";

export const runtime = "nodejs";

const STATE_COOKIE = "template_google_oauth_state";
const STATE_MAX_AGE_SEC = 600;
const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET(request: Request): Promise<NextResponse> {
  const origin = getRequestOrigin(request);
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?google=soon", origin));
  }

  const redirectUri = `${origin}/api/v1/auth/google/callback`;
  const state = randomBytes(24).toString("hex");

  const authUrl = new URL(GOOGLE_AUTH);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("access_type", "online");
  authUrl.searchParams.set("include_granted_scopes", "true");

  const res = NextResponse.redirect(authUrl.toString());
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: STATE_MAX_AGE_SEC,
  });
  return res;
}
