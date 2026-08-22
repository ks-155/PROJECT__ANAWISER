# Anawiser Architecture & Implementation Plan

This document outlines the current technical direction for Anawiser, designed to be lightning-fast for a hackathon while remaining fully scalable and production-ready for the real world.

## 1. Core Stack
- **Frontend & API Layer:** Next.js (React + TypeScript)
- **Deployment:** Vercel (Serverless Edge Functions)
- **Database:** Supabase (PostgreSQL)

## 2. Why Supabase? (Database Choice)
For this hackathon, we have chosen **Supabase**.
- **Speed:** It takes 2 minutes to set up and provides an instant API.
- **Scalability:** Unlike NoSQL databases, it is built on PostgreSQL, meaning it can scale infinitely and handle complex relational queries (like graphing price histories over time).
- **Ecosystem:** It integrates seamlessly with Next.js and Vercel.

## 3. Web Scraping & Data Extraction
We are utilizing **Bright Data's Hosted Web Scraper APIs** to handle all scraping.
- **Why:** Writing custom HTML parsers and managing headless browsers (like Puppeteer) on our own servers is brittle and hard to scale. 
- **How it works:** Instead of manually bypassing captchas and extracting text, our Next.js backend simply sends a URL to Bright Data. Bright Data's infrastructure extracts the data using their pre-built eCommerce scrapers and returns clean JSON (`{"price": 499.99, "in_stock": true}`).
- **Cost:** Covered completely by the $50 Bright Data hackathon credits.

## 4. Automation & Alerts
- **Cron Jobs:** Since our Next.js app is deployed statelessly on Vercel, we will use **Vercel Cron** to trigger our `/api/anawiser/check` endpoint every 1-5 minutes.
- **Notification Delivery:** When the cron job detects a restock or a price drop, it pushes a webhook notification via Telegram/Discord to the user.

## 5. Next Steps for Execution
1. Set up a free Supabase project and get the database connection string.
2. Replace our local `backend/data/anawiser.json` logic with the Supabase `@supabase/supabase-js` client.
3. Update `ai-scraper/src/engine.ts` to call the Bright Data Hosted API instead of manual scraping.
4. Deploy the Next.js app to Vercel and configure Vercel Cron.
5. Polish the Frontend UI.
