"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useBuyGold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goldGrams: number) => api.post("/api/gold/buy", { goldGrams }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useSellGold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goldGrams: number) => api.post("/api/gold/sell", { goldGrams }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
