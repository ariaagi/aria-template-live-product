import { Activity, ArrowUpRight, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STATS = [
  { label: "Active users", value: "1,284", change: "+8.1%", icon: Users },
  { label: "Weekly actions", value: "12,430", change: "+3.4%", icon: Activity },
  { label: "Revenue", value: "$8,920", change: "+12.0%", icon: Wallet },
];

export function DashboardOverview() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          End-user home screen. Agents can swap these widgets based on idea domain.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  {stat.change}
                  <ArrowUpRight className="h-3 w-3" />
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Generic feed placeholder for template bootstrapping.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>New user signed in with Google.</p>
          <p>Billing portal action completed.</p>
          <p>Profile preferences updated.</p>
        </CardContent>
      </Card>
    </section>
  );
}
