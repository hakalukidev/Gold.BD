"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { buyGoldSchema, sellGoldSchema, type BuyGoldInput } from "@/lib/validations/gold";
import { ApiError } from "@/lib/api-client";
import { useBuyGold, useSellGold } from "@/hooks/use-gold-trade";
import { useGoldRate } from "@/hooks/use-gold-rate";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { formatBDT } from "@/lib/format";

export function GoldTradeForm({ side }: { side: "BUY" | "SELL" }) {
  const router = useRouter();
  const { data: rate } = useGoldRate();
  const { data: wallet } = useWallet();
  const buy = useBuyGold();
  const sell = useSellGold();
  const mutation = side === "BUY" ? buy : sell;

  const form = useForm<BuyGoldInput>({
    resolver: zodResolver(side === "BUY" ? buyGoldSchema : sellGoldSchema),
    defaultValues: { goldGrams: 0 },
  });

  const grams = form.watch("goldGrams");
  const estimate = rate && grams ? Number(rate.pricePerGramBDT) * Number(grams) : 0;

  async function onSubmit(values: BuyGoldInput) {
    try {
      await mutation.mutateAsync(values.goldGrams);
      toast.success(`${side === "BUY" ? "Purchase" : "Sale"} completed`);
      form.reset({ goldGrams: 0 });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Transaction failed");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="goldGrams"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grams of gold</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="1.000"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>
                {rate ? `Current rate: ${formatBDT(rate.pricePerGramBDT)} / g` : "Loading rate…"}
                {side === "SELL" && wallet ? ` · You hold ${wallet.goldBalanceGrams} g` : null}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground">
          Estimated {side === "BUY" ? "cost" : "proceeds"}: <span className="font-medium text-foreground">{formatBDT(estimate || 0)}</span>
        </p>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Processing…" : side === "BUY" ? "Buy gold" : "Sell gold"}
        </Button>
      </form>
    </Form>
  );
}
