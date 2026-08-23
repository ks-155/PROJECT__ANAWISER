# Anawiser
### *Analyser & Wiser*

<img width="1894" height="1199" alt="Screenshot 2026-08-23 232528" src="https://github.com/user-attachments/assets/91f460c4-e24e-4e6f-9a5b-23db71702ed9" />
<img width="1083" height="975" alt="Screenshot 2026-08-23 232711" src="https://github.com/user-attachments/assets/6449d0a6-9a51-40da-8963-2e19de7ad33e" />
<img width="1871" height="998" alt="Screenshot 2026-08-23 232955 (1)" src="https://github.com/user-attachments/assets/801c398f-1256-492b-8357-2149cd6faaef" />
<img width="1890" height="966" alt="Screenshot 2026-08-23 232734 (1)" src="https://github.com/user-attachments/assets/0f668246-d11d-4160-91e1-a967ef128381" />




A price-intelligence tool that helps local retailers stay competitive against e-commerce platforms — and helps online shoppers find the best deals.

---

## The Problem

During major sale seasons like **Big Billion Days** and the **Great Indian Festival**, e-commerce platforms roll out steep discounts. Online sellers can do this because they have deep visibility into market pricing and tight control over their supply chains.

Local retail shopkeepers don't have that same advantage. They're often unaware of real-time online pricing for the products they sell, which puts them at a disadvantage even when they could otherwise compete — and their sales take a hit every festive season as a result.

## Who It's For

- **Retail Businesses / Shopkeepers** — competing against e-commerce discounts during big sale events, with little visibility into current online market prices.
- **Online Buyers** — looking to track the best available prices and save on every discounted purchase.

## Our Solution

Anawiser lets retailers list their products online so that anyone — buyers or the retailers themselves — can instantly see how their prices stack up against major e-commerce platforms.

### Trust & Verification

Retailer-submitted product and pricing information can't always be independently verified, so Anawiser relies on a **community rating system**: users rate the stores they interact with. If a store's rating drops too low, buyers are shown a warning before they reach out to that retailer — building trust into the platform without needing manual verification.

## What Makes Anawiser Different

- **Live market data via Bright Data web scrapers** — pulls real pricing information from major e-commerce platforms including **Amazon, Flipkart, and Blinkit**, giving retailers an actual picture of where they stand in the market.
  > *Note: as this is currently a demo, the scraped data isn't as well-organized as we'd like yet — but the pipeline works, and building a custom AI-powered scraper from scratch with Bright Data was one of our favorite parts of the build.*
- **AI Chat Assistant** — built into the platform to help users understand and navigate the product.

## Tech Stack

| Component | Tool |
|---|---|
| Web Scraping | Bright Data (custom AI-built scrapers) |
| Scraped Sources | Amazon, Flipkart, Blinkit |
| Product Imagery | Kaggle datasets |
| 3D Design | Spline |
| User Support | In-app AI chat assistant |

## Project Status

Anawiser is currently a **demo/early-stage build**. Core scraping and comparison functionality is working; data organization and the retailer rating system are still being refined.

---

*Built for shopkeepers who deserve a fair shot against the sale-season discount wars — and for buyers who just want a good deal.*



