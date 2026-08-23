# Anawiser

Private Indian e-commerce price comparison. Next.js on Vercel, **public** prices via Bright Data, local shops in Supabase, optional Gemini chat.

Spline 3D is the page background. UI type uses one parent font (Outfit) with a dark halo so labels stay visible on the scene. Tokens stay in `.env.local` and are gitignored.

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
