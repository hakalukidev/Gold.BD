import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/require";
import { buyGoldSchema } from "@/lib/validations/gold";
import { buyGold } from "@/lib/services/gold.service";
import { ok, failFromZod, failFromUnknown } from "@/lib/api-response";
import { toTransactionSummary } from "@/lib/serializers";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const parsed = buyGoldSchema.safeParse(await request.json());
    if (!parsed.success) return failFromZod(parsed.error);

    const transaction = await buyGold(session.userId, parsed.data.goldGrams);
    return ok(toTransactionSummary(transaction), 201);
  } catch (error) {
    return failFromUnknown(error);
  }
}
