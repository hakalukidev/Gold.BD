"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { TransactionSummary } from "@gold-bd/shared-types";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.get<TransactionSummary[]>("/api/transactions"),
  });
}
