import { CATALOG, CATEGORIES } from "@/lib/catalog";
import { geminiApiKey } from "@/lib/env";

const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"] as const;

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatContext = {
  productName?: string;
  category?: string;
  prices?: Record<string, { price: number | null; status: string }>;
  localPrices?: Array<{ store?: string; price?: number | null }>;
  path?: string;
};

const OFF_TOPIC_REPLY = "Sorry, that is not my context to reply.";

function catalogDigest() {
  return CATEGORIES.map((cat) => {
    const names = CATALOG.filter((p) => p.category === cat)
      .map((p) => p.name)
      .slice(0, 45);
    return `${cat}: ${names.join("; ")}`;
  }).join("\n");
}

function siteKnowledge() {
  return `You are AnawiserAI, the helper inside the Anawiser website. Anawiser means Analyser + Wiser.

Answer shopper questions about this site: what it can do, how to compare prices, which pages exist, products in the catalog, local shops, festival offers, makers, contact, and product photos shown on Compare.

What Anawiser can do:
- Compare public Indian prices from Amazon, Flipkart, Blinkit, Croma, Reliance, and D-Mart.
- Show a neighbourhood shop quote next to those online prices.
- Surface public festival discounts and coupons during Flipkart Big Billion Days and Amazon Great Indian Festival.
- Show a matching electronics photo (phones and similar devices) when a product is selected.

Pages: Home, Compare, About Us, Docs. Retailers add a shop price with “Are you a retailer? Try this” above “Got any questions?”. Email is hello@anawiser.app.
Makers: Krish Patel and Dhrupad Patel.

Never invent a rupee amount. If no live prices are in this session, send the shopper to Compare.
Never describe how the website is built. Never mention disks, folders, file paths, npm commands, env files, API keys, tokens, collectors, datasets, servers, or source code.

If the question is not about Anawiser or using this website (movie tickets, weather, homework, recipes, sports, and other off-site topics), reply with only this sentence:
${OFF_TOPIC_REPLY}

Replies: 2–5 short sentences, or the off-topic sentence above.

Catalog:
${catalogDigest()}`;
}

function contextText(ctx?: ChatContext) {
  if (!ctx) return "No live product is selected.";
  const lines: string[] = [];
  if (ctx.path) lines.push(`User is on: ${ctx.path}`);
  if (ctx.category) lines.push(`Category: ${ctx.category}`);
  if (ctx.productName) lines.push(`Selected product: ${ctx.productName}`);
  if (ctx.prices && Object.keys(ctx.prices).length) {
    for (const [store, data] of Object.entries(ctx.prices)) {
      lines.push(`Live ${store}: ${data.price != null ? `₹${data.price}` : data.status || "none"}`);
    }
  } else {
    lines.push("No live online prices in session yet.");
  }
  if (ctx.localPrices?.length) {
    for (const row of ctx.localPrices) {
      lines.push(`Local ${row.store || "store"}: ${row.price != null ? `₹${row.price}` : "N/A"}`);
    }
  }
  return lines.join("\n");
}

function liveRows(ctx?: ChatContext) {
  const rows: Array<{ store: string; price: number }> = [];
  if (ctx?.prices) {
    for (const [store, data] of Object.entries(ctx.prices)) {
      if (data.price != null && data.price > 0) rows.push({ store, price: data.price });
    }
  }
  if (ctx?.localPrices) {
    for (const row of ctx.localPrices) {
      if (row.price != null && row.price > 0) {
        rows.push({ store: row.store || "Local shop", price: row.price });
      }
    }
  }
  return rows;
}

function isOffTopic(message: string) {
  const q = message.toLowerCase();
  if (
    /movie ticket|cinema|theatre|theater|netflix password|hotstar password|weather|recipe|cook|homework|assignment|lottery|crypto|bitcoin|dating|girlfriend|boyfriend|hack|crack|exam|cricket score|football score|stock tip|medical advice|visa|passport(?! bag)|free ticket/.test(
      q,
    )
  ) {
    return true;
  }
  const aboutSite =
    /anawiser|price|compare|amazon|flipkart|blinkit|croma|reliance|d-?mart|shop|store|product|phone|laptop|festival|coupon|discount|offer|local|maker|krish|dhrupad|contact|photo|hello|hi\b|hey\b|what can|what do you|what (your|the|this) site|this (site|app)|how (do i|to) use|who (made|built|are)/.test(
      q,
    );
  if (aboutSite) return false;
  if (q.split(/\s+/).filter(Boolean).length <= 2 && /^(ok|thanks|thank you|bye|good morning|good evening)$/.test(q)) {
    return false;
  }
  return q.length > 12;
}

function findProducts(message: string) {
  const q = message.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 3);
  return CATALOG.filter((p) => {
    const name = p.name.toLowerCase();
    return name.includes(q) || (words.length > 0 && words.every((w) => name.includes(w)));
  }).slice(0, 5);
}

