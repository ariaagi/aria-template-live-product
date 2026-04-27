/** Google OAuth callback — token exchange, signed session cookie, redirect dashboard. */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getRequestOrigin } from "@/lib/server/auth/app-origin";
import { setTemplateGoogleSessionCookie } from "@/lib/server/auth/template-google-session";

export const runtime = "nodejs";

const STATE_COOKIE = "template_google_oauth_state";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO = "https://www.googleapis.com/oauth2/v3/userinfo";

function clearStateCookie(res: NextResponse): void {
  res.cookies.set(STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
};

export async function GET(request: Request): Promise<NextResponse> {
  const origin = getRequestOrigin(request);
  const url = new URL(request.url);
  const code = url.searchParams.get("code")?.trim();
  const state = url.searchParams.get("state")?.trim();
  const oauthError = url.searchParams.get("error")?.trim();

  const redirectLogin = (q: string): NextResponse => {
    const res = NextResponse.redirect(new URL(`/login?google=${q}`, origin));
    clearStateCookie(res);
    return res;
  };

  try {
    if (oauthError) {
      return redirectLogin("error");
    }

    const jar = await cookies();
    const saved = jar.get(STATE_COOKIE)?.value?.trim();
    if (!code || !state || !saved || state !== saved) {
      return redirectLogin("error");
    }

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret) {
      return redirectLogin("soon");
    }

    const redirectUri = `${origin}/api/v1/auth/google/callback`;
    const body = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch(GOOGLE_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const tokenJson = (await tokenRes.json().catch(() => null)) as {
      access_token?: string;
      error?: string;
    } | null;

    if (!tokenRes.ok || !tokenJson?.access_token) {
      return redirectLogin("error");
    }

    const uRes = await fetch(GOOGLE_USERINFO, {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    const uJson = (await uRes.json().catch(() => null)) as GoogleUserInfo | null;
    const googleSub = typeof uJson?.sub === "string" ? uJson.sub.trim() : "";
    const email = typeof uJson?.email === "string" ? uJson.email.trim() : null;
    if (!googleSub) {
      return redirectLogin("error");
    }

    const res = NextResponse.redirect(new URL("/dashboard", origin));
    setTemplateGoogleSessionCookie(res, googleSub, email);
    clearStateCookie(res);
    return res;
  } catch {
    return redirectLogin("error");
  }
}
