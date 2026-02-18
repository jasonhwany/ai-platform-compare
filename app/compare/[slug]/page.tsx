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
    { href: `/platform/${pair.a.id}`, label: `${pair.a.name} 상세 가이드` },
    { href: `/platform/${pair.b.id}`, label: `${pair.b.name} 상세 가이드` },
    { href: `/price/${pair.a.id}`, label: `${pair.a.name} 가격 전략` },
  ];

  const useCases = [
    "신규 서비스 검토 단계: 두 플랫폼의 성능/비용 균형을 빠르게 판단",
    "기존 스택 교체 검토: 이전 비용과 전환 비용까지 비교해 리스크 최소화",
    "팀 단위 표준화: 조직 공통 모델을 선정해 운영 복잡도를 줄임",
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
        name: `${pair.a.name}와 ${pair.b.name} 중 가격이 더 유리한 쪽은 어디인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "실제 비용은 사용량, 기능 범위, 팀 규모에 따라 달라지므로 기본 요금 문구와 사용 패턴을 함께 비교해야 정확합니다.",
        },
      },
      {
        "@type": "Question",
        name: `${pair.a.name} vs ${pair.b.name} 비교 시 가장 중요한 기준은 무엇인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "가격 외에도 모델 품질, 응답 지연, 생태계 연동, 보안 요구사항을 함께 평가하는 것이 좋습니다.",
        },
      },
      {
        "@type": "Question",
        name: "두 플랫폼의 무료 플랜만으로도 충분한가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "실험 단계는 가능하지만 운영 트래픽이 증가하면 유료 전환과 비용 통제가 필요합니다.",
        },
      },
      {
        "@type": "Question",
        name: "비용 절감을 위해 어떤 비교 전략이 효과적인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "업무를 난이도별로 분리해 저비용 모델과 고성능 모델을 혼합 사용하면 전체 단가를 낮출 수 있습니다.",
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
            두 플랫폼의 가격, 핵심 기능, 추천 용도를 한눈에 비교하세요.
          </p>
        </header>

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
                <td className="px-3 py-3 text-slate-400">Tagline</td>
                <td className="px-3 py-3">{pair.a.tagline}</td>
                <td className="px-3 py-3">{pair.b.tagline}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-3 text-slate-400">Pricing</td>
                <td className="px-3 py-3 text-emerald-300">{pair.a.pricing}</td>
                <td className="px-3 py-3 text-emerald-300">{pair.b.pricing}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-3 text-slate-400">Category</td>
                <td className="px-3 py-3">{pair.a.category}</td>
                <td className="px-3 py-3">{pair.b.category}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-3 text-slate-400">Best For</td>
                <td className="px-3 py-3">{pair.a.bestFor}</td>
                <td className="px-3 py-3">{pair.b.bestFor}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Extended Pricing Explanation</h2>
          <p className="mt-3 text-slate-300">
            동일 사용량 기준으로 비교하면 고정 구독비보다 요청당 과금 구조가 총비용에 더 큰 영향을 미치는 경우가 많습니다.
            또한 팀 확장 시에는 좌석비, 관리 기능, API 호출량을 함께 계산해야 실제 운영비를 정확히 예측할 수 있습니다.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Pros & Cons</h2>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-emerald-300">{pair.a.name} Pros</h3>
            <ul className="mt-2 space-y-2 text-slate-300">
              {pair.a.highlights.map((item) => (
                <li key={`a-${item}`} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-rose-300">{pair.a.name} Cons</h3>
            <p className="mt-2 text-slate-300">비용 효율은 사용 패턴 최적화 여부에 크게 좌우됩니다.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">{pair.b.name} Pros</h3>
            <ul className="mt-2 space-y-2 text-slate-300">
              {pair.b.highlights.map((item) => (
                <li key={`b-${item}`} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-rose-300">{pair.b.name} Cons</h3>
            <p className="mt-2 text-slate-300">고급 기능 사용 시 예상보다 빠르게 비용이 증가할 수 있습니다.</p>
          </article>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Who should use this?</h2>
            <p className="mt-3 text-slate-300">
              도입 후보 2개를 최종 압축해야 하는 팀, 비용/성능 밸런스를 데이터로 비교하려는 제품 조직에 적합합니다.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Who should avoid this?</h2>
            <p className="mt-3 text-slate-300">
              이미 단일 플랫폼으로 표준화가 끝났거나, 비교 없이 즉시 실행이 필요한 단기 프로젝트에는 우선순위가 낮습니다.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Detailed Use-Case Scenarios</h2>
          <ul className="mt-4 grid gap-3 text-slate-300">
            {useCases.map((item) => (
              <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">관련 페이지</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/platform/${pair.a.id}`}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              {pair.a.name} 상세 페이지
            </Link>
            <Link
              href={`/platform/${pair.b.id}`}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              {pair.b.name} 상세 페이지
            </Link>
            <Link
              href={`/price/${pair.a.id}`}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              {pair.a.name} 가격 페이지
            </Link>
            <Link
              href={`/price/${pair.b.id}`}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              {pair.b.name} 가격 페이지
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-semibold">Call-to-Action</h2>
          <p className="mt-3 text-slate-200">
            최종 선택 전 각 플랫폼의 가격 페이지를 확인해 실제 예산 시나리오를 검증하고, 바로 팀 표준안을 확정하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/price/${pair.a.id}`}
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              {pair.a.name} 가격 확인
            </Link>
            <Link
              href={`/price/${pair.b.id}`}
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              {pair.b.name} 가격 확인
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Related Articles</h2>
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
