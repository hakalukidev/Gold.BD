"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { ArrowLeftRight, Banknote, Coins, Gem, HandCoins, Percent, TrendingUp } from "lucide-react";
import { useGoldRate } from "@/hooks/use-gold-rate";
import { useGoldRateHistory } from "@/hooks/use-gold-rate-history";
import { useT } from "@/lib/i18n/use-t";
import { formatBDT } from "@/lib/format";
import { LandingHeader } from "@/components/landing/landing-header";
import { GoldPriceTicker } from "@/components/landing/gold-price-ticker";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LiveBadge } from "@/components/landing/today-price-section";
import { RateChart } from "@/components/landing/rate-chart";

// 1 bhori (also spelled vori/tola), the standard South Asian gold-trading
// unit, equals this many grams — the figure used across the BD jewellery trade.
const BHORI_TO_GRAM = 11.6638038;

// Nisab: the zakat-eligibility threshold, expressed as the value of 87.48
// grams of pure (24K) gold — the traditional 7.5-tola figure.
const NISAB_GRAMS = 87.48;

const PURITY_OPTIONS = [24, 22, 21, 18] as const;

// Drives both the quick-nav chip row and each CalcCard's icon badge, so the
// two stay in sync by construction instead of two separately maintained lists.
const SECTIONS = [
  { id: "gold", icon: Coins },
  { id: "silver", icon: Gem },
  { id: "making-charge", icon: Percent },
  { id: "bhori-gram", icon: ArrowLeftRight },
  { id: "zakat", icon: HandCoins },
] as const;

