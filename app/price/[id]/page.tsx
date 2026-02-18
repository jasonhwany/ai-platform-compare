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
      title: "가격 페이지를 찾을 수 없습니다 | AI Platform Compare",
      description: "요청한 가격 페이지를 찾을 수 없습니다.",
    };
  }

  const title = `${platform.name} 가격 | 2026 요금 및 무료 플랜 정리`;
  const description = `${platform.name} 요금제, 무료 여부, 할인 방법 완전 정리`;
  const url = `${siteUrl}/price/${platform.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/price/${platform.id}`,
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

export default async function PricePage({ params }: PageProps) {
  const { id } = await params;
  const platform = findPlatform(id);

  if (!platform) {
    notFound();
  }

  const relatedComparePages = platforms
    .filter((item) => item.id !== platform.id)
    .map((item) => {
      const slug = [platform.id, item.id].sort().join("-vs-");
      return { slug, label: `${platform.name} vs ${item.name}` };
    })
    .slice(0, 3);

  const relatedArticles = [
    { href: `/platform/${platform.id}`, label: `${platform.name} 플랫폼 상세` },
    ...relatedComparePages.slice(0, 2).map((item) => ({
      href: `/compare/${item.slug}`,
      label: `${item.label} 비교 글`,
    })),
  ];

  const useCases = [
    "개인/소규모 팀: 무료 플랜 기반으로 초기 검증 후 선택적으로 유료 전환",
    "성장 단계 스타트업: 기능별 모델 라우팅으로 성능과 단가를 동시에 관리",
    "엔터프라이즈 파일럿: 부서별 사용량 상한과 알림으로 비용 폭증 리스크 차단",
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Price",
        item: `${siteUrl}/price/${platform.id}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${platform.name} 가격`,
        item: `${siteUrl}/price/${platform.id}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${platform.name} 무료 플랜은 어떤 한계가 있나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "요청량, 고급 기능 접근, 팀 관리 기능이 제한되는 경우가 많아 운영 단계에서는 유료 플랜 검토가 필요합니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name} 유료 플랜으로 전환해야 하는 기준은 무엇인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "트래픽 증가, 응답 품질 요구, 팀 협업 기능 필요성이 커질 때 유료 플랜 전환이 합리적입니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name}와 경쟁 플랫폼 가격을 어떻게 비교하면 좋나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "동일한 트래픽 시나리오에서 요청당 비용, 월 고정비, 기능 포함 범위를 함께 비교하면 정확합니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name} 비용을 낮추는 실전 방법은 무엇인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "모델 라우팅, 프롬프트 최적화, 사용량 알림 설정, 장기 계약 할인 활용이 대표적인 절감 전략입니다.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {platform.name} 가격 및 요금 정리 (2026)
          </h1>
          <p className="mt-3 text-slate-300">
            {platform.name}의 요금 구조와 무료/유료 선택 기준을 빠르게 확인하세요.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Extended Pricing Explanation</h2>
          <p className="mt-3 text-emerald-300">기본 요금 정보: {platform.pricing}</p>
          <p className="mt-3 text-slate-300">
            월간 총비용은 요금제 자체보다 사용량 분포와 고급 기능 사용 빈도에서 크게 갈립니다. 무료 플랜은 검증에 좋지만
            운영 단계에서는 예산 상한, 팀별 정책, 자동 알림을 함께 설계해야 비용을 안정적으로 관리할 수 있습니다.
          </p>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Free vs Paid 비교</h2>
          <table className="mt-4 min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-2 font-medium">구분</th>
                <th className="px-3 py-2 font-medium">Free</th>
                <th className="px-3 py-2 font-medium">Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-3 text-slate-400">사용 한도</td>
                <td className="px-3 py-3">낮음 또는 제한적</td>
                <td className="px-3 py-3">높음 또는 확장 가능</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="px-3 py-3 text-slate-400">모델/기능 접근</td>
                <td className="px-3 py-3">기본 모델 위주</td>
                <td className="px-3 py-3">고급 모델 및 추가 기능</td>
              </tr>
              <tr>
                <td className="px-3 py-3 text-slate-400">운영 안정성</td>
                <td className="px-3 py-3">트래픽 상황에 영향 큼</td>
                <td className="px-3 py-3">SLA/기업 옵션 선택 가능</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Pros & Cons</h2>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-emerald-300">Pros</h3>
            <ul className="mt-2 space-y-2 text-slate-300">
              <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">초기 진입 비용을 통제하기 쉽습니다.</li>
              <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">업무별 요금 최적화 전략을 세우기 좋습니다.</li>
              <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">규모 확장 시 플랜 전환 선택지가 존재합니다.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-300">Cons</h3>
            <ul className="mt-2 space-y-2 text-slate-300">
              <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">사용량 급증 시 비용 예측이 어려워질 수 있습니다.</li>
              <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">관리 정책이 없으면 과금 누수가 발생할 수 있습니다.</li>
              <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">고성능 모델 의존도가 높으면 단가가 빠르게 상승합니다.</li>
            </ul>
          </article>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Who should use this?</h2>
            <p className="mt-3 text-slate-300">
              비용 통제가 핵심인 팀, 무료 플랜에서 유료 전환 타이밍을 판단해야 하는 운영 조직에 적합합니다.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Who should avoid this?</h2>
            <p className="mt-3 text-slate-300">
              가격보다 성능만 최우선으로 선택하는 프로젝트, 혹은 비교 없이 단일 벤더를 고정한 조직에는 우선순위가 낮습니다.
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
            가격 기준으로 후보를 좁혔다면 비교 페이지로 이동해 기능 적합성까지 함께 검토하고 최종 선택을 완료하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/platform/${platform.id}`}
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              플랫폼 상세 보기
            </Link>
            <a
              href={platform.links.website}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-slate-500"
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
