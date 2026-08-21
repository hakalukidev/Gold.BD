import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoldTradeForm } from "@/components/forms/gold-trade-form";

export default function BuyGoldPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <span className="mb-1 flex size-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <ArrowUpRight className="size-4.5" strokeWidth={1.75} />
        </span>
        <CardTitle className="text-xl">Buy gold</CardTitle>
        <CardDescription>Cash is debited from your wallet at the current rate.</CardDescription>
      </CardHeader>
      <CardContent>
        <GoldTradeForm side="BUY" />
      </CardContent>
    </Card>
  );
}
