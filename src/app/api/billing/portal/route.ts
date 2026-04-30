import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getRequestOrigin } from "@/lib/server/auth/app-origin";
import { getStripe } from "@/lib/server/billing/stripe";
import { getUserBillingSnapshot } from "@/lib/server/billing/subscriptions-store";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const snapshot = await getUserBillingSnapshot(session.user.id);
  if (!snapshot.stripeCustomerId) {
    const origin = getRequestOrigin(request);
    return NextResponse.json({
      ok: false,
      error: "no_customer",
      redirectTo: `${origin}/billing`,
    });
  }

  try {
    const stripe = getStripe();
    const origin = getRequestOrigin(request);
    const portal = await stripe.billingPortal.sessions.create({
      customer: snapshot.stripeCustomerId,
      return_url: `${origin}/billing`,
    });
    return NextResponse.json({ ok: true, url: portal.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "portal_failed";
    if (/billing portal|configuration|No configuration provided/i.test(message)) {
      return NextResponse.json(
        {
          ok: false,
          error: "portal_not_configured",
          detail: "Stripe Billing Portal is not configured yet for this account.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ ok: false, error: "portal_failed" }, { status: 502 });
  }
}
