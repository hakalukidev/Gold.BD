import { requireUser } from "@/lib/auth/require";
import { getWallet } from "@/lib/services/wallet.service";
import { ok, failFromUnknown } from "@/lib/api-response";
import { toWalletSummary } from "@/lib/serializers";

export async function GET() {
  try {
    const session = await requireUser();
    const wallet = await getWallet(session.userId);
    return ok(toWalletSummary(wallet));
  } catch (error) {
    return failFromUnknown(error);
  }
}
