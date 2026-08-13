import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/auth/require";
import { ok, failFromUnknown } from "@/lib/api-response";
import { toTransactionSummary } from "@/lib/serializers";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const take = Math.min(Number(request.nextUrl.searchParams.get("take") ?? 50), 200);

    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: { user: { select: { fullName: true, phone: true } } },
    });

    return ok(transactions.map((t) => ({ ...toTransactionSummary(t), user: t.user })));
  } catch (error) {
    return failFromUnknown(error);
  }
}
