const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatContext = {
  productName?: string;
  category?: string;
  prices?: Record<string, { price: number | null; status: string }>;
  localPrices?: Array<{ store?: string; price?: number | null }>;
};

const SYSTEM = `You are Anawiser AI, a shopping assistant for Indian e-commerce prices.
Help the user compare prices in INR. Recommend the cheapest option when numbers are provided.
Never invent prices. Keep replies to 3-8 short sentences.`;

function contextText(ctx?: ChatContext) {
  if (!ctx) return "No product selected.";
  const lines: string[] = [];
  if (ctx.category) lines.push(`Category: ${ctx.category}`);
  if (ctx.productName) lines.push(`Product: ${ctx.productName}`);
  if (ctx.prices) {
    for (const [store, data] of Object.entries(ctx.prices)) {
      lines.push(`${store}: ${data.price != null ? `₹${data.price}` : data.status}`);
    }
  }
  if (ctx.localPrices?.length) {
    for (const row of ctx.localPrices) {
      lines.push(`Local ${row.store || "store"}: ${row.price != null ? `₹${row.price}` : "N/A"}`);
    }
  }
  return lines.join("\n") || "No product selected.";
}

export async function askAssistant(opts: {
  message: string;
  history?: ChatMessage[];
  context?: ChatContext;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const history = (opts.history || []).slice(-8);
  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [
        ...history.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        {
          role: "user",
          parts: [{ text: `${contextText(opts.context)}\n\nUser: ${opts.message}` }],
        },
      ],
      generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error (${res.status}): ${await res.text()}`);
  const data = await res.json();
  const reply =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ||
    "I could not generate a reply.";
  return { reply: reply.trim(), model: MODEL };
}

export const ANAWISER_AI = {
  provider: "Google Gemini",
  model: MODEL,
  getKeyUrl: "https://aistudio.google.com/apikey",
};
