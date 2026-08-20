"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cart-slice";
import { useMetalRate, type Metal } from "@/hooks/use-metal-rate";
import { PRODUCT_IMAGES, PRODUCT_WEIGHTS, PURITY_22K, effectivePricePerGram, type ProductForm, type ProductWeight } from "@/lib/products";
import { useT } from "@/lib/i18n/use-t";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LandingHeader } from "@/components/landing/landing-header";
import { GoldPriceTicker } from "@/components/landing/gold-price-ticker";
import { LandingFooter } from "@/components/landing/landing-footer";

type Sku = { id: string; metal: Metal; form: ProductForm; weight: ProductWeight };

const METALS = ["gold", "silver"] as const;
const FORMS = ["bar", "coin"] as const;

// The full catalog: every metal × form × weight combination, in one stable
// order — built once, not per render, since it never depends on any state.
const SKUS: Sku[] = METALS.flatMap((metal) => FORMS.flatMap((form) => PRODUCT_WEIGHTS.map((weight) => ({ id: `${metal}-${form}-${weight.grams}`, metal, form, weight }))));

export default function ProductsPage() {
  const t = useT();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: goldRate } = useMetalRate("gold");
  const { data: silverRate } = useMetalRate("silver");

  const [selectedId, setSelectedId] = useState(SKUS[0].id);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const fine22k = useMemo(() => {
    const goldFine = goldRate ? Number(goldRate.pricePerGramBDT) * PURITY_22K : null;
    const silverFine = silverRate ? Number(silverRate.pricePerGramBDT) * PURITY_22K : null;
    return { gold: goldFine, silver: silverFine } satisfies Record<Metal, number | null>;
  }, [goldRate, silverRate]);

  function skuTitle(sku: Sku) {
    const weightLabel = t.featured[sku.weight.key as "weight0_5" | "weight1" | "weight5" | "weight10"];
    const metalLabel = t.featured[sku.metal === "gold" ? "metalGold" : "metalSilver"];
    const formLabel = t.featured[sku.form === "bar" ? "formBar" : "formCoin"];
    return `${weightLabel} ${metalLabel} ${formLabel}`;
  }

  function skuPricing(sku: Sku) {
    const perGram = effectivePricePerGram(fine22k[sku.metal], sku.weight);
    const unitPrice = perGram !== null ? perGram * sku.weight.grams : null;
    return { perGram, unitPrice };
  }

  function selectSku(id: string) {
    setSelectedId(id);
    setQty(1);
  }

  const selected = SKUS.find((s) => s.id === selectedId) ?? SKUS[0];
  const selectedTitle = skuTitle(selected);
  const selectedImage = PRODUCT_IMAGES[selected.metal][selected.form];
  const { unitPrice } = skuPricing(selected);
  const totalPrice = unitPrice !== null ? unitPrice * qty : null;

  function addSelectedToCart() {
    if (unitPrice === null) return;
    dispatch(addToCart({ id: selected.id, name: selectedTitle, image: selectedImage, unitPriceBDT: unitPrice, quantity: qty }));
  }

  function handleAddToCart() {
    addSelectedToCart();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  function handleBuyNow() {
    addSelectedToCart();
    router.push("/buy-gold");
  }

  return (
    <main className="flex flex-1 flex-col">
      <GoldPriceTicker />
      <LandingHeader />

      <div className="bg-ink py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{t.featured.heading}</h1>
          <p className="mt-3 text-neutral-300">{t.productsPage.subheading}</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* ---------- Catalog grid ---------- */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SKUS.map((sku) => {
              const { unitPrice: skuUnitPrice } = skuPricing(sku);
              const isSelected = sku.id === selectedId;
              return (
                <button
                  key={sku.id}
                  type="button"
                  onClick={() => selectSku(sku.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex flex-col items-start rounded-2xl border bg-white/[0.03] p-4 text-left transition-colors",
                    isSelected ? "border-gold" : "border-white/10 hover:border-white/25"
                  )}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black">
                    <Image
                      src={PRODUCT_IMAGES[sku.metal][sku.form]}
                      alt={skuTitle(sku)}
                      fill
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 45vw"
                      className="object-contain p-4"
                    />
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">{skuTitle(sku)}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gold tabular-nums">
                    {skuUnitPrice !== null ? formatBDT(skuUnitPrice) : "—"}
                  </p>
                </button>
              );
            })}
          </div>

          {/* ---------- Selected product detail panel ---------- */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:sticky lg:top-24">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
              <Image src={selectedImage} alt={selectedTitle} fill sizes="380px" className="object-contain p-8" />
            </div>

            <p className="mt-5 text-xs font-semibold tracking-wide text-gold uppercase">· {t.productsPage.hallmarkBadge}</p>
            <h2 className="mt-1 text-xl font-bold text-white">{selectedTitle}</h2>

            <p className="mt-3">
              <span className="text-2xl font-extrabold text-gold tabular-nums">{totalPrice !== null ? formatBDT(totalPrice) : "—"}</span>
              <span className="ml-1.5 text-sm text-neutral-400">· {t.featured.vatIncluded}</span>
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex items-center rounded-full border border-white/15">
                <button
                  type="button"
                  aria-label={t.featured.decreaseQty}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex size-9 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-white tabular-nums">{qty}</span>
                <button
                  type="button"
                  aria-label={t.featured.increaseQty}
                  onClick={() => setQty((q) => q + 1)}
                  className="flex size-9 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="gold-outline" onClick={handleAddToCart} disabled={unitPrice === null}>
                {justAdded ? t.featured.added : t.featured.addToCart}
              </Button>
              <Button variant="gold-solid" onClick={handleBuyNow} disabled={unitPrice === null}>
                {t.featured.buyNow}
              </Button>
            </div>

            <ul className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5">
              {[t.productsPage.trustInsured, t.productsPage.trustCertificate, t.productsPage.trustSellBack].map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-neutral-300">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <LandingFooter />
    </main>
  );
}
