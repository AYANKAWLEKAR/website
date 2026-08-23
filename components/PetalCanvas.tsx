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
const MAX_PETALS = 22;

export default function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

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
    let lastSpawn = 0;
    let nextSpawnGap = 40;
    let prevX = 0;
    let prevY = 0;
    let hasPrev = false;

    const drawPetal = (p: Petal, now: number) => {
      const t = (now - p.born) / p.life;
      if (t >= 1) return;
      const fade = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
      ctx.save();
      ctx.translate(p.x * dpr, p.y * dpr);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale * dpr, p.scale * dpr);
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
      ctx.restore();
    };

    const tick = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        const age = now - p.born;
        if (age >= p.life) {
          petals.splice(i, 1);
          continue;
        }
        const dt = 1 / 60;
        p.x += (p.vx + Math.sin(now / 1000 * p.sway + p.phase) * 14) * dt;
        p.y += p.vy * dt;
        p.vy += 26 * dt; // gentle gravity
        p.rotation += p.spin * dt;
        drawPetal(p, now);
      }
      if (petals.length > 0 && !document.hidden) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const ensureLoop = () => {
      // The host may size the viewport after mount; recover from a 0×0 canvas
      const expected = Math.floor(window.innerWidth * dpr);
      if (canvas.width !== expected && window.innerWidth > 0) resize();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (hasPrev && now - lastSpawn >= nextSpawnGap && petals.length < MAX_PETALS) {
        lastSpawn = now;
        nextSpawnGap = 35 + Math.random() * 20;
        // Spawn slightly behind the cursor, along its direction of travel
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        const mag = Math.max(Math.hypot(dx, dy), 0.001);
        const bx = e.clientX - (dx / mag) * (8 + Math.random() * 6);
        const by = e.clientY - (dy / mag) * (8 + Math.random() * 6);
        petals.push({
          x: bx + (Math.random() - 0.5) * 10,
          y: by + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 24,
          vy: 34 + Math.random() * 40,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 3.4,
          scale: 1.0 + Math.random() * 0.8,
          born: now,
          life: 700 + Math.random() * 500,
          color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
          phase: Math.random() * Math.PI * 2,
          sway: 2 + Math.random() * 3,
        });
        ensureLoop();
      }
      prevX = e.clientX;
      prevY = e.clientY;
      hasPrev = true;
    };

    const onVisibility = () => {
      if (!document.hidden && petals.length > 0) ensureLoop();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="petal-canvas" aria-hidden="true" />;
}
