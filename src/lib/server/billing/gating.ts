import { getBuildConfig } from "@/config/build-config";
import { getUserBillingSnapshot } from "@/lib/server/billing/subscriptions-store";

const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
]);

export async function canUserRunProtectedAction(userId: string): Promise<boolean> {
  const config = getBuildConfig();
  const requiresSubscription =
    config.gating?.requireActiveSubscriptionForProtectedActions === true ||
    config.monetizationMode === "paid_only";
  if (!requiresSubscription) {
    return true;
  }

  const snapshot = await getUserBillingSnapshot(userId);
  const status = snapshot.subscription?.status?.trim().toLowerCase();
  return Boolean(status && ACTIVE_SUBSCRIPTION_STATUSES.has(status));
}
