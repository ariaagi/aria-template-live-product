"use client";

import Image from "next/image";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthView } from "@neondatabase/auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AuthViewCardProps = {
  pathname: "sign-in" | "sign-up";
  hasNeonAuth: boolean;
};

function GoogleAuthQueryBanner(): React.ReactElement | null {
  const searchParams = useSearchParams();
  const key = searchParams.get("google");
  const text =
    key === "soon"
      ? "Google sign-in is not configured yet (missing GOOGLE_OAUTH_CLIENT_ID / SECRET)."
      : key === "error"
        ? "Google sign-in failed. Try again or use another method."
        : key === "ok"
          ? "Google verified, but no session was created."
          : null;
  if (!text) {
    return null;
  }
  return (
    <p className="text-balance text-sm text-amber-700 dark:text-amber-400">{text}</p>
  );
}

function GoogleButtonAndSeparator(): React.ReactElement {
  return (
    <div className="grid w-full gap-5">
      <a
        href="/api/v1/auth/google/start"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "inline-flex h-12 w-full items-center justify-center gap-2.5 font-medium"
        )}
      >
        <Image
          src="/logos/googlesearch.png"
          alt=""
          width={22}
          height={22}
          className="size-[22px] shrink-0 object-contain"
        />
        <span>Continue with Google</span>
      </a>
      <div className="flex items-center gap-3 py-2">
        <Separator className="flex-1" />
        <span className="shrink-0 text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}

export function AuthViewCard({ pathname, hasNeonAuth }: AuthViewCardProps): React.ReactElement {
  const isSignIn = pathname === "sign-in";

  return (
    <section className="w-full max-w-md space-y-8">
      <Suspense fallback={null}>
        <GoogleAuthQueryBanner />
      </Suspense>

      {hasNeonAuth ? (
        <AuthView
          pathname={pathname}
          className="w-full max-w-md"
          classNames={{
            base: "max-w-md gap-6 py-6",
            header: "gap-0 pb-1",
            content: "gap-8 pt-6",
            footer: "mt-2 gap-2 pt-2",
          }}
          cardHeader={
            <div className="grid w-full gap-5 text-center">
              <CardTitle
                className={cn(
                  "text-lg md:text-xl",
                  "font-heading leading-snug font-medium text-center"
                )}
              >
                {isSignIn ? "Sign In" : "Sign Up"}
              </CardTitle>
              <CardDescription className="text-balance text-xs leading-relaxed text-muted-foreground md:text-sm">
                {isSignIn
                  ? "Enter your email below to login to your account"
                  : "Enter your email below to create your account"}
              </CardDescription>
              <div className="w-full text-left">
                <GoogleButtonAndSeparator />
              </div>
            </div>
          }
        />
      ) : (
        <Card className="w-full max-w-md gap-6 py-6">
          <CardHeader className="grid gap-6">
            <GoogleButtonAndSeparator />
          </CardHeader>
          <CardContent className="pt-2">
            <Alert>
              <AlertTitle>Auth not configured yet</AlertTitle>
              <AlertDescription>
                ARIA must inject `NEON_AUTH_BASE_URL` and provider credentials for this app.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
