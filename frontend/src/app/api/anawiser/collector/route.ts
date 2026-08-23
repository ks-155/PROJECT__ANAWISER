import { NextResponse } from "next/server";
import { getCollectorProof } from "@/lib/collector-proof";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Safe proof for the dashboard. Never returns the API token. */
export async function GET() {
  const proof = getCollectorProof();
  return NextResponse.json({
    collectorId: proof?.collectorId ?? null,
    collectionId: proof?.collectionId ?? null,
    lastRunAt: proof?.lastRunAt ?? null,
    healed: proof?.healed ?? false,
    source: proof?.source ?? null,
    publicDataOnly: true,
  });
}
