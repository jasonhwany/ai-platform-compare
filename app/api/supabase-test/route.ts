import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../lib/supabase/server";

export async function GET() {
  try {
    const client = getSupabaseServerClient();
    if (!client) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}

