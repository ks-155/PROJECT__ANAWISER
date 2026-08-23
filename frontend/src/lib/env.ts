/** Read env under both historic and current names. Never log values. */

function firstMatching(test: (key: string) => boolean) {
  for (const [key, value] of Object.entries(process.env)) {
    if (value && test(key)) return value.trim();
  }
  return "";
}

export function geminiApiKey() {
  return (
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    firstMatching((key) => /gemini/i.test(key) && /key/i.test(key))
  );
}

export function brightDataToken() {
  return (
    process.env.BRIGHT_DATA_API_TOKEN?.trim() ||
    process.env.BRIGHT_DATA_API_TOKEN?.trim() ||
    firstMatching((key) => /bright/i.test(key) && /token|api/i.test(key) && !/collector|zone/i.test(key))
  );
}

export function brightDataCollectorId() {
  return (
    process.env.BRIGHT_DATA_COLLECTOR_ID?.trim() ||
    process.env.BRIGHT_DATA_COLLECTOR_ID?.trim() ||
    firstMatching((key) => /bright/i.test(key) && /collector/i.test(key))
  );
}

export function brightDataUnlockerZone() {
  return (
    process.env.BRIGHT_DATA_WEB_UNLOCKER_ZONE?.trim() ||
    process.env.BRIGHT_DATA_WEB_UNLOCKER_ZONE?.trim() ||
    process.env.BRIGHT_DATA_WEB_UNLOCKER_ZONE?.trim() ||
    firstMatching((key) => /bright/i.test(key) && /unlock/i.test(key))
  );
}
