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
    .slice(0, 4);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Price", item: `${siteUrl}/price/${platform.id}` },
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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {platform.name} 가격 및 요금 정리 (2026)
          </h1>
          <p className="mt-3 text-slate-300">
            {platform.name}의 요금 구조와 무료/유료 선택 기준을 빠르게 확인하세요.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Pricing Breakdown</h2>
          <p className="mt-3 text-emerald-300">기본 요금 정보: {platform.pricing}</p>
          <ul className="mt-4 grid gap-2 text-slate-300">
            <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
              과금 방식: 사용량 기반 또는 구독형 플랜 혼합
            </li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
              비용 핵심 변수: 요청량, 고급 모델 사용 비율, 팀 좌석 수
            </li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
              예산 관리: 월별 상한선과 API 사용량 모니터링 필수
            </li>
          </ul>
        </section>

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

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">저렴하게 쓰는 방법</h2>
          <ul className="mt-4 grid gap-2 text-slate-300">
            <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
              무료 플랜에서 프롬프트 품질을 먼저 검증한 후 유료 전환
            </li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
              복잡도 낮은 요청은 저비용 모델로 라우팅
            </li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
              월간 예산 알림과 사용량 대시보드로 초과 비용 방지
            </li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
              연간 결제/팀 계약 할인과 크레딧 프로모션 주기적 확인
            </li>
          </ul>
        </section>

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

        <div className="flex flex-wrap gap-3">
          <a
            href={platform.links.website}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
          >
            공식 사이트 방문
          </a>
          <Link
            href={`/platform/${platform.id}`}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            플랫폼 상세 보기
          </Link>
        </div>
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
