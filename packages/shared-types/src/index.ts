// Shared TypeScript types used by client (and any future app, e.g. a mobile app).
// Kept intentionally framework-free — no Next imports here.

export type UserRole = "USER" | "ADMIN";

export type KycStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

export interface PublicUser {
  id: string;
  phone: string;
  email: string | null;
  fullName: string;
  role: UserRole;
  kycStatus: KycStatus;
  createdAt: string;
}

export interface WalletSummary {
  cashBalanceBDT: string; // decimal serialized as string to avoid float precision loss over the wire
  goldBalanceGrams: string;
}

export type TransactionType = "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface TransactionSummary {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  goldGrams: string | null;
  pricePerGramBDT: string | null;
  totalAmountBDT: string;
  createdAt: string;
}

export interface GoldRateSummary {
  pricePerGramBDT: string;
  effectiveAt: string;
}

/** Standard envelope returned by every /api/* route. */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
