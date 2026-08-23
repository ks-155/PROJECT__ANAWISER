import { NextResponse } from "next/server";
import { triggerSelfHeal } from "@/lib/self-heal";
import { getCollectorProof } from "@/lib/collector-proof";
import { brightDataCollectorId } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Start Scraper Studio Self-Healing. Does not return the API token. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await triggerSelfHeal({
    wait: false,
    prompt: typeof body.prompt === "string" ? body.prompt : undefined,
  });
  return NextResponse.json({
    ...result,
    publicDataOnly: true,
    tokenExposed: false,
  });
}

export async function GET() {
  const proof = getCollectorProof();
  return NextResponse.json({
    collectorId: (proof?.collectorId ?? brightDataCollectorId()) || null,
    healed: proof?.healed ?? false,
    source: proof?.source ?? null,
    publicDataOnly: true,
  });
}
