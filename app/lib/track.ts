"use client";

type TrackPayload = Record<string, unknown>;

export function track(type: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;

  const body = {
    type,
    page: window.location.pathname,
    payload,
    ts: Date.now(),
  };

  void fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // swallow tracking failures
  });
}
