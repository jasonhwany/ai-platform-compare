import { providers } from "./providers";

export type Platform = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  pricing: string;
  highlights: string[];
  bestFor: string;
  links: {
    website: string;
  };
  badges: string[];
};

export const platforms: Platform[] = providers.map((provider) => ({
  id: provider.id,
  name: provider.name,
  tagline: provider.tagline,
  category: provider.category_tags.join(", "),
  pricing:
    provider.pricing.entry_price_usd_month !== null
      ? `$${provider.pricing.entry_price_usd_month}/mo${provider.pricing.usage_based ? " + 사용량" : ""}`
      : provider.pricing.free_plan.available
        ? "무료 플랜 중심"
        : "요금 정보 확인 필요",
  highlights: [
    ...provider.category_tags.slice(0, 2),
    provider.capabilities.model_choice.note ?? "모델 선택 정보",
  ],
  bestFor: provider.best_for.business[0] ?? provider.best_for.blog[0] ?? "업무 자동화",
  links: { website: provider.website },
  badges: provider.badges,
}));
