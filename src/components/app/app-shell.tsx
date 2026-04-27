"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { CreditCard, LayoutGrid, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

type AppShellProps = PropsWithChildren;

export function AppShell({ children }: AppShellProps) {
  const currentPath = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="border-r bg-muted/30 p-4">
          <div className="mb-6 rounded-lg border bg-background px-3 py-2 text-sm font-medium">
            ARIA Template
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex flex-col">
          <header className="border-b px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Reusable end-user SaaS shell. Agents extend features from this baseline.
            </p>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
