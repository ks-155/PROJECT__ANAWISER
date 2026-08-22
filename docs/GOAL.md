# The North Star Goal: Anawiser MVP

For this hackathon, we need to stay hyper-focused. If we try to build too many things, the project will break. Our goal is to build a sleek, fully functional **Minimum Viable Product (MVP)** that flawlessly executes one specific user journey.

## The Core Objective
To build a **private, anti-bot resilient price and stock tracking dashboard** that allows a user to monitor high-demand items (like electronics during Flash Sales) across major Indian e-commerce sites, delivering instant alerts faster than public Telegram channels.

## The 5-Step User Journey (What we are building)

This is the exact flow we want to present to the judges:

1. **The Input:** The user opens the Anawiser dashboard (our sleek, dark-mode Next.js UI) and pastes a product URL (e.g., a PS5 on Flipkart) along with their "Target Price".
2. **The Engine:** Behind the scenes, our backend sends that URL to Bright Data. Bright Data handles all the complex proxy rotation and CAPTCHA solving to securely fetch the page data.
3. **The Brain:** Our scraper extracts the exact current price and the "In Stock / Out of Stock" status from the page.
4. **The Storage:** This data point is saved to our cloud database (Supabase) so the user can see a beautiful price history graph on their dashboard.
5. **The Alert (The Wow Moment):** If the extracted price is lower than the user's "Target Price", our backend instantly fires a webhook, sending a *Ping!* directly to the user's private Telegram or Discord.

## What is OUT of scope for the hackathon?
To ensure we finish on time, we will **not** build:
- Automated checkout / Auto-buying (too complex and risks actual money).
- Complex user authentication/login (we will just build a single-tenant "personal" dashboard for the demo).
- Mobile apps (the Next.js website will be mobile-responsive).

If we execute this 5-step journey flawlessly, the project will be a massive success.
