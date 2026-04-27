"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import "@neondatabase/auth/ui/css";

type NeonAuthProviderProps = {
  children: ReactNode;
};

export function NeonAuthProvider({ children }: NeonAuthProviderProps) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={router.refresh}
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
