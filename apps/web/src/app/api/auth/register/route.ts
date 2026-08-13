import type { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { registerUser } from "@/lib/services/auth.service";
import { ok, failFromZod, failFromUnknown } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return failFromZod(parsed.error);

  try {
    const result = await registerUser(parsed.data);
    return ok(result, 201);
  } catch (error) {
    return failFromUnknown(error);
  }
}
