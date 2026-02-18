import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { platforms } from "../../data/platforms";

type PageProps = {
  params: Promise<{ id: string }>;
};

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

  return {
    title: `${platform.name} 가격 및 기능 분석 | AI Platform Compare`,
    description: `${platform.name} 요금, 장단점, 추천 용도 정리`,
    alternates: {
      canonical: `/platform/${platform.id}`,
    },
  };
}

export default async function PlatformDetailPage({ params }: PageProps) {
  const { id } = await params;
  const platform = findPlatform(id);

  if (!platform) {
    notFound();
  }

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
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
