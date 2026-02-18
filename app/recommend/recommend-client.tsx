"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type BudgetLevel,
  type PrimaryGoal,
  type SkillLevel,
  getRecommendedStacks,
  getPlatformBestBadges,
  toParamBudget,
  toParamGoal,
  toParamSkill,
} from "../data/recommendation";
import { platforms } from "../data/platforms";
import { track } from "../lib/track";

type RecommendClientProps = {
  initialGoal: PrimaryGoal | null;
  initialBudget: BudgetLevel | null;
  initialSkill: SkillLevel | null;
};

const goals: PrimaryGoal[] = ["Blog", "Video", "Design", "Automation", "Research"];
const budgets: BudgetLevel[] = ["Free", "Under $20", "Flexible"];
const skills: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"];

export default function RecommendClient({
  initialGoal,
  initialBudget,
  initialSkill,
}: RecommendClientProps) {
  const hasInitialSelection = Boolean(initialGoal && initialBudget && initialSkill);

  const [step, setStep] = useState(hasInitialSelection ? 4 : 1);
  const [goal, setGoal] = useState<PrimaryGoal | null>(initialGoal);
  const [budget, setBudget] = useState<BudgetLevel | null>(initialBudget);
  const [skill, setSkill] = useState<SkillLevel | null>(initialSkill);
  const [copyLabel, setCopyLabel] = useState("Copy share link");

  const recommendations = useMemo(() => {
    if (!goal || !budget || !skill) return [];
    return getRecommendedStacks(goal, budget, skill);
  }, [goal, budget, skill]);

  const lastTrackedSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (step !== 4 || !goal || !budget || !skill || recommendations.length === 0) return;
    const signature = `${goal}-${budget}-${skill}-${recommendations.map((item) => item.id).join(",")}`;
    if (lastTrackedSignatureRef.current === signature) return;
    lastTrackedSignatureRef.current = signature;

    track("reco_complete", {
      goal,
      budget,
      skill,
      stackIds: recommendations.map((item) => item.id),
    });
  }, [step, goal, budget, skill, recommendations]);

  const sharePath = useMemo(() => {
    if (!goal || !budget || !skill) return "/recommend";
    const params = new URLSearchParams({
      goal: toParamGoal(goal),
      budget: toParamBudget(budget),
      skill: toParamSkill(skill),
    });
    return `/recommend?${params.toString()}`;
  }, [goal, budget, skill]);

  const copyShareLink = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${sharePath}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyLabel("Copied");
      window.history.replaceState(null, "", sharePath);
      setTimeout(() => setCopyLabel("Copy share link"), 1500);
    } catch {
      setCopyLabel("Copy failed");
      setTimeout(() => setCopyLabel("Copy share link"), 1500);
    }
  };

  const reset = () => {
    setStep(1);
    setGoal(null);
    setBudget(null);
    setSkill(null);
    setCopyLabel("Copy share link");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/recommend");
    }
  };

  const onSelectGoal = (item: PrimaryGoal) => {
    setGoal(item);
    setStep(2);
  };

  const onSelectBudget = (item: BudgetLevel) => {
    setBudget(item);
    setStep(3);
  };

  const onSelectSkill = (item: SkillLevel) => {
    setSkill(item);
    setStep(4);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">AI Stack Recommender</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Get Your Best AI Stack in 3 Steps</h1>
          <p className="mt-3 text-slate-300">목표, 예산, 숙련도를 선택하면 바로 실행 가능한 플랫폼 조합을 추천합니다.</p>
        </header>

        {step <= 3 && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Step {step} / 3</p>

            {step === 1 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Primary Goal</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {goals.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSelectGoal(item)}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-left font-semibold hover:border-emerald-400"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Budget Level</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {budgets.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSelectBudget(item)}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-left font-semibold hover:border-emerald-400"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Skill Level</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {skills.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSelectSkill(item)}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-left font-semibold hover:border-emerald-400"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {step === 4 && goal && budget && skill && (
          <section className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Recommended AI Stacks</h2>
                <p className="mt-2 text-slate-200">
                  Based on your profile: <span className="font-semibold">{goal}</span> / <span className="font-semibold">{budget}</span> / <span className="font-semibold">{skill}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-100 hover:border-slate-500"
              >
                {copyLabel}
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {recommendations.slice(0, 3).map((stack) => (
                <article key={stack.id} className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                  <h3 className="text-lg font-bold text-emerald-300">{stack.title}</h3>
                  <p className="mt-2 text-slate-300">{stack.summary}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {stack.platformIds.map((id) => {
                      const platform = platforms.find((item) => item.id === id);
                      if (!platform) return null;
                      return (
                        <div key={id} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
                          <p className="font-semibold text-slate-100">{platform.name}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {getPlatformBestBadges(id).slice(0, 2).map((badge) => (
                              <span key={badge} className="rounded-full bg-amber-300/20 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={stack.cta.href}
                      className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-200"
                      onClick={() => {
                        track("reco_cta_click", {
                          goal,
                          budget,
                          skill,
                          stackIds: recommendations.map((item) => item.id),
                          recommendationId: stack.id,
                          target: stack.cta.href,
                        });
                      }}
                    >
                      {stack.cta.label}
                    </Link>
                    <Link
                      href="/"
                      className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-100 hover:border-slate-500"
                    >
                      Go Compare on Homepage
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-slate-500"
            >
              Restart Recommendation Wizard
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
