import { NextResponse } from "next/server";
import { getProducts, addProduct, getLatestSnapshot } from "@anawiser/backend";

export async function GET() {
  try {
    const products = await getProducts();
    // Attach latest snapshot to each product for the dashboard
    const productsWithSnapshots = await Promise.all(
      products.map(async (prod) => {
        const latest = await getLatestSnapshot(prod.id);
        return { ...prod, latest };
      })
    );
    return NextResponse.json({ products: productsWithSnapshots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, desiredPrice, attributes } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const newProduct = await addProduct({
      url,
      desiredPrice: desiredPrice ? parseFloat(desiredPrice) : null,
      attributes: attributes || {},
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
