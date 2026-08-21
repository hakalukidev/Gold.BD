"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/rates", label: "Rates", icon: ShieldCheck },
  { href: "/admin/transactions", label: "Transactions", icon: History },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1">
      {links.map((link) => {
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
