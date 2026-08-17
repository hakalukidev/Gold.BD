"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveWhyTab, type WhyTab } from "@/store/slices/ui-slice";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

export function WhySection() {
  const activeTab = useAppSelector((state) => state.ui.activeWhyTab);
  const dispatch = useAppDispatch();
  const t = useT();

  const tabs: { id: WhyTab; label: string }[] = [
    { id: "asset", label: t.why.tabAsset },
    { id: "platform", label: t.why.tabPlatform },
  ];
  const active = t.why[activeTab];

  return (
    <section id="why" className="scroll-mt-24 bg-linear-to-b from-ink to-ink-light py-20">
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
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{active.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-300">{active.intro}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {active.points.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <p className="font-medium text-gold">{point.title}</p>
              <p className="mt-2 text-sm text-neutral-300">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