**Pages:** Home, Compare, About, Docs, Contact, Local admin (`/local-admin`).
## How we use Bright Data Scraper Studio
Scraper Studio is the price-intelligence core of Anawiser. We scrape **public product pages only** (no logins, paywalls, or personal data) from Amazon, Flipkart, Blinkit, Croma, Reliance, and D-Mart.
**What we scrape:** visible list price, stock-style status, MRP / discount when present, and public coupon / offer text when it is a real short code.
**How Scraper Studio fits in**
1. **Collector create-and-run** — `npm run collector:create-run` builds a Scraper Studio collector against a public sample URL and prints a **Collector ID**. That ID is our proof artefact; it is stored as `BRIGHT_DATA_COLLECTOR_ID` and shown on the dashboard (token never leaves the server).
2. **Live compare** — Choosing a product on Compare hits `/api/anawiser/scrape-online`, which triggers that same collector for the product’s Amazon (and related) public URLs so the UI can show current market prices next to local shop quotes.
3. **Web Unlocker fallback** — If the collector miss leaves HTML hard to parse, we call Bright Data’s Web Unlocker zone (`BRIGHT_DATA_WEB_UNLOCKER_ZONE`) so the shopper still gets a usable price instead of waiting on a long repair.
4. **Self-Healing** — When Amazon (or similar) returns `price` as `undefined`, we call Scraper Studio’s Self-Healing API with a plain-language prompt to refactor the **same** collector. Compare starts the heal in the background; full wait/poll stays on `npm run collector:heal` or `/api/anawiser/heal` so the page stays fast.
5. **Proof without secrets** — `/api/anawiser/collector` and the heal route return Collector ID / status only. `BRIGHT_DATA_API_TOKEN` stays in env and is never committed or returned to the browser.
In short: Scraper Studio gives Anawiser real-time online pricing for retailers and shoppers during sale seasons; Self-Healing keeps that pipeline alive when storefronts change.
## Setup (reproducible)
```bash
cd frontend
cp .env.local.example .env.local
# paste Bright Data / Supabase / Gemini keys locally — never commit this file
npm install
npm run dev
```
Open http://localhost:3000
## Bright Data (public pages only)
Scrapes **public product pages** only. No login walls, paywalls, or personal data.
| Env var | Purpose |
|---|---|
| `BRIGHT_DATA_API_TOKEN` | API token — **keep out of git and demo video** |
| `BRIGHT_DATA_COLLECTOR_ID` | Collector ID shown as proof on the dashboard |
| `BRIGHT_DATA_WEB_UNLOCKER_ZONE` | Fallback if a collector run misses a price |
### Create-and-run flow (Collector ID is the proof)
```bash
cd frontend
npm run collector:create-run
```
The script prints:
```
PROOF — Collector ID: <id>
```
Paste that id into `.env.local` as `BRIGHT_DATA_COLLECTOR_ID`. Comparing a product on the dashboard **runs that collector** and shows the same id under Contact.
### Self-Healing (Scraper Studio)
Follows Bright Data’s [Self-Healing tool](https://docs.brightdata.com/datasets/scraper-studio/self-healing-tool): a plain-language prompt refactors the **same** collector when `price` comes back `undefined`.
```bash
cd frontend
npm run collector:heal
```
That calls:
1. `POST /dca/collectors/{id}/refactor_template` with prompt `The 'price' value is returning 'undefined', please fix`
2. Poll `GET .../refactor_template/progress` (jobs can take up to 15 minutes)
3. If status is `pending_answer`, approve with `POST .../resume_automation_job` `{ "message": true, "auto_save": true }`
In the app:
- Compare → Amazon miss triggers Self-Healing in the background (same Collector ID)
- User still gets Web Unlocker / estimate so the page does not wait 15 minutes
- Quiet control **Repair collector (Self-Healing)** → `POST /api/anawiser/heal`
Never put `BRIGHT_DATA_API_TOKEN` in git or a demo recording.
## Local product photos (D:\dataset_1 and D:\Dataset_2)
The site is trained on those folders: phones from dataset_1, and jeans / t-shirts / sofas / TVs from Dataset_2.
```bash
cd frontend
npm run datasets:sync
```
That copies images into:
- `frontend/public/datasets/` — shown on Home and Compare
- `frontend/data/datasets-backup/` — local backup when you add new items
After you drop new files on D:\, run the same command again. The chatbot also knows this inventory.
### Downstream wiring
`BRIGHT_DATA_COLLECTOR_ID` is used by `/api/anawiser/scrape-online` and exposed (id only, never the token) at `/api/anawiser/collector` for the dashboard.
## What the agent generated
- `scripts/create-and-run-collector.mjs` — create + one public run, print Collector ID
- `src/lib/self-heal.ts` — official Self-Healing API (trigger, poll, approve)
- `src/app/api/anawiser/heal/route.ts` — dashboard hook, returns Collector ID only
- `src/lib/collector-proof.ts` — in-memory proof, no token storage
- `src/app/api/anawiser/scrape-online/route.ts` — collector → unlocker → estimate
- `src/components/spline-background.tsx` — original Spline scene as the only backdrop
## Deploy on Vercel
The Next.js app lives in `frontend/`. In the Vercel project, set **Root Directory** to `frontend` or the build will not find `next.config`.
### Catalog photos (they deploy with the site)
Catalog photos live in `frontend/public/datasets/`. That folder is part of the Next.js app, so **Vercel’s CDN serves them on every deploy**. They are not left on `D:\`.
Do **not** put the image files in Postgres (shop prices stay in Supabase tables). Do **not** use Google Drive as a website image host.
Optional second copy in object storage:
1. Run `frontend/supabase/catalog-photos.sql` in the Supabase SQL editor.
2. Add `SUPABASE_SERVICE_ROLE_KEY` to `frontend/.env.local` (or `BLOB_READ_WRITE_TOKEN` for Vercel Blob).
3. `cd frontend && npm run datasets:publish`
4. Set `NEXT_PUBLIC_DATASET_CDN` to the URL the script prints, then redeploy.
### Before the first deploy
Keep these assets in git so the Vercel CDN has them:
- `frontend/public/datasets/` (catalog photos — about 150MB, required)
- `frontend/public/reviews/`
- `frontend/public/fonts/`
- `frontend/src/app/icon.png` and `frontend/src/app/apple-icon.png`
- `frontend/src/lib/dataset-manifest.json`
Do **not** commit `.env.local`, API tokens, or `frontend/data/datasets-backup/`.
These npm scripts stay **local CLI** tools (`frontend/scripts/`). They are not Vercel functions:
- `npm run collector:create-run`
- `npm run collector:heal` (can run 15+ minutes)
- `npm run datasets:sync` (reads `D:\dataset_1`)
Production still uses the same Collector ID, Unlocker zone, scrape route, heal route, and AnawiserAI chat.
### Import settings
1. Import the GitHub repo into Vercel.
2. Framework Preset: **Next.js**.
3. **Root Directory:** `frontend` (Edit → select `frontend`).
4. Install / Build / Output: leave default (`npm install`, `npm run build`).
5. Node.js: **20.x**.
### Environment variables
Add every key from `frontend/.env.local.example` to **Production**, **Preview**, and **Development**:
| Variable | Needed for |
|---|---|
| `BRIGHT_DATA_API_TOKEN` | Compare live prices, collector trigger, Self-Healing |
| `BRIGHT_DATA_COLLECTOR_ID` | Same collector as local; shown as proof (id only) |
| `BRIGHT_DATA_WEB_UNLOCKER_ZONE` | Unlocker fallback when a collector miss happens |
| `NEXT_PUBLIC_SUPABASE_URL` | Nearby shops + `/local-admin` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Nearby shops + `/local-admin` |
| `GEMINI_API_KEY` | AnawiserAI chat (`GEMINI_API_KEY` also works) |
| `NEXT_PUBLIC_DATASET_CDN` | Optional. Only if you ran `npm run datasets:publish` |
`NEXT_PUBLIC_*` values are inlined at build time. After changing them, redeploy.
### What stays available in production
- Pages: Home, Compare, About, Docs, Contact, Local admin (`/local-admin`)
- APIs: scrape-online, local, local-prices, ai, collector, heal
- 3D hero, catalog photos, reviews, AnawiserAI, retailer form
- Self-Healing **starts** from Compare/heal on Vercel; wait-until-done stays `npm run collector:heal` on your machine
Hobby functions are capped at 60 seconds. Scrape, chat, and heal-start fit that window. The CLI heal script is unchanged.
Hobby functions are capped at 60 seconds. Scrape, chat, and heal-start fit that window. The CLI heal script is unchanged.
