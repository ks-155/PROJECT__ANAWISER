# Anawiser — Project Explainer & Technical Guide

> This document explains every part of the Anawiser project so you (the human) can confidently explain the scraper, architecture, and technical decisions to hackathon judges.

---

## 1. What Is Anawiser?

Anawiser is a **private price tracker for Indian e-commerce**. A user pastes a product URL (e.g., from Amazon.in), sets a target price, and the app automatically scrapes the current price using Bright Data's Scraper Studio. If the price drops below the target, the user gets alerted.

**Why it exists:** Public price trackers (BuyHatke, PriceHistory) update every few hours and broadcast to thousands of users. During Flash Sales (Big Billion Days), by the time you see the alert, the deal is gone. Anawiser is your **private** tracker — no one else sees your alerts.

---

## 2. What Is Bright Data Scraper Studio?

Scraper Studio is Bright Data's **visual scraper builder**. Instead of writing code to download a web page, parse the HTML yourself, and fight CAPTCHAs — you describe what data you want, Scraper Studio builds a "collector" that does all the work on Bright Data's servers, and returns **clean structured JSON**.

### How It Differs From Web Unlocker (What We Had Before)

| Feature | Web Unlocker (old) | Scraper Studio (current) |
|---------|-------------------|-------------------------|
| What you get back | Raw HTML (you parse it yourself) | Clean JSON (`{price: 1499, in_stock: true}`) |
| CAPTCHA handling | Yes | Yes |
| Proxy rotation | Yes | Yes |
| You write parsing code? | Yes, fragile regex | No, Bright Data parses it |
| Breaks when site changes layout? | Yes | Self-healing |

**Why we switched:** Scraper Studio is simpler, more reliable, and is a hackathon requirement.

---

## 3. Step-by-Step: Creating Your Scraper Studio Collector

