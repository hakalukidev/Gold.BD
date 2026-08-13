import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoldTradeForm } from "@/components/forms/gold-trade-form";

export default function SellGoldPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Sell gold</CardTitle>
        <CardDescription>Gold is debited from your holdings and cash is credited.</CardDescription>
      </CardHeader>
      <CardContent>
        <GoldTradeForm side="SELL" />
      </CardContent>
    </Card>
  );
}
