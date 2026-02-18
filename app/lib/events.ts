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

export function onValueScoreView(payload: Record<string, unknown>) {
  track("value_score_view", payload);
}

export function onBestValueBadgeRender(payload: Record<string, unknown>) {
  track("best_value_badge_render", payload);
}

export function onFaqExpand(payload: Record<string, unknown>) {
  track("faq_expand", payload);
}

export function onOfficialLinkClick(payload: Record<string, unknown>) {
  track("official_link_click", payload);
}

export function onCompareAddClick(payload: Record<string, unknown>) {
  track("compare_add_click", payload);
}
