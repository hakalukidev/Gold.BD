"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Award, Headset, ShieldCheck, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/use-t";
import { TrustFeatures } from "./trust-features";

const GoldCoinScene = dynamic(() => import("@/components/landing/gold-coin-scene"), {
  ssr: false,
  loading: () => <div className="mx-auto aspect-square w-full animate-pulse rounded-full bg-gold/10" />,
});

const HIGHLIGHT_ICONS = [Award, ShieldCheck, Headset] as const;

export function HeroSection() {
  const t = useT();
  const coinParallaxRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (reducedMotionRef.current || !coinParallaxRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    coinParallaxRef.current.style.transform = `translate3d(${relX * 24}px, ${relY * 16}px, 0)`;
  }

  function handleMouseLeave() {
    if (coinParallaxRef.current) coinParallaxRef.current.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <div
      className="relative flex h-[calc(100vh-5rem)] min-h-[calc(100vh-5rem)] flex-col overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Atmospheric gold glow, light trail and dust — a real rendered asset rather
          than hand-rolled gradients, anchored right/bottom under the coin. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/hero_background.png')] bg-cover bg-bottom-right bg-no-repeat opacity-90"
      />

      <section className="relative flex flex-1 flex-col justify-center-safe overflow-y-auto">
        <div className="relative mx-auto grid w-full max-w-6xl place-items-center gap-5 px-4 py-4 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-w-0 space-y-3 text-center lg:text-left"
          >
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-white uppercase sm:text-sm">
              {t.hero.eyebrow}
            </p>

            <h1 className="font-display text-3xl leading-[1.15] font-bold tracking-tight text-gold uppercase sm:text-4xl lg:text-[44px]">
              {t.hero.headingLine1}
              <br />
              {t.hero.headingLine2Before}
              {t.hero.headingLine2Gold}
              {t.hero.headingLine2After}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 lg:justify-start">
              {t.hero.highlights.map((highlight, i) => {
                const Icon = HIGHLIGHT_ICONS[i];
                return (
                  <div key={highlight.label} className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Icon className="size-3.5" strokeWidth={2} />
                    </span>
                    <span className="text-[11px] font-semibold tracking-wide text-neutral-200 uppercase sm:text-xs">
                      {highlight.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                nativeButton={false}
                className="btn-gold-shine h-12 w-full gap-2 px-6 text-sm uppercase shadow-[0_0_30px_rgba(212,166,42,0.2)] transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto"
                render={
                  <Link href="/register">
                    <ShoppingBag className="size-4" />
                    {t.hero.ctaPrimary}
                  </Link>
                }
              />
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="h-12 w-full gap-2 border-gold/50 bg-transparent px-6 text-sm uppercase text-gold transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-ink hover:shadow-[0_0_30px_rgba(212,166,42,0.3)] sm:w-auto"
                render={
                  <a href="#rate-history">
                    {t.hero.ctaSecondary}
                    <TrendingUp className="size-4" />
                  </a>
                }
              />
            </div>
          </motion.div>

          {/* ---------- Gold coin visual ---------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto w-full min-w-0 max-w-44 self-center sm:max-w-56 lg:max-w-72 lg:self-center"
          >
            <div ref={coinParallaxRef} className="relative transition-transform duration-300 ease-out">
              {/* Tight golden halo hugging the coin, layered over the background image's own glow. */}
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(244,198,78,0.25)_0%,rgba(212,166,42,0.12)_25%,transparent_65%)] blur-[60px]" />

              <div className="coin-float">
                <GoldCoinScene />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---------- Trust features panel ---------- */}
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6 lg:px-8 lg:pb-6">
          <div className="flex rounded-md border border-gold/20 bg-white/3 px-4 py-3 backdrop-blur-sm">
            <TrustFeatures />
          </div>
        </div>
      </section>
    </div>
  );
}
