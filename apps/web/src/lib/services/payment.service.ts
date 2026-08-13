/**
 * Swappable payment-gateway interface (bKash/Nagad/Stripe/etc. would each
 * implement this). `MockPaymentProvider` resolves a deposit immediately,
 * as if a webhook had just confirmed it — no vendor credentials required
 * to exercise the full wallet top-up flow locally.
 */
export interface PaymentProvider {
  charge(amountBDT: number, reference: string): Promise<{ success: true } | { success: false; reason: string }>;
}

class MockPaymentProvider implements PaymentProvider {
  async charge(amountBDT: number, reference: string) {
    console.log(`[payment-mock] charged ${amountBDT} BDT for ${reference} — auto-approved`);
    return { success: true } as const;
  }
}

export const paymentProvider: PaymentProvider = new MockPaymentProvider();
