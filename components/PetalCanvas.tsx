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
};

const PETAL_COLORS = ["#d37b91", "#e39aab", "#efb7c3", "#c9748c"];
const PETAL_EDGE = "#b95f78";

// A short trail: few petals, brief lives. Each one is launched with the
// cursor's own velocity, then bled off by drag so it settles where the
// cursor was rather than sailing away from it.
const MAX_PETALS = 11;
const EMIT_SPACING = 19; // px of pointer travel between petals
const TELEPORT = 220; // pointer re-entered the window; don't bridge the jump
const MAX_SPEED = 2600; // px/s clamp against flick spikes
const DRAG = 3.6; // per-second velocity decay
const GRAVITY = 150; // takes over once drag has eaten the launch speed

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

    // Emission anchor walks the true pointer path; velocity is smoothed
    // across samples so a petal inherits the cursor's current motion.
    let anchor: { x: number; y: number } | null = null;
    let lastSample: { x: number; y: number; t: number } | null = null;
    let velX = 0;
    let velY = 0;

    const disabled = () => reduced.matches || coarse.matches;

    const drawPetal = (p: Petal, now: number) => {
      const t = (now - p.born) / p.life;
      if (t >= 1) return;
      const fade = t < 0.45 ? 1 : 1 - (t - 0.45) / 0.55;
      // Tumbling foreshortening sells "petal" over "dot"
      const tumble =
        0.35 + 0.65 * Math.abs(Math.sin(p.rotation + now / 320 + p.phase));
      ctx.save();
      ctx.translate(p.x * dpr, p.y * dpr);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale * dpr, p.scale * dpr * tumble);
      ctx.globalAlpha = 0.85 * fade;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 4.6);
      ctx.bezierCurveTo(-4.4, 1.8, -3.9, -3.4, -0.9, -4.4);
      ctx.lineTo(0, -3.1);
      ctx.lineTo(0.9, -4.4);
      ctx.bezierCurveTo(3.9, -3.4, 4.4, 1.8, 0, 4.6);
      ctx.closePath();
      ctx.fill();
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
      const drag = Math.exp(-DRAG * dt);
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        if (now - p.born >= p.life) {
          petals.splice(i, 1);
          continue;
        }
        p.vx *= drag;
        p.vy *= drag;
        p.vy += GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
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
      // The host may size the viewport after mount; recover from a 0x0 canvas
      const expected = Math.floor(window.innerWidth * dpr);
      if (canvas.width !== expected && window.innerWidth > 0) resize();
      if (!running) {
        running = true;
        lastFrame = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const makePetal = (x: number, y: number, now: number): Petal => ({
      x: x + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 5,
      // Launched at a fraction of the cursor's own velocity, so the trail
      // stretches when the pointer is fast and stays tight when it is slow
      vx: velX * 0.5 + (Math.random() - 0.5) * 30,
      vy: velY * 0.5 + (Math.random() - 0.5) * 30,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 4,
      scale: 1.3 + Math.random() * 0.7,
      born: now,
      life: 450 + Math.random() * 260,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      phase: Math.random() * Math.PI * 2,
    });

    // Coalesced samples expose every un-coalesced position change
    // (MDN: PointerEvent.getCoalescedEvents), so fast strokes both measure
    // velocity accurately and lay petals along the real path.
    const onMove = (e: PointerEvent) => {
      if (disabled() || e.pointerType !== "mouse") return;
      const samples =
        typeof e.getCoalescedEvents === "function" &&
        e.getCoalescedEvents().length > 0
          ? e.getCoalescedEvents()
          : [e];
      const now = performance.now();
      let spawned = false;

      for (const s of samples) {
        const x = s.clientX;
        const y = s.clientY;

        if (lastSample) {
          const dts = (s.timeStamp - lastSample.t) / 1000;
          if (dts > 0 && dts < 0.1) {
            const ivx = (x - lastSample.x) / dts;
            const ivy = (y - lastSample.y) / dts;
            // Light smoothing keeps direction honest without lagging turns
            velX = velX * 0.45 + ivx * 0.55;
            velY = velY * 0.45 + ivy * 0.55;
            const speed = Math.hypot(velX, velY);
            if (speed > MAX_SPEED) {
              velX = (velX / speed) * MAX_SPEED;
              velY = (velY / speed) * MAX_SPEED;
            }
          }
        }
        lastSample = { x, y, t: s.timeStamp };

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
          anchor.x += (dx / dist) * EMIT_SPACING;
          anchor.y += (dy / dist) * EMIT_SPACING;
          // At the cap, retire the oldest rather than skipping the spawn:
          // the trail must stay pinned to the cursor, with the cap setting
          // its length. Skipping would strand the trail behind fast strokes.
          if (petals.length >= MAX_PETALS) petals.shift();
          petals.push(makePetal(anchor.x, anchor.y, now));
          spawned = true;
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
        lastSample = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (process.env.NODE_ENV === "development") {
      (window as unknown as Record<string, unknown>).__petalDebug = {
        petals,
        velocity: () => ({ velX, velY }),
      };
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
