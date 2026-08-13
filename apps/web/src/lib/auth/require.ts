import { getSession } from "@/lib/auth/session";

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = "Not authenticated") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "Not authorized") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.role !== "ADMIN") throw new ForbiddenError();
  return session;
}
