import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackedExternalLink, TrackedLink } from "../../components/tracked-link";
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
    alternates: { canonical: `/price/${platform.id}` },
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

  const bestBadges = getPlatformBestBadges(platform.id);

  const relatedComparePages = platforms
    .filter((item) => item.id !== platform.id)
    .map((item) => ({
      slug: [platform.id, item.id].sort().join("-vs-"),
      label: `${platform.name} vs ${item.name}`,
    }))
    .slice(0, 3);

  const faqItems = [
    {
      question: `${platform.name} 무료 플랜은 어디까지 사용할 수 있나요?`,
      answer: "기본 검증은 가능하지만 운영 단계에서는 사용량/기능 제한으로 유료 전환이 필요해지는 경우가 많습니다.",
    },
    {
      question: `${platform.name}에서 가장 먼저 비용이 증가하는 지점은 어디인가요?`,
      answer: "고성능 모델 사용률과 호출량 증가가 가장 큰 비용 증가 포인트입니다.",
    },
    {
      question: `${platform.name} 요금제를 선택할 때 중요한 기준은 무엇인가요?`,
      answer: "예상 트래픽과 품질 목표, 협업 인원 수를 먼저 정하고 최소 플랜부터 시작하는 것이 안전합니다.",
    },
    {
      question: `${platform.name} 비용을 줄이는 실전 전략은 무엇인가요?`,
      answer: "모델 라우팅, 요청 캐싱, 프롬프트 최적화, 월간 예산 알림 설정을 함께 적용하는 방식이 효과적입니다.",
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Price", item: `${siteUrl}/price/${platform.id}` },
      { "@type": "ListItem", position: 3, name: `${platform.name} 가격`, item: `${siteUrl}/price/${platform.id}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{platform.name} 가격 및 요금 정리 (2026)</h1>
          <p className="mt-3 text-slate-300">{platform.name}의 요금 구조를 실사용 기준으로 정리한 페이지입니다.</p>
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

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Detailed Pricing Explanation</h2>
          <p className="mt-4 text-emerald-300">기준 요금 정보: {platform.pricing}</p>
          <p className="mt-4 text-slate-300">실제 월간 비용은 요청량, 고급 기능 비율, 팀 규모에 따라 달라집니다.</p>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Breakdown of Plan Tiers</h2>
          <div className="mt-4 grid gap-3 text-slate-300">
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">Free/Trial: 파일럿 검증 단계</div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">Pro/Team: 실무 운영과 협업 단계</div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">Business/Enterprise: 대규모 운영 및 보안 요구 단계</div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Discount Strategies</h2>
          <ul className="mt-4 grid gap-2 text-slate-300">
            <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">저비용 모델 라우팅으로 평균 단가 절감</li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">예산 경고 설정으로 과금 급증 사전 차단</li>
            <li className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">연간 계약/크레딧 프로모션 주기 확인</li>
          </ul>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Pricing FAQ</h2>
          <div className="mt-4 grid gap-3">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="font-semibold text-slate-100">{item.question}</h3>
                <p className="mt-2 text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-6">
          <h2 className="text-2xl font-semibold">Final Recommendation Block</h2>
          <p className="mt-3 text-slate-200">Best for: 비용 효율을 유지하며 확장하려는 팀</p>
          <p className="mt-3 text-lg font-bold text-emerald-200">
            Recommended: {platform.name}는 무료 검증 후 유료 확장하는 단계형 도입 전략에 가장 적합합니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <TrackedLink
              href={`/compare/${relatedComparePages[0]?.slug ?? `${platform.id}-vs-openai`}`}
              className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-200"
              payload={{
                target: `/compare/${relatedComparePages[0]?.slug ?? `${platform.id}-vs-openai`}`,
                platformId: platform.id,
              }}
            >
              Compare Before You Subscribe
            </TrackedLink>
            <TrackedExternalLink
              href={platform.links.website}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-100 hover:border-slate-500"
              payload={{ target: platform.links.website, platformId: platform.id }}
            >
              Unlock Latest {platform.name} Deals
            </TrackedExternalLink>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Related Articles</h2>
          <div className="mt-4 grid gap-2">
            <Link href={`/platform/${platform.id}`} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500">
              {platform.name} 플랫폼 상세
            </Link>
            {relatedComparePages.slice(0, 2).map((item) => (
              <Link key={item.slug} href={`/compare/${item.slug}`} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 hover:border-slate-500">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
            <Link href="/recommend?goal=blog&budget=under20&skill=beginner" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 hover:border-slate-500">
              Blog Starter Stack
            </Link>
            <Link href="/recommend?goal=video&budget=flexible&skill=intermediate" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 hover:border-slate-500">
              Video Growth Stack
            </Link>
            <Link href="/recommend?goal=design&budget=free&skill=beginner" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 hover:border-slate-500">
              Design Free Stack
            </Link>
          </div>
        </section>

        <div className="ad-slot-placeholder" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
