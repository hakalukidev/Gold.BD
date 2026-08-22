"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, History, IdCard, LayoutDashboard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared with dashboard-sidebar-nav.tsx so the two nav variants (compact
// mobile header vs. desktop sidebar) can't drift apart.
export const DASHBOARD_NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/buy-gold", label: "Buy gold", icon: ArrowUpRight },
  { href: "/sell-gold", label: "Sell gold", icon: ArrowDownRight },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: History },
  { href: "/kyc", label: "KYC", icon: IdCard },
];

/** Compact horizontal nav — used in the mobile header below `lg`, where the
 * full sidebar (dashboard-sidebar-nav.tsx) is hidden. */
export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1">
      {DASHBOARD_NAV_LINKS.map((link) => {
        const active = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" strokeWidth={2} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
