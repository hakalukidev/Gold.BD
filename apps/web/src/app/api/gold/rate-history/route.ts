import { getRateHistory } from "@/lib/services/gold.service";
import { ok, failFromUnknown } from "@/lib/api-response";

// Public, like /api/gold/rate — this is just that same rate over time, no user data.
export async function GET() {
  try {
    const history = await getRateHistory(30);
    return ok(history);
  } catch (error) {
    return failFromUnknown(error);
  }
}
