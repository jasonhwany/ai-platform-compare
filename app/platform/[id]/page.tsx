import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlatformBestBadges } from "../../data/recommendation";
import { platforms } from "../../data/platforms";

type PageProps = {
  params: Promise<{ id: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-platform-compare.vercel.app";
const ogImage = `${siteUrl}/og-image.png`;

const findPlatform = (id: string) =>
  platforms.find((platform) => platform.id === id);

export function generateStaticParams() {
  return platforms.map((platform) => ({ id: platform.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const platform = findPlatform(id);

  if (!platform) {
    return {
      title: "플랫폼을 찾을 수 없습니다 | AI Platform Compare",
      description: "요청한 플랫폼 정보를 찾을 수 없습니다.",
    };
  }

  const title = `${platform.name} 기능 및 활용 가이드 | AI Platform Compare`;
  const description = `${platform.name} 핵심 기능, 가격 포인트, 비교 추천 조합까지 한 번에 확인하세요.`;
  const url = `${siteUrl}/platform/${platform.id}`;

  return {
    title,
    description,
    alternates: { canonical: `/platform/${platform.id}` },
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
  const platform = findPlatform(id);

  if (!platform) {
    notFound();
  }

  const bestBadges = getPlatformBestBadges(platform.id);
  const relatedPlatforms = platforms.filter((item) => item.id !== platform.id);
  const relatedComparePages = relatedPlatforms
    .map((item) => ({
      slug: [platform.id, item.id].sort().join("-vs-"),
      label: `${platform.name} vs ${item.name}`,
    }))
    .slice(0, 3);

  const relatedArticles = [
    { href: `/price/${platform.id}`, label: `${platform.name} 가격 전략 상세` },
    ...relatedComparePages.slice(0, 2).map((item) => ({
      href: `/compare/${item.slug}`,
      label: `${item.label} 실제 비교 리포트`,
    })),
  ];

  const bestForSummary = `${platform.bestFor}에 가장 적합`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Platform",
        item: `${siteUrl}/platform/${platform.id}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: platform.name,
        item: `${siteUrl}/platform/${platform.id}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${platform.name}는 어떤 팀이 가장 빠르게 효과를 볼 수 있나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "반복 텍스트 작업, 고객 응답 자동화, 문서 요약 같은 업무 비중이 큰 팀에서 도입 효과가 빠르게 나타납니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name} 도입 시 비용을 먼저 어떻게 계산해야 하나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "핵심 시나리오를 먼저 고정하고 월간 사용량 상한을 설정한 뒤 실제 데이터를 바탕으로 확장하는 방식이 안전합니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name}를 다른 플랫폼과 비교할 때 우선순위는 무엇인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "가격뿐 아니라 모델 품질, 생태계 연동성, 운영 통제 기능을 동시에 비교해야 장기 운영 리스크를 줄일 수 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name}를 피해야 하는 경우도 있나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI 기능이 핵심 가치와 연결되지 않거나 운영 정책 없이 단기 실험만 반복하는 팀에는 비효율이 생길 수 있습니다.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{platform.name}</h1>
            <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
              {platform.category}
            </span>
          </div>
          <p className="mt-3 text-lg text-slate-300">{platform.tagline}</p>
          {bestBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {bestBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-amber-300/20 px-2.5 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/40"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </header>

        <section className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Need a Full AI Stack, Not Just One Tool?</h2>
              <p className="mt-1 text-sm text-slate-200">
                Use the recommender wizard to get a stack matched to your goal and budget.
              </p>
            </div>
            <Link
              href="/recommend"
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-200"
            >
              Try AI Stack Recommender
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="mt-4 text-slate-300">
            {platform.name}는 {platform.category} 영역에서 널리 비교되는 서비스입니다. 실제 도입에서 중요한 포인트는 기능 개수보다
            조직의 목표와 적합성입니다. {platform.bestFor}처럼 적용 맥락이 명확하면 도입 효과가 빠르게 나타나고, 반대로 목표가
            불명확하면 비용만 증가할 수 있습니다. 따라서 도입 전에는 대표 시나리오를 먼저 설정하고 품질/비용 기준을 함께
            정의하는 것이 필수입니다.
          </p>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Core Features Explained</h2>
          <p className="mt-4 text-slate-300">
            핵심 기능은 {platform.highlights.join(", ")}로 요약됩니다. 중요한 점은 모든 요청에 같은 고급 기능을 쓰는 것이 아니라,
            작업 난이도별로 기능 사용 정책을 분리해 성능과 비용을 균형화하는 것입니다.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Real-world Use Cases</h2>
          <ul className="mt-4 grid gap-3 text-slate-300">
            <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">고객 지원 자동화와 답변 품질 표준화</li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">마케팅 콘텐츠 제작 주기 단축</li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">내부 문서 검색과 지식 요약 자동화</li>
          </ul>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Pros</h2>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">핵심 기능이 명확해 초기 도입 판단이 빠릅니다.</li>
              <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">업무 단위 확장이 쉬워 운영 성숙도에 맞춰 확대할 수 있습니다.</li>
              <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">플랫폼 비교/가격 페이지와 연결해 의사결정 흐름을 완성하기 쉽습니다.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Cons</h2>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">사용량 급증 시 월간 비용 변동성이 커질 수 있습니다.</li>
              <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">품질 운영 기준이 없으면 결과 편차가 커질 수 있습니다.</li>
              <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">보안/권한 정책을 늦게 설계하면 운영 부담이 증가합니다.</li>
            </ul>
          </article>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Who should use it?</h2>
            <p className="mt-4 text-slate-300">{platform.bestFor}인 팀, 즉 도입 목표와 운영 지표를 함께 설계할 수 있는 팀에 적합합니다.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Who should avoid it?</h2>
            <p className="mt-4 text-slate-300">단기 실험만 반복하거나 운영 정책 없이 즉시 확장하려는 팀에는 효율이 낮을 수 있습니다.</p>
          </article>
        </section>

        <section className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-6">
          <h2 className="text-2xl font-semibold">Final Recommendation Block</h2>
          <p className="mt-3 text-slate-200">Best for: {bestForSummary}</p>
          <p className="mt-3 text-lg font-bold text-emerald-200">
            Recommended: {platform.name}를 핵심 워크플로우 1개에 먼저 적용하고, 성과 확인 후 확장하세요.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/price/${platform.id}`}
              className="inline-flex items-center rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-200"
            >
              Start with Pricing Plan
            </Link>
            <a
              href={platform.links.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-100 hover:border-slate-500"
            >
              Launch Free Trial on {platform.name}
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Related Articles</h2>
          <div className="mt-4 grid gap-2">
            {relatedArticles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
              >
                {article.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="ad-slot-placeholder" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
