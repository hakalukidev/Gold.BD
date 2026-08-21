import Link from "next/link";
import { Gem } from "lucide-react";
import { AdminNav } from "@/components/shared/admin-nav";
import { UserMenu } from "@/components/shared/user-menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/admin/users" className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex size-7 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                <Gem className="size-3.5" />
              </span>
              Gold BD Admin
            </Link>
            <AdminNav />
          </div>
          <UserMenu />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
