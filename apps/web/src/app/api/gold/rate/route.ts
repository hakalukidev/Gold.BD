import { getCurrentRate } from "@/lib/services/gold.service";
import { ok, failFromUnknown } from "@/lib/api-response";

export async function GET() {
  try {
    const rate = await getCurrentRate();
    return ok(rate);
  } catch (error) {
    return failFromUnknown(error);
  }
}
