import { NextResponse } from "next/server";
import { addProduct, addSnapshot } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { storeName, productName, price, url } = await req.json();
    if (!storeName || !productName || price === undefined) {
      return NextResponse.json({ error: "storeName, productName, and price are required" }, { status: 400 });
    }
    const slug = `${storeName}-${productName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const product = await addProduct({
      url: url || `local://${slug}/${Date.now()}`,
      name: productName,
      desiredPrice: null,
      attributes: { isLocal: "true", storeName },
    });
    await addSnapshot({
      productId: product.id,
      price: Number(price),
      inStock: true,
      currency: "INR",
      stockText: "In Stock (Local Store)",
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add local product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
