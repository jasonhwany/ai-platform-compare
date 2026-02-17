export type Platform = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  pricing: string;
  highlights: string[];
  bestFor: string;
  links: {
    website: string;
  };
  badges: string[];
};

export const platforms: Platform[] = [
  {
    id: "openai",
    name: "OpenAI",
    tagline: "Flagship multimodal models for chat, code, and reasoning.",
    category: "General AI API",
    pricing: "Free tier + usage-based API pricing",
    highlights: ["GPT family", "Strong tool use", "Enterprise options"],
    bestFor: "Teams building reliable AI features quickly",
    links: { website: "https://openai.com" },
    badges: ["HOT", "Popular"],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    tagline: "High-safety assistant models with long-context strength.",
    category: "General AI API",
    pricing: "Usage-based API pricing",
    highlights: ["Claude models", "Long context", "Safety-focused"],
    bestFor: "Knowledge-heavy workflows and enterprise assistants",
    links: { website: "https://www.anthropic.com" },
    badges: ["HOT", "Premium"],
  },
  {
    id: "google-ai",
    name: "Google AI",
    tagline: "Gemini models integrated with Google ecosystem tooling.",
    category: "General AI API",
    pricing: "Free tier + pay-as-you-go",
    highlights: ["Gemini", "Workspace integrations", "Vertex AI"],
    bestFor: "Teams already using Google Cloud",
    links: { website: "https://ai.google" },
    badges: ["HOT"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    tagline: "Answer engine optimized for cited web research.",
    category: "AI Search",
    pricing: "Free plan + Pro monthly subscription",
    highlights: ["Citations", "Fast research", "Consumer-friendly UI"],
    bestFor: "Researchers and content teams validating sources",
    links: { website: "https://www.perplexity.ai" },
    badges: ["Trending"],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    tagline: "High-quality AI image generation for creative production.",
    category: "Image Generation",
    pricing: "Subscription plans",
    highlights: ["Image quality", "Style control", "Active community"],
    bestFor: "Designers, marketers, and visual prototyping",
    links: { website: "https://www.midjourney.com" },
    badges: ["HOT", "Creator Pick"],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    tagline: "AI coding assistant built into popular developer workflows.",
    category: "Code Assistant",
    pricing: "Individual + Business subscription tiers",
    highlights: ["IDE integration", "Code suggestions", "Team policies"],
    bestFor: "Engineering teams accelerating implementation",
    links: { website: "https://github.com/features/copilot" },
    badges: ["Popular"],
  },
];
