"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { GoldRateSummary } from "@/types";

export function useGoldRate() {
  return useQuery({
    queryKey: ["gold-rate"],
    queryFn: () => api.get<GoldRateSummary>("/api/gold/rate"),
    refetchInterval: 30_000,
  });
}
