import { providers, type Provider } from "../data/providers";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const priced = providers
  .map((provider) => provider.pricing.entry_price_usd_month)
  .filter((value): value is number => value !== null);

const minPrice = priced.length ? Math.min(...priced) : 0;
const maxPrice = priced.length ? Math.max(...priced) : 0;

function normalizedEntryScore(entryPrice: number | null): number {
  if (entryPrice === null) return 1;
  if (maxPrice === minPrice) return 3;
  const normalized = ((maxPrice - entryPrice) / (maxPrice - minPrice)) * 3;
  return clamp(normalized, 0, 3);
}

function modelDiversityScore(provider: Provider): number {
  const capabilities = [
    provider.capabilities.text_chat,
    provider.capabilities.image,
    provider.capabilities.video,
    provider.capabilities.audio,
    provider.capabilities.code,
    provider.capabilities.agent_automation,
  ];

  const count = capabilities.filter(Boolean).length;
  return clamp((count / 6) * 2, 0, 2);
}

export function getProviderValueScore(provider: Provider): {
  raw: number;
  score10: number;
} {
  const freePlanScore = provider.pricing.free_plan.available === true ? 2 : 0;
  const entryPriceScore = normalizedEntryScore(provider.pricing.entry_price_usd_month);
  const apiScore = provider.integrations.api === true ? 1 : 0;
  const commercialScore = provider.limits.commercial_use === "allowed" ? 1 : 0;
  const diversityScore = modelDiversityScore(provider);

  const raw = freePlanScore + entryPriceScore + apiScore + commercialScore + diversityScore;
  const score10 = clamp((raw / 9) * 10, 0, 10);

  return {
    raw: Number(raw.toFixed(2)),
    score10: Number(score10.toFixed(1)),
  };
}

export function getBestValueProviderId(list: Provider[] = providers): string | null {
  if (list.length === 0) return null;
  const scored = list.map((provider) => ({
    id: provider.id,
    score: getProviderValueScore(provider).score10,
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.id ?? null;
}
