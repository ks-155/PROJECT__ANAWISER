/** Public festival windows and live offer chips scraped from product pages. */

export type Festival = {
  id: string;
  name: string;
  host: "Flipkart" | "Amazon";
  months: number[];
  shopperTip: string;
  shopkeeperTip: string;
};

export const FESTIVALS: Festival[] = [
  {
    id: "big-billion-days",
    name: "Flipkart Big Billion Days",
    host: "Flipkart",
    months: [9, 10],
    shopperTip:
      "Check Flipkart’s listed price plus bank / coupon chips against a neighbourhood quote before you buy.",
    shopkeeperTip:
      "Publish your festival price and a short code on Local shops so shoppers can beat or match Flipkart without waiting for delivery.",
  },
  {
    id: "great-indian-festival",
    name: "Amazon Great Indian Festival",
    host: "Amazon",
    months: [9, 10],
    shopperTip:
      "Amazon’s sale price is not always the floor — bank offers and local shops often close the gap.",
    shopkeeperTip:
      "If you can match the Amazon sale price in-store, post that rate here so nearby buyers skip shipping and returns.",
  },
];

export function festivalsActiveOn(date = new Date()) {
  const month = date.getMonth() + 1;
  const live = FESTIVALS.filter((f) => f.months.includes(month));
  if (live.length) return { phase: "live" as const, items: live };
  const upcoming = FESTIVALS.filter((f) => f.months.some((m) => m === month + 1 || (month === 12 && m === 1)));
  if (upcoming.length) return { phase: "upcoming" as const, items: upcoming };
  return { phase: "off" as const, items: FESTIVALS };
}

export type ScrapedOffers = {
  mrp: number | null;
  discountPercent: number | null;
  coupon: string | null;
  offers: string[];
};

function isShopperOffer(line: string) {
  const text = line.replace(/\s+/g, " ").trim();
  if (text.length < 10 || text.length > 88) return false;
  if (/[{}\[\]"|]|default"|hh:mm|ga_banner|show_timer|"type"|coupon[-_]?zone|internal_source|internal_medium|internal_campaign|\\u00|https?:|%[0-9a-f]{2}/i.test(text)) {
    return false;
  }
  if (/[?&=/\\]/.test(text)) return false;
  return true;
}

const COUPON_RE = /\b([A-Z]{3,}[A-Z0-9]{2,})\b/g;
const NOISE = new Set([
  "HTML",
  "HTTP",
  "HTTPS",
  "JSON",
  "UTF8",
  "INR",
  "GST",
  "SKU",
  "EMI",
  "UPI",
  "COD",
  "PDP",
  "CSS",
  "SRC",
  "ZONE",
]);

export function shopperOffers(lines: string[] | undefined) {
  return (lines || []).filter(isShopperOffer).slice(0, 3);
}

export function cleanCoupon(raw: string | null | undefined) {
  if (!raw) return null;
  const decoded = raw.replace(/\\u00[0-9a-f]{2}/gi, "/").trim();
  if (/coupon[-_]?zone|internal_|https?:|[?&=/\\%]/.test(decoded)) return null;
  const code = decoded.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length < 4 || code.length > 12) return null;
  if (NOISE.has(code)) return null;
  if (!/[A-Z]/.test(code)) return null;
  return code;
}

export function extractOffers(html: string, sellingPrice: number | null): ScrapedOffers {
  const mrpMatch =
    html.match(/"mrp"\s*:\s*"?(\d[\d,]*)/i) ||
    html.match(/"priceCurrency"[^}]{0,80}"price"\s*:\s*"?(\d[\d.]*)/i) ||
    html.match(/(?:M\.?R\.?P\.?|Maximum Retail Price)[^0-9]{0,24}(?:₹|&₹|Rs\.?)?\s*([\d,]+)/i);
  const mrpRaw = mrpMatch ? Number(String(mrpMatch[1]).replace(/[^\d.]/g, "")) : null;
  const mrp = mrpRaw && mrpRaw > 100 ? Math.round(mrpRaw) : null;

  const discountPercent =
    sellingPrice && mrp && mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : null;

  const offerLines = new Set<string>();
  const offerBlocks = html.matchAll(
    /(?:Bank Offer|No Cost EMI|Exchange Offer|Special Price|Coupon Code|Deal of the Day|Limited time deal)[^<]{0,80}/gi,
  );
  for (const block of offerBlocks) {
    const clean = block[0].replace(/\s+/g, " ").replace(/<[^>]+>/g, "").trim().slice(0, 90);
    if (isShopperOffer(clean)) offerLines.add(clean);
    if (offerLines.size >= 5) break;
  }

  let coupon: string | null = null;
  const couponHint = html.match(/coupon code[:\s]+([A-Z0-9]{4,12})/i);
  if (couponHint) coupon = cleanCoupon(couponHint[1]);
  if (!coupon) {
    for (const hit of html.matchAll(COUPON_RE)) {
      const code = cleanCoupon(hit[1]);
      if (code && /SAVE|OFF|BANK|FEST|BBD|GIF|DEAL/.test(code)) {
        coupon = code;
        break;
      }
    }
  }

  return {
    mrp,
    discountPercent,
    coupon,
    offers: [...offerLines],
  };
}

export function festivalHeadline(date = new Date()) {
  const { phase, items } = festivalsActiveOn(date);
  if (phase === "live") {
    return {
      title: items.map((i) => i.name).join(" + "),
      detail:
        "Sale prices, bank offers, and coupons from public product pages sit next to neighbourhood quotes — so a shopkeeper can promote a matching discount and a buyer can pick store or app.",
    };
  }
  if (phase === "upcoming") {
    return {
      title: `${items.map((i) => i.name).join(" and ")} are close`,
      detail:
        "Retail shops can post festival prices now. Shoppers can compare those quotes with Amazon and Flipkart as soon as the sale lists go live.",
    };
  }
  return {
    title: "Festival offers, when they exist",
    detail:
      "During Flipkart Big Billion Days and Amazon Great Indian Festival we surface public discount chips beside local shop prices so offline and online stay comparable.",
  };
}
