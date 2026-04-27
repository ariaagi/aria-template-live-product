import { redirect } from "next/navigation";
import { AuthViewCard } from "@/components/auth/auth-view-card";
import { getAuthServer } from "@/lib/auth/server";
import { getTemplateGoogleSession } from "@/lib/server/auth/template-google-session";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  if (process.env.E2E_BYPASS_AUTH === "true") {
    redirect("/dashboard");
  }

  const hasNeonAuth = Boolean(process.env.NEON_AUTH_BASE_URL);
  const auth = getAuthServer();
  if (auth) {
    const { data: session } = await auth.getSession();
    if (session?.user) {
      redirect("/dashboard");
    }
  }

  const googleSession = await getTemplateGoogleSession();
  if (googleSession) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <AuthViewCard pathname="sign-up" hasNeonAuth={hasNeonAuth} />
    </main>
  );
}
