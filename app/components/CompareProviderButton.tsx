"use client";

import { useEffect, useMemo, useState } from "react";
import { providers } from "../data/providers";
import { onCompareAddClick, onSelectProvider } from "../lib/events";

type CompareProviderButtonProps = {
  providerId: string;
  label?: string;
  className?: string;
};

const MAX_SELECTION = 3;
const STORAGE_KEY = "compareProviders";

function sanitizeIds(ids: string[]): string[] {
  const validIds = new Set(providers.map((provider) => provider.id));
  return Array.from(new Set(ids.filter((id) => validIds.has(id)))).slice(0, MAX_SELECTION);
}

export default function CompareProviderButton({
  providerId,
  label,
  className = "rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-200",
}: CompareProviderButtonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromQuery = new URLSearchParams(window.location.search).get("compare");
    if (fromQuery) {
      const parsed = sanitizeIds(fromQuery.split(",").map((item) => item.trim()));
      setSelectedIds(parsed);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setSelectedIds(sanitizeIds(parsed));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const isSelected = useMemo(() => selectedIds.includes(providerId), [selectedIds, providerId]);

  const handleClick = () => {
    const next = isSelected
      ? selectedIds.filter((id) => id !== providerId)
      : sanitizeIds([...selectedIds, providerId]);

    if (!isSelected && selectedIds.length >= MAX_SELECTION) {
      onSelectProvider({
        providerId,
        action: "max_reached",
        selectedCount: selectedIds.length,
      });
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      const compareQuery = next.length > 0 ? `?compare=${next.join(",")}` : "";
      onSelectProvider({
        providerId,
        action: isSelected ? "remove" : "add",
        selectedCount: next.length,
      });
      if (!isSelected) {
        onCompareAddClick({
          providerId,
          selectedCount: next.length,
        });
      }
      window.location.href = `/${compareQuery}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {label ?? (isSelected ? "홈 비교에서 제거" : "이 공급자 비교에 추가")}
    </button>
  );
}
