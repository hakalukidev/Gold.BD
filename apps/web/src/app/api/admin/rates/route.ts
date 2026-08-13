import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/auth/require";
import { setGoldRateSchema } from "@/lib/validations/gold";
import { setRate } from "@/lib/services/gold.service";
import { ok, failFromZod, failFromUnknown } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAdmin();
    const rates = await prisma.goldRate.findMany({ orderBy: { effectiveAt: "desc" }, take: 20 });
    return ok(rates);
  } catch (error) {
    return failFromUnknown(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const parsed = setGoldRateSchema.safeParse(await request.json());
    if (!parsed.success) return failFromZod(parsed.error);

    const rate = await setRate(parsed.data.pricePerGramBDT, session.userId);
    return ok(rate, 201);
  } catch (error) {
    return failFromUnknown(error);
  }
}
