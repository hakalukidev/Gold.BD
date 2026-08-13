import Link from "next/link";
import { UserMenu } from "@/components/shared/user-menu";

const links = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/rates", label: "Rates" },
  { href: "/admin/transactions", label: "Transactions" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/admin/users" className="text-lg font-semibold">
              Gold BD Admin
            </Link>
            <nav className="flex gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <UserMenu />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
