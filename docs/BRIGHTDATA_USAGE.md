# Bright Data Integration in Anawiser

As part of the Anawiser architecture, we leverage **Bright Data** to solve the most difficult challenge in modern web scraping: bypassing aggressive anti-bot protections on major e-commerce platforms.

## The Problem
E-commerce websites (like Amazon, Best Buy, and Walmart) deploy sophisticated anti-bot mechanisms, including:
- IP rate limiting and blocking
- JavaScript challenges and CAPTCHAs
- Browser fingerprinting

Attempting to scrape real-time stock and price data directly using standard HTTP requests or basic headless browsers results in immediate blocks, rendering our alert system useless.

## The Solution: Bright Data Web Unlocker
We integrated the **Bright Data Web Unlocker API** directly into our backend scraping engine to ensure a 100% success rate when fetching product pages.

### How We Implemented It
In our codebase (`ai-scraper/src/engine.ts`), we bypassed the need for complex internal proxy rotation or CAPTCHA solving logic. Instead, we use a single, unified API call:

1. **Direct API Request:** We send a POST request to `api.brightdata.com/request` containing the target product URL (e.g., a Best Buy PlayStation 5 listing).
2. **Behind the Scenes:** Bright Data's infrastructure automatically:
   - Routes the request through premium residential proxy networks.
   - Handles automated CAPTCHA solving.
   - Emulates real user fingerprints (canvas, headers, user-agents).
   - Renders any required JavaScript.
3. **Data Retrieval:** The Web Unlocker API returns the pristine, unblocked raw HTML of the product page back to our Next.js backend.
4. **Data Extraction:** We then parse this HTML to extract the real-time stock status and current price, saving it to our database and triggering user alerts if necessary.

## Why This Matters for Anawiser
By utilizing the Web Unlocker, Anawiser achieves **enterprise-grade reliability**. Our users receive price drop and restock alerts in real-time without our backend servers ever getting IP-banned or stuck behind a CAPTCHA screen. This allows us to focus entirely on building a great AI parsing and alerting experience.
