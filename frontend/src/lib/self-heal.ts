/**
 * Bright Data Scraper Studio Self-Healing
 * Docs: https://docs.brightdata.com/datasets/scraper-studio/self-healing-tool
 * API:  POST /dca/collectors/{id}/refactor_template
 *       GET  /dca/collectors/{id}/refactor_template/progress
 *       POST /dca/collectors/{id}/resume_automation_job
 *
 * Never logs or returns the API token. Collector ID is the public proof.
 */

import { recordCollectorProof } from "./collector-proof";
import { brightDataCollectorId, brightDataToken } from "./env";

const API = "https://api.brightdata.com";

const DEFAULT_PROMPT =
  "The 'price' value is returning 'undefined', please fix. Keep title and visible list price only. Public product pages only — no login or personal data.";

function auth() {
  return {
    Authorization: `Bearer ${brightDataToken()}`,
    "Content-Type": "application/json",
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function triggerSelfHeal(opts?: { wait?: boolean; prompt?: string }) {
  const token = brightDataToken();
  const collectorId = brightDataCollectorId();
  if (!token || !collectorId) {
    return { ok: false as const, collectorId: collectorId || null, error: "missing_env" };
  }

  const prompt = (opts?.prompt || DEFAULT_PROMPT).slice(0, 1000);
  const trigger = await fetch(`${API}/dca/collectors/${collectorId}/refactor_template`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify({ prompt, custom_input: [] }),
  });

  if (!trigger.ok) {
    return {
      ok: false as const,
      collectorId,
      error: `trigger_${trigger.status}`,
    };
  }

  recordCollectorProof({
    collectorId,
    lastRunAt: new Date().toISOString(),
    healed: true,
    source: "self-heal-started",
  });

  if (!opts?.wait || process.env.VERCEL === "1") {
    return { ok: true as const, collectorId, status: "started" };
  }

  for (let i = 0; i < 45; i++) {
    await sleep(20000);
    const prog = await fetch(`${API}/dca/collectors/${collectorId}/refactor_template/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await prog.json().catch(() => ({}))) as {
      status?: string;
      step?: string;
    };
    const status = (data.status || "").toLowerCase();
    const step = (data.step || "").toLowerCase();

    if (status === "pending_answer" || step === "user_approval") {
      await fetch(`${API}/dca/collectors/${collectorId}/resume_automation_job`, {
        method: "POST",
        headers: auth(),
        body: JSON.stringify({ message: true, auto_save: true }),
      });
      continue;
    }
    if (["done", "completed", "success"].includes(status)) {
      recordCollectorProof({
        collectorId,
        lastRunAt: new Date().toISOString(),
        healed: true,
        source: "self-heal",
      });
      return { ok: true as const, collectorId, status: "done" };
    }
    if (["failed", "error", "cancelled"].includes(status)) {
      return { ok: false as const, collectorId, error: status };
    }
  }

  return { ok: true as const, collectorId, status: "running" };
}