function CalcCard({
  id,
  icon: Icon,
  index,
  title,
  description,
  children,
}: {
  id: string;
  icon: ComponentType<{ className?: string }>;
  index: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-gold/30 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-gold/70">{String(index).padStart(2, "0")}</span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
          </div>
          <p className="mt-1 text-sm text-neutral-400">{description}</p>
        </div>
      </div>
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

/** Splits `n` items into ascending row sizes (1, 2, 3, …) — rendered top-to-bottom
 *  this reads as a pile with a narrow apex and a wide base, like stacked coins/bundles. */
function pileRows(n: number): number[] {
  const rows: number[] = [];
  let remaining = n;
  let size = 1;
  while (remaining > 0) {
    const take = Math.min(size, remaining);
    rows.push(take);
    remaining -= take;
    size++;
  }
  return rows;
}

/** Small stacked gold coins — the right-pan pile, sized by how many grams the scale reads. */
function CoinPile({ count }: { count: number }) {
  if (count === 0) return <span className="text-xs text-neutral-600">—</span>;
  return (
    <div className="flex flex-col items-center">
      {pileRows(count).map((rowCount, i) => (
        <div key={i} className="flex -space-x-1" style={i > 0 ? { marginTop: -6 } : undefined}>
          {Array.from({ length: rowCount }, (_, j) => (
            <span
              key={j}
              className="size-3.5 rounded-full bg-linear-to-br from-gold-bright to-gold shadow-[0_1px_2px_rgba(0,0,0,0.5)] ring-1 ring-black/40"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Small stacked taka-note bundles — the left-pan pile, sized by the entered amount. */
function MoneyPile({ count }: { count: number }) {
  if (count === 0) return <span className="text-xs text-neutral-600">—</span>;
  return (
    <div className="flex flex-col items-center">
      {pileRows(count).map((rowCount, i) => (
        <div key={i} className="flex -space-x-2" style={i > 0 ? { marginTop: -4 } : undefined}>
          {Array.from({ length: rowCount }, (_, j) => (
            <span key={j} className="relative h-3 w-7 rounded-[2px] bg-linear-to-b from-[#d9c98a] to-[#a8935a] ring-1 ring-black/40">
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-[#f4ecc9]" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** A short round-dashed line reads as a beaded chain without any custom link
 *  geometry — it's a single straight SVG line, so it can't render crooked. */
function Chain({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className="stroke-gold/70"
      strokeWidth="2.6"
      strokeDasharray="0.1 5.5"
      strokeLinecap="round"
    />
  );
}

/** A deep, brass-shaded bowl like a real hanging scale pan — round body first,
 *  then a rim ellipse painted on top of it, symmetric by construction since
 *  the body's one control point sits on the pan's own vertical axis. */
function Pan({ cx, gradId }: { cx: number; gradId: string }) {
  const rimY = 150;
  const w = 40;
  return (
    <>
      <path d={`M ${cx - w} ${rimY} Q ${cx} ${rimY + 42} ${cx + w} ${rimY} Z`} fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
      <path
        d={`M ${cx - w * 0.5} ${rimY + 12} Q ${cx - w * 0.1} ${rimY + 5} ${cx + w * 0.15} ${rimY + 11}`}
        className="fill-none stroke-gold-light/60"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx={cx} cy={rimY} rx={w} ry="9" fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
      <ellipse cx={cx} cy={rimY} rx={w - 7} ry="5.5" className="fill-none stroke-black/25" strokeWidth="1" />
    </>
  );
}

/** One side's ring with a 3-chain fan straight down to the rim, and the pan
 *  hanging dead-center under that same ring — `ringX` is the only x used for
 *  both, so the pan can't drift sideways off the ring the way a separate
 *  ring/pan-center pair could. */
function PanAssembly({ ringX, gradId }: { ringX: number; gradId: string }) {
  const beamY = 52;
  const rimY = 150;
  const w = 40;
  return (
    <>
      <circle cx={ringX} cy={beamY} r="6.5" className="fill-none stroke-gold-bright" strokeWidth="2.5" />
      <Chain x1={ringX} y1={beamY} x2={ringX - w} y2={rimY} />
      <Chain x1={ringX} y1={beamY} x2={ringX} y2={rimY - 9} />
      <Chain x1={ringX} y1={beamY} x2={ringX + w} y2={rimY} />
      <Pan cx={ringX} gradId={gradId} />
    </>
  );
}

// One carved acanthus-scroll wing, in local coordinates with its origin at the
// center ornament — drawn once and mirrored for the other side (below) so the
// two wings are provably identical rather than two hand-typed paths.
const SCROLL_WING_PATH = "M 4 -2 C 16 -9 32 -6 38 3 C 43 10 39 17 31 16 C 37 12 35 5 27 4 C 19 3 13 7 10 13";
const TASSEL_OFFSETS = [-27, -13.5, 0, 13.5, 27];

/** The ornamental finial above the pivot — a center urn flanked by mirrored
 *  scroll wings, with a fringe of tassels hanging from the crossbar. */
function CrownOrnament() {
  return (
    <g>
      <g transform="translate(200,14)">
        <path d={SCROLL_WING_PATH} className="fill-none stroke-gold" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="9" r="2" className="fill-gold-bright" />
      </g>
      <g transform="translate(200,14) scale(-1,1)">
        <path d={SCROLL_WING_PATH} className="fill-none stroke-gold" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="9" r="2" className="fill-gold-bright" />
      </g>

      {/* center urn */}
      <path d="M 195 8 L 200 2 L 205 8 Z" className="fill-gold-bright" />
      <ellipse cx="200" cy="14" rx="5" ry="7" className="fill-gold-bright" />
      <rect x="197" y="21" width="6" height="9" className="fill-gold/80" />

      {/* crossbar + hanging tassels */}
      <rect x="163" y="30" width="74" height="3" rx="1.5" className="fill-gold/80" />
      {TASSEL_OFFSETS.map((dx) => (
        <g key={dx}>
          <line x1={200 + dx} y1="33" x2={200 + dx} y2="37" className="stroke-gold/60" strokeWidth="1" />
          <ellipse cx={200 + dx} cy="40" rx="2" ry="3" className="fill-gold-bright" />
        </g>
      ))}
    </g>
  );
}

/**
 * The দাঁড়িপাল্লা itself — an ornate justice-scale silhouette (scrollwork
 * finial, fluted pedestal, chains, rimmed pans) as one SVG so the whole
 * apparatus scales as a unit; the two pan piles are separate absolutely
 * positioned overlays (aligned to the SVG's pan coordinates as percentages)
 * so they can be ordinary DOM content instead of baked into the drawing.
 */
function BalanceScale({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  const uid = useId();
  const gradId = `${uid}-pan-grad`;

  return (
    <div className="relative mx-auto mt-6 aspect-[2/1] max-w-md">
      <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          {/* brass shading for the pans — light upper-left, dark lower-right, like a lit metal bowl */}
          <linearGradient id={gradId} x1="0.15" y1="0.1" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#f6e3a8" />
            <stop offset="45%" stopColor="#d4a62a" />
            <stop offset="100%" stopColor="#8a6a1c" />
          </linearGradient>
        </defs>

        {/* fluted pedestal */}
        <ellipse cx="200" cy="193" rx="56" ry="7" className="fill-gold/70 stroke-gold/90" strokeWidth="1" />
        <ellipse cx="200" cy="181" rx="38" ry="6" className="fill-gold/80" />
        <path d="M 192 56 L 208 56 L 211 178 L 189 178 Z" className="fill-gold/80 stroke-gold/40" strokeWidth="1" />
        <line x1="196" y1="86" x2="204" y2="86" className="stroke-gold/40" strokeWidth="1" />
        <line x1="195" y1="122" x2="205" y2="122" className="stroke-gold/40" strokeWidth="1" />

        {/* scrollwork finial */}
        <CrownOrnament />
        <rect x="197" y="33" width="6" height="16" className="fill-gold/80" />

        {/* beam */}
        <rect x="50" y="49" width="300" height="6" rx="3" className="fill-gold" />
        <circle cx="200" cy="52" r="8" className="fill-gold-bright" style={{ filter: "drop-shadow(0 0 6px rgba(244,198,78,0.7))" }} />

        {/* pans — ring, hanging chains and bowl, mirrored left/right from one formula */}
        <PanAssembly ringX={50} gradId={gradId} />
        <PanAssembly ringX={350} gradId={gradId} />
      </svg>

      <div className="absolute bottom-[25%] left-[12.5%] -translate-x-1/2">{left}</div>
      <div className="absolute bottom-[25%] left-[87.5%] -translate-x-1/2">{right}</div>
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

  // Purely decorative pile sizes — grow with the actual numbers so the scale
  // visibly "fills up" as you type, without pretending to be an exact count.
  const amountNum = Number(amount) || 0;
  const bundleCount = Math.min(10, Math.round(amountNum / 3000) || (amountNum > 0 ? 1 : 0));
  const coinCount = Math.min(10, Math.round(grams * 6) || (grams > 0 ? 1 : 0));

  return (
    <CalcCard id="gold" icon={Coins} index={1} title={c.title} description={c.description}>
      {/* Current rate sits above the scale, like a ticker over the beam. */}
      <div className="text-center">
        <p className="text-xs text-neutral-400">{c.rateLabel}</p>
        <p className="mt-1 text-lg font-bold text-gold">{rate ? formatBDT(rate.pricePerGramBDT) : "…"}</p>
      </div>

      {/* দাঁড়িপাল্লা — money piles up in the left pan, gold in the right, as you type. */}
      <BalanceScale left={<MoneyPile count={bundleCount} />} right={<CoinPile count={coinCount} />} />

      <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-5 sm:gap-8">
        <Field label={c.amountLabel} htmlFor="gold-amount">
          <div className="relative">
            <Banknote className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-neutral-500" />
            <input
              id="gold-amount"
              type="number"
              min="0"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/15 bg-ink pr-3 pl-8 text-sm text-white outline-none focus:border-gold/60"
            />
          </div>
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
    <CalcCard id="silver" icon={Gem} index={2} title={c.title} description={c.description}>
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
  // the user hasn't already typed their own value into it. Deliberately a
  // one-shot sync-on-arrival effect, not a derived value, so a later user
  // edit isn't clobbered by a rate refetch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
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
    <CalcCard id="making-charge" icon={Percent} index={3} title={c.title} description={c.description}>
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
    <CalcCard id="bhori-gram" icon={ArrowLeftRight} index={4} title={c.title} description={c.description}>
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
  // the user hasn't already typed their own value into it. Deliberately a
  // one-shot sync-on-arrival effect, not a derived value, so a later user
  // edit isn't clobbered by a rate refetch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
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
    <CalcCard id="zakat" icon={HandCoins} index={5} title={c.title} description={c.description}>
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

// Maps each nav-chip section back to its i18n title — SECTIONS' ids are
// kebab-case (route anchors), t.calculatorPage's keys are camelCase.
const SECTION_LABEL_KEYS = {
  gold: "gold",
  silver: "silver",
  "making-charge": "makingCharge",
  "bhori-gram": "bhoriGram",
  zakat: "zakat",
} as const;

export default function CalculatorPage() {
  const t = useT();
  const c = t.calculatorPage;
  const { data: rate } = useGoldRate();
  const { data: history, isLoading: historyLoading } = useGoldRateHistory();

  return (
    <main className="flex flex-1 flex-col">
      <GoldPriceTicker />
      <LandingHeader />

      {/* ---------- Hero: heading, quick nav, live trend chart ---------- */}
      <section className="relative overflow-hidden bg-ink py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,166,42,0.16),transparent)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="flex items-center justify-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
              <TrendingUp className="size-4.5" />
            </span>
            <LiveBadge label={t.todayPrice.live} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{c.heading}</h1>
          <p className="mt-3 text-neutral-300">{c.subheading}</p>

          {/* Quick nav — jumps straight to a calculator card below. */}
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {SECTIONS.map(({ id, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-neutral-200 transition-colors hover:border-gold/60 hover:text-gold"
              >
                <Icon className="size-3.5" />
                {c[SECTION_LABEL_KEYS[id]].title}
              </a>
            ))}
          </div>
        </div>

        {/* Live rate trend — reuses the same chart the landing page's rate tracker uses. */}
        <div className="relative mx-auto mt-10 max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium text-white">{t.rateHistory.chartCardTitle}</p>
              {rate && <p className="text-lg font-bold text-gold">{formatBDT(rate.pricePerGramBDT)}</p>}
            </div>
            <div className="mt-4">
              {historyLoading ? (
                <p className="text-sm text-neutral-400">{t.rateHistory.loading}</p>
              ) : !history || history.length === 0 ? (
                <p className="text-sm text-neutral-400">{t.rateHistory.noData}</p>
              ) : history.length === 1 ? (
                <div className="py-6 text-center">
                  <p className="text-xs text-neutral-400">{t.rateHistory.singlePointLabel}</p>
                  <p className="text-3xl font-semibold text-gold">{formatBDT(history[0].pricePerGramBDT)}</p>
                  <p className="mt-2 text-xs text-neutral-500">{t.rateHistory.singlePointHint}</p>
                </div>
              ) : (
                <RateChart data={history} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Calculators ---------- */}
      <div className="bg-ink py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 sm:px-6">
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
