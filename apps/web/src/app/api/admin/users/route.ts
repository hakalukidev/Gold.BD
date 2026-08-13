import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/auth/require";
import { ok, failFromUnknown } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const take = Math.min(Number(request.nextUrl.searchParams.get("take") ?? 50), 200);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: { wallet: true, kycProfile: true },
    });

    return ok(
      users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        phone: u.phone,
        email: u.email,
        role: u.role,
        kycStatus: u.kycStatus,
        createdAt: u.createdAt.toISOString(),
        cashBalanceBDT: u.wallet?.cashBalanceBDT.toString() ?? "0",
        goldBalanceGrams: u.wallet ? (Number(u.wallet.goldBalanceMg) / 1000).toFixed(3) : "0",
      }))
    );
  } catch (error) {
    return failFromUnknown(error);
  }
}
