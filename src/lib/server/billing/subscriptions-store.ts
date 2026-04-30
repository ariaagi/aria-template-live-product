import type Stripe from "stripe";

import { getDbPool } from "@/lib/db";
import { getStripe, toDateFromUnix } from "@/lib/server/billing/stripe";

/**
 * Merge webhook subscription payloads with a fresh Stripe retrieve so fields like
 * `cancel_at_period_end` and metadata are complete.
 *
 * Some flows (e.g. Billing Portal) deliver updated subscription state while the
 * webhook `metadata.user_id` key can be missing or empty; we then resolve the user by
 * `user.stripe_customer_id` after checkout linked the Stripe customer.
 */
export async function upsertSubscriptionFromStripeWebhookEvent(
  subscriptionFromEvent: Stripe.Subscription
): Promise<void> {
  const stripe = getStripe();
  let subscription = subscriptionFromEvent;
  try {
    subscription = await stripe.subscriptions.retrieve(subscriptionFromEvent.id);
  } catch {
    /* use event object if retrieve fails */
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;
  if (!customerId) return;

  let userId = typeof subscription.metadata?.user_id === "string"
    ? subscription.metadata.user_id.trim()
    : "";
  if (!userId) {
    const pool = getDbPool();
    const { rows } = await pool.query<{ id: string }>(
      `SELECT id FROM "user" WHERE stripe_customer_id = $1 LIMIT 1`,
      [customerId]
    );
    userId = rows[0]?.id ?? "";
  }
  if (!userId) return;

  await upsertSubscriptionFromStripe(userId, customerId, subscription);
}

function tierSlugFromSubscription(subscription: Stripe.Subscription): string | null {
  const item = subscription.items.data[0];
  const fromMetadata = subscription.metadata?.tier_slug?.trim();
  if (fromMetadata) return fromMetadata;
  const fromPrice = item?.price?.metadata?.tier_slug?.trim();
  if (fromPrice) return fromPrice;
  return null;
}

export async function upsertSubscriptionFromStripe(
  userId: string,
  customerId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const pool = getDbPool();
  const item = subscription.items.data[0];
  const stripePriceId = item?.price?.id ?? null;
  const tierSlug = tierSlugFromSubscription(subscription);
  const currentPeriodEnd = toDateFromUnix(item?.current_period_end ?? null);

  await pool.query(
    `UPDATE "user"
     SET stripe_customer_id = $2, "updatedAt" = now()
     WHERE id = $1`,
    [userId, customerId]
  );

  await pool.query(
    `INSERT INTO "subscriptions" (
      id,
      user_id,
      stripe_subscription_id,
      stripe_price_id,
      tier_slug,
      status,
      current_period_end,
      cancel_at_period_end,
      created_at,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, now(), now()
    )
    ON CONFLICT (stripe_subscription_id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      stripe_price_id = EXCLUDED.stripe_price_id,
      tier_slug = EXCLUDED.tier_slug,
      status = EXCLUDED.status,
      current_period_end = EXCLUDED.current_period_end,
      cancel_at_period_end = EXCLUDED.cancel_at_period_end,
      updated_at = now()`,
    [
      subscription.id,
      userId,
      subscription.id,
      stripePriceId,
      tierSlug,
      subscription.status,
      currentPeriodEnd,
      subscription.cancel_at_period_end,
    ]
  );
}

export async function markSubscriptionDeleted(subscriptionId: string): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    `UPDATE "subscriptions"
     SET status = 'canceled', updated_at = now()
     WHERE stripe_subscription_id = $1`,
    [subscriptionId]
  );
}

export async function getUserBillingSnapshot(userId: string): Promise<{
  stripeCustomerId: string | null;
  subscription: {
    status: string;
    tierSlug: string | null;
    stripePriceId: string | null;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
  } | null;
}> {
  const pool = getDbPool();
  const { rows: userRows } = await pool.query<{ stripe_customer_id: string | null }>(
    `SELECT stripe_customer_id FROM "user" WHERE id = $1 LIMIT 1`,
    [userId]
  );
  const { rows: subRows } = await pool.query<{
    status: string;
    tier_slug: string | null;
    stripe_price_id: string | null;
    cancel_at_period_end: boolean;
    current_period_end: Date | null;
  }>(
    `SELECT status, tier_slug, stripe_price_id, cancel_at_period_end, current_period_end
     FROM "subscriptions"
     WHERE user_id = $1
     ORDER BY updated_at DESC
     LIMIT 1`,
    [userId]
  );
  const sub = subRows[0];
  return {
    stripeCustomerId: userRows[0]?.stripe_customer_id ?? null,
    subscription: sub
      ? {
          status: sub.status,
          tierSlug: sub.tier_slug,
          stripePriceId: sub.stripe_price_id,
          cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
          currentPeriodEnd: sub.current_period_end
            ? sub.current_period_end.toISOString()
            : null,
        }
      : null,
  };
}
