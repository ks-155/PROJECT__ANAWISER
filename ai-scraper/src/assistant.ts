/**
 * Anawiser AI Assistant — Google Gemini 2.5 Flash
 *
 * Helps users:
 * - Understand how to use the price tracker / scraper
 * - Compare scraped prices in plain language
 * - Decide whether to buy now
 * - Draft Bright Data heal prompts when extraction looks wrong
 *
 * Get a free API key: https://aistudio.google.com/apikey
 * Put it in frontend/.env.local as GEMINI_API_KEY=...
 */

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantContext = {
  productName?: string;
  category?: string;
  prices?: Record<string, { price: number | null; status: string }>;
  localPrices?: Array<{ store?: string; price?: number | null }>;
};

const SYSTEM_PROMPT = `You are Anawiser AI — a friendly shopping + scraper assistant for Indian e-commerce price tracking.

Anawiser uses Bright Data Scraper Studio to pull live prices from Amazon.in, Flipkart, Croma, Blinkit, Reliance, DMart, and local stores.

Your job:
1. Help the user use Anawiser (pick category/product, read prices, check local stores).
2. Explain scraped prices clearly in INR (₹). Recommend the cheapest option when data is present.
3. If prices look missing/wrong, suggest a short Bright Data self-heal prompt they can use.
4. Be concise (3–8 short sentences). No markdown tables unless asked.
5. Never invent exact prices — only use numbers from the provided context.
6. If no API context is available, still teach them how to use the dashboard.`;

function buildContextBlock(ctx?: AssistantContext): string {
  if (!ctx) return "No product is selected yet.";
  const lines: string[] = [];
  if (ctx.category) lines.push(`Category: ${ctx.category}`);
  if (ctx.productName) lines.push(`Product: ${ctx.productName}`);
  if (ctx.prices && Object.keys(ctx.prices).length) {
    lines.push("Online scraped prices:");
    for (const [platform, data] of Object.entries(ctx.prices)) {
      lines.push(
        `  - ${platform}: ${data.price != null ? `₹${data.price}` : data.status || "unknown"}`,
      );
    }
  }
  if (ctx.localPrices?.length) {
    lines.push("Local store prices:");
    for (const lp of ctx.localPrices) {
      lines.push(`  - ${lp.store || "store"}: ${lp.price != null ? `₹${lp.price}` : "N/A"}`);
    }
  }
  return lines.join("\n") || "No product is selected yet.";
}

export async function askAnawiserAssistant(opts: {
  message: string;
  history?: AssistantMessage[];
  context?: AssistantContext;
  apiKey?: string;
}): Promise<{ reply: string; model: string }> {
  const apiKey = opts.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey and add it to frontend/.env.local",
    );
  }

  const history = (opts.history || []).slice(-8);
  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [
        {
          text: [
            `Current Anawiser context:\n${buildContextBlock(opts.context)}`,
            "",
            `User question: ${opts.message}`,
          ].join("\n"),
        },
      ],
    },
  ];

  const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const reply =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ||
    "I could not generate a reply. Try again.";

  return { reply: reply.trim(), model: GEMINI_MODEL };
}

/**
 * After a scrape, ask Gemini for a one-line buy tip (optional).
 */
export async function explainScrapedPrices(opts: {
  productName: string;
  prices: Record<string, { price: number | null; status: string }>;
  apiKey?: string;
}): Promise<string | null> {
  try {
    const { reply } = await askAnawiserAssistant({
      message:
        "In 2 short sentences: which store is cheapest right now, and should the user buy or wait?",
      context: {
        productName: opts.productName,
        prices: opts.prices,
      },
      apiKey: opts.apiKey,
    });
    return reply;
  } catch {
    return null;
  }
}

export const ANAWISER_AI = {
  provider: "Google Gemini",
  model: GEMINI_MODEL,
  getKeyUrl: "https://aistudio.google.com/apikey",
  why: "Fast, strong reasoning, generous free tier — ideal for a hackathon shopping/scraper assistant.",
} as const;
