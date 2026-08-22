# 🤖 HANDOVER CONTEXT FOR CURSOR AGENT 🤖

Hello Cursor Agent! If you are reading this, you are taking over the **Anawiser** project. I have been working with your human developer to lay the foundation. This file contains everything you need to know about the project goals, what has been implemented so far, and exactly what you need to build next. 

**Do not deviate from the core stack or the product vision defined below.**

---

## 1. The Product Vision (What is Anawiser?)
Anawiser is a **private, anti-bot resilient price and stock tracking dashboard** built for the Indian market.
* **The Problem:** Indian consumers miss out on Flash Sales (PS5s, iPhones on Flipkart/Amazon during Big Billion Days) because public trackers (like BuyHatke or Telegram groups) are too slow, and building private scrapers is hard because of aggressive captchas.
* **The Solution:** Anawiser gives the user a private Next.js dashboard where they input a product URL and a Target Price. The backend uses the **Bright Data Web Unlocker API** to effortlessly bypass captchas and scrape real-time prices. If the price drops, a webhook instantly pings their personal Telegram/Discord.

## 2. Technical Architecture & Core Stack
* **Monorepo:** The project is a Next.js monorepo using npm workspaces (`@anawiser/frontend`, `@anawiser/backend`, `@anawiser/ai-scraper`).
* **Frontend:** Next.js (React + TypeScript). 
* **Backend:** Next.js Serverless API routes (`/api/anawiser/check`).
* **Scraper:** Bright Data Web Unlocker API via standard `fetch`. (We specifically abandoned Puppeteer/WebSockets to keep things simple for serverless deployment).
* **Database (Action Required):** Currently using a local JSON file (`backend/data/anawiser.json`). This **MUST** be migrated to **Supabase (PostgreSQL)** so it works on Vercel.
* **Deployment (End Goal):** Vercel.

## 3. What We Have Accomplished So Far
1. ✅ **Project Renamed:** The project was originally called "StockRadar" or "Aegis". A bulk-rename script was run. The project is now globally named **Anawiser**.
2. ✅ **Monorepo Setup:** The workspaces are fully linked. The frontend successfully builds.
3. ✅ **Scraping Engine Built:** In `ai-scraper/src/engine.ts`, the logic is fully written to send a POST request to `api.brightdata.com/request` with the user's Bright Data API key to fetch raw, unblocked HTML and extract the price.
4. ✅ **Git Reset:** The old `.git` folder was deleted. The user will run `git init` to start a fresh repo when ready.

## 4. Immediate Next Steps (Your Tasks)
Here is exactly what you need to do next to finish the project:

### TASK A: Migrate to Supabase (Database)
Vercel serverless functions are read-only, so our local `anawiser.json` file will break in production. 
1. Guide the user to set up a free Supabase project.
2. Install `@supabase/supabase-js` in the `@anawiser/backend` workspace.
3. Rewrite the database logic to read/write product tracking data and price history to Supabase instead of the JSON file.

### TASK B: The "Trading Terminal" UI (Frontend)
The user wants a highly premium, dark-mode, glassmorphism UI. It should look like a Wall Street trading terminal, not a boring spreadsheet.
1. **Inspiration:** The user uploaded screenshots of *BuyHatke*. We want to steal two UI elements from them:
   * A **"Should you buy now?" Speedometer** (calculated based on historical highs/lows).
   * A **"Price Stats" Box** showing the Highest, Lowest, and Average price from the Supabase database.
2. Build the Next.js dashboard to display these beautiful components.

### TASK C: The Instant Webhook (Alerts)
1. Add logic to the backend so that when a scrape finishes and the `currentPrice < targetPrice`, it fires a POST request to a Telegram Bot API or Discord Webhook URL.
2. This is the "Wow Factor" for the hackathon demo—we want the judges to hear the Telegram *ding* instantly.

---
**Final Note to Cursor Agent:** The user has $50 in Bright Data credits, so rely on Bright Data's hosted APIs for all scraping/unblocking needs. Good luck, build something beautiful!
