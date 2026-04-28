import { CreditCard, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getBuildConfig } from "@/config/build-config";

export function BillingPanel() {
  const buildConfig = getBuildConfig();
  const intervalSuffix = buildConfig.pricing.interval ? `/${buildConfig.pricing.interval}` : "";
  const planLabel = buildConfig.pricing.planName?.trim() || "Starter";
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: buildConfig.pricing.currency,
    maximumFractionDigits: Number.isInteger(buildConfig.pricing.amount) ? 0 : 2,
  }).format(buildConfig.pricing.amount);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
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
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button className="justify-between" type="button" variant="outline">
          Set up payments
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button className="justify-between" type="button">
          Upgrade plan
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button className="justify-between" type="button" variant="outline">
          Manage billing
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
