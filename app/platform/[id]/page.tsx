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

  const relatedPlatforms = platforms.filter((item) => item.id !== platform.id);

  const relatedComparePages = relatedPlatforms
    .map((item) => {
      const slug = [platform.id, item.id].sort().join("-vs-");
      return {
        slug,
        label: `${platform.name} vs ${item.name}`,
      };
    })
    .slice(0, 3);

  const relatedArticles = [
    { href: `/price/${platform.id}`, label: `${platform.name} 가격 전략 상세` },
    ...relatedComparePages.slice(0, 2).map((item) => ({
      href: `/compare/${item.slug}`,
      label: `${item.label} 실제 비교 리포트`,
    })),
  ];

  const useCases = [
    `${platform.name}를 고객 지원 자동화에 도입하면 반복 질문 응답 시간을 줄이고 운영 인력은 고난도 문의 처리에 집중할 수 있습니다. 특히 FAQ 업데이트 주기가 빠른 팀이라면 응답 템플릿을 주기적으로 개선하면서 CS 품질을 안정적으로 높일 수 있습니다.`,
    `${platform.name}는 마케팅 콘텐츠 운영에서도 활용 가치가 높습니다. 블로그 초안 작성, 랜딩카피 아이디어 생성, 광고 문구 A/B 테스트처럼 빠른 반복이 필요한 작업에서 생산성을 높일 수 있고, 사람 검수 프로세스를 함께 두면 브랜드 톤을 지키면서도 제작 속도를 크게 개선할 수 있습니다.`,
    `${platform.name}를 내부 지식 검색 워크플로우에 연결하면 문서 탐색, 회의록 요약, 프로젝트 히스토리 파악 시간을 단축할 수 있습니다. 특히 신규 입사자 온보딩 문서를 연결하면 팀이 필요한 정보를 찾는 시간이 줄어들고 협업 효율이 높아집니다.`,
  ];

  const pros = [
    `${platform.name}의 핵심 강점은 ${platform.highlights.join(", ")}처럼 실제 업무에 바로 연결되는 기능이 명확하다는 점입니다.`,
    `도입 범위를 작은 기능부터 단계적으로 확장하기 쉬워 초기 리스크를 줄이면서 운영 데이터를 축적할 수 있습니다.`,
    `카테고리(${platform.category}) 관점에서 요구사항과 맞으면 제품화까지 연결되는 속도가 빠른 편입니다.`,
  ];

  const cons = [
    `사용량이 급격히 증가할 때 월간 비용이 예상보다 빨리 늘 수 있으므로 사전 모니터링 정책이 필요합니다.`,
    `고급 기능을 제대로 활용하려면 프롬프트 설계, 평가 기준, 워크플로우 분리 같은 운영 노하우가 필요합니다.`,
    `기술적으로는 빠르게 시작할 수 있지만 조직 차원의 보안/권한 정책을 늦게 정리하면 관리 복잡도가 올라갈 수 있습니다.`,
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
          text: "초기에는 핵심 시나리오 1~2개를 선정해 요청량과 사용자 수를 기준으로 월간 상한을 설정하고, 이후 실제 사용 데이터를 반영해 확장하는 방식이 안전합니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name}를 다른 플랫폼과 비교할 때 우선순위는 무엇인가요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "가격뿐 아니라 모델 품질, 생태계 연동성, 운영 통제 기능을 동시에 비교해야 장기적으로 안정적인 선택이 가능합니다.",
        },
      },
      {
        "@type": "Question",
        name: `${platform.name}를 피해야 하는 경우도 있나요?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI 기능이 핵심 가치가 아니거나 운영 정책 없이 단기 성과만 목표로 할 경우 도입 후 비용과 품질 관리가 어려워질 수 있습니다.",
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
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="mt-4 text-slate-300">
            {platform.name}는 {platform.category} 영역에서 널리 비교되는 서비스입니다. 실제 도입에서 중요한 포인트는
            단순히 기능 수가 아니라, 조직이 지금 해결하려는 문제와 얼마나 정확히 맞물리는지입니다. 예를 들어 운영 자동화가
            목표라면 빠른 응답성과 안정적 워크플로우 연결이 중요하고, 지식 기반 업무가 핵심이라면 맥락 유지력과 문서
            처리 품질이 더 중요해집니다. 따라서 도입 이전에는 한 가지 대표 시나리오를 기준으로 성공 조건을 먼저 정의하는
            것이 좋습니다. {platform.name}의 경우 기본 기능만으로도 빠른 검증이 가능하지만, 실제 성과를 내기 위해서는
            사용 목적별 정책, 비용 상한, 품질 평가 기준을 함께 설계해야 합니다.
          </p>
          <p className="mt-4 text-slate-300">
            이 페이지는 {platform.name}를 장단점 중심으로 짧게 보는 소개 페이지가 아니라, 실제 선택과 운영에 필요한 정보를
            길게 읽고 판단할 수 있게 구성했습니다. 기능, 비용, 활용 시나리오, 적합한 팀과 부적합한 팀, 최종 추천까지
            한 흐름에서 확인할 수 있도록 작성했습니다.
          </p>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Core Features Explained</h2>
          <p className="mt-4 text-slate-300">
            핵심 기능은 {platform.highlights.join(", ")}로 요약할 수 있습니다. 하지만 기능 이름만 보는 것보다 실제 운영
            맥락에서 해석하는 것이 더 중요합니다. 예를 들어 고성능 모델 사용 옵션이 있더라도 모든 요청에 동일하게 적용하면
            비용 효율이 급격히 떨어질 수 있습니다. 반대로 모델 라우팅을 설계하면 같은 업무에서도 비용 대비 성능을 크게
            개선할 수 있습니다.
          </p>
          <p className="mt-4 text-slate-300">
            또한 {platform.bestFor} 같은 사용 적합성 정보는 도입 범위를 정하는 데 도움이 됩니다. 초기에는 작은 범위에서
            품질 기준을 확립하고, 성공 지표가 확인되면 단계적으로 확장하는 방식이 권장됩니다. 이 접근은 예산 낭비를 줄이고,
            실제 팀이 감당 가능한 수준에서 안정적으로 운영 체계를 만드는 데 유리합니다.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Real-world Use Cases</h2>
          <ul className="mt-4 grid gap-4 text-slate-300">
            {useCases.map((item) => (
              <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-4 py-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="ad-slot-placeholder" />

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Pros</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              {pros.map((item) => (
                <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Cons</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              {cons.map((item) => (
                <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Who should use it?</h2>
            <p className="mt-4 text-slate-300">
              {platform.name}는 AI를 실제 비즈니스 프로세스에 연결해야 하는 팀에 적합합니다. 특히 업무 자동화, 콘텐츠 생산,
              고객 응답 품질 개선처럼 반복 작업을 줄이는 목표가 명확한 조직이라면 도입 효과를 수치로 확인하기 쉽습니다.
              또한 팀 단위 정책 수립이 가능한 조직이라면 비용 통제를 병행하면서 장기 운영으로 확장할 수 있습니다.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">Who should avoid it?</h2>
            <p className="mt-4 text-slate-300">
              반대로 AI 기능이 현재 제품 핵심과 직접 연결되지 않는 팀, 내부 검수 체계를 구축할 계획이 없는 팀, 단기 성과만
              목표로 도입하려는 팀은 {platform.name}의 장점을 충분히 활용하기 어렵습니다. 이 경우에는 더 단순한 자동화 도구나
              제한된 범위의 솔루션부터 시작하는 편이 더 현실적일 수 있습니다.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
          <h2 className="text-2xl font-semibold">Final Verdict</h2>
          <p className="mt-4 text-slate-200">
            결론적으로 {platform.name}는 기능 유연성과 확장성 측면에서 경쟁력이 있지만, 성과를 내는 핵심은 도구 자체보다
            운영 설계에 있습니다. 도입 전에는 성공 지표를 구체화하고, 도입 후에는 비용/품질 모니터링 체계를 반드시 함께
            구축해야 합니다. 이 원칙을 지키면 {platform.name}는 단순 실험을 넘어 실제 비즈니스 생산성을 높이는 플랫폼으로
            자리 잡을 수 있습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/price/${platform.id}`}
              className="inline-flex items-center rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              {platform.name} 가격 페이지 이동
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
