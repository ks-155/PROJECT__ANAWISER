"use client";

import { useEffect, useRef } from "react";
import { Application } from "@splinetool/runtime";

/**
 * Anawiser Spline 3D background (official @splinetool/runtime).
 *
 * Swap SCENE_URL for your own design:
 * 1. Open https://spline.design/ and create/remix a scene (shopping tags, charts, soft shapes).
 * 2. Click Export → Code → Vanilla JS / React (or Public URL).
 * 3. Copy the `https://prod.spline.design/.../scene.splinecode` link.
 * 4. Paste it below (or set NEXT_PUBLIC_SPLINE_SCENE_URL in frontend/.env.local).
 *
 * Tip: keep the scene sparse and light-colored so low opacity + the wash overlay stay readable.
 *
 * Note: We load via `@splinetool/runtime` (same engine as `@splinetool/react-spline`) because
 * Next.js 16’s bundler cannot resolve react-spline’s ESM-only package exports reliably.
 */
export const SCENE_URL =
  process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ??
  // Soft abstract “data / product” vibe from Spline’s public Next.js demo export
  "https://prod.spline.design/KFonZGtsoUXP-qx7/scene.splinecode";

export function SplineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new Application(canvas);
    let disposed = false;

    app.load(SCENE_URL).catch((err: unknown) => {
      if (!disposed) {
        console.warn("[Anawiser] Spline scene failed to load", err);
      }
    });

    return () => {
      disposed = true;
      try {
        app.dispose();
      } catch {
        // ignore teardown races
      }
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute -inset-[8%] opacity-[0.42] saturate-90 contrast-100 blur-[0.5px] motion-reduce:hidden">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      {/* Soft wash so slate/indigo UI + AI panel stay readable */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(99,102,241,0.06), transparent 55%), radial-gradient(ellipse 70% 50% at 15% 80%, rgba(15,118,110,0.04), transparent 50%), linear-gradient(to bottom right, rgba(248,250,252,0.78), rgba(238,242,255,0.55))",
        }}
      />
    </div>
  );
}
