 "use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BuildConfig, BuildPlanConfig } from "@/types/build-config";

type BillingStatus = {
  status: string;
  tierSlug: string | null;
  stripePriceId: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
} | null;

type ApiJson = {
  ok?: boolean;
  url?: string;
  error?: string;
  redirectTo?: string;
  subscription?: BillingStatus;
};

async function postJson(url: string, body?: unknown): Promise<ApiJson> {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : "{}",
  });
  return (await response.json()) as ApiJson;
}

export function BillingPanel({ buildConfig }: { buildConfig: BuildConfig }) {
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [pendingPortal, setPendingPortal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<BillingStatus>(null);
  const plans = useMemo(() => {
    if (buildConfig.plans && buildConfig.plans.length > 0) {
      return buildConfig.plans;
    }
    const legacyLabel = buildConfig.pricing.planName?.trim() || "Starter";
    const fallbackPlan: BuildPlanConfig = {
      tierSlug: "starter",
      displayName: legacyLabel,
      amount: buildConfig.pricing.amount,
      currency: buildConfig.pricing.currency,
      interval: "month",
      isFree: buildConfig.pricing.amount <= 0,
      stripePriceId: undefined,
    };
    return [fallbackPlan];
  }, [buildConfig]);
  const paidPlans = plans.filter((plan) => !plan.isFree && plan.amount > 0);
  const [selectedTierSlug, setSelectedTierSlug] = useState<string>("");
  const activePlan =
    plans.find((plan) => plan.stripePriceId && plan.stripePriceId === status?.stripePriceId) ??
    plans[0];
  const intervalSuffix = activePlan?.interval ? `/${activePlan.interval}` : "";
  const planLabel = activePlan?.displayName?.trim() || "Starter";
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: activePlan?.currency ?? buildConfig.pricing.currency,
    maximumFractionDigits: Number.isInteger(activePlan?.amount ?? 0) ? 0 : 2,
  }).format(activePlan?.amount ?? 0);
  const supportEmail = buildConfig.supportEmail?.trim() || null;
  const selectedTierSlugForCheckout =
    selectedTierSlug && paidPlans.some((plan) => plan.tierSlug === selectedTierSlug)
      ? selectedTierSlug
      : paidPlans[0]?.tierSlug ?? "";

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/billing/status", {
        credentials: "include",
      });
      const data = await response.json();
      if (!data?.ok) return;
      setStatus(data.subscription ?? null);
    })();
  }, []);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="shrink-0"
            onClick={async () => {
              const response = await fetch("/api/billing/status", {
                credentials: "include",
              });
              const data = await response.json();
              if (!data?.ok) return;
              setStatus(data.subscription ?? null);
            }}
          >
            Refresh billing status
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your plan, payments, and subscription details.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current plan
          </CardTitle>
          <div className="flex items-center gap-3">
            <p className="font-medium">{planLabel}</p>
            <p className="text-sm text-muted-foreground">{`${amount}${intervalSuffix}`}</p>
            <Badge variant="secondary">{status?.status ?? "Unknown"}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="-mx-1 flex min-w-0 flex-nowrap items-center gap-3 overflow-x-auto px-1 py-0.5 [scrollbar-width:thin]">
        <div className="flex min-h-10 min-w-[min(100%,14rem)] flex-1 shrink-0 basis-[min(14rem,calc(100%-15rem))] items-center gap-2">
          <span className="text-xs whitespace-nowrap text-muted-foreground">Choose plan</span>
          <Select
            value={selectedTierSlugForCheckout}
            onValueChange={(value) => setSelectedTierSlug(value ?? "")}
            disabled={pendingCheckout || paidPlans.length <= 1}
          >
            <SelectTrigger
              size="lg"
              className="min-w-0 flex-1 justify-between rounded-lg pr-3 text-sm [&_[data-slot=select-value]]:truncate"
              aria-label="Choose plan"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              align="start"
              alignItemWithTrigger={false}
              collisionAvoidance={{ align: "shift", side: "none" }}
              className="w-[min(var(--anchor-width),calc(100vw-2rem))]"
            >
              {paidPlans.map((plan) => (
                <SelectItem key={plan.tierSlug} value={plan.tierSlug}>
                  {plan.displayName} - {plan.amount} {plan.currency.toUpperCase()}/month
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="h-10 min-w-[10.5rem] shrink-0 justify-between"
          type="button"
          disabled={pendingCheckout || paidPlans.length < 1}
          onClick={async () => {
            setPendingCheckout(true);
            setErrorMessage(null);
            try {
              const targetTierSlug = selectedTierSlugForCheckout || paidPlans[0]?.tierSlug;
              const data = await postJson("/api/billing/checkout-session", {
                tierSlug: targetTierSlug,
              });
              if (!data?.ok || !data?.url) {
                setErrorMessage(data?.error ?? "checkout_failed");
                return;
              }
              window.location.href = data.url;
            } catch {
              setErrorMessage("checkout_failed");
            } finally {
              setPendingCheckout(false);
            }
          }}
        >
          {pendingCheckout ? "Redirecting..." : "Change plan"}
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button
          className="h-10 min-w-[10.5rem] shrink-0 justify-between"
          type="button"
          variant="outline"
          disabled={pendingPortal}
          onClick={async () => {
            setPendingPortal(true);
            setErrorMessage(null);
            try {
              const data = await postJson("/api/billing/portal");
              if (data?.ok && data?.url) {
                window.location.href = data.url;
                return;
              }
              if (typeof data?.redirectTo === "string" && data.redirectTo.length > 0) {
                window.location.href = data.redirectTo;
                return;
              }
              setErrorMessage(data?.error ?? "portal_failed");
            } catch {
              setErrorMessage("portal_failed");
            } finally {
              setPendingPortal(false);
            }
          }}
        >
          Manage billing
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {errorMessage ? (
          <p className="text-sm text-rose-500">{errorMessage}</p>
        ) : null}
        {supportEmail ? (
          <p className="text-xs text-muted-foreground">
            Need help? Contact <a className="underline" href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
