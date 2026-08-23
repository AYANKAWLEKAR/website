"use client";

import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  scale: number;
  born: number;
  life: number;
  color: string;
  phase: number;
  sway: number;
};

const PETAL_COLORS = ["#d37b91", "#e39aab", "#efb7c3", "#c9748c"];
const PETAL_EDGE = "#b95f78";
const MAX_PETALS = 24;

export default function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");

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

    const petals: Petal[] = [];
    let raf = 0;
    let running = false;
    let lastFrame = 0;
    // Anchor of the emission path — petals are laid down every EMIT_SPACING
    // px of pointer travel, interpolated along the true cursor path.
    let anchor: { x: number; y: number } | null = null;
    const EMIT_SPACING = 30;
    const TELEPORT = 220; // pointer re-entered the window; don't bridge the jump

    const disabled = () => reduced.matches || coarse.matches;

    const drawPetal = (p: Petal, now: number) => {
      const t = (now - p.born) / p.life;
      if (t >= 1) return;
      const fade = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
      // Tumbling foreshortening: petals flip edge-on and back as they fall
      const tumble = 0.35 + 0.65 * Math.abs(Math.sin(p.rotation + now / 300 + p.phase));
      ctx.save();
      ctx.translate(p.x * dpr, p.y * dpr);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale * dpr, p.scale * dpr * tumble);
      ctx.globalAlpha = 0.85 * fade;
      ctx.fillStyle = p.color;
      // Sakura petal: rounded body with a small notch at the tip
      ctx.beginPath();
      ctx.moveTo(0, 4.6);
      ctx.bezierCurveTo(-4.4, 1.8, -3.9, -3.4, -0.9, -4.4);
      ctx.lineTo(0, -3.1);
      ctx.lineTo(0.9, -4.4);
      ctx.bezierCurveTo(3.9, -3.4, 4.4, 1.8, 0, 4.6);
      ctx.closePath();
      ctx.fill();
      // Drawn, ink-adjacent edge
      ctx.globalAlpha = 0.4 * fade;
      ctx.strokeStyle = PETAL_EDGE;
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 60;
      lastFrame = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        const age = now - p.born;
        if (age >= p.life) {
          petals.splice(i, 1);
          continue;
        }
        p.x += (p.vx + Math.sin((now / 1000) * p.sway + p.phase) * 14) * dt;
        p.y += p.vy * dt;
        p.vy += 26 * dt; // gentle gravity
        p.rotation += p.spin * dt;
        drawPetal(p, now);
      }
      if (petals.length > 0 && !document.hidden) {
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

    const makePetal = (x: number, y: number, ux: number, uy: number, now: number): Petal => ({
      // On the path, with only a whisper of jitter so the trail stays true
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      // Carried briefly along the stroke direction, then wind and gravity
      vx: ux * 26 + (Math.random() - 0.5) * 16,
      vy: uy * 26 + 22 + Math.random() * 26,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 3.4,
      scale: 1.4 + Math.random() * 0.9,
      born: now,
      life: 700 + Math.random() * 500,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      phase: Math.random() * Math.PI * 2,
      sway: 2 + Math.random() * 3,
    });

    // Coalesced pointer samples expose every un-coalesced position change
    // (MDN: PointerEvent.getCoalescedEvents), so fast strokes emit petals
    // along the real path instead of at sparse sampled points.
    const onMove = (e: PointerEvent) => {
      if (disabled()) return;
      if (e.pointerType !== "mouse") return;
      const samples =
        typeof e.getCoalescedEvents === "function" && e.getCoalescedEvents().length > 0
          ? e.getCoalescedEvents()
          : [e];
      const now = performance.now();
      let spawned = false;
      for (const s of samples) {
        const x = s.clientX;
        const y = s.clientY;
        if (!anchor) {
          anchor = { x, y };
          continue;
        }
        let dx = x - anchor.x;
        let dy = y - anchor.y;
        let dist = Math.hypot(dx, dy);
        if (dist > TELEPORT) {
          anchor = { x, y };
          continue;
        }
        while (dist >= EMIT_SPACING) {
          const ux = dx / dist;
          const uy = dy / dist;
          anchor.x += ux * EMIT_SPACING;
          anchor.y += uy * EMIT_SPACING;
          if (petals.length < MAX_PETALS) {
            petals.push(makePetal(anchor.x, anchor.y, ux, uy, now));
            spawned = true;
          }
          dx = x - anchor.x;
          dy = y - anchor.y;
          dist = Math.hypot(dx, dy);
        }
      }
      if (spawned) ensureLoop();
    };

    const onVisibility = () => {
      if (!document.hidden && petals.length > 0) ensureLoop();
    };

    // Honor mid-session preference changes: clear immediately when disabled
    const onPreferenceChange = () => {
      if (disabled()) {
        petals.length = 0;
        anchor = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (process.env.NODE_ENV === "development") {
      (window as unknown as Record<string, unknown>).__petalDebug = { petals };
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onPreferenceChange);
    coarse.addEventListener("change", onPreferenceChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onPreferenceChange);
      coarse.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="petal-canvas" aria-hidden="true" />;
}
