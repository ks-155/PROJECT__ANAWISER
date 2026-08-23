import { NextResponse } from "next/server";
import { getProducts, getLatestSnapshot } from "../../../../../../backend/src/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productName = searchParams.get("productName");

    if (!productName) {
      return NextResponse.json({ error: "Missing productName" }, { status: 400 });
    }

    const products = await getProducts();
    
    // Filter for local products that match the requested name (simple substring match for demo)
    const localProducts = products.filter(
      (p) => p.attributes?.isLocal === "true" && 
             p.name && 
             p.name.toLowerCase().includes(productName.toLowerCase().split(" ")[0])
    );

    const productsWithPrices = await Promise.all(
      localProducts.map(async (product) => {
        const latest = await getLatestSnapshot(product.id);
        return { ...product, latest };
      })
    );

    // Simulate network delay
    await new Promise((res) => setTimeout(res, 1000));

    return NextResponse.json({ products: productsWithPrices });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
