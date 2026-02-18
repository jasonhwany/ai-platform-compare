import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    alternates: {
      canonical: `/platform/${platform.id}`,
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

export default async function PlatformDetailPage({ params }: PageProps) {
  const { id } = await params;
  const platform = findPlatform(id);

  if (!platform) {
    notFound();
  }

  const relatedComparePages = platforms
    .filter((item) => item.id !== platform.id)
    .map((item) => {
      const slug = [platform.id, item.id].sort().join("-vs-");
      return {
        slug,
        label: `${platform.name} vs ${item.name}`,
      };
    })
    .slice(0, 3);

  const relatedArticles = [
    { href: `/price/${platform.id}`, label: `${platform.name} 가격 가이드` },
    ...relatedComparePages.slice(0, 2).map((item) => ({
      href: `/compare/${item.slug}`,
      label: `${item.label} 비교 분석`,
    })),
  ];

  const useCases = [
    "고객지원 챗봇 자동화: 반복 문의를 자동 처리하고 상담 시간을 단축",
    "콘텐츠 생산 파이프라인: 초안 작성, 요약, 교정 과정을 빠르게 반복",
    "내부 업무 자동화: 문서 검색, 분석 리포트 작성, 회의록 정리를 표준화",
  ];

  const pros = [
    "핵심 기능이 명확해 도입 판단이 빠름",
    "팀 단위 운영에 필요한 확장 옵션이 존재",
    "API/앱 형태로 다양한 업무 흐름에 연결 가능",
  ];

  const cons = [
    "사용량 증가 시 비용 변동성이 커질 수 있음",
    "고급 기능 사용 시 학습 비용이 필요",
    "요구사항에 따라 별도 모니터링/거버넌스가 필요",
  ];

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
        name: `${platform.name} 요금은 어떤 방식으로 과금되나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${platform.name}는 일반적으로 사용량 기반 또는 구독형 과금 구조를 사용하며 실제 비용은 사용 빈도와 기능 사용 범위에 따라 달라집니다.`,
        },
      },
      {
        "@type": "Question",
        name: `${platform.name} 무료 플랜만으로도 운영이 가능한가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "초기 테스트는 가능하지만 트래픽이 늘면 유료 플랜이나 API 과금 모델 검토가 필요합니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name}는 다른 AI 플랫폼과 비교해 어떤 장점이 있나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "강점은 모델 성능, 생태계 연동, 팀 기능 등에서 갈리므로 compare 페이지에서 동일 항목 기준으로 확인하는 것이 가장 정확합니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name} 비용 절감을 위한 추천 방법은 무엇인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "저비용 모델 라우팅, 사용량 상한 설정, 정기적인 프롬프트 최적화로 월간 비용을 줄일 수 있습니다.",
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
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Extended Pricing Explanation</h2>
          <p className="mt-3 text-emerald-300">현재 요금 정보: {platform.pricing}</p>
          <p className="mt-3 text-slate-300">
            실제 지출은 사용자 수, 요청량, 고성능 모델 사용 비율에 따라 달라집니다. 초기에는 작은 워크로드로
            단가를 측정하고, 이후 핵심 기능만 유료로 확대하면 예산 예측 정확도를 높일 수 있습니다.
          </p>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Pros & Cons</h2>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-emerald-300">Pros</h3>
            <ul className="mt-2 space-y-2 text-slate-300">
              {pros.map((item) => (
                <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-rose-300 md:mt-10">Cons</h3>
            <ul className="mt-2 space-y-2 text-slate-300">
              {cons.map((item) => (
                <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Who should use this?</h2>
            <p className="mt-3 text-slate-300">
              빠르게 AI 기능을 제품에 통합하려는 스타트업, 운영 자동화가 필요한 중소기업, 반복 업무를 줄이고 싶은
              팀에 적합합니다.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Who should avoid this?</h2>
            <p className="mt-3 text-slate-300">
              고정비 중심의 단순 도구만 원하는 팀, 모델 선택과 성능 튜닝을 최소화하고 싶은 조직은 다른 단순형 툴이
              더 나을 수 있습니다.
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
          <h2 className="text-xl font-semibold">관련 비교 페이지</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedComparePages.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-semibold">Call-to-Action</h2>
          <p className="mt-3 text-slate-200">
            {platform.name} 도입을 검토 중이라면 가격 페이지와 비교 페이지를 함께 확인해 최적의 시작 플랜을 결정하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/price/${platform.id}`}
              className="inline-flex items-center rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              {platform.name} 가격 페이지 보기
            </Link>
            <a
              href={platform.links.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-slate-500"
            >
              공식 사이트 방문
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Related Articles</h2>
          <div className="mt-4 grid gap-2">
            {relatedArticles.slice(0, 3).map((article) => (
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
