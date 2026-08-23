"use client";

import { useEffect, useRef } from "react";

export const SCENE_URL =
  process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ??
  "https://prod.spline.design/KFonZGtsoUXP-qx7/scene.splinecode";

export function SplineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let appInstance: any = null;

    import("@splinetool/runtime")
      .then(({ Application }) => {
        if (disposed) return;
        appInstance = new Application(canvas);
        appInstance.load(SCENE_URL).catch((err: unknown) => {
          if (!disposed) {
            console.warn("[Anawiser] Spline scene failed to load", err);
          }
        });
      })
      .catch((err) => {
        console.warn("[Anawiser] Spline runtime failed to import", err);
      });

    return () => {
      disposed = true;
      if (appInstance) {
        try {
          appInstance.dispose();
        } catch {
          // ignore teardown races
        }
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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#e8f0fa]/85 via-[#e8f0fa]/70 to-[#dce8f8]/90" />
      <div className="aegis-grid pointer-events-none absolute inset-0 opacity-40" />
    </div>
  );
}
