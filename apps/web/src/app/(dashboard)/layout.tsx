import Link from "next/link";
import { DashboardNav } from "@/components/shared/dashboard-nav";
import { UserMenu } from "@/components/shared/user-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/dashboard" className="text-lg font-semibold">
              Gold BD
            </Link>
            <DashboardNav />
          </div>
          <UserMenu />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
