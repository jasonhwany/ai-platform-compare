import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "../../components/AdSlot";
import CompareProviderButton from "../../components/CompareProviderButton";
import ProviderFaq from "../../components/ProviderFaq";
import { TrackedExternalLink, TrackedLink } from "../../components/tracked-link";
import { getPlatformBestBadges } from "../../data/recommendation";
import { getProviderById, providers } from "../../data/providers";
import { getProviderValueScore } from "../../lib/value-score";

type PageProps = {
  params: Promise<{ id: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-platform-compare.vercel.app";
const ogImage = `${siteUrl}/og-image.png`;

function toKoreanBool(value: boolean | null) {
  if (value === null) return "정보 미확인";
  return value ? "예" : "아니오";
}

export function generateStaticParams() {
  return providers.map((provider) => ({ id: provider.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const provider = getProviderById(id);

  if (!provider) {
    return {
      title: "플랫폼을 찾을 수 없습니다 | AI Platform Compare",
      description: "요청한 플랫폼 정보를 찾을 수 없습니다.",
    };
  }

  const entryPrice =
    provider.pricing.entry_price_usd_month !== null
      ? `$${provider.pricing.entry_price_usd_month}/월`
      : "가격 미확인";
  const title = `${provider.name} Pricing & Comparison (2026 Updated)`;
  const description = `${provider.name} 요금: ${entryPrice} · 최종 검증일: ${provider.last_verified} · 실사용 비교 가이드 제공`;
  const url = `${siteUrl}/platform/${provider.id}`;

  return {
    title,
    description,
    alternates: { canonical: `/platform/${provider.id}` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "AI Platform Compare" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PlatformDetailPage({ params }: PageProps) {
  const { id } = await params;
  const provider = getProviderById(id);

  if (!provider) {
    notFound();
  }

  const bestBadges = getPlatformBestBadges(provider.id);
  const valueScore = getProviderValueScore(provider);

  const getTagSet = (target: (typeof providers)[number]) =>
    new Set(
      [
        ...target.best_for.blog,
        ...target.best_for.shorts,
        ...target.best_for.design,
        ...target.best_for.coding,
        ...target.best_for.business,
      ].filter((item) => item !== "—"),
    );

  const sourceTags = getTagSet(provider);

  const similarProviders = providers
    .filter((item) => item.id !== provider.id)
    .map((item) => {
      const tags = getTagSet(item);
      let overlap = 0;
      sourceTags.forEach((tag) => {
        if (tags.has(tag)) overlap += 1;
      });
      return { item, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map(({ item }) => ({
      href: `/compare/${[provider.id, item.id].sort().join("-vs-")}`,
      label: `${provider.name} vs ${item.name}`,
    }));

  const faqItems = [
    {
      question: `${provider.name} 무료 플랜이 있나요?`,
      answer: provider.pricing.free_plan.available
        ? `예. ${provider.pricing.free_plan.note ?? "무료 플랜이 제공됩니다."}`
        : provider.pricing.free_plan.available === false
          ? "무료 플랜은 확인되지 않았습니다."
          : "무료 플랜 정보가 검증되지 않았습니다.",
    },
    {
      question: `${provider.name} 입문 가격은 얼마인가요?`,
      answer:
        provider.pricing.entry_price_usd_month !== null
          ? `입문 가격은 월 $${provider.pricing.entry_price_usd_month} 기준으로 확인되었습니다.`
          : "입문 가격은 현재 검증되지 않았습니다.",
    },
    {
      question: `${provider.name}는 상업적 사용이 가능한가요?`,
      answer:
        provider.limits.commercial_use === "allowed"
          ? "상업적 사용 가능으로 확인되었습니다."
          : "상업적 사용 정책은 공식 문서 추가 확인이 필요합니다.",
    },
    {
      question: `${provider.name} API 연동이 가능한가요?`,
      answer: provider.integrations.api
        ? "API 연동이 가능하며 자동화 워크플로우에 연결할 수 있습니다."
        : "API 연동 정보는 제한적이거나 미확인 상태입니다.",
    },
    {
      question: `${provider.name} 데이터는 언제 검증되었나요?`,
      answer: `현재 페이지의 데이터 최종 검증일은 ${provider.last_verified} 입니다.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">공급자 상세</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{provider.name}</h1>
          <p className="mt-3 text-slate-300">{provider.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {provider.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300"
              >
                {badge}
              </span>
            ))}
            {bestBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-amber-300/20 px-2.5 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/40"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="text-slate-400">카테고리</p>
              <p className="mt-1 text-slate-100">{provider.category_tags.join(", ")}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="text-slate-400">최종 검증일</p>
              <p className="mt-1 text-slate-100">Last verified on: {provider.last_verified}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="text-slate-400">데이터 출처</p>
              <p className="mt-1 text-slate-100">Data source: Official website</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="text-slate-400">Value Score</p>
              <p className="mt-1 text-emerald-300">{valueScore.score10}/10</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <CompareProviderButton providerId={provider.id} label="Add to Compare" />
            <TrackedExternalLink
              href={provider.pricing.api_pricing_link ?? provider.website}
              className="inline-flex items-center rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-200"
              payload={{ target: provider.pricing.api_pricing_link ?? provider.website, platformId: provider.id }}
              eventType="official_link_click"
            >
              View Official Pricing
            </TrackedExternalLink>
            <TrackedExternalLink
              href={provider.website}
              className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-100 hover:border-slate-500"
              payload={{ target: provider.website, platformId: provider.id }}
              eventType="official_link_click"
            >
              Start Free Trial
            </TrackedExternalLink>
          </div>
        </header>

        <AdSlot id={`platform-${provider.id}-hero`} label="Platform Above Fold Banner Slot" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">핵심 기능</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm">
              <p>Text/Chat: {toKoreanBool(provider.capabilities.text_chat)}</p>
              <p className="mt-1">Image: {toKoreanBool(provider.capabilities.image)}</p>
              <p className="mt-1">Video: {toKoreanBool(provider.capabilities.video)}</p>
              <p className="mt-1">Audio: {toKoreanBool(provider.capabilities.audio)}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm">
              <p>Code: {toKoreanBool(provider.capabilities.code)}</p>
              <p className="mt-1">Agent/Automation: {toKoreanBool(provider.capabilities.agent_automation)}</p>
              <p className="mt-1">
                모델 선택: {toKoreanBool(provider.capabilities.model_choice.available)}
                {provider.capabilities.model_choice.note ? ` (${provider.capabilities.model_choice.note})` : ""}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">유사 도구와 비교</h2>
          <p className="mt-2 text-sm text-slate-300">best_for 태그 유사도를 기준으로 비교 링크를 자동 생성합니다.</p>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {similarProviders.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <AdSlot id={`platform-${provider.id}-mid`} label="Platform Mid Content Slot" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <ProviderFaq providerId={provider.id} items={faqItems} />
        </section>

        <section className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-6">
          <h2 className="text-xl font-semibold">최종 추천</h2>
          <p className="mt-3 text-slate-200">이 공급자는 {provider.best_for.business[0] ?? provider.best_for.blog[0] ?? "업무 자동화"}에 특히 적합합니다.</p>
          <p className="mt-2 text-lg font-bold text-emerald-200">요금 링크 확인 후 홈에서 2~3개 공급자를 함께 비교하는 방식이 가장 안전합니다.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <TrackedLink
              href={`/?compare=${provider.id}`}
              className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-200"
              payload={{ target: `/?compare=${provider.id}`, platformId: provider.id }}
            >
              Add to Compare
            </TrackedLink>
            <TrackedLink
              href="/recommend"
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-100 hover:border-slate-500"
              payload={{ target: "/recommend", platformId: provider.id }}
            >
              AI 스택 추천기 열기
            </TrackedLink>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-xs text-slate-400">
          We independently verify pricing monthly.
        </section>

        <AdSlot id={`platform-${provider.id}-bottom`} label="Platform End Page Slot" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
