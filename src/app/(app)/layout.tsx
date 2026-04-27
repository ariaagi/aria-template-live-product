import { AppShell } from "@/components/app/app-shell";
import { redirect } from "next/navigation";
import { getAuthServer } from "@/lib/auth/server";
import { getTemplateGoogleSession } from "@/lib/server/auth/template-google-session";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: AppLayoutProps) {
  if (process.env.E2E_BYPASS_AUTH !== "true") {
    const auth = getAuthServer();
    const session = auth ? (await auth.getSession()).data : null;
    const googleSession = await getTemplateGoogleSession();

    if (!session?.user && !googleSession) {
      redirect("/login");
    }
  }

  return <AppShell>{children}</AppShell>;
}
