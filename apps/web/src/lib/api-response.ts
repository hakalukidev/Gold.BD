import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import type { ApiResponse } from "@gold-bd/shared-types";

export function ok<T>(data: T, init?: number | ResponseInit) {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, typeof init === "number" ? { status: init } : init);
}

export function fail(error: string, status = 400, fieldErrors?: Record<string, string[]>) {
  const body: ApiResponse<never> = { success: false, error, fieldErrors };
  return NextResponse.json(body, { status });
}

export function failFromZod(error: ZodError, status = 400) {
  return fail("Validation failed", status, error.flatten().fieldErrors as Record<string, string[]>);
}

/** Normalizes any thrown error into a JSON API response instead of leaking a stack trace to the client. */
export function failFromUnknown(error: unknown, fallbackMessage = "Something went wrong") {
  const message = error instanceof Error ? error.message : fallbackMessage;
  const status = error instanceof Error && "status" in error ? Number((error as { status: unknown }).status) : 400;
  console.error(error);
  return fail(message, Number.isFinite(status) ? status : 400);
}
