import { NextResponse } from "next/server";
import { simulateScrapeAndExtract } from "@anawiser/ai-scraper";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    // Call our scraper engine logic
    const result = await simulateScrapeAndExtract(productId);

    return NextResponse.json(result);
    
  } catch (error: any) {
    if (error.message === "Product not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
