import { UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsProfileForm } from "@/features/settings/components/settings-profile-form";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Manage your profile preferences and account details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsProfileForm />
        </CardContent>
      </Card>
    </section>
  );
}
