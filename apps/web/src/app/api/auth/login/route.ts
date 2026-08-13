import type { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { startLogin } from "@/lib/services/auth.service";
import { ok, failFromZod, failFromUnknown } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return failFromZod(parsed.error);

  try {
    const result = await startLogin(parsed.data);
    return ok(result);
  } catch (error) {
    return failFromUnknown(error);
  }
}
