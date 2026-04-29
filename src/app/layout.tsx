import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { getBuildConfig } from "@/config/build-config";
import { AppAuthProvider } from "@/components/providers/app-auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function tryGetMetadataBase(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

export function generateMetadata(): Metadata {
  const buildConfig = getBuildConfig();
  const appName = buildConfig.appName.trim() || "Template App";
  const appTagline =
    buildConfig.appTagline.trim() ||
    "Centralized baseline template ready for ARIA-generated MVP apps.";
  const logoUrl = buildConfig.branding.logoUrl?.trim();
  const iconUrl = logoUrl || "/window.svg";
  const metadataBase = tryGetMetadataBase();

  return {
    metadataBase,
    title: appName,
    description: appTagline,
    applicationName: appName,
    openGraph: {
      type: "website",
      title: appName,
      description: appTagline,
      siteName: appName,
    },
    twitter: {
      card: "summary",
      title: appName,
      description: appTagline,
    },
    icons: {
      icon: iconUrl,
      apple: iconUrl,
      shortcut: iconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html
      lang="en"
      className={cn(inter.variable, geistMono.variable, "h-full antialiased")}
      suppressHydrationWarning
    >
      <body className={cn(inter.className, "flex min-h-full flex-col")}>
        <AppAuthProvider>
          {children}
          <Toaster />
        </AppAuthProvider>
      </body>
    </html>
  );
}
