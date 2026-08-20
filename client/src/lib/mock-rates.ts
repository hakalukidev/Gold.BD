import type { MetalRateSummary } from "@/types";

export type Metal = "gold" | "silver";

/**
 * Stand-in for the real rate feed until a backend exists (see CLAUDE.md — this
 * repo has no `/api/*` implementation of its own). Each metal is anchored to
 * the dummy figure gold-price-ticker.tsx already uses (24K gold ৳21,839/g,
 * silver ৳385/g — the latter also being the calculator's silver default) so
 * every price shown across the site agrees with every other.
 */
const ANCHOR_PRICE_PER_GRAM: Record<Metal, number> = {
  gold: 21839,
  silver: 385,
};

// Silver is the more volatile of the two, so it gets a wider daily swing.
const DAILY_VOLATILITY: Record<Metal, number> = {
  gold: 0.01,
  silver: 0.018,
};

const HISTORY_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;

// Deterministic PRNG (mulberry32) so the walk — and therefore every price on
// the site — stays stable across requests instead of jittering on refetch.
function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildHistory(metal: Metal): MetalRateSummary[] {
  // Distinct seeds so gold and silver don't trace the same shape.
  const rand = mulberry32(metal === "gold" ? 20260817 : 19980412);
  const now = Date.now();
  const volatility = DAILY_VOLATILITY[metal];

  // Walk backward from today's anchor price so the series always ends exactly
  // on the ticker's dummy figure, with a mild upward drift into the past
  // (i.e. prices were a bit lower further back) plus daily noise.
  const prices: number[] = [ANCHOR_PRICE_PER_GRAM[metal]];
  for (let i = 1; i < HISTORY_DAYS; i++) {
    const dailyChangePct = (rand() - 0.5) * volatility + 0.0008;
    prices.push(prices[i - 1] / (1 + dailyChangePct));
  }
  prices.reverse();

  return prices.map((price, i) => ({
    pricePerGramBDT: price.toFixed(2),
    effectiveAt: new Date(now - (HISTORY_DAYS - 1 - i) * DAY_MS).toISOString(),
  }));
}

const cachedHistory: Partial<Record<Metal, MetalRateSummary[]>> = {};

export function getRateHistory(metal: Metal): MetalRateSummary[] {
  cachedHistory[metal] ??= buildHistory(metal);
  return cachedHistory[metal];
}

export function getLatestRate(metal: Metal): MetalRateSummary {
  const history = getRateHistory(metal);
  return history[history.length - 1];
}
