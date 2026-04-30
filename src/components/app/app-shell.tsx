"use client";

import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, LayoutGrid, Menu, Settings } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: LayoutGrid },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

type AppShellProps = PropsWithChildren;
type AppShellBrandingProps = {
  appName: string;
  appTagline: string;
  logoSrc?: string;
};

export function AppShell({
  children,
  appName,
  appTagline,
  logoSrc,
}: AppShellProps & AppShellBrandingProps) {
  const currentPath = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto grid min-h-svh max-w-7xl grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/30 p-4 md:block">
          <div className="mb-6 flex items-center gap-2 px-1 py-1 text-sm font-medium">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt=""
                aria-hidden
                width={18}
                height={18}
                className="size-[18px] shrink-0 rounded-sm object-cover"
              />
            ) : null}
            <span>{appName}</span>
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
        <div className="flex min-w-0 flex-col">
          <header className="flex min-w-0 items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 sm:py-4">
            <p className="text-sm text-muted-foreground">{appTagline}</p>
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button type="button" variant="outline" size="icon-sm" aria-label="Open menu" />
                    }
                  >
                    <Menu className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPath.startsWith(item.href);
                      return (
                        <DropdownMenuItem
                          key={item.href}
                          className={cn("cursor-pointer", isActive && "bg-muted")}
                          onClick={() => router.push(item.href)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-0 focus:bg-transparent">
                      <SignOutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="hidden md:block">
                <SignOutButton />
              </div>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
