import { NextResponse } from "next/server";
import { addProduct, addSnapshot } from "@anawiser/backend";

export async function POST(req: Request) {
  try {
    const { storeName, productName, price, url } = await req.json();

    if (!storeName || !productName || price === undefined) {
      return NextResponse.json(
        { error: "storeName, productName, and price are required" },
        { status: 400 }
      );
    }

    // Generate a unique URL for local products if none is provided
    const safeStore = storeName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const safeProduct = productName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const productUrl = url || `local://${safeStore}/${safeProduct}/${Date.now()}`;

    // 1. Add the product with local attributes
    const product = await addProduct({
      url: productUrl,
      name: productName,
      desiredPrice: null, // Local admins aren't setting a desired price, they are posting the current price
      attributes: {
        isLocal: "true",
        storeName: storeName,
      },
    });

    // 2. Add the initial price snapshot so it appears on the dashboard immediately
    await addSnapshot({
      productId: product.id,
      price: Number(price),
      inStock: true,
      currency: "INR",
      stockText: "In Stock (Local Store)",
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Local add error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add local product" },
      { status: 500 }
    );
  }
}
