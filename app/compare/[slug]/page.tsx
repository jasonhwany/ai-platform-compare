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

  return {
    title: `${pair.a.name} vs ${pair.b.name} 가격 비교 | AI Platform Compare`,
    description: `${pair.a.name}와 ${pair.b.name}의 요금, 기능, 장단점 비교 분석`,
    alternates: {
      canonical: `/compare/${pair.slug}`,
    },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const pair = findPairBySlug(slug);

  if (!pair) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
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
              <tr>
                <td className="px-3 py-3 align-top text-slate-400">Highlights</td>
                <td className="px-3 py-3">
                  <ul className="space-y-2">
                    {pair.a.highlights.map((item) => (
                      <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-3">
                  <ul className="space-y-2">
                    {pair.b.highlights.map((item) => (
                      <li key={item} className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="flex flex-wrap gap-3">
          <a
            href={pair.a.links.website}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
          >
            {pair.a.name} 공식 사이트
          </a>
          <a
            href={pair.b.links.website}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
          >
            {pair.b.name} 공식 사이트
          </a>
          <Link
            href="/"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </main>
  );
}
