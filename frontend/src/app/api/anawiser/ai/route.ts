import { NextResponse } from "next/server";
import { askAssistant, ANAWISER_AI } from "@/lib/assistant";
import { geminiApiKey } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const key = geminiApiKey();
  return NextResponse.json({
    ok: true,
    configured: Boolean(key),
    provider: ANAWISER_AI.provider,
    model: ANAWISER_AI.model,
    getKeyUrl: ANAWISER_AI.getKeyUrl,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = String(body.message || "").trim();
  if (!message) {
    return NextResponse.json({ ok: false, error: "message is required" }, { status: 400 });
  }
  try {
    const result = await askAssistant({
      message,
      history: body.history,
      context: body.context,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 },
    );
  }
}
