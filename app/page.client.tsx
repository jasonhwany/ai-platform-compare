"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { platforms } from "./data/platforms";
import { getPlatformBestBadges } from "./data/recommendation";

const MAX_SELECTION = 3;

export default function HomeClient() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedPlatforms = useMemo(
    () => platforms.filter((platform) => selectedIds.includes(platform.id)),
    [selectedIds],
  );

  const togglePlatform = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/40">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            AI Platform Comparison MVP
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Find the right AI stack before you overspend.
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Compare top AI platforms by pricing, strengths, and fit. Select up to
            three providers and prepare a side-by-side shortlist.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1">
              Selected: {selectedIds.length}/{MAX_SELECTION}
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              Compare button ready for interstitial ads
            </span>
          </div>
        </header>

        <section className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Try AI Stack Recommender</h2>
              <p className="mt-1 text-sm text-slate-200">
                Answer 3 quick questions and get a conversion-ready platform stack.
              </p>
            </div>
            <Link
              href="/recommend"
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-200"
            >
              Find My Best AI Stack
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Top Platforms</h2>
            <p className="text-sm text-slate-400">
              Tap a card to compare (max {MAX_SELECTION})
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {platforms.map((platform) => {
              const selected = selectedIds.includes(platform.id);
              const selectionLocked =
                !selected && selectedIds.length >= MAX_SELECTION;
              const bestBadges = getPlatformBestBadges(platform.id);

              return (
                <article
                  key={platform.id}
                  className={`rounded-2xl border p-5 transition ${
                    selected
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-slate-800 bg-slate-900 hover:border-slate-600"
                  } ${selectionLocked ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{platform.name}</h3>
                      <p className="mt-1 text-sm text-slate-300">{platform.tagline}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {platform.badges.map((badge) => (
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
                    <span className="font-medium text-slate-100">Category:</span>{" "}
                    {platform.category}
                  </p>
                  <p className="mt-1 text-sm text-emerald-300">
                    <span className="font-medium text-slate-100">Pricing:</span>{" "}
                    {platform.pricing}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    <span className="font-medium text-slate-100">Best for:</span>{" "}
                    {platform.bestFor}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                    {platform.highlights.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <Link
                      href={`/platform/${platform.id}`}
                      className="text-sm text-cyan-300 hover:text-cyan-200"
                    >
                      Read conversion guide
                    </Link>
                    <button
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      disabled={selectionLocked}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {selected ? "Selected" : "Select"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Comparison Table</h2>
            <button
              type="button"
              className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Compare (ad slot placeholder)
            </button>
          </div>

          {selectedPlatforms.length === 0 ? (
            <p className="text-sm text-slate-400">
              Select up to {MAX_SELECTION} platforms to see side-by-side details.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-300">
                    <th className="px-3 py-2 font-medium">Platform</th>
                    <th className="px-3 py-2 font-medium">Category</th>
                    <th className="px-3 py-2 font-medium">Pricing</th>
                    <th className="px-3 py-2 font-medium">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPlatforms.map((platform) => (
                    <tr
                      key={platform.id}
                      className="border-b border-slate-800 last:border-none"
                    >
                      <td className="px-3 py-3 font-semibold text-slate-100">
                        {platform.name}
                      </td>
                      <td className="px-3 py-3 text-slate-300">{platform.category}</td>
                      <td className="px-3 py-3 text-emerald-300">{platform.pricing}</td>
                      <td className="px-3 py-3 text-slate-300">{platform.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
