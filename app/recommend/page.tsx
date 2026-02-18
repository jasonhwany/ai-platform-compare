import type { Metadata } from "next";
import {
  parseBudgetParam,
  parseGoalParam,
  parseSkillParam,
  toParamBudget,
  toParamGoal,
  toParamSkill,
} from "../data/recommendation";
import RecommendClient from "./recommend-client";

type SearchParams = {
  goal?: string;
  budget?: string;
  skill?: string;
};

type RecommendPageProps = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ searchParams }: RecommendPageProps): Promise<Metadata> {
  const params = await searchParams;
  const goal = parseGoalParam(params.goal);
  const budget = parseBudgetParam(params.budget);
  const skill = parseSkillParam(params.skill);

  if (goal && budget && skill) {
    return {
      title: `AI Stack Recommendation: ${goal} / ${budget} / ${skill} | AI Platform Compare`,
      description: `${goal} 목적과 ${budget} 예산, ${skill} 숙련도에 맞춘 AI 스택 추천 결과를 확인하세요.`,
      alternates: {
        canonical: `/recommend?goal=${toParamGoal(goal)}&budget=${toParamBudget(budget)}&skill=${toParamSkill(skill)}`,
      },
    };
  }

  return {
    title: "AI Stack Recommender | AI Platform Compare",
    description: "3-step wizard로 목표, 예산, 숙련도에 맞는 AI 도구 스택을 추천받으세요.",
    alternates: { canonical: "/recommend" },
  };
}

export default async function RecommendPage({ searchParams }: RecommendPageProps) {
  const params = await searchParams;
  const goal = parseGoalParam(params.goal);
  const budget = parseBudgetParam(params.budget);
  const skill = parseSkillParam(params.skill);

  return <RecommendClient initialGoal={goal} initialBudget={budget} initialSkill={skill} />;
}