function answerFromSite(message: string, ctx?: ChatContext): string | null {
  const q = message.toLowerCase();
  if (isOffTopic(message)) return OFF_TOPIC_REPLY;

  const rows = liveRows(ctx);

  if (
    /(what (can|does) (your |the |this )?site|what (your |the |this )?site can|what do you do|what is this (site|app)|what can you|what does anawiser)/.test(
      q,
    )
  ) {
    return "Anawiser compares public prices from Amazon, Flipkart, Blinkit, Croma, Reliance, and D-Mart with nearby shop quotes. Open Compare, pick a category and a product, then see which live store is cheapest today. During festival sales we also show public discounts and coupons, and a local shop can post a matching price.";
  }

  if (/(cheap|lowest|best deal|which store|buy now)/.test(q) && rows.length) {
    const best = rows.reduce((a, b) => (a.price < b.price ? a : b));
    const list = [...rows]
      .sort((a, b) => a.price - b.price)
      .map((r) => `${r.store} ₹${r.price.toLocaleString("en-IN")}`)
      .join("; ");
    return `${best.store} is the lowest live price at ₹${best.price.toLocaleString("en-IN")}${
      ctx?.productName ? ` for ${ctx.productName}` : ""
    }. Ranked: ${list}. I only use numbers currently on screen.`;
  }

  if (/(how (do i|to) use|what is anawiser|analyser|wiser|^help$|guide|pages)/.test(q)) {
    return "Anawiser is Analyser + Wiser: we analyse public Indian prices so you can buy wiser. Open Compare, pick a category then a product, and read Lowest today. Full steps are on Docs. Retailers add a neighbourhood rate with “Are you a retailer? Try this”, which sits above “Got any questions?”. Email is hello@anawiser.app.";
  }

  if (/(local shop|neighbour|neighborhood|add a price|local-admin)/.test(q)) {
    return "Open the link at the bottom right that says “Are you a retailer? Try this”. Publish store name, product, and rupee price. That listing then appears under Nearby shops on Compare.";
  }

  if (/(self-heal|self heal|broken scrape|missing price|undefined price)/.test(q)) {
    return "If a live price comes back blank, Compare can retry that store so you can keep shopping. Use the numbers on the Compare page — I will not invent a rupee amount.";
  }

  const hits = findProducts(message);
  if (hits.length && /(where|find|category|product|samsung|iphone|sony|whey|bag|jean|sofa|tv|t-?shirt)/.test(q)) {
    const list = hits.map((p) => `${p.name} (${p.category})`).join("; ");
    return `On Compare, choose the matching category then the product. I found: ${list}. Open Compare to load live prices — I will not invent a rupee amount.`;
  }

  if (/(dataset|photo|image|train|backup|dataset_1|dataset_2)/.test(q)) {
    return "Anawiser shows matching electronics photos — phones and similar devices — when you pick a product on Compare. That helps you confirm the item while you check prices.";
  }

  if (/(maker|who built|krish|dhrupad|antigravity|cursor)/.test(q)) {
    return "Anawiser is built by Krish Patel and Dhrupad Patel, with Bright Data Web Scraper Studio, Cursor, and Antigravity. Read more on About Us.";
  }

  if (/(festival|big billion|great indian|discount|coupon|offer)/.test(q)) {
    return "During Flipkart Big Billion Days and Amazon Great Indian Festival, Compare lists public sale prices, MRP cuts, and coupon chips from the product page. A neighbourhood shop can post a matching festival price and code with “Are you a retailer? Try this” so you can pick offline or online without guessing.";
  }

  if (/(contact|email)/.test(q)) {
    return "Email hello@anawiser.app.";
  }

  return null;
}

function scrubArchitecture(text: string) {
  if (
    /npm run|datasets:sync|drop new files|D:\\|\.env|frontend\/|collector|GEMINI_|api (key|token)|node_modules|source code|trained on this site/i.test(
      text,
    )
  ) {
    return "I can help with Anawiser: comparing prices, finding products, local shops, festival offers, and how to use this site.";
  }
  return text;
}

async function callGemini(model: string, apiKey: string, contents: unknown, system: string) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.2, maxOutputTokens: 320 },
    }),
    signal: AbortSignal.timeout(20000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${model} ${res.status}`);
  const data = JSON.parse(text) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
}

export async function askAssistant(opts: {
  message: string;
  history?: ChatMessage[];
  context?: ChatContext;
}) {
  const local = answerFromSite(opts.message, opts.context);
  if (local) {
    return { reply: local, model: "anawiser-site", configured: Boolean(geminiApiKey()) };
  }

  const apiKey = geminiApiKey();

  if (!apiKey) {
    return {
      reply:
        "I can help with Anawiser: how to compare prices, which pages to open, and what this site can do. Try asking “What can your site do?” or open Compare.",
      model: "anawiser-site",
      configured: false,
    };
  }

  const history = (opts.history || [])
    .filter((m) => m.content?.trim())
    .filter((m) => !/^hi[ —-]+i['’]m anawiserai/i.test(m.content))
    .slice(-6);

  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
  for (const m of history) {
    if (m.role === "assistant" && contents.length === 0) continue;
    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }
  contents.push({
    role: "user",
    parts: [{ text: `${contextText(opts.context)}\n\nUser: ${opts.message}` }],
  });
  if (contents[0]?.role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "Hello" }] });
  }

  const system = `${siteKnowledge()}\n\nSession:\n${contextText(opts.context)}`;

  for (const model of MODELS) {
    try {
      const reply = scrubArchitecture((await callGemini(model, apiKey, contents, system)).trim());
      if (reply) return { reply, model, configured: true };
    } catch {
      /* try next model */
    }
  }

  return {
    reply: "I could not answer just now. Anawiser still works: open Compare, pick a product, and use the live numbers on that page.",
    model: "anawiser-site",
    configured: true,
  };
}

export const ANAWISER_AI = {
  provider: "Google Gemini + Anawiser site data",
  model: MODELS[0],
  getKeyUrl: "https://aistudio.google.com/apikey",
};
