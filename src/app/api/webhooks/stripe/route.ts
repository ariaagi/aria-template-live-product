import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { requireStripeWebhookSecret } from "@/lib/env";
import { getStripe } from "@/lib/server/billing/stripe";
import {
  markSubscriptionDeleted,
  upsertSubscriptionFromStripe,
  upsertSubscriptionFromStripeWebhookEvent,
} from "@/lib/server/billing/subscriptions-store";

export const runtime = "nodejs";

function userIdFromMetadata(
  metadata: Stripe.Metadata | null | undefined
): string | null {
  const v = metadata?.user_id;
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t || null;
}

export async function POST(request: Request): Promise<NextResponse> {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, error: "missing_signature" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      requireStripeWebhookSecret()
    );
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = userIdFromMetadata(session.metadata);
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (userId && customerId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await upsertSubscriptionFromStripe(userId, customerId, subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripeWebhookEvent(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await markSubscriptionDeleted(subscription.id);
        break;
      }
      case "invoice.paid":
      case "invoice.payment_failed":
      default:
        break;
    }
  } catch {
    return NextResponse.json({ ok: false, error: "webhook_process_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
