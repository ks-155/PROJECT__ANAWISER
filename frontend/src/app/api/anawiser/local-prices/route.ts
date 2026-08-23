import { NextResponse } from "next/server";
import { getProducts, getLatestSnapshot } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const productName = new URL(req.url).searchParams.get("productName");
    if (!productName) return NextResponse.json({ error: "Missing productName" }, { status: 400 });
    const needle = productName.toLowerCase().split(" ")[0];
    const matches = (await getProducts()).filter(
      (p) => p.attributes?.isLocal === "true" && p.name?.toLowerCase().includes(needle),
    );
    const products = await Promise.all(
      matches.map(async (product) => ({ ...product, latest: await getLatestSnapshot(product.id) })),
    );
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
