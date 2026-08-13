import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/require";
import { withdrawSchema } from "@/lib/validations/wallet";
import { withdraw } from "@/lib/services/wallet.service";
import { ok, failFromZod, failFromUnknown } from "@/lib/api-response";
import { toWalletSummary } from "@/lib/serializers";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const parsed = withdrawSchema.safeParse(await request.json());
    if (!parsed.success) return failFromZod(parsed.error);

    const wallet = await withdraw(session.userId, parsed.data.amountBDT);
    return ok(toWalletSummary(wallet));
  } catch (error) {
    return failFromUnknown(error);
  }
}