### Step 1: Open Scraper Studio
1. Log in to [brightdata.com](https://brightdata.com)
2. In the left sidebar, click **"Scraper Studio"** (or "Web Scraper IDE")
3. Click **"Create a new scraper"** or **"+ New"**

### Step 2: Choose Your Method
You'll see options like:
- **Start from a template** — Bright Data has pre-built templates for Amazon, eBay, etc.
- **Start with AI** — Describe what you want in plain English
- **Start from scratch** — Write your own interaction/parser code

**Recommended for hackathon:** Use the **Amazon product template** if scraping Amazon.in. If no exact template exists, use the **AI agent** — just type something like:
> "Extract the product title, current price, currency, and whether it is in stock from this Amazon.in product page"

### Step 3: Configure the Output Schema
The collector needs to know what fields to extract. Set up these fields:

| Field Name | Type | Description |
|-----------|------|-------------|
| `title` | String | Product name |
| `price` | Number | Current selling price |
| `currency` | String | e.g., "INR" |
| `in_stock` | Boolean | Whether the product is available |
| `url` | String | The product URL (input) |

### Step 4: Test With a Real URL
1. Paste a real Amazon.in product URL into the test input, e.g.:
   `https://www.amazon.in/dp/B0CHX3QBCH` (any public product page)
2. Click **"Run"** or **"Test"**
3. Verify the output has the correct price, title, and stock status
4. If something is wrong, adjust the parser code or re-describe to the AI

### Step 5: Save & Publish
1. Click **"Save"** to save your scraper
2. **Publish to production** — this makes it available via API
3. Note down the **Collector ID** — it looks like `c_lxxxxxxxxxxxxxxx`
4. This ID goes into your `.env.local` file as `BRIGHT_DATA_COLLECTOR_ID`

### Step 6: Get Your API Token
1. Go to **Account Settings -> API Tokens** (or Settings -> API tokens)
2. Copy your API token
3. This goes into your `.env.local` file as `BRIGHT_DATA_API_TOKEN`

---

## 4. Project Architecture

```
project_anawiser/
├── frontend/           <- Next.js app (UI + API routes)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           <- Main dashboard page
│   │   │   ├── layout.tsx         <- App shell, fonts, metadata
│   │   │   ├── globals.css        <- Global styles
│   │   │   └── api/anawiser/
│   │   │       ├── products/route.ts  <- GET/POST products
│   │   │       └── check/route.ts     <- POST trigger scrape
│   │   └── components/
│   │       └── stock-radar-dashboard.tsx  <- Dashboard UI component
│   └── .env.local         <- API keys (never committed to git)
│
├── backend/            <- Data storage layer
│   └── src/
│       └── store.ts       <- Supabase CRUD (products + snapshots)
│
├── ai-scraper/         <- Scraping engine
│   └── src/
│       └── engine.ts      <- Triggers Scraper Studio collector
│
├── docs/               <- Documentation
│   └── EXPLAINER.md       <- This file
│
└── package.json        <- Root monorepo config (npm workspaces)
```

### Data Flow (What Happens When You Click "Check Now")

```
1. User clicks "Check Now" on the dashboard
       |
2. Frontend calls POST /api/anawiser/check with {productId}
       |
3. API route calls engine.ts -> simulateScrapeAndExtract(productId)
       |
4. Engine looks up the product URL from Supabase
       |
5. Engine sends POST to Bright Data:
   POST https://api.brightdata.com/dca/trigger?collector=c_xxxxx
   Body: [{"url": "https://amazon.in/dp/..."}]
       |
6. Bright Data's Scraper Studio collector runs:
   - Routes through residential proxies
   - Solves any CAPTCHAs
   - Renders JavaScript
   - Extracts price, title, stock from the page
       |
7. Engine polls GET /dca/dataset?id=COLLECTION_ID
   until results are ready (usually 10-30 seconds)
       |
8. Engine receives clean JSON: {price: 1499, in_stock: true, title: "..."}
       |
9. Engine saves snapshot to Supabase (addSnapshot)
       |
10. If price <= target price -> returns alert message to frontend
       |
11. Dashboard shows updated price and any alerts
```

---

## 5. Technical Decisions & Why

### Why Scraper Studio Instead of Writing Our Own Scraper?
- **Hackathon requirement** — the rules say we must use Scraper Studio
- **Reliability** — Scraper Studio has self-healing; if Amazon changes their HTML layout, our scraper still works
- **Simplicity** — We get clean JSON instead of writing fragile regex to parse raw HTML
- **No infrastructure** — No Puppeteer, no headless browsers, no proxy servers to manage

### Why a Monorepo (npm workspaces)?
- **Separation of concerns** — scraping logic, data storage, and UI are isolated
- **Reusability** — `@anawiser/backend` can be imported by both the frontend API routes and the scraper engine
- **Clean for judges** — easy to explain "this folder does X, this folder does Y"

### Why Supabase Instead of Local JSON?
- **Deployment** — Vercel serverless functions have a read-only filesystem. A local JSON file breaks instantly in production.
- **Free tier** — Supabase offers a generous free tier (500 MB, unlimited API requests)
- **Simple** — Just 2 tables (`products`, `snapshots`), basic INSERT/SELECT queries via the JS SDK

### Why No Login / Authentication?
- **Hackathon demo** — single-tenant. One user, one dashboard. No auth complexity.
- **Focus** — judges care about the scraping + alerting flow, not a login page

### Why Indian Market (INR)?
- **The product vision** — Anawiser targets Indian Flash Sales (Flipkart Big Billion Days, Amazon Great Indian Festival)
- **Differentiation** — most open-source trackers target US sites (Best Buy, Walmart). We target Amazon.in / Flipkart.

---

## 6. How to Explain This to Judges

### Elevator Pitch (30 seconds)
> "Anawiser is a private price tracker for Indian e-commerce. You paste a product URL, set your target price, and our backend uses Bright Data's Scraper Studio to bypass anti-bot protections and extract the real-time price. When the price drops, you get instantly alerted. Unlike public trackers that broadcast to thousands of people, this is your private cheat code for Flash Sales."

### If They Ask "How Does the Scraping Work?"
> "We created a custom collector in Bright Data's Scraper Studio. When a user clicks 'Check Now', our Next.js API route sends the product URL to Bright Data's collector API. Bright Data's infrastructure handles proxy rotation, CAPTCHA solving, and JavaScript rendering on their end. They return clean structured JSON — we just read the price and stock status. No HTML parsing, no fragile regex."

### If They Ask "Why Not Just Use BeautifulSoup / Puppeteer?"
> "Two reasons. First, sites like Amazon and Flipkart have aggressive anti-bot protection — CAPTCHAs, IP bans, browser fingerprinting. A basic scraper gets blocked within minutes. Second, HTML parsers break when the site changes its layout. Scraper Studio has self-healing — it adapts automatically. We focus on the product experience, not scraper maintenance."

### If They Ask "What About Privacy / Ethics?"
> "We only scrape publicly available product listings — prices and stock status that any shopper sees when they visit the page. We don't scrape private data, login-protected content, or personal information. Bright Data's infrastructure ensures we follow the same access patterns as a regular browser user."

---

## 7. Environment Variables Reference

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `BRIGHT_DATA_API_TOKEN` | Bright Data -> Account Settings -> API Tokens | `abcd1234-...` |
| `BRIGHT_DATA_COLLECTOR_ID` | Scraper Studio -> Your collector -> Settings | `c_lk5abc123xyz` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase -> Project Settings -> API | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase -> Project Settings -> API | `eyJhbGciOiJI...` |

These go in `frontend/.env.local` (never committed to git).

---

## 8. Supabase Database Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **"New Project"**
3. Name it `anawiser`, choose a region close to you, set a database password
4. Wait for the project to be created (~1 minute)

### Step 2: Run the SQL to Create Tables
Go to **SQL Editor** in your Supabase dashboard and run this:

```sql
-- Products table: stores the URLs being tracked
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  name TEXT,
  desired_price NUMERIC,
  attributes JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Snapshots table: stores each price check result
CREATE TABLE snapshots (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  price NUMERIC,
  in_stock BOOLEAN,
  currency TEXT DEFAULT 'INR',
  stock_text TEXT
);

-- Index for fast lookups by product
CREATE INDEX idx_snapshots_product_id ON snapshots(product_id);

-- Allow public read/write (no auth needed for hackathon demo)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on snapshots" ON snapshots FOR ALL USING (true) WITH CHECK (true);
```

### Step 3: Get Your API Keys
1. Go to **Project Settings -> API**
2. Copy the **Project URL** (goes into `NEXT_PUBLIC_SUPABASE_URL`)
3. Copy the **anon/public key** (goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
