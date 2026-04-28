import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "ARIA Live Product Template",
  description: "Centralized baseline template for ARIA-generated MVP apps.",
};

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
