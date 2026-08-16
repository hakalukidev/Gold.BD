"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { GoldRateSummary } from "@gold-bd/shared-types";

export function useGoldRateHistory() {
  return useQuery({
    queryKey: ["gold-rate-history"],
    queryFn: () => api.get<GoldRateSummary[]>("/api/gold/rate-history"),
    staleTime: 60_000,
  });
}
