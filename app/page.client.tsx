"use client";

import Link from "next/link";
import { Fragment } from "react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { providers } from "./data/providers";
import { getPlatformBestBadges } from "./data/recommendation";
import {
  onClickCompare,
  onClickPricingLink,
  onCopyLink,
  onOpenRecommend,
  onSelectProvider,
} from "./lib/events";

const MAX_SELECTION = 3;
const STORAGE_KEY = "compareProviders";

type Provider = (typeof providers)[number];

type GroupRow = {
  key: string;
  label: string;
  getValue: (provider: Provider) => ReactNode;
};

type Group = {
  title: string;
  rows: GroupRow[];
};

function UnknownValue() {
  return (
    <span className="cursor-help text-slate-400" title="Unknown / not verified">
      —
    </span>
  );
}

function yesNo(value: boolean | null) {
  if (value === null) return <UnknownValue />;
  return value ? "예" : "아니오";
}

function yesNoUnknown(value: "yes" | "no" | "unknown") {
  if (value === "unknown") return <UnknownValue />;
  return value === "yes" ? "예" : "아니오";
}

function limitValue(value: string | null) {
  if (!value) return <UnknownValue />;
  return value;
}

function bestForBullets(items: string[]) {
  if (!items.length || (items.length === 1 && items[0] === "—")) {
    return <UnknownValue />;
  }
  return (
    <ul className="list-disc space-y-1 pl-4 text-xs">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const groups: Group[] = [
  {
    title: "A. 요금 정보",
    rows: [
      {
        key: "free-plan",
        label: "무료 플랜",
        getValue: (provider) => {
          if (provider.pricing.free_plan.available === null) return <UnknownValue />;
          const head = provider.pricing.free_plan.available ? "예" : "아니오";
          const note = provider.pricing.free_plan.note;
          return note ? `${head} (${note})` : head;
        },
      },
      {
        key: "entry-price",
        label: "입문 가격(월)",
        getValue: (provider) =>
          provider.pricing.entry_price_usd_month !== null
            ? `$${provider.pricing.entry_price_usd_month}`
            : <UnknownValue />,
      },
      {
        key: "usage-based",
        label: "사용량 기반 과금",
        getValue: (provider) => yesNo(provider.pricing.usage_based),
      },
      {
        key: "api-pricing-link",
        label: "API 요금 링크",
        getValue: (provider) =>
          provider.pricing.api_pricing_link ? (
            <a
              href={provider.pricing.api_pricing_link}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-300 underline-offset-2 hover:underline"
              onClick={() => {
                onClickPricingLink({
                  providerId: provider.id,
                  target: provider.pricing.api_pricing_link,
                });
              }}
            >
              바로가기
            </a>
          ) : (
            <UnknownValue />
          ),
      },
      {
        key: "last-verified",
        label: "최종 검증일",
        getValue: (provider) => provider.last_verified,
      },
    ],
  },
  {
    title: "B. 핵심 기능",
    rows: [
      { key: "text", label: "Text/Chat", getValue: (provider) => yesNo(provider.capabilities.text_chat) },
      { key: "image", label: "Image", getValue: (provider) => yesNo(provider.capabilities.image) },
      { key: "video", label: "Video", getValue: (provider) => yesNo(provider.capabilities.video) },
      { key: "audio", label: "Audio", getValue: (provider) => yesNo(provider.capabilities.audio) },
      { key: "code", label: "Code", getValue: (provider) => yesNo(provider.capabilities.code) },
      {
        key: "agent",
        label: "Agent/Automation",
        getValue: (provider) => yesNo(provider.capabilities.agent_automation),
      },
      {
        key: "model-choice",
        label: "모델 선택",
        getValue: (provider) => {
          if (provider.capabilities.model_choice.available === null) return <UnknownValue />;
          const head = provider.capabilities.model_choice.available ? "예" : "아니오";
          const note = provider.capabilities.model_choice.note;
          return note ? `${head} (${note})` : head;
        },
      },
    ],
  },
  {
    title: "C. 제한/정책",
    rows: [
      {
        key: "commercial",
        label: "상업적 사용",
        getValue: (provider) =>
          provider.limits.commercial_use === "allowed" ? "허용" : <UnknownValue />,
      },
      {
        key: "watermark",
        label: "워터마크",
        getValue: (provider) => yesNoUnknown(provider.limits.watermark),
      },
      {
        key: "rate-limits",
        label: "레이트 리밋",
        getValue: (provider) => limitValue(provider.limits.rate_limits),
      },
    ],
  },
  {
    title: "D. 연동",
    rows: [
      { key: "api", label: "API", getValue: (provider) => yesNo(provider.integrations.api) },
      {
        key: "workflow-tools",
        label: "Zapier/Make/n8n",
        getValue: (provider) => yesNoUnknown(provider.integrations.zapier_make_n8n),
      },
      {
        key: "plugins",
        label: "플러그인/확장",
        getValue: (provider) => yesNoUnknown(provider.integrations.plugins_extensions),
      },
    ],
  },
  {
    title: "E. 활용 추천",
    rows: [
      { key: "best-blog", label: "Blog", getValue: (provider) => bestForBullets(provider.best_for.blog) },
      { key: "best-shorts", label: "Shorts", getValue: (provider) => bestForBullets(provider.best_for.shorts) },
      { key: "best-design", label: "Design", getValue: (provider) => bestForBullets(provider.best_for.design) },
      { key: "best-coding", label: "Coding", getValue: (provider) => bestForBullets(provider.best_for.coding) },
      {
        key: "best-business",
        label: "Business",
        getValue: (provider) => bestForBullets(provider.best_for.business),
      },
    ],
  },
];

function parseCompareParam(value: string | null): string[] {
  if (!value) return [];
  const validIds = new Set(providers.map((provider) => provider.id));
  const parsed = value
    .split(",")
    .map((id) => id.trim())
    .filter((id) => validIds.has(id));
  return Array.from(new Set(parsed)).slice(0, MAX_SELECTION);
}

export default function HomeClient() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copyLabel, setCopyLabel] = useState("링크 복사");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const queryIds = parseCompareParam(new URLSearchParams(window.location.search).get("compare"));

    if (queryIds.length > 0) {
      setSelectedIds(queryIds);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queryIds));
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const validIds = parseCompareParam(parsed.join(","));
        setSelectedIds(validIds);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const selectedProviders = useMemo(
    () => selectedIds.map((id) => providers.find((provider) => provider.id === id)).filter(Boolean) as Provider[],
    [selectedIds],
  );

  const providerColumns = [selectedProviders[0] ?? null, selectedProviders[1] ?? null, selectedProviders[2] ?? null];

  const toggleProvider = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        onSelectProvider({ providerId: id, action: "remove", selectedCount: next.length });
        return next;
      }

      if (prev.length >= MAX_SELECTION) return prev;

      const next = [...prev, id];
      onSelectProvider({ providerId: id, action: "add", selectedCount: next.length });
      return next;
    });
  };

  const copyShareLink = async () => {
    if (typeof window === "undefined" || selectedIds.length === 0) return;

    const url = new URL(window.location.href);
    url.searchParams.set("compare", selectedIds.join(","));

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopyLabel("복사 완료");
      onCopyLink({ compare: selectedIds.join(",") });
      setTimeout(() => setCopyLabel("링크 복사"), 1500);
    } catch {
      setCopyLabel("복사 실패");
      setTimeout(() => setCopyLabel("링크 복사"), 1500);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/40">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">AI 플랫폼 비교</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">최대 3개 공급자를 선택해 실데이터로 비교하세요</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            요금, 기능, 정책, 연동 정보를 한 화면에서 비교하고 바로 공유 가능한 비교 링크를 생성할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1">선택됨: {selectedIds.length}/{MAX_SELECTION}</span>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300"
              >
                {copyLabel}
              </button>
            )}
          </div>
        </header>

        <section className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">AI 스택 추천기로 빠르게 시작</h2>
              <p className="mt-1 text-sm text-slate-200">3단계 질문으로 목적/예산/숙련도에 맞는 조합을 추천받을 수 있습니다.</p>
            </div>
            <Link
              href="/recommend"
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-200"
              onClick={() => onOpenRecommend({ source: "home_banner" })}
            >
              추천기 열기
            </Link>
          </div>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
            <Link href="/recommend?goal=blog&budget=under20&skill=beginner" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 hover:border-slate-500">블로그 입문 조합</Link>
            <Link href="/recommend?goal=video&budget=flexible&skill=intermediate" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 hover:border-slate-500">영상 성장 조합</Link>
            <Link href="/recommend?goal=design&budget=free&skill=beginner" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 hover:border-slate-500">디자인 무료 조합</Link>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">공급자 선택</h2>
            <p className="text-sm text-slate-400">카드를 눌러 비교 대상 추가/해제</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {providers.map((provider) => {
              const selected = selectedIds.includes(provider.id);
              const selectionLocked = !selected && selectedIds.length >= MAX_SELECTION;
              const bestBadges = getPlatformBestBadges(provider.id);

              return (
                <article
                  key={provider.id}
                  className={`rounded-2xl border p-5 transition ${
                    selected
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-slate-800 bg-slate-900 hover:border-slate-600"
                  } ${selectionLocked ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{provider.name}</h3>
                      <p className="mt-1 text-sm text-slate-300">{provider.tagline}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {provider.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            badge === "HOT"
                              ? "bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/40"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {bestBadges.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
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

                  <p className="mt-4 text-sm text-slate-300">
                    <span className="font-medium text-slate-100">카테고리:</span> {provider.category_tags.join(", ")}
                  </p>
                  <p className="mt-1 text-sm text-emerald-300">
                    <span className="font-medium text-slate-100">입문 가격:</span>{" "}
                    {provider.pricing.entry_price_usd_month !== null ? `$${provider.pricing.entry_price_usd_month}/월` : "—"}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    <span className="font-medium text-slate-100">최종 검증:</span> {provider.last_verified}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <Link href={`/platform/${provider.id}`} className="text-sm text-cyan-300 hover:text-cyan-200">
                      상세 가이드
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleProvider(provider.id)}
                      disabled={selectionLocked}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {selected ? "선택됨" : "선택"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">실시간 비교 테이블</h2>
            <button
              type="button"
              onClick={() => onClickCompare({ selectedIds })}
              className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
            >
              비교 실행 (광고 슬롯 연동 준비)
            </button>
          </div>

          {selectedProviders.length === 0 ? (
            <p className="text-sm text-slate-400">공급자를 1~3개 선택하면 비교표가 즉시 표시됩니다.</p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-300">
                      <th className="px-3 py-2 font-medium">항목</th>
                      {providerColumns.map((provider, index) => (
                        <th key={`head-${index}`} className="px-3 py-2 font-medium">
                          {provider ? provider.name : "선택 안 됨"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <Fragment key={`group-${group.title}`}>
                        <tr className="bg-slate-800/60 text-slate-100">
                          <td className="px-3 py-2 font-semibold" colSpan={4}>{group.title}</td>
                        </tr>
                        {group.rows.map((row) => (
                          <tr key={`${group.title}-${row.key}`} className="border-b border-slate-800 last:border-none">
                            <td className="px-3 py-3 text-slate-300">{row.label}</td>
                            {providerColumns.map((provider, index) => (
                              <td key={`${row.key}-${index}`} className="px-3 py-3 text-slate-200 align-top">
                                {provider ? row.getValue(provider) : <span className="text-slate-500">—</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 md:hidden">
                {groups.map((group) => (
                  <section key={`mobile-${group.title}`} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">{group.title}</h3>
                    <div className="mt-3 grid gap-3">
                      {selectedProviders.map((provider) => (
                        <article key={`${group.title}-${provider.id}`} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                          <p className="text-sm font-semibold text-emerald-300">{provider.name}</p>
                          <div className="mt-2 space-y-2 text-xs text-slate-300">
                            {group.rows.map((row) => (
                              <div key={`${provider.id}-${row.key}`} className="grid grid-cols-[110px_1fr] gap-2">
                                <span className="text-slate-400">{row.label}</span>
                                <div>{row.getValue(provider)}</div>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
