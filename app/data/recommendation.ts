import { providers } from "./providers";

export type BestBadge =
  | "Best Overall"
  | "Best Budget"
  | "Best for Professionals"
  | "Best for Beginners";

export type PrimaryGoal = "Blog" | "Video" | "Design" | "Automation" | "Research";
export type BudgetLevel = "Free" | "Under $20" | "Flexible";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export function parseGoalParam(input?: string | null): PrimaryGoal | null {
  const value = (input ?? "").toLowerCase();
  if (value === "blog") return "Blog";
  if (value === "video") return "Video";
  if (value === "design") return "Design";
  if (value === "automation") return "Automation";
  if (value === "research") return "Research";
  return null;
}

export function parseBudgetParam(input?: string | null): BudgetLevel | null {
  const value = (input ?? "").toLowerCase();
  if (value === "free") return "Free";
  if (value === "under20") return "Under $20";
  if (value === "flexible") return "Flexible";
  return null;
}

export function parseSkillParam(input?: string | null): SkillLevel | null {
  const value = (input ?? "").toLowerCase();
  if (value === "beginner") return "Beginner";
  if (value === "intermediate") return "Intermediate";
  if (value === "advanced") return "Advanced";
  return null;
}

export function toParamGoal(goal: PrimaryGoal): string {
  return goal.toLowerCase();
}

export function toParamBudget(budget: BudgetLevel): string {
  if (budget === "Under $20") return "under20";
  return budget.toLowerCase();
}

export function toParamSkill(skill: SkillLevel): string {
  return skill.toLowerCase();
}

export const bestBadgeByPlatform: Record<string, BestBadge[]> = {
  openai: ["Best Overall", "Best for Professionals"],
  anthropic: ["Best for Professionals"],
  "google-ai": ["Best for Beginners"],
  perplexity: ["Best Budget", "Best for Beginners"],
  midjourney: ["Best Overall"],
  "github-copilot": ["Best for Professionals", "Best Budget"],
};

export function getPlatformBestBadges(platformId: string): BestBadge[] {
  return bestBadgeByPlatform[platformId] ?? [];
}

export type RecommendedStack = {
  id: string;
  title: string;
  platformIds: string[];
  summary: string;
  cta: {
    label: string;
    href: string;
  };
};

const findName = (id: string) =>
  providers.find((provider) => provider.id === id)?.name ?? id;

const toCompareHref = (a: string, b: string) =>
  `/compare/${[a, b].sort().join("-vs-")}`;

