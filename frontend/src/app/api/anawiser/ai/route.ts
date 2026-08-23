import { NextResponse } from "next/server";
import {
  askAnawiserAssistant,
  ANAWISER_AI,
  type AssistantContext,
  type AssistantMessage,
} from "@anawiser/ai-scraper/assistant";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const key = process.env.GEMINI_API_KEY?.trim() || "";
  const configured =
    key.length > 0 &&
    !key.includes("your_gemini") &&
    !key.includes("your_key") &&
    key !== "changeme";

  return NextResponse.json({
    ok: true,
    provider: ANAWISER_AI.provider,
    model: ANAWISER_AI.model,
    getKeyUrl: ANAWISER_AI.getKeyUrl,
    configured,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      message?: string;
      history?: AssistantMessage[];
      context?: AssistantContext;
    };

    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json({ ok: false, error: "message is required" }, { status: 400 });
    }

    const result = await askAnawiserAssistant({
      message,
      history: body.history,
      context: body.context,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const error = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
