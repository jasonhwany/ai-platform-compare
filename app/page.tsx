import type { Metadata } from "next";
import HomeClient from "./page.client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-platform-compare.vercel.app";

export const metadata: Metadata = {
  title: "AI Platform Compare | Compare ChatGPT, Claude, Gemini and More",
  description:
    "Compare AI platforms by pricing, strengths, and best use case. Build a shortlist fast and reduce AI software spend.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Platform Compare",
    description:
      "Compare top AI tools and pick the best platform for your budget and workflow.",
    url: siteUrl,
    siteName: "AI Platform Compare",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 256,
        height: 256,
        alt: "AI Platform Compare",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "AI Platform Compare",
    description: "Compare AI platform pricing and features in one place.",
    images: ["/favicon.ico"],
  },
};

export default function Home() {
  return <HomeClient />;
}
