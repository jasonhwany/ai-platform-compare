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
    { href: `/platform/${platform.id}`, label: `${platform.name} 플랫폼 상세 리뷰` },
    ...relatedComparePages.slice(0, 2).map((item) => ({
      href: `/compare/${item.slug}`,
      label: `${item.label} 비용 비교`,
    })),
  ];

  const planTiers = [
    {
      tier: "Free / Trial",
      summary: "기능 검증과 소규모 테스트에 적합",
      details: "요청 한도나 고급 기능 제한이 존재하므로 프로덕션 운영보다는 파일럿 검증 용도로 권장됩니다.",
    },
    {
      tier: "Pro / Team",
      summary: "일반적인 실무 운영에 적합",
      details: "협업 기능과 사용량 확장이 가능하며, 팀 단위 업무 자동화에 필요한 안정성이 확보됩니다.",
    },
    {
      tier: "Business / Enterprise",
      summary: "대규모 트래픽 및 보안 정책 요구에 적합",
      details: "관리 기능, 보안 옵션, 계약 기반 지원을 포함해 장기 운영 리스크를 줄이는 구조로 설계됩니다.",
    },
  ];

  const discountStrategies = [
    "초기에는 무료 플랜으로 고정 사용량을 측정한 뒤, 필요한 기능만 유료 전환해 낭비를 줄입니다.",
    "요청 복잡도를 분리해 단순 작업은 저비용 모델로 라우팅하고 고난도 작업만 상위 모델을 사용합니다.",
    "월간 예산 상한과 경고 알림을 함께 설정해 트래픽 급증 구간에서 과금 폭증을 예방합니다.",
    "연간 결제, 파트너 크레딧, 팀 계약 할인을 정기적으로 점검해 실효 단가를 낮춥니다.",
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

  const faqItems = [
    {
      question: `${platform.name} 무료 플랜은 어디까지 사용할 수 있나요?`,
      answer:
        "대부분 기본 기능 검증은 가능하지만, 요청량 상한과 고급 기능 제한이 있어 운영 단계에서는 유료 플랜 검토가 필요합니다.",
    },
    {
      question: `${platform.name}에서 가장 먼저 비용이 증가하는 지점은 어디인가요?`,
      answer:
        "일반적으로 고성능 모델 사용 비율과 호출량 증가가 비용 상승의 핵심 요인이며, 팀 사용자가 늘면 관리비용도 함께 커집니다.",
    },
    {
      question: `${platform.name} 요금제를 선택할 때 가장 중요한 기준은 무엇인가요?`,
      answer:
        "예상 트래픽, 품질 요구 수준, 협업 인원 수를 먼저 정의한 뒤 그 기준을 만족하는 최저 플랜부터 시작하는 전략이 안전합니다.",
    },
    {
      question: `${platform.name} 비용을 줄이는 실전 전략은 무엇인가요?`,
      answer:
        "모델 라우팅, 요청 캐싱, 프롬프트 최적화, 월간 예산 알림을 결합하면 동일 품질에서 총비용을 효과적으로 낮출 수 있습니다.",
    },
    {
      question: `${platform.name}와 경쟁 서비스 가격 비교는 어떻게 해야 하나요?`,
      answer:
        "동일한 업무 시나리오를 기준으로 요청당 비용, 월 고정비, 부가 기능 비용을 동시에 비교해야 정확한 판단이 가능합니다.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {platform.name} 가격 및 요금 정리 (2026)
          </h1>
          <p className="mt-3 text-slate-300">
            {platform.name}의 요금 구조를 실제 운영 기준으로 해석해, 무료 시작부터 유료 확장까지 어떤 선택이 합리적인지
            단계별로 설명합니다.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Detailed Pricing Explanation</h2>
          <p className="mt-4 text-emerald-300">기준 요금 정보: {platform.pricing}</p>
          <p className="mt-4 text-slate-300">
            실제 총비용은 표면 요금보다 사용 패턴의 영향을 더 크게 받습니다. 같은 플랫폼을 쓰더라도 요청 길이, 피크 시간대,
            팀 규모, 고급 기능 사용률에 따라 월간 비용이 크게 달라질 수 있습니다. 따라서 요금제를 선택할 때는 먼저 업무를
            난이도별로 분해하고, 각각에 맞는 모델 정책을 정한 뒤, 해당 정책이 월간 예산 범위에 들어오는지 검증하는 절차가
            필요합니다. 초기에는 보수적으로 시작해 데이터가 쌓이면 최적화하는 방식이 가장 안정적입니다.
          </p>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Breakdown of Plan Tiers</h2>
          <div className="mt-4 grid gap-4">
            {planTiers.map((tier) => (
              <article key={tier.tier} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="text-lg font-semibold text-slate-100">{tier.tier}</h3>
                <p className="mt-2 text-slate-300">{tier.summary}</p>
                <p className="mt-2 text-slate-400">{tier.details}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Discount Strategies</h2>
          <ul className="mt-4 grid gap-3 text-slate-300">
            {discountStrategies.map((item) => (
              <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Pricing FAQ</h2>
          <div className="mt-4 grid gap-4">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="text-base font-semibold text-slate-100">{item.question}</h3>
                <p className="mt-2 text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
          <h2 className="text-2xl font-semibold">Call-to-Action</h2>
          <p className="mt-3 text-slate-200">
            가격만으로 결정하기 어렵다면 비교 페이지에서 기능 적합성까지 함께 확인하고, 최종적으로 공식 사이트에서 최신 플랜을
            검증한 뒤 도입을 확정하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/platform/${platform.id}`}
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              {platform.name} 플랫폼 가이드 보기
            </Link>
            <a
              href={platform.links.website}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-slate-500"
            >
              공식 가격 페이지 확인
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Related Articles</h2>
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
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedComparePages.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 hover:border-slate-500"
              >
                {item.label}
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
