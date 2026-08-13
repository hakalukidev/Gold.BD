import { z } from "zod";

export const buyGoldSchema = z.object({
  goldGrams: z.number().positive("Enter an amount of gold to buy").max(1000),
});
export type BuyGoldInput = z.infer<typeof buyGoldSchema>;

export const sellGoldSchema = z.object({
  goldGrams: z.number().positive("Enter an amount of gold to sell").max(1000),
});
export type SellGoldInput = z.infer<typeof sellGoldSchema>;

export const setGoldRateSchema = z.object({
  pricePerGramBDT: z.number().positive("Enter a valid price"),
});
export type SetGoldRateInput = z.infer<typeof setGoldRateSchema>;
