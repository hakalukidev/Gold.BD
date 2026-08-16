"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMe, useLogout } from "@/hooks/use-auth";

export function UserMenu() {
  const router = useRouter();
  const { data: user } = useMe();
  const logout = useLogout();

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      {user && <span className="text-sm text-muted-foreground">{user.fullName}</span>}
      <Button size="sm" variant="outline" onClick={handleLogout} disabled={logout.isPending}>
        Log out
      </Button>
    </div>
  );
}
