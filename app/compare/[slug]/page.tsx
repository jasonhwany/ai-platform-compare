import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlatformBestBadges } from "../../data/recommendation";
import { platforms } from "../../data/platforms";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Pair = {
  slug: string;
  a: (typeof platforms)[number];
  b: (typeof platforms)[number];
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-platform-compare.vercel.app";
const ogImage = `${siteUrl}/og-image.png`;

const comparePairs: Pair[] = platforms.flatMap((a, i) =>
  platforms.slice(i + 1).map((b) => ({
    slug: `${a.id}-vs-${b.id}`,
    a,
    b,
  })),
);

const findPairBySlug = (slug: string) =>
  comparePairs.find((pair) => pair.slug === slug);

export function generateStaticParams() {
  return comparePairs.map((pair) => ({ slug: pair.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pair = findPairBySlug(slug);

  if (!pair) {
    return {
      title: "비교 페이지를 찾을 수 없습니다 | AI Platform Compare",
      description: "요청한 비교 페이지를 찾을 수 없습니다.",
    };
  }

  const title = `${pair.a.name} vs ${pair.b.name} 가격 비교 | AI Platform Compare`;
  const description = `${pair.a.name}와 ${pair.b.name}의 요금, 기능, 장단점 비교 분석`;
  const url = `${siteUrl}/compare/${pair.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/compare/${pair.slug}` },
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

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const pair = findPairBySlug(slug);

  if (!pair) {
    notFound();
  }

  const aBadges = getPlatformBestBadges(pair.a.id);
  const bBadges = getPlatformBestBadges(pair.b.id);

  const relatedArticles = [
    { href: `/platform/${pair.a.id}`, label: `${pair.a.name} 플랫폼 분석` },
    { href: `/platform/${pair.b.id}`, label: `${pair.b.name} 플랫폼 분석` },
    { href: `/price/${pair.a.id}`, label: `${pair.a.name} 가격 전략` },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${siteUrl}/compare/${pair.slug}` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${pair.a.name} vs ${pair.b.name}`,
        item: `${siteUrl}/compare/${pair.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${pair.a.name}와 ${pair.b.name} 중 어떤 서비스가 입문자에게 유리한가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "온보딩 난이도, 기본 UI, 기본 요금 구조를 함께 보면 입문자 적합도를 빠르게 판단할 수 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: `${pair.a.name} vs ${pair.b.name} 비교에서 가격 외 필수 기준은 무엇인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "성능 안정성, 기능 확장성, 운영 보안 요건 충족 여부를 동시에 비교해야 장기 선택 리스크를 줄일 수 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: "예산이 제한된 팀은 어떻게 선택하는 것이 좋나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "무료/저비용 파일럿으로 시작하고 핵심 성능 작업만 상위 요금으로 분리하는 전략이 유리합니다.",
        },
      },
      {
        "@type": "Question",
        name: "최종 선택 전에 반드시 확인해야 할 항목은 무엇인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "실사용 시나리오 비용, 품질 테스트, 팀 운영 정책을 확인한 뒤 선택해야 재도입 비용을 줄일 수 있습니다.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {pair.a.name} vs {pair.b.name}
          </h1>
          <p className="mt-3 text-slate-300">두 플랫폼의 가격, 기능, 운영 관점 차이를 의사결정 기준으로 정리했습니다.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
              <p className="text-sm font-semibold text-slate-200">{pair.a.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {aBadges.map((badge) => (
                  <span
                    key={`a-${badge}`}
                    className="rounded-full bg-amber-300/20 px-2 py-0.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/40"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
              <p className="text-sm font-semibold text-slate-200">{pair.b.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {bBadges.map((badge) => (
                  <span
                    key={`b-${badge}`}
                    className="rounded-full bg-amber-300/20 px-2 py-0.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/40"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Comparison Summary</h2>
          <p className="mt-4 text-slate-300">
            {pair.a.name}는 {pair.a.bestFor}에 강하고, {pair.b.name}는 {pair.b.bestFor} 흐름에서 강점을 보입니다. 예산이 핵심이면
            무료/저비용 구간의 한도를 먼저 비교하고, 전문 운영이 목표면 고급 기능과 팀 제어 옵션을 우선 확인하는 전략이
            효율적입니다.
          </p>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-3 font-medium">항목</th>
                <th className="px-3 py-3 font-medium">{pair.a.name}</th>
                <th className="px-3 py-3 font-medium">{pair.b.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-3 text-slate-400">Category</td>
                <td className="px-3 py-3">{pair.a.category}</td>
                <td className="px-3 py-3">{pair.b.category}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-3 text-slate-400">Pricing</td>
                <td className="px-3 py-3 text-emerald-300">{pair.a.pricing}</td>
                <td className="px-3 py-3 text-emerald-300">{pair.b.pricing}</td>
              </tr>
              <tr>
                <td className="px-3 py-3 text-slate-400">Best For</td>
                <td className="px-3 py-3">{pair.a.bestFor}</td>
                <td className="px-3 py-3">{pair.b.bestFor}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Best for beginners</h2>
            <p className="mt-3 text-slate-300">입문자라면 초기 설정과 학습 곡선이 낮은 플랫폼을 우선 선택하세요.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Best for professionals</h2>
            <p className="mt-3 text-slate-300">전문 팀은 통제 기능, API 확장성, 품질 일관성을 가장 먼저 확인해야 합니다.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Best for budget users</h2>
            <p className="mt-3 text-slate-300">예산 중심이면 저비용 모델 라우팅이 가능한 플랫폼이 장기적으로 유리합니다.</p>
          </article>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-6">
          <h2 className="text-2xl font-semibold">Final Recommendation Block</h2>
          <p className="mt-3 text-slate-200">Best for: 빠른 실행을 원하는 팀은 {pair.a.name}, 안정적 확장을 원하는 팀은 {pair.b.name}</p>
          <p className="mt-3 text-lg font-bold text-emerald-200">
            Recommended: 두 플랫폼 모두 파일럿 테스트 후, 비용/품질 점수가 높은 쪽으로 즉시 전환하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/price/${pair.a.id}`}
              className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-200"
            >
              Compare Pricing for {pair.a.name}
            </Link>
            <Link
              href={`/price/${pair.b.id}`}
              className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-200"
            >
              Compare Pricing for {pair.b.name}
            </Link>
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
