"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "../lib/track";

type TrackPayload = Record<string, unknown>;

type TrackedLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  eventType?: string;
  payload?: TrackPayload;
};

export function TrackedLink({
  href,
  className,
  children,
  eventType = "cta_click",
  payload = {},
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        track(eventType, payload);
      }}
    >
      {children}
    </Link>
  );
}

type TrackedExternalLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  eventType?: string;
  payload?: TrackPayload;
};

export function TrackedExternalLink({
  href,
  className,
  children,
  target = "_blank",
  rel = "noreferrer",
  eventType = "cta_click",
  payload = {},
}: TrackedExternalLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() => {
        track(eventType, payload);
      }}
    >
      {children}
    </a>
  );
}
