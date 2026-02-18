import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "../../components/AdSlot";
import CompareProviderButton from "../../components/CompareProviderButton";
import { TrackedExternalLink, TrackedLink } from "../../components/tracked-link";
import { getPlatformBestBadges } from "../../data/recommendation";
import { getProviderById, providers } from "../../data/providers";

type PageProps = {
  params: Promise<{ id: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-platform-compare.vercel.app";
const ogImage = `${siteUrl}/og-image.png`;

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

  const title = `${provider.name} 상세 비교 가이드 | AI Platform Compare`;
  const description = `${provider.name}의 요금, 기능, 정책, 연동 정보를 데이터 기반으로 확인하세요.`;
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
  const relatedComparePages = providers
    .filter((item) => item.id !== provider.id)
    .slice(0, 3)
    .map((item) => ({
      href: `/compare/${[provider.id, item.id].sort().join("-vs-")}`,
      label: `${provider.name} vs ${item.name}`,
    }));

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

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="text-slate-400">카테고리</p>
              <p className="mt-1 text-slate-100">{provider.category_tags.join(", ")}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="text-slate-400">최종 검증일</p>
              <p className="mt-1 text-slate-100">{provider.last_verified}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="text-slate-400">입문 가격(월)</p>
              <p className="mt-1 text-slate-100">
                {provider.pricing.entry_price_usd_month !== null ? `$${provider.pricing.entry_price_usd_month}` : "—"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <CompareProviderButton providerId={provider.id} />
            {provider.pricing.api_pricing_link ? (
              <TrackedExternalLink
                href={provider.pricing.api_pricing_link}
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-100 hover:border-slate-500"
                payload={{ target: provider.pricing.api_pricing_link, platformId: provider.id }}
              >
                공식 요금 링크 확인
              </TrackedExternalLink>
            ) : (
              <TrackedExternalLink
                href={provider.website}
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-100 hover:border-slate-500"
                payload={{ target: provider.website, platformId: provider.id }}
              >
                공식 사이트 이동
              </TrackedExternalLink>
            )}
          </div>
        </header>

        <AdSlot id={`platform-${provider.id}-hero`} label="Platform Hero Ad Slot" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">핵심 기능</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm">
              <p>Text/Chat: {provider.capabilities.text_chat ? "예" : "아니오"}</p>
              <p className="mt-1">Image: {provider.capabilities.image ? "예" : "아니오"}</p>
              <p className="mt-1">Video: {provider.capabilities.video ? "예" : "아니오"}</p>
              <p className="mt-1">Audio: {provider.capabilities.audio ? "예" : "아니오"}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm">
              <p>Code: {provider.capabilities.code ? "예" : "아니오"}</p>
              <p className="mt-1">Agent/Automation: {provider.capabilities.agent_automation ? "예" : "아니오"}</p>
              <p className="mt-1">
                모델 선택: {provider.capabilities.model_choice.available ? "예" : "아니오"}
                {provider.capabilities.model_choice.note ? ` (${provider.capabilities.model_choice.note})` : ""}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">활용 추천</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="font-semibold text-slate-100">Blog</p>
              <p className="mt-1 text-slate-300">{provider.best_for.blog.join(", ")}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="font-semibold text-slate-100">Shorts</p>
              <p className="mt-1 text-slate-300">{provider.best_for.shorts.join(", ")}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="font-semibold text-slate-100">Design</p>
              <p className="mt-1 text-slate-300">{provider.best_for.design.join(", ")}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="font-semibold text-slate-100">Coding</p>
              <p className="mt-1 text-slate-300">{provider.best_for.coding.join(", ")}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
              <p className="font-semibold text-slate-100">Business</p>
              <p className="mt-1 text-slate-300">{provider.best_for.business.join(", ")}</p>
            </div>
          </div>
        </section>

        <AdSlot id={`platform-${provider.id}-mid`} label="Platform Mid Content Ad Slot" />

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
              홈에서 이 공급자 비교 시작
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

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">관련 비교 링크</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {relatedComparePages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
            <Link href="/recommend?goal=blog&budget=under20&skill=beginner" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 hover:border-slate-500">블로그 입문 조합</Link>
            <Link href="/recommend?goal=video&budget=flexible&skill=intermediate" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 hover:border-slate-500">영상 성장 조합</Link>
            <Link href="/recommend?goal=design&budget=free&skill=beginner" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 hover:border-slate-500">디자인 무료 조합</Link>
          </div>
        </section>

        <AdSlot id={`platform-${provider.id}-bottom`} label="Platform Bottom Ad Slot" />
      </div>
    </main>
  );
}
