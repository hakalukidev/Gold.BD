"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGoldRate } from "@/hooks/use-gold-rate";
import { formatBDT } from "@gold-bd/utils";
import { useT } from "@/lib/i18n/use-t";
import { LandingHeader } from "@/components/landing/landing-header";
import { WhySection } from "@/components/landing/why-section";
import { RateHistorySection } from "@/components/landing/rate-history-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TrustSection } from "@/components/landing/trust-section";
import { TaglineBanner } from "@/components/landing/tagline-banner";
import { FaqSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  const { data: rate, isLoading } = useGoldRate();
  const t = useT();

  return (
    <main className="flex flex-1 flex-col">
      <LandingHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-linear-to-br from-ink via-ink-light to-ink">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              {t.hero.eyebrow}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t.hero.headingLine1}
              <br />
              <span className="text-gold">{t.hero.headingLine2}</span>
            </h1>
            <p className="mx-auto max-w-lg text-base text-neutral-300 lg:mx-0">{t.hero.body}</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="w-full bg-gold text-ink hover:bg-gold-light sm:w-auto"
                render={<Link href="/register">{t.hero.ctaPrimary}</Link>}
              />
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                render={<Link href="/login">{t.hero.ctaSecondary}</Link>}
              />
            </div>
          </div>

          {/* ---------- Gold card visual ---------- */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-gold/30 via-gold-light/10 to-transparent blur-2xl" />
            <div className="relative rounded-3xl border border-gold/30 bg-ink-light/80 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wide text-gold">GOLD BD</span>
                <span className="rounded-full border border-gold/40 px-2 py-0.5 text-[10px] font-medium text-gold">
                  {t.hero.cardBadge}
                </span>
              </div>
              <div className="mt-8 h-28 rounded-xl bg-linear-to-br from-gold-light to-gold shadow-inner" />
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-xs text-neutral-400">{t.hero.cardRateLabel}</p>
                  <p className="text-2xl font-semibold text-white">
                    {isLoading ? "…" : rate ? formatBDT(rate.pricePerGramBDT) : t.hero.rateNotSet}
                  </p>
                  <p className="text-xs text-neutral-500">{t.hero.cardRateUnit}</p>
                </div>
                <span className="rounded-full bg-gold/10 px-2 py-1 text-[10px] font-medium text-gold">
                  {t.hero.cardLive}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhySection />
      <RateHistorySection />

      {/* ---------- Features ---------- */}
      <section id="features" className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.features.heading}</h2>
            <p className="mt-3 text-muted-foreground">{t.features.subheading}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.features.items.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="space-y-2 pt-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
                    <span className="text-lg">●</span>
                  </div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <HowItWorksSection />
      <TrustSection />
      <TaglineBanner />
      <FaqSection />

      {/* ---------- CTA footer band ---------- */}
      <section className="border-t bg-muted/30 py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <h2 className="text-xl font-semibold sm:text-2xl">{t.ctaBand.heading}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{t.ctaBand.body}</p>
          <Button
            size="lg"
            className="bg-gold text-ink hover:bg-gold-light"
            render={<Link href="/register">{t.ctaBand.cta}</Link>}
          />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
