# 🕸️ Anawiser — Private Price Tracker for Indian E-Commerce

> Built for the [**Into the Scrape-Verse**](https://www.wemakedevs.org/hackathons/scrape-verse) hackathon by WeMakeDevs × Bright Data (Aug 17–23, 2026)

**Anawiser** is a private, anti-bot resilient price and stock tracking dashboard built for the Indian market. Paste a product URL from Amazon.in, set your target price, and Anawiser uses a **custom Bright Data Scraper Studio collector** to bypass CAPTCHAs and extract real-time prices. When the price drops — you get alerted instantly.

## 🎯 Problem

Indian consumers miss Flash Sale deals (Big Billion Days, Great Indian Festival) because:
- **Public trackers** (BuyHatke, PriceHistory) are slow — they update every few hours
- **Building private scrapers** is hard — Amazon and Flipkart have aggressive anti-bot protection
- **Existing scrapers break** when sites change their layout

## 💡 Solution

Anawiser solves all three problems:
1. **Real-time tracking** — checks prices on-demand via Scraper Studio
2. **Anti-bot immunity** — Bright Data handles proxy rotation, CAPTCHAs, and fingerprinting
3. **Self-healing** — Scraper Studio's AI automatically adapts when site layouts change

## 🏗️ Architecture

```
User → Next.js Dashboard → API Route → Bright Data Scraper Studio Collector → Amazon.in
                                              ↓
                                    Structured JSON (price, stock, title)
                                              ↓
                                    Supabase (PostgreSQL) → Dashboard Update
```

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Scraping | Bright Data Scraper Studio (custom collector) |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

### Monorepo Structure
```
project_anawiser/
├── frontend/          # Next.js app (UI + API routes)
├── backend/           # Supabase data layer (@anawiser/backend)
├── ai-scraper/        # Scraper Studio engine (@anawiser/ai-scraper)
└── docs/              # Documentation & explainers
```

## 🕷️ Bright Data Scraper Studio Integration

### Custom Collector
We created a **custom scraper** in Scraper Studio using the AI Agent to extract:
- `title` — Product name
- `price` — Current selling price (number)
- `currency` — "INR"
- `in_stock` — Whether the product is available
- `url` — The scraped page URL

**Collector ID:** `c_mt4syfv6214ukjmcju`

### How It Works
1. **Trigger:** Our API sends `POST /dca/trigger?collector=COLLECTOR_ID` with the product URL
2. **Bright Data runs the scraper:** Handles proxy rotation, CAPTCHA solving, JS rendering, and data extraction on their infrastructure
3. **Poll for results:** We poll `GET /dca/dataset?id=COLLECTION_ID` every 3 seconds
4. **Receive clean JSON:** No HTML parsing needed — we get structured data directly
5. **Save & alert:** Data is saved to Supabase; if price ≤ target, user is alerted

### Self-Healing
Scraper Studio scrapers are **self-healing** by design:
- When Amazon.in changes their page layout (CSS classes, DOM structure), the scraper automatically adapts
- The AI-based parsing engine identifies the semantic meaning of elements (price, title, stock status) rather than relying on brittle CSS selectors
- No manual maintenance required — the collector continues to return correct data even after site updates

## 📋 Setup & Reproducible Instructions

### Prerequisites
- Node.js 18+
- A [Bright Data](https://brightdata.com) account (use promo code `wemakedevs` for $50 credits)
- A [Supabase](https://supabase.com) account (free tier)

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/project_anawiser.git
cd project_anawiser
npm install
```

### 2. Create a Scraper Studio Collector
1. Log in to [brightdata.com](https://brightdata.com) → Scraper Studio
2. Create a new scraper with AI Agent:
   > "Extract title, price, currency, in_stock, and url from an Amazon.in product page"
3. Test with a real Amazon.in URL, verify output, then publish
4. Copy your **Collector ID** (`c_xxx...`)

### 3. Set Up Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Run the SQL from [`docs/EXPLAINER.md`](docs/EXPLAINER.md#8-supabase-database-setup) in the SQL Editor
3. Copy your **Project URL** and **anon key**

### 4. Configure Environment
```bash
cp frontend/.env.local.example frontend/.env.local
```
Fill in:
```env
BRIGHT_DATA_API_TOKEN=your_api_token
BRIGHT_DATA_COLLECTOR_ID=c_your_collector_id
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Run
```bash
npm run dev --workspace=frontend
```
Open http://localhost:3000

## 📖 Code Explanation

See [`docs/EXPLAINER.md`](docs/EXPLAINER.md) for a detailed breakdown of:
- Every file and what it does
- The data flow from user click to price result
- Every technical decision and why we made it
- How to explain the project to judges

### Key Files
| File | What it does |
|------|-------------|
| [`ai-scraper/src/engine.ts`](ai-scraper/src/engine.ts) | Triggers the Scraper Studio collector and polls for results |
| [`backend/src/store.ts`](backend/src/store.ts) | Supabase CRUD operations for products and price snapshots |
| [`frontend/src/app/api/anawiser/check/route.ts`](frontend/src/app/api/anawiser/check/route.ts) | API endpoint that runs a price check |
| [`frontend/src/app/api/anawiser/products/route.ts`](frontend/src/app/api/anawiser/products/route.ts) | API endpoint for adding/listing tracked products |
| [`frontend/src/components/stock-radar-dashboard.tsx`](frontend/src/components/stock-radar-dashboard.tsx) | The main dashboard UI component |

## 🚀 Roadmap & Vision: The "Wow" Factor

While this MVP focuses on Amazon.in to demonstrate the Bright Data Scraper Studio pipeline, Anawiser's true vision is to become the ultimate **omnichannel price intelligence engine for India**:

- **Multi-Retailer Expansion:** Seamlessly integrate DMart, Reliance Mart, Reliance Digital, Croma, and Blinkit into the same tracking dashboard.
- **Empowering Local Retailers:** We plan to introduce an **Admin Panel for Local Stores**. Local shop owners can upload their inventory or let our agent scrape their localized storefronts. Anawiser will automatically promote local store availability and pricing alongside major e-commerce giants, giving them visibility without ad spend.
- **Hyper-Local Alerts:** "The headphones you want dropped in price at Amazon, but they are available *right now* for ₹200 less at the electronics shop down your street."

## 🏆 Hackathon Submission Checklist

- [x] **Custom Scraper Studio collector** — created via AI Agent, not a pre-built library scraper
- [x] **Working create-and-run flow** — trigger collector → poll results → save to DB
- [x] **Collector ID provided** — wired into the downstream Next.js application
- [x] **Self-healing capability** — Scraper Studio's AI adapts to site layout changes
- [x] **Downstream integration** — prices stored in Supabase, displayed on dashboard, alert system
- [x] **Public GitHub repo** — with reproducible setup instructions
- [x] **Code explanation** — see [`docs/EXPLAINER.md`](docs/EXPLAINER.md)
- [x] **Public data only** — scrapes publicly visible product listings (prices, stock status)

## ⚖️ Ethical Compliance

- We only scrape **publicly available product listings** — prices and stock status visible to any visitor
- No private data, login-protected content, paywalled information, or personal data is collected
- No government websites are scraped
- All scraping goes through Bright Data's compliant infrastructure

## 📄 License

MIT
