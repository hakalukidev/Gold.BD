"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cart-slice";
import { useMetalRate, type Metal } from "@/hooks/use-metal-rate";
import { useT } from "@/lib/i18n/use-t";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";

// The platform only tracks one admin-set rate (fine gold/silver price per
// gram) per metal — 22K, the karat these bars/coins are minted/struck at, is
// derived from it by purity ratio. Same convention as gold-rate-card.tsx and
// today-price-section.tsx (redefined locally there too rather than shared).
const PURITY_22K = 22 / 24;

type Form = "bar" | "coin";

const PRODUCT_IMAGES: Record<Metal, Record<Form, string>> = {
  gold: { bar: "/products/gold-bar.webp", coin: "/products/gold-coin.webp" },
  silver: { bar: "/products/silver-bar.webp", coin: "/products/silver-coin.webp" },
};

// Smaller denominations carry a heavier minting/making-charge premium over
// the spot rate, narrowing as weight goes up — mirrors how real bar/coin
// pricing works rather than a flat markup across every size.
const WEIGHTS = [
  { grams: 0.5, premium: 0.09, key: "weight0_5" },
  { grams: 1, premium: 0.065, key: "weight1" },
  { grams: 5, premium: 0.045, key: "weight5" },
  { grams: 10, premium: 0.03, key: "weight10" },
] as const satisfies readonly { grams: number; premium: number; key: string }[];

type Weight = (typeof WEIGHTS)[number];

function ProductCard({
  metal,
  form,
  weight,
  pricePerGram22k,
}: {
  metal: Metal;
  form: Form;
  weight: Weight;
  pricePerGram22k: number | null;
}) {
  const t = useT();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const id = `${metal}-${form}-${weight.grams}`;
  const image = PRODUCT_IMAGES[metal][form];
  const weightLabel = t.featured[weight.key as "weight0_5" | "weight1" | "weight5" | "weight10"];
  const formLabel = t.featured[form === "bar" ? "formBar" : "formCoin"];
  const title = `${weightLabel} ${formLabel}`;
  const kicker = `${t.featured[form === "bar" ? "kickerBar" : "kickerCoin"]} · ${t.featured.karatBadge}`;

  const effectivePerGram = pricePerGram22k !== null ? pricePerGram22k * (1 + weight.premium) : null;
  const unitPrice = effectivePerGram !== null ? effectivePerGram * weight.grams : null;
  const totalPrice = unitPrice !== null ? unitPrice * qty : null;
  const premiumPct = (weight.premium * 100).toFixed(1);

  function addWithQty() {
    if (unitPrice === null) return;
    dispatch(addToCart({ id, name: title, image, unitPriceBDT: unitPrice, quantity: qty }));
  }

  function handleAddToCart() {
    addWithQty();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  function handleBuyNow() {
    addWithQty();
    router.push("/buy-gold");
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.05] hover:shadow-[0_20px_45px_-20px_rgba(212,166,42,0.35)]">
      {/* ---------- Image ---------- */}
      <div className="relative aspect-4/3 shrink-0 overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,166,42,0.25),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 rounded-full border border-gold/30 bg-black/60 px-2 py-1 text-[10px] font-semibold tracking-wide text-gold uppercase backdrop-blur-sm">
          {t.featured.karatBadge}
        </span>
      </div>

      {/* ---------- Body ---------- */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-[11px] font-medium tracking-wide text-gold/80 uppercase">{kicker}</p>
          <h3 className="mt-0.5 text-sm font-bold text-white">{title}</h3>
        </div>

        <div>
          <p className="text-lg font-extrabold text-white tabular-nums">{totalPrice !== null ? formatBDT(totalPrice) : "—"}</p>
          <p className="mt-0.5 text-[11px] text-muted-white">
            {effectivePerGram !== null ? formatBDT(effectivePerGram) : "—"}
            {t.featured.perGram} · {premiumPct}% {t.featured.withPremium}
          </p>
          <p className="text-[11px] text-muted-white">{t.featured.vatIncluded}</p>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <div className="flex shrink-0 items-center rounded-full border border-white/15">
            <button
              type="button"
              aria-label={t.featured.decreaseQty}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex size-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-semibold text-white tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label={t.featured.increaseQty}
              onClick={() => setQty((q) => q + 1)}
              className="flex size-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <Button
            variant="gold-outline"
            className="h-8 flex-1 px-2 text-[11px]"
            onClick={handleAddToCart}
            disabled={unitPrice === null}
          >
            {justAdded ? t.featured.added : t.featured.addToCart}
          </Button>
        </div>

        <Button variant="gold-solid" className="h-8 w-full text-xs" onClick={handleBuyNow} disabled={unitPrice === null}>
          {t.featured.buyNow}
        </Button>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const t = useT();
  const [metal, setMetal] = useState<Metal>("gold");
  const [form, setForm] = useState<Form>("bar");
  const { data: rate } = useMetalRate(metal);

  const fine = rate ? Number(rate.pricePerGramBDT) : null;
  const price22k = fine !== null ? fine * PURITY_22K : null;

  return (
    <section id="products" className="scroll-mt-24 bg-black py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ---------- Header ---------- */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{t.featured.kicker}</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{t.featured.heading}</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-400">{t.featured.subheading}</p>
          </div>
          <Link
            href="/buy-gold"
            className="flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
          >
            {t.featured.viewAll}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* ---------- Metal / form toggles ---------- */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
            {(["gold", "silver"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetal(m)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors",
                  metal === m ? "bg-gold text-ink" : "text-neutral-300 hover:text-white"
                )}
              >
                {t.featured[m === "gold" ? "metalGold" : "metalSilver"]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
            {(["bar", "coin"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setForm(f)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors",
                  form === f ? "bg-gold text-ink" : "text-neutral-300 hover:text-white"
                )}
              >
                {t.featured[f === "bar" ? "formBar" : "formCoin"]}
              </button>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-white">
            <ShieldCheck className="size-3.5 text-gold" />
            {t.featured.karatBadge}
          </span>
        </div>

        {/* ---------- Grid ---------- */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {WEIGHTS.map((weight) => (
            <ProductCard key={weight.grams} metal={metal} form={form} weight={weight} pricePerGram22k={price22k} />
          ))}
        </div>
      </div>
    </section>
  );
}
