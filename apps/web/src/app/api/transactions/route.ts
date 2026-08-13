import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { requireUser } from "@/lib/auth/require";
import { ok, failFromUnknown } from "@/lib/api-response";
import { toTransactionSummary } from "@/lib/serializers";

export async function GET(request: NextRequest) {
  try {
    const session = await requireUser();
    const take = Math.min(Number(request.nextUrl.searchParams.get("take") ?? 20), 100);
    const skip = Number(request.nextUrl.searchParams.get("skip") ?? 0);

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });

    return ok(transactions.map(toTransactionSummary));
  } catch (error) {
    return failFromUnknown(error);
  }
}
