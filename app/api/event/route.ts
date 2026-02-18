import { NextRequest, NextResponse } from "next/server";

type EventBody = {
  type: string;
  page: string;
  payload?: Record<string, unknown>;
  ts: number;
};

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const ipBuckets = new Map<string, { count: number; startedAt: number }>();

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  const bucket = ipBuckets.get(ip);
  if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
    ipBuckets.set(ip, { count: 1, startedAt: now });
    return false;
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return true;
  }

  bucket.count += 1;
  ipBuckets.set(ip, bucket);
  return false;
}

function isValidBody(data: unknown): data is EventBody {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  if (typeof obj.type !== "string" || obj.type.length < 2 || obj.type.length > 64) {
    return false;
  }

  if (typeof obj.page !== "string" || !obj.page.startsWith("/") || obj.page.length > 256) {
    return false;
  }

  if (typeof obj.ts !== "number" || !Number.isFinite(obj.ts)) {
    return false;
  }

  if (
    obj.payload !== undefined &&
    (typeof obj.payload !== "object" || obj.payload === null || Array.isArray(obj.payload))
  ) {
    return false;
  }

  return true;
}

export async function POST(req: NextRequest) {
  const now = Date.now();
  const ip = getIp(req);

  if (isRateLimited(ip, now)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "production") {
    console.info("[first_party_event]", {
      ip,
      type: body.type,
      page: body.page,
      payload: body.payload ?? {},
      ts: body.ts,
    });
  }

  return NextResponse.json({ ok: true });
}
