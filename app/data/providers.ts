export type TriState = "yes" | "no" | "unknown";

export type Provider = {
  id: string;
  name: string;
  website: string;
  tagline: string;
  category_tags: string[];
  badges: string[];
  pricing: {
    free_plan: {
      available: boolean | null;
      note: string | null;
    };
    entry_price_usd_month: number | null;
    usage_based: boolean | null;
    api_pricing_link: string | null;
  };
  last_verified: string;
  capabilities: {
    text_chat: boolean | null;
    image: boolean | null;
    video: boolean | null;
    audio: boolean | null;
    code: boolean | null;
    agent_automation: boolean | null;
    model_choice: {
      available: boolean | null;
      note: string | null;
    };
  };
  limits: {
    commercial_use: "allowed" | "unknown";
    watermark: TriState;
    rate_limits: string | null;
  };
  integrations: {
    api: boolean | null;
    zapier_make_n8n: TriState;
    plugins_extensions: TriState;
  };
  best_for: {
    blog: string[];
    shorts: string[];
    design: string[];
    coding: string[];
    business: string[];
  };
};

export const providers: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    website: "https://openai.com",
    tagline: "대화형 AI와 API 생태계가 강한 범용 플랫폼",
    category_tags: ["범용 AI", "API", "에이전트"],
    badges: ["HOT", "Popular"],
    pricing: {
      free_plan: {
        available: true,
        note: "일부 모델/사용량 제한",
      },
      entry_price_usd_month: 20,
      usage_based: true,
      api_pricing_link: "https://openai.com/api/pricing/",
    },
    last_verified: "2026-02-18",
    capabilities: {
      text_chat: true,
      image: true,
      video: false,
      audio: true,
      code: true,
      agent_automation: true,
      model_choice: {
        available: true,
        note: "모델 라인업 선택 가능",
      },
    },
    limits: {
      commercial_use: "allowed",
      watermark: "unknown",
      rate_limits: "요금제/티어별 상이",
    },
    integrations: {
      api: true,
      zapier_make_n8n: "yes",
      plugins_extensions: "yes",
    },
    best_for: {
      blog: ["장문 초안", "요약/교정"],
      shorts: ["스크립트 생성", "후킹 문구"],
      design: ["카피 생성", "크리에이티브 아이디어"],
      coding: ["코드 생성", "디버깅 보조"],
      business: ["업무 자동화", "고객응대 챗봇"],
    },
  },
  {
    id: "anthropic",
    name: "Anthropic",
    website: "https://www.anthropic.com",
    tagline: "긴 문맥 처리와 안전성 중심의 고급 AI 플랫폼",
    category_tags: ["범용 AI", "API", "엔터프라이즈"],
    badges: ["HOT", "Premium"],
    pricing: {
      free_plan: {
        available: true,
        note: "무료 사용량 제한",
      },
      entry_price_usd_month: 20,
      usage_based: true,
      api_pricing_link: "https://www.anthropic.com/pricing",
    },
    last_verified: "2026-02-18",
    capabilities: {
      text_chat: true,
      image: true,
      video: false,
      audio: false,
      code: true,
      agent_automation: true,
      model_choice: {
        available: true,
        note: "Claude 모델 선택",
      },
    },
    limits: {
      commercial_use: "allowed",
      watermark: "unknown",
      rate_limits: "모델/계정별 제한",
    },
    integrations: {
      api: true,
      zapier_make_n8n: "yes",
      plugins_extensions: "unknown",
    },
    best_for: {
      blog: ["리서치 기반 장문", "정제된 문체"],
      shorts: ["스크립트 정리"],
      design: ["기획서 작성"],
      coding: ["리팩터링 가이드", "문서화"],
      business: ["정책/문서 QA", "엔터프라이즈 보조"],
    },
  },
  {
    id: "google-ai",
    name: "Google AI",
    website: "https://ai.google",
    tagline: "Google 생태계와 결합하기 쉬운 Gemini 중심 플랫폼",
    category_tags: ["범용 AI", "멀티모달", "생산성"],
    badges: ["HOT"],
    pricing: {
      free_plan: {
        available: true,
        note: "무료 티어 제공",
      },
      entry_price_usd_month: 19,
      usage_based: true,
      api_pricing_link: "https://ai.google.dev/pricing",
    },
    last_verified: "2026-02-18",
    capabilities: {
      text_chat: true,
      image: true,
      video: true,
      audio: true,
      code: true,
      agent_automation: true,
      model_choice: {
        available: true,
        note: "Gemini 계열 선택",
      },
    },
    limits: {
      commercial_use: "allowed",
      watermark: "unknown",
      rate_limits: "API 요금제별 상이",
    },
    integrations: {
      api: true,
      zapier_make_n8n: "yes",
      plugins_extensions: "yes",
    },
    best_for: {
      blog: ["정보성 글 초안", "검색 결합"],
      shorts: ["영상 아이디어", "스크립트"],
      design: ["프롬프트 실험"],
      coding: ["코드 보조", "설명 생성"],
      business: ["Google Workspace 연동"],
    },
  },
  {
    id: "perplexity",
    name: "Perplexity",
    website: "https://www.perplexity.ai",
    tagline: "출처 기반 리서치에 강한 답변형 검색 AI",
    category_tags: ["리서치", "검색", "요약"],
    badges: ["Trending"],
    pricing: {
      free_plan: {
        available: true,
        note: "기본 무료 사용 가능",
      },
      entry_price_usd_month: 20,
      usage_based: false,
      api_pricing_link: "https://www.perplexity.ai/pro",
    },
    last_verified: "2026-02-18",
    capabilities: {
      text_chat: true,
      image: false,
      video: false,
      audio: false,
      code: false,
      agent_automation: false,
      model_choice: {
        available: true,
        note: "일부 모드에서 선택 가능",
      },
    },
    limits: {
      commercial_use: "unknown",
      watermark: "unknown",
      rate_limits: "플랜별 질문량 제한",
    },
    integrations: {
      api: false,
      zapier_make_n8n: "unknown",
      plugins_extensions: "unknown",
    },
    best_for: {
      blog: ["근거 수집", "출처 확인"],
      shorts: ["트렌드 탐색"],
      design: ["레퍼런스 조사"],
      coding: ["기술 문서 탐색"],
      business: ["시장조사", "경쟁사 리서치"],
    },
  },
  {
    id: "midjourney",
    name: "Midjourney",
    website: "https://www.midjourney.com",
    tagline: "고품질 이미지 생성에 특화된 크리에이티브 플랫폼",
    category_tags: ["이미지 생성", "디자인", "콘텐츠"],
    badges: ["HOT", "Creator Pick"],
    pricing: {
      free_plan: {
        available: false,
        note: "무료 플랜 제한적/비상시 제공",
      },
      entry_price_usd_month: 10,
      usage_based: false,
      api_pricing_link: "https://www.midjourney.com/pricing",
    },
    last_verified: "2026-02-18",
    capabilities: {
      text_chat: false,
      image: true,
      video: false,
      audio: false,
      code: false,
      agent_automation: false,
      model_choice: {
        available: true,
        note: "모델/스타일 버전 선택",
      },
    },
    limits: {
      commercial_use: "allowed",
      watermark: "unknown",
      rate_limits: "플랜별 생성량/속도 차등",
    },
    integrations: {
      api: false,
      zapier_make_n8n: "unknown",
      plugins_extensions: "unknown",
    },
    best_for: {
      blog: ["썸네일/삽화 제작"],
      shorts: ["커버 이미지", "콘셉트 시안"],
      design: ["브랜딩 시안", "광고 비주얼"],
      coding: ["—"],
      business: ["크리에이티브 제작"],
    },
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    website: "https://github.com/features/copilot",
    tagline: "개발 생산성을 높이는 코드 특화 AI 도우미",
    category_tags: ["코딩", "개발자도구", "IDE"],
    badges: ["Popular"],
    pricing: {
      free_plan: {
        available: true,
        note: "학생/OSS 등 조건부 무료",
      },
      entry_price_usd_month: 10,
      usage_based: false,
      api_pricing_link: "https://github.com/features/copilot/plans",
    },
    last_verified: "2026-02-18",
    capabilities: {
      text_chat: true,
      image: false,
      video: false,
      audio: false,
      code: true,
      agent_automation: true,
      model_choice: {
        available: true,
        note: "모델 선택(플랜/정책 기반)",
      },
    },
    limits: {
      commercial_use: "allowed",
      watermark: "no",
      rate_limits: "플랜/조직 정책 기반",
    },
    integrations: {
      api: false,
      zapier_make_n8n: "no",
      plugins_extensions: "yes",
    },
    best_for: {
      blog: ["개발 글 초안"],
      shorts: ["개발 팁 스크립트"],
      design: ["—"],
      coding: ["코드 자동완성", "리뷰 보조"],
      business: ["개발팀 생산성 향상"],
    },
  },
];

export const providersById: Record<string, Provider> = Object.fromEntries(
  providers.map((provider) => [provider.id, provider]),
);

export function getProviderById(id: string): Provider | undefined {
  return providersById[id];
}
