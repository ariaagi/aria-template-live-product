import { CreditCard, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingPanel() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Payment actions are routed through centralized ARIA backend endpoints.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current plan
          </CardTitle>
          <CardDescription>Template placeholder for account status and usage limits.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Starter</p>
            <p className="text-sm text-muted-foreground">$19/month - 1 workspace seat</p>
          </div>
          <Badge variant="secondary">Active</Badge>
        </CardContent>
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
