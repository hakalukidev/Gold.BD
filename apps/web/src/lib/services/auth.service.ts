import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma/client";
import { createSession } from "@/lib/auth/session";
import { issueOtp, verifyOtp } from "@/lib/services/otp.service";
import type { RegisterInput, LoginInput } from "@/lib/validations/auth";

const SALT_ROUNDS = 10;

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { phone: input.phone } });
  if (existing) throw new Error("An account with this phone number already exists");

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      phone: input.phone,
      email: input.email || null,
      fullName: input.fullName,
      passwordHash,
      wallet: { create: { cashBalanceBDT: 0, goldBalanceMg: 0 } },
    },
  });

  await issueOtp(user.phone, "REGISTER");
  return { userId: user.id, phone: user.phone };
}

export async function startLogin(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { phone: input.phone } });
  if (!user) throw new Error("Invalid phone number or password");

  const passwordOk = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordOk) throw new Error("Invalid phone number or password");

  await issueOtp(user.phone, "LOGIN");
  return { phone: user.phone };
}

export async function completeOtpLogin(
  phone: string,
  code: string,
  purpose: "REGISTER" | "LOGIN"
) {
  await verifyOtp(phone, code, purpose);

  const user = await prisma.user.findUniqueOrThrow({ where: { phone } });
  await createSession({ userId: user.id, role: user.role });

  return user;
}
