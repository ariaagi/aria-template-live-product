import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getUserBillingSnapshot } from "@/lib/server/billing/subscriptions-store";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const snapshot = await getUserBillingSnapshot(session.user.id);
  return NextResponse.json({ ok: true, ...snapshot });
}
