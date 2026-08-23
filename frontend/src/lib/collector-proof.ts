/**
 * In-memory proof of the last Bright Data collector run.
 * Never stores the API token. Collector ID is the public artefact judges need.
 */

import { brightDataCollectorId } from "./env";

type Proof = {
  collectorId: string;
  collectionId?: string;
  lastRunAt: string;
  lastUrl?: string;
  healed: boolean;
  source: string;
};

let lastProof: Proof | null = null;

export function recordCollectorProof(proof: Proof) {
  lastProof = proof;
}

export function getCollectorProof(): Proof | null {
  const envId = brightDataCollectorId();
  if (lastProof) return lastProof;
  if (!envId) return null;
  return {
    collectorId: envId,
    lastRunAt: new Date(0).toISOString(),
    healed: false,
    source: "env",
  };
}
