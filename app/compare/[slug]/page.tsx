import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    alternates: {
      canonical: `/compare/${pair.slug}`,
    },
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

  const relatedArticles = [
    { href: `/platform/${pair.a.id}`, label: `${pair.a.name} 플랫폼 분석` },
    { href: `/platform/${pair.b.id}`, label: `${pair.b.name} 플랫폼 분석` },
    { href: `/price/${pair.a.id}`, label: `${pair.a.name} 가격 전략` },
  ];

  const summaryPoints = [
    `${pair.a.name}는 ${pair.a.category} 관점에서 ${pair.a.bestFor} 같은 사용 케이스에 강점을 보입니다.`,
    `${pair.b.name}는 ${pair.b.category} 환경에서 ${pair.b.bestFor} 같은 팀 운영 시나리오에 적합한 선택지입니다.`,
    "가격 비교는 단순 월 구독비가 아니라 실제 요청량, 사용자 수, 고급 기능 사용 비율까지 포함해 판단해야 정확합니다.",
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Compare",
        item: `${siteUrl}/compare/${pair.slug}`,
      },
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
          text: "초기에는 무료/저비용 구간에서 파일럿을 진행하고, 핵심 성능이 필요한 작업만 상위 요금으로 분리하는 전략이 유리합니다.",
        },
      },
      {
        "@type": "Question",
        name: "최종 선택 전에 반드시 확인해야 할 항목은 무엇인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "실제 사용 시나리오 기반 비용 추정, 품질 테스트, 팀 운영 정책을 점검한 뒤 선택해야 재도입 비용을 줄일 수 있습니다.",
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
          <p className="mt-3 text-slate-300">
            두 플랫폼의 가격, 기능, 운영 관점 차이를 실제 도입 의사결정 흐름에 맞춰 정리했습니다.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Comparison Summary</h2>
          <ul className="mt-4 grid gap-3 text-slate-300">
            {summaryPoints.map((item) => (
              <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-slate-300">
            실제 프로젝트에서는 "어떤 기능이 더 많나"보다 "우리 팀 목표를 더 낮은 리스크로 달성하는가"가 훨씬 중요합니다.
            따라서 이 비교 페이지는 단순 스펙 나열보다 운영 안정성과 비용 지속 가능성 중심으로 읽는 것이 좋습니다.
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
              <tr className="border-b border-slate-800">
                <td className="px-3 py-3 text-slate-400">Best For</td>
                <td className="px-3 py-3">{pair.a.bestFor}</td>
                <td className="px-3 py-3">{pair.b.bestFor}</td>
              </tr>
              <tr>
                <td className="px-3 py-3 align-top text-slate-400">Highlights</td>
                <td className="px-3 py-3">
                  <ul className="space-y-2">
                    {pair.a.highlights.map((item) => (
                      <li key={`a-${item}`} className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-3">
                  <ul className="space-y-2">
                    {pair.b.highlights.map((item) => (
                      <li key={`b-${item}`} className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Best for beginners</h2>
            <p className="mt-3 text-slate-300">
              입문자는 학습 곡선과 초기 비용이 낮은 쪽을 선택하는 것이 좋습니다. 무료 구간에서 빠르게 반복 실험이 가능한
              플랫폼이 첫 선택으로 유리합니다.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Best for professionals</h2>
            <p className="mt-3 text-slate-300">
              전문 팀은 품질 일관성, 확장 API, 운영 정책 통합 능력을 우선 확인해야 합니다. 중장기 운영을 고려하면 관리 기능의
              완성도가 의사결정에 큰 영향을 줍니다.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Best for budget users</h2>
            <p className="mt-3 text-slate-300">
              예산 중심 사용자라면 요청 단가와 무료 한도를 함께 보고, 고급 기능을 부분 적용하는 하이브리드 전략이 가능한
              플랫폼을 선택하는 것이 좋습니다.
            </p>
          </article>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
          <h2 className="text-2xl font-semibold">Final Recommendation</h2>
          <p className="mt-3 text-slate-200">
            최종 추천은 팀 목표에 따라 달라집니다. 빠른 실험과 가벼운 도입이 우선이면 초기 진입 장벽이 낮은 옵션이 유리하고,
            장기 운영과 통제 가능성이 핵심이면 관리 기능이 성숙한 옵션이 유리합니다. 가장 안전한 선택은 두 후보 모두를
            동일 시나리오로 1~2주 파일럿 테스트하고, 품질/비용/운영 난이도 점수를 기반으로 최종 결정을 내리는 방식입니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/price/${pair.a.id}`}
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              {pair.a.name} 가격 보기
            </Link>
            <Link
              href={`/price/${pair.b.id}`}
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              {pair.b.name} 가격 보기
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
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/price/${pair.a.id}`}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 hover:border-slate-500"
            >
              {pair.a.name} 가격 페이지
            </Link>
            <Link
              href={`/price/${pair.b.id}`}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 hover:border-slate-500"
            >
              {pair.b.name} 가격 페이지
            </Link>
          </div>
        </section>

        <div className="ad-slot-placeholder" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
