"use client";

import { track } from "./track";

export function onSelectProvider(payload: Record<string, unknown>) {
  track("on_select_provider", payload);
}

export function onClickCompare(payload: Record<string, unknown>) {
  track("on_click_compare", payload);
}

export function onCopyLink(payload: Record<string, unknown>) {
  track("on_copy_link", payload);
}

export function onClickPricingLink(payload: Record<string, unknown>) {
  track("on_click_pricing_link", payload);
}

export function onOpenRecommend(payload: Record<string, unknown>) {
  track("on_open_recommend", payload);
}
