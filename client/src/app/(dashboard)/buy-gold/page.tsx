import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoldTradeForm } from "@/components/forms/gold-trade-form";

export default function BuyGoldPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Buy gold</CardTitle>
        <CardDescription>Cash is debited from your wallet at the current rate.</CardDescription>
      </CardHeader>
      <CardContent>
        <GoldTradeForm side="BUY" />
      </CardContent>
    </Card>
  );
}
