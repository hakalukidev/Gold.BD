"use client";

import { Activity, Banknote, BookLock, IdCard, Layers, ShieldCheck, type LucideIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveWhyTab, type WhyTab } from "@/store/slices/ui-slice";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

// Icons are matched to each tab's points by index (both tabs carry exactly
// three points) rather than by title text, since the dictionary is
// locale-keyed and titles differ between `bn`/`en`.
const POINT_ICONS: Record<WhyTab, readonly LucideIcon[]> = {
  asset: [ShieldCheck, Banknote, Layers],
  platform: [BookLock, IdCard, Activity],
};

// Fanned "card deck" look: the outer two cards rotate around the vertical
// axis (a horizontal tilt, via `perspective()` + `rotateY()` — not an
// in-plane rotate) so the row reads as angled cards rather than flat tiles,
// while the centre card stays flat and slightly larger to anchor the row.
// Each card straightens on hover. Written as full `transform` values (not
// Tailwind's `scale-*`/`rotate-*` utilities) so nothing else composes into
// the same CSS variable and silently overrides it. Tilt only applies at
// `sm:` and up — below that the grid is a single column, where a 3D tilt
// would just look broken.
const CARD_TRANSFORMS = [
  "sm:origin-right sm:opacity-90 sm:[transform:perspective(1100px)_rotateY(24deg)_scale(0.93)] sm:hover:opacity-100 sm:hover:[transform:perspective(1100px)_rotateY(0deg)_scale(1.03)]",
  "sm:z-10 sm:[transform:scale(1.08)] sm:hover:[transform:scale(1.12)]",
  "sm:origin-left sm:opacity-90 sm:[transform:perspective(1100px)_rotateY(-24deg)_scale(0.93)] sm:hover:opacity-100 sm:hover:[transform:perspective(1100px)_rotateY(0deg)_scale(1.03)]",
] as const;

export function WhySection() {
  const activeTab = useAppSelector((state) => state.ui.activeWhyTab);
  const dispatch = useAppDispatch();
  const t = useT();

  const tabs: { id: WhyTab; label: string }[] = [
    { id: "asset", label: t.why.tabAsset },
    { id: "platform", label: t.why.tabPlatform },
  ];
  const active = t.why[activeTab];
  const icons = POINT_ICONS[activeTab];

  return (
    <section id="why" className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-20">
      {/* Blurred gold coin backdrop. Oversized (-inset-24) so the blur's soft
          edges fall outside the section's clipped bounds instead of fading
          to nothing right at the boundary. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-24 -z-20 bg-[url('/gold_coin.png')] bg-cover bg-center opacity-50 blur-3xl saturate-150"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-ink via-ink/60 to-ink-light"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => dispatch(setActiveWhyTab(tab.id))}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-gold/60 bg-gold/15 text-gold"
                  : "border-white/15 text-neutral-300 hover:border-white/30 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-balance text-white sm:text-3xl">{active.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-300">{active.intro}</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:gap-5">
          {active.points.map((point, i) => {
            const Icon = icons[i];
            return (
              <div
                key={point.title}
                className={cn(
                  "group relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/40 backdrop-blur-md transition-transform duration-500 ease-out sm:hover:z-20",
                  CARD_TRANSFORMS[i]
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <p className="mt-4 font-medium text-gold">{point.title}</p>
                <p className="mt-2 text-sm text-neutral-300">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
