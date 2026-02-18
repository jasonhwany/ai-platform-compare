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
    .slice(0, 4);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
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
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 md:px-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{platform.name}</h1>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
            {platform.category}
          </span>
        </div>

        <p className="text-lg text-slate-300">{platform.tagline}</p>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Pricing</h2>
          <p className="mt-2 text-emerald-300">{platform.pricing}</p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <ul className="mt-3 grid gap-2 text-slate-300">
            {platform.highlights.map((highlight) => (
              <li key={highlight} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                {highlight}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Best For</h2>
          <p className="mt-2 text-slate-300">{platform.bestFor}</p>
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
            className="inline-flex items-center rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
          >
            공식 사이트 방문
          </a>
          <Link
            href={`/price/${platform.id}`}
            className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            가격 페이지 보기
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            홈으로 돌아가기
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
