import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/** HTTP-only session after Google OAuth (signed payload, no DB). */
export const TEMPLATE_GOOGLE_SESSION_COOKIE = "template_google_session";

const SESSION_DAYS = 7;

type SessionPayload = {
  googleSub: string;
  email: string | null;
  exp: number;
};

function signingSecret(): string | null {
  const secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  if (!secret) {
    return null;
  }
  return createHmac("sha256", secret).update("template-google-session-v1").digest("hex");
}

function signPayload(payload: SessionPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function parseAndVerify(token: string, secret: string): SessionPayload | null {
  const dot = token.indexOf(".");
  if (dot < 1) {
    return null;
  }
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!body || !sig) {
    return null;
  }
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const json = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (
      typeof json.googleSub !== "string" ||
      typeof json.exp !== "number" ||
      (json.email !== null && typeof json.email !== "string")
    ) {
      return null;
    }
    if (json.exp < Date.now() / 1000) {
      return null;
    }
    return json;
  } catch {
    return null;
  }
}

export function templateGoogleSessionMaxAgeSec(): number {
  return 60 * 60 * 24 * SESSION_DAYS;
}

export function setTemplateGoogleSessionCookie(
  res: NextResponse,
  googleSub: string,
  email: string | null
): void {
  const secret = signingSecret();
  if (!secret) {
    return;
  }
  const exp = Math.floor(Date.now() / 1000) + templateGoogleSessionMaxAgeSec();
  const token = signPayload({ googleSub, email, exp }, secret);
  res.cookies.set(TEMPLATE_GOOGLE_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: templateGoogleSessionMaxAgeSec(),
  });
}

export function clearTemplateGoogleSessionCookie(res: NextResponse): void {
  res.cookies.set(TEMPLATE_GOOGLE_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getTemplateGoogleSession(): Promise<{
  googleSub: string;
  email: string | null;
} | null> {
  const secret = signingSecret();
  if (!secret) {
    return null;
  }
  const jar = await cookies();
  const raw = jar.get(TEMPLATE_GOOGLE_SESSION_COOKIE)?.value?.trim();
  if (!raw) {
    return null;
  }
  const payload = parseAndVerify(raw, secret);
  if (!payload) {
    return null;
  }
  return { googleSub: payload.googleSub, email: payload.email };
}
