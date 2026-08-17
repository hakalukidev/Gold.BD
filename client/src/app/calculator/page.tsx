"use client";

import { useEffect, useMemo, useState } from "react";
import { useGoldRate } from "@/hooks/use-gold-rate";
import { useT } from "@/lib/i18n/use-t";
import { formatBDT } from "@/lib/format";
import { LandingHeader } from "@/components/landing/landing-header";
import { GoldPriceTicker } from "@/components/landing/gold-price-ticker";
import { LandingFooter } from "@/components/landing/landing-footer";

// 1 bhori (also spelled vori/tola), the standard South Asian gold-trading
// unit, equals this many grams — the figure used across the BD jewellery trade.
const BHORI_TO_GRAM = 11.6638038;

// Nisab: the zakat-eligibility threshold, expressed as the value of 87.48
// grams of pure (24K) gold — the traditional 7.5-tola figure.
const NISAB_GRAMS = 87.48;

const PURITY_OPTIONS = [24, 22, 21, 18] as const;

function CalcCard({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-neutral-400">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-neutral-400" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function NumberInput({ id, value, onChange }: { id?: string; value: string; onChange: (v: string) => void }) {
  return (
    <input
      id={id}
      type="number"
      min="0"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-lg border border-white/15 bg-ink px-3 text-sm text-white outline-none focus:border-gold/60"
    />
  );
}

function ReadonlyField({ value }: { value: string }) {
  return (
    <div className="flex h-10 w-full items-center rounded-lg border border-white/10 bg-ink px-3 text-sm text-white">
      {value}
    </div>
  );
}

function GoldCalculator() {
  const t = useT();
  const c = t.calculatorPage.gold;
  const { data: rate } = useGoldRate();
  const [amount, setAmount] = useState("5000");

  const grams = useMemo(() => {
    const rateNum = rate ? Number(rate.pricePerGramBDT) : 0;
    const amountNum = Number(amount) || 0;
    return rateNum > 0 ? amountNum / rateNum : 0;
  }, [amount, rate]);

  return (
    <CalcCard id="gold" title={c.title} description={c.description}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={c.amountLabel} htmlFor="gold-amount">
          <NumberInput id="gold-amount" value={amount} onChange={setAmount} />
        </Field>
        <Field label={c.rateLabel}>
          <ReadonlyField value={rate ? formatBDT(rate.pricePerGramBDT) : "…"} />
        </Field>
        <Field label={c.resultLabel}>
          <ReadonlyField value={`${grams.toFixed(3)} g`} />
        </Field>
      </div>
    </CalcCard>
  );
}

function SilverCalculator() {
  const t = useT();
  const c = t.calculatorPage.silver;
  const [amount, setAmount] = useState("2000");
  const [rate, setRate] = useState("385");

  const grams = useMemo(() => {
    const rateNum = Number(rate) || 0;
    const amountNum = Number(amount) || 0;
    return rateNum > 0 ? amountNum / rateNum : 0;
  }, [amount, rate]);

  return (
    <CalcCard id="silver" title={c.title} description={c.description}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={c.amountLabel} htmlFor="silver-amount">
          <NumberInput id="silver-amount" value={amount} onChange={setAmount} />
        </Field>
        <Field label={c.rateLabel} htmlFor="silver-rate">
          <NumberInput id="silver-rate" value={rate} onChange={setRate} />
        </Field>
        <Field label={c.resultLabel}>
          <ReadonlyField value={`${grams.toFixed(3)} g`} />
        </Field>
      </div>
      <p className="mt-3 text-xs text-neutral-500">{c.rateNote}</p>
    </CalcCard>
  );
}

function MakingChargeCalculator() {
  const t = useT();
  const c = t.calculatorPage.makingCharge;
  const { data: rate } = useGoldRate();
  const [weight, setWeight] = useState("1");
  const [ratePerGram, setRatePerGram] = useState("");
  const [chargePercent, setChargePercent] = useState("10");

  // Seed the rate field from the live gold rate once it loads — but only if
  // the user hasn't already typed their own value into it.
  useEffect(() => {
    if (rate && ratePerGram === "") setRatePerGram(rate.pricePerGramBDT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  const { goldValue, chargeAmount, total } = useMemo(() => {
    const w = Number(weight) || 0;
    const r = Number(ratePerGram) || 0;
    const pct = Number(chargePercent) || 0;
    const gv = w * r;
    const ca = gv * (pct / 100);
    return { goldValue: gv, chargeAmount: ca, total: gv + ca };
  }, [weight, ratePerGram, chargePercent]);

  return (
    <CalcCard id="making-charge" title={c.title} description={c.description}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={c.weightLabel} htmlFor="mc-weight">
          <NumberInput id="mc-weight" value={weight} onChange={setWeight} />
        </Field>
        <Field label={c.rateLabel} htmlFor="mc-rate">
          <NumberInput id="mc-rate" value={ratePerGram} onChange={setRatePerGram} />
        </Field>
        <Field label={c.chargeLabel} htmlFor="mc-charge">
          <NumberInput id="mc-charge" value={chargePercent} onChange={setChargePercent} />
        </Field>
      </div>
      <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-3">
        <Field label={c.goldValueLabel}>
          <ReadonlyField value={formatBDT(goldValue)} />
        </Field>
        <Field label={c.chargeAmountLabel}>
          <ReadonlyField value={formatBDT(chargeAmount)} />
        </Field>
        <Field label={c.totalLabel}>
          <div className="flex h-10 w-full items-center rounded-lg border border-gold/40 bg-gold/10 px-3 text-sm font-semibold text-gold">
            {formatBDT(total)}
          </div>
        </Field>
      </div>
    </CalcCard>
  );
}

function BhoriGramCalculator() {
  const t = useT();
  const c = t.calculatorPage.bhoriGram;
  const [bhori, setBhori] = useState("1");
  const [grams, setGrams] = useState("11.6638");

  const gramsFromBhori = (Number(bhori) || 0) * BHORI_TO_GRAM;
  const bhoriFromGrams = (Number(grams) || 0) / BHORI_TO_GRAM;

  return (
    <CalcCard id="bhori-gram" title={c.title} description={c.description}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label={c.bhoriLabel} htmlFor="bg-bhori">
            <NumberInput id="bg-bhori" value={bhori} onChange={setBhori} />
          </Field>
          <Field label={c.gramLabel}>
            <ReadonlyField value={gramsFromBhori.toFixed(4)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={c.gramLabel} htmlFor="bg-grams">
            <NumberInput id="bg-grams" value={grams} onChange={setGrams} />
          </Field>
          <Field label={c.bhoriLabel}>
            <ReadonlyField value={bhoriFromGrams.toFixed(4)} />
          </Field>
        </div>
      </div>
    </CalcCard>
  );
}

function ZakatCalculator() {
  const t = useT();
  const c = t.calculatorPage.zakat;
  const { data: rate } = useGoldRate();
  const [weight, setWeight] = useState("0");
  const [purity, setPurity] = useState<(typeof PURITY_OPTIONS)[number]>(24);
  const [ratePerGram, setRatePerGram] = useState("");

  // Seed the rate field from the live gold rate once it loads — but only if
  // the user hasn't already typed their own value into it.
  useEffect(() => {
    if (rate && ratePerGram === "") setRatePerGram(rate.pricePerGramBDT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  const { eligible, marketValue, zakatDue } = useMemo(() => {
    const w = Number(weight) || 0;
    const r = Number(ratePerGram) || 0;
    const pureGrams = w * (purity / 24);
    const isEligible = pureGrams >= NISAB_GRAMS;
    const value = w * r;
    return { eligible: isEligible, marketValue: value, zakatDue: isEligible ? value * 0.025 : 0 };
  }, [weight, purity, ratePerGram]);

  return (
    <CalcCard id="zakat" title={c.title} description={c.description}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={c.weightLabel} htmlFor="zakat-weight">
          <NumberInput id="zakat-weight" value={weight} onChange={setWeight} />
        </Field>
        <Field label={c.purityLabel} htmlFor="zakat-purity">
          <select
            id="zakat-purity"
            value={purity}
            onChange={(e) => setPurity(Number(e.target.value) as (typeof PURITY_OPTIONS)[number])}
            className="h-10 w-full rounded-lg border border-white/15 bg-ink px-3 text-sm text-white outline-none focus:border-gold/60"
          >
            {PURITY_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}K
              </option>
            ))}
          </select>
        </Field>
        <Field label={c.rateLabel} htmlFor="zakat-rate">
          <NumberInput id="zakat-rate" value={ratePerGram} onChange={setRatePerGram} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
        <Field label={c.marketValueLabel}>
          <ReadonlyField value={formatBDT(marketValue)} />
        </Field>
        <Field label={c.zakatDueLabel}>
          <div className="flex h-10 w-full items-center rounded-lg border border-gold/40 bg-gold/10 px-3 text-sm font-semibold text-gold">
            {formatBDT(zakatDue)}
          </div>
        </Field>
      </div>

      <p className={`mt-3 text-xs font-medium ${eligible ? "text-emerald-400" : "text-neutral-500"}`}>
        {eligible ? c.eligible : c.notEligible}
      </p>
      <p className="mt-1 text-xs text-neutral-500">{c.nisabNote}</p>
    </CalcCard>
  );
}

export default function CalculatorPage() {
  const t = useT();

  return (
    <main className="flex flex-1 flex-col">
      <GoldPriceTicker />
      <LandingHeader />

      <div className="bg-ink py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{t.calculatorPage.heading}</h1>
          <p className="mt-3 text-neutral-300">{t.calculatorPage.subheading}</p>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-6 px-4 sm:px-6">
          <GoldCalculator />
          <SilverCalculator />
          <MakingChargeCalculator />
          <BhoriGramCalculator />
          <ZakatCalculator />
        </div>
      </div>

      <LandingFooter />
    </main>
  );
}
