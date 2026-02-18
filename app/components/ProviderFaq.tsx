"use client";

import { onFaqExpand } from "../lib/events";

type FaqItem = {
  question: string;
  answer: string;
};

type ProviderFaqProps = {
  providerId: string;
  items: FaqItem[];
};

export default function ProviderFaq({ providerId, items }: ProviderFaqProps) {
  return (
    <div className="mt-4 grid gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="rounded-lg border border-slate-700 bg-slate-950 p-4"
          onToggle={(event) => {
            const target = event.currentTarget;
            if (target.open) {
              onFaqExpand({ providerId, question: item.question });
            }
          }}
        >
          <summary className="cursor-pointer font-semibold text-slate-100">{item.question}</summary>
          <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
