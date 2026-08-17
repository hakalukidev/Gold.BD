"use client";

import Link from "next/link";
import { Sparkles, BadgeCheck, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/use-t";

/**
 * A soft, elegant "light" interlude between the dark ink/gold bands — an
 * abstract coin illustration (no stock photography, nothing borrowed) stands
 * in for the product shot a jewelry brand would use here.
 */
function GoldMedallionArt() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
      {/* backdrop box, echoes a product-photography plinth */}
      <div className="absolute inset-6 rounded-[2.5rem] bg-blush" />

      {/* sparkle accent */}
      <Sparkles className="absolute left-4 top-4 size-6 text-gold/70" />

      {/* medallion */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex size-40 items-center justify-center rounded-full bg-linear-to-br from-gold-light via-gold to-[#9c7d3d] shadow-2xl">
          <div className="flex size-32 items-center justify-center rounded-full border-2 border-ink/10">
            <span className="font-script text-3xl text-ink/70">Au</span>
          </div>
        </div>
      </div>

      {/* verified seal, bottom-right, overlapping the frame like the reference */}
      <div className="absolute bottom-2 right-2 flex size-20 flex-col items-center justify-center gap-1 rounded-full border border-gold/40 bg-cream text-center shadow-lg">
        <BadgeCheck className="size-5 text-gold" />
      </div>
    </div>
  );
}

export function BrandStorySection() {
  const t = useT();

  return (
    <section id="about" className="scroll-mt-24 bg-linear-to-b from-cream to-cream-deep py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2.5rem] bg-white/70 shadow-xl ring-1 ring-ink/5 backdrop-blur-sm">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <GoldMedallionArt />

            <div className="text-center lg:text-left">
              <p className="font-script text-3xl text-gold/70">{t.story.wordmark}</p>
              <p className="mt-1 text-sm font-medium tracking-wide text-ink/50">{t.story.kicker}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{t.story.heading}</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/70 lg:mx-0">{t.story.body}</p>

              <Link
                href="#how-it-works"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-light"
              >
                {t.story.cta}
                <ArrowRight className="size-4" />
              </Link>

              <p className="mt-4 text-xs text-ink/40">{t.story.sealText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
