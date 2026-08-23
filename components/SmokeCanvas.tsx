"use client";

import { useEffect, useRef } from "react";

export const SMOKE_EVENT = "scroll:smoke";

type SmokeParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  startScale: number;
  endScale: number;
  peakAlpha: number;
  spriteIndex: number;
  phase: number;
  sway: number;
};

const MAX_PARTICLES = 120;
const BURST_COUNT = 55;

/**
 * Incense/ink smoke layer for the tab transition. Listens for the
 * SMOKE_EVENT CustomEvent and emits a staggered burst of warm gray-brown
 * wisps that rise off the dissolving content column.
 */
export default function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();

    // Pre-render soft radial sprites in the smoke palette
    const sprites = ["#31261d", "#5a4a3a", "#807060"].map((color) => {
      const s = document.createElement("canvas");
      const size = 128;
      s.width = size;
      s.height = size;
      const sctx = s.getContext("2d")!;
      const g = sctx.createRadialGradient(
        size / 2, size / 2, 4,
        size / 2, size / 2, size / 2
      );
      g.addColorStop(0, `${color}cc`);
      g.addColorStop(0.55, `${color}55`);
      g.addColorStop(1, `${color}00`);
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, size, size);
      return s;
    });

    const particles: SmokeParticle[] = [];
    let raf = 0;
    let running = false;
    let lastFrame = 0;
    const spawnTimeouts = new Set<ReturnType<typeof setTimeout>>();

    const tick = (now: number) => {
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 60;
      lastFrame = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const t = (now - p.born) / p.life;
        if (t >= 1) {
          particles.splice(i, 1);
          continue;
        }
        p.x += (p.vx + Math.sin((now / 1000) * p.sway + p.phase) * 9) * dt;
        p.y += p.vy * dt;
        p.vy -= 6 * dt; // buoyancy — smoke accelerates gently upward
        // Alpha envelope: quick rise, long fall
        const alpha =
          t < 0.15 ? (t / 0.15) * p.peakAlpha : p.peakAlpha * (1 - (t - 0.15) / 0.85);
        const scale = p.startScale + (p.endScale - p.startScale) * t;
        const sprite = sprites[p.spriteIndex];
        const size = 128 * scale * dpr;
        // Stamp three offsets along a slowly curling vector so each particle
        // reads as a ribboned strand rather than one round blob.
        const curl = p.phase + t * 2;
        for (let s = 0; s < 3; s++) {
          const r = (s - 1) * 13 * scale;
          const ox = Math.cos(curl) * r;
          const oy = Math.sin(curl) * r - s * 4 * scale;
          ctx.globalAlpha = Math.max(alpha * (1 - s * 0.28), 0);
          ctx.drawImage(
            sprite,
            (p.x + ox) * dpr - size / 2,
            (p.y + oy) * dpr - size / 2,
            size,
            size
          );
        }
      }
      ctx.globalAlpha = 1;
      if (particles.length > 0 && !document.hidden) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const ensureLoop = () => {
      // The host may size the viewport after mount; recover from a 0×0 canvas
      const expected = Math.floor(window.innerWidth * dpr);
      if (canvas.width !== expected && window.innerWidth > 0) resize();
      if (!running) {
        running = true;
        lastFrame = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const spawnOne = () => {
      if (particles.length >= MAX_PARTICLES) return;
      if (document.hidden || window.innerWidth === 0) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Hug the content column, biased toward the text block's lower half,
      // so smoke visibly rises off the dissolving copy.
      const x = w * (0.28 + Math.random() * 0.44);
      const y = h * (0.3 + Math.random() * 0.35);
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 26,
        vy: -(34 + Math.random() * 56),
        born: performance.now(),
        life: 900 + Math.random() * 500,
        startScale: 0.3 + Math.random() * 0.35,
        endScale: 0.8 + Math.random() * 0.8,
        peakAlpha: 0.06 + Math.random() * 0.08,
        spriteIndex: Math.floor(Math.random() * sprites.length),
        phase: Math.random() * Math.PI * 2,
        sway: 1.4 + Math.random() * 2.2,
      });
      ensureLoop();
    };

    const onBurst = () => {
      if (reduced.matches) return;
      // Mobile gets a lighter burst
      const count = window.innerWidth < 768 ? Math.floor(BURST_COUNT / 2.5) : BURST_COUNT;
      for (let i = 0; i < count; i++) {
        const delay = Math.random() * 600; // staggered emission over the dissolve
        const id = setTimeout(() => {
          spawnTimeouts.delete(id);
          spawnOne();
        }, delay);
        spawnTimeouts.add(id);
      }
    };

    const onVisibility = () => {
      if (!document.hidden && particles.length > 0) ensureLoop();
    };

    // Honor a mid-session switch to reduced motion: stop and clear at once
    const onPreferenceChange = () => {
      if (reduced.matches) {
        spawnTimeouts.forEach(clearTimeout);
        spawnTimeouts.clear();
        particles.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener(SMOKE_EVENT, onBurst);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onPreferenceChange);

    if (process.env.NODE_ENV === "development") {
      (window as unknown as Record<string, unknown>).__smokeDebug = {
        particles,
        burst: onBurst,
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      spawnTimeouts.forEach(clearTimeout);
      window.removeEventListener(SMOKE_EVENT, onBurst);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="smoke-canvas" aria-hidden="true" />;
}