export function getRecommendedStacks(
  goal: PrimaryGoal,
  budget: BudgetLevel,
  skill: SkillLevel,
): RecommendedStack[] {
  const lowBudget = budget === "Free" || budget === "Under $20";

  if (goal === "Design") {
    return [
      {
        id: "design-1",
        title: `${findName("midjourney")} + ${findName("openai")}`,
        platformIds: ["midjourney", "openai"],
        summary:
          "비주얼 생성과 카피/기획 자동화를 동시에 가져가는 균형형 스택입니다. 캠페인 제작 속도를 높이기 좋습니다.",
        cta: { label: "디자인 스택 비교 시작", href: toCompareHref("midjourney", "openai") },
      },
      {
        id: "design-2",
        title: `${findName("midjourney")} + ${findName("perplexity")}`,
        platformIds: ["midjourney", "perplexity"],
        summary:
          "레퍼런스 조사와 시안 생성을 연결하는 리서치 중심 디자인 스택입니다.",
        cta: {
          label: "디자인 리서치 스택 보기",
          href: toCompareHref("midjourney", "perplexity"),
        },
      },
      {
        id: "design-3",
        title: `${findName("google-ai")} + ${findName("midjourney")}`,
        platformIds: ["google-ai", "midjourney"],
        summary:
          "초기 비용 부담을 낮추면서 크리에이티브 품질을 확보하려는 팀에 적합합니다.",
        cta: { label: "저비용 디자인 조합 확인", href: toCompareHref("google-ai", "midjourney") },
      },
    ];
  }

  if (goal === "Automation") {
    return [
      {
        id: "automation-1",
        title: `${findName("openai")} + ${findName("github-copilot")}`,
        platformIds: ["openai", "github-copilot"],
        summary:
          "워크플로우 자동화와 개발 생산성을 동시에 올리는 실무형 조합입니다.",
        cta: { label: "자동화 스택 도입하기", href: toCompareHref("openai", "github-copilot") },
      },
      {
        id: "automation-2",
        title: `${findName("anthropic")} + ${findName("github-copilot")}`,
        platformIds: ["anthropic", "github-copilot"],
        summary:
          "긴 문맥 처리와 코드 협업을 함께 강화하려는 고급 팀에 유리합니다.",
        cta: {
          label: "프로 자동화 조합 비교",
          href: toCompareHref("anthropic", "github-copilot"),
        },
      },
      {
        id: "automation-3",
        title: `${findName("google-ai")} + ${findName("github-copilot")}`,
        platformIds: ["google-ai", "github-copilot"],
        summary:
          "낮은 진입비용으로 자동화 파일럿을 시작하고 싶은 팀에 적합합니다.",
        cta: { label: "가성비 자동화 조합 보기", href: toCompareHref("google-ai", "github-copilot") },
      },
    ];
  }

  if (goal === "Research") {
    return [
      {
        id: "research-1",
        title: `${findName("perplexity")} + ${findName("anthropic")}`,
        platformIds: ["perplexity", "anthropic"],
        summary:
          "근거 기반 조사와 심층 요약이 필요한 분석 업무에 강한 조합입니다.",
        cta: { label: "리서치 조합 자세히 보기", href: toCompareHref("perplexity", "anthropic") },
      },
      {
        id: "research-2",
        title: `${findName("perplexity")} + ${findName("openai")}`,
        platformIds: ["perplexity", "openai"],
        summary:
          "정보 수집 속도와 결과물 품질의 균형이 좋아 일반 조직 리서치에 적합합니다.",
        cta: { label: "리서치 표준 조합 비교", href: toCompareHref("perplexity", "openai") },
      },
      {
        id: "research-3",
        title: `${findName("google-ai")} + ${findName("perplexity")}`,
        platformIds: ["google-ai", "perplexity"],
        summary:
          "낮은 예산으로 검색 기반 리서치 자동화를 시작하기 쉬운 조합입니다.",
        cta: { label: "예산형 리서치 조합", href: toCompareHref("google-ai", "perplexity") },
      },
    ];
  }

  if (goal === "Video") {
    return [
      {
        id: "video-1",
        title: `${findName("openai")} + ${findName("midjourney")}`,
        platformIds: ["openai", "midjourney"],
        summary:
          "영상 스크립트와 비주얼 콘셉트 제작을 동시에 강화할 수 있는 크리에이터 중심 조합입니다.",
        cta: { label: "영상 제작 조합 시작", href: toCompareHref("openai", "midjourney") },
      },
      {
        id: "video-2",
        title: `${findName("google-ai")} + ${findName("openai")}`,
        platformIds: ["google-ai", "openai"],
        summary:
          "대본 생성과 워크스페이스 연동을 함께 활용하려는 팀형 제작 워크플로우에 적합합니다.",
        cta: { label: "팀 영상 워크플로우 보기", href: toCompareHref("google-ai", "openai") },
      },
      {
        id: "video-3",
        title: `${findName("perplexity")} + ${findName("openai")}`,
        platformIds: ["perplexity", "openai"],
        summary:
          "트렌드 조사와 대본 제작을 짧은 주기로 반복해야 하는 채널 운영에 유리합니다.",
        cta: { label: "영상 리서치 조합 비교", href: toCompareHref("perplexity", "openai") },
      },
    ];
  }

  const base = [
    {
      id: "blog-1",
      title: `${findName("openai")} + ${findName("perplexity")}`,
      platformIds: ["openai", "perplexity"],
      summary:
        "콘텐츠 초안 생성과 근거 리서치를 함께 처리해 블로그 생산성을 빠르게 높일 수 있습니다.",
      cta: { label: "블로그 스택 바로 비교", href: toCompareHref("openai", "perplexity") },
    },
    {
      id: "blog-2",
      title: `${findName("google-ai")} + ${findName("perplexity")}`,
      platformIds: ["google-ai", "perplexity"],
      summary: "초기 예산이 제한된 상황에서 검색 기반 글감 생산을 시작하기 좋은 조합입니다.",
      cta: { label: "가성비 블로그 조합 보기", href: toCompareHref("google-ai", "perplexity") },
    },
    {
      id: "blog-3",
      title: `${findName("anthropic")} + ${findName("perplexity")}`,
      platformIds: ["anthropic", "perplexity"],
      summary:
        "장문 품질과 리서치 정확도를 동시에 높이고 싶은 전문 콘텐츠 팀에 적합합니다.",
      cta: { label: "전문 블로그 조합 분석", href: toCompareHref("anthropic", "perplexity") },
    },
  ];

  if (lowBudget) {
    return [base[1], base[0], base[2]];
  }

  if (skill === "Advanced") {
    return [base[2], base[0], base[1]];
  }

  return base;
}
