# Anawiser: Product Strategy & Brainstorming

Before we write more code, we need to define exactly why Anawiser exists, why it's better than the competition, and how we will "wow" the judges during the hackathon demo.

## 1. How We Differentiate (The Problem with Existing Solutions)
Existing tools like CamelCamelCamel or Honey are great for casual shoppers, but they fail for high-demand items (GPUs, Sneakers, Consoles). 
Here is how Anawiser is different:

* **Real-Time vs. Delayed:** Existing trackers update every few hours. Anawiser is built for "hype drops" and can check stock every 60 seconds.
* **AI-Resilient Parsing:** Traditional scrapers break when a website changes its layout or CSS classes. Anawiser uses AI to read the page like a human, meaning it never breaks when Amazon or Best Buy redesigns their site.
* **Anti-Bot Immunity:** Most trackers get IP-banned. By using Bright Data Web Unlocker, our scraper is virtually invisible and never gets blocked by CAPTCHAs.
* **Instant Webhooks:** We don't rely on slow emails. We push instant notifications to where gamers and hypebeasts actually live: Discord and Telegram.

## 2. The "Wow Factor" (Hackathon Demo Strategy)
To win a hackathon, the project needs to look and feel premium. Here are the 3 wow factors we should focus on:

1. **The "Bypass" Live Demo:** We show the terminal fetching data from a heavily protected site (like Best Buy) without getting blocked, proving the Bright Data integration works flawlessly.
2. **The Trading Terminal UI:** We don't build a boring list. We build a dark-mode, glassmorphism dashboard that looks like a high-end Wall Street trading terminal for consumer goods. 
3. **The Instant Ping:** During the presentation, we set a target price for a PS5. We simulate a price drop, and the judges hear a *ding* as a Telegram message instantly appears on the screen.

## 3. Current Progress & Tech Stack
Here is exactly where we stand as of right now:

### Tech Stack
- **Frontend:** Next.js, React, TailwindCSS (planned for UI)
- **Backend/API:** Next.js Serverless Routes
- **Scraping Engine:** Bright Data Web Unlocker (via Node.js `fetch`)
- **Database:** Currently Local JSON (Planned migration to Supabase/PostgreSQL)

### What is actually working right now?
✅ We have a clean Monorepo architecture (`frontend`, `backend`, `ai-scraper`).
✅ We successfully integrated the Bright Data API to bypass blocks.
✅ We have the logic to extract prices and stock status from raw HTML.
✅ We have a script that can successfully track the PS5, Xbox, and Nintendo Switch.

## 4. Next Steps to Execute the Vision
Now that we have defined the product vision, here is how we achieve it:
1. **Migrate to Supabase:** Get the cloud database working so the app is robust.
2. **Build the UI:** Focus heavily on the "Trading Terminal" aesthetic (vibrant colors, dark mode, smooth charts).
3. **Hook up Telegram:** Build the alert system for the "Instant Ping" wow factor.
