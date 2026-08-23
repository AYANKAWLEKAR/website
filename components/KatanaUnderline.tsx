"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Original hand-authored katana SVG, drawn as a single-color ink underline.
 * Kissaki (tip) at the left, tsuka (handle) at the right, with a faint
 * temper-line along the blade and a single tiny vermilion sageo accent.
 */
export default function KatanaUnderline({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={`group ${className}`}
      initial={
        reduced
          ? { opacity: 0 }
          : { clipPath: "inset(0 100% 0 0)", opacity: 1 }
      }
      animate={
        reduced ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)", opacity: 1 }
      }
      transition={
        reduced
          ? { duration: 0.2 }
          : { duration: 0.6, delay: 0.45, ease: [0.25, 0.6, 0.3, 1] }
      }
      whileHover={reduced ? undefined : { x: 3, transition: { duration: 0.25 } }}
    >
      <svg
        viewBox="0 0 640 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        role="presentation"
        focusable="false"
      >
        {/* Blade — gentle sori curve, tapering to the kissaki at left */}
        <path
          d="M6 27
             C 90 17.5, 240 13, 452 15.5
             L 452 21.5
             C 250 20.5, 100 24.5, 10 28.6
             C 8 28.7, 5.6 27.9, 6 27 Z"
          fill="var(--ink)"
          fillOpacity="0.92"
        />
        {/* Temper line (hamon suggestion) — faint, brightens slightly on hover */}
        <path
          d="M 24 25.5 C 120 20.5, 260 17, 448 18.6"
          stroke="var(--paper-light)"
          strokeWidth="0.8"
          strokeOpacity="0.35"
          className="transition-[stroke-opacity] duration-300 group-hover:[stroke-opacity:0.6]"
        />
        {/* Habaki — blade collar */}
        <rect x="452" y="12.5" width="10" height="11" rx="1" fill="var(--ink)" fillOpacity="0.95" />
        {/* Tsuba — guard */}
        <ellipse cx="468" cy="18" rx="5" ry="13.5" fill="var(--ink)" />
        {/* Tiny vermilion sageo knot — the single color accent */}
        <path
          d="M 468 32.5 l 3 3.4 l -3 3.4 l -3 -3.4 Z"
          fill="var(--vermilion)"
          fillOpacity="0.55"
        />
        {/* Tsuka — handle with ito-wrap diamonds */}
        <path
          d="M 474 12.8 L 622 14.6 C 626 14.7, 628 16, 628 18 C 628 20, 626 21.3, 622 21.4 L 474 23.2 Z"
          fill="var(--ink)"
          fillOpacity="0.9"
        />
        {/* Wrap crossings — pick out diamonds in paper tone */}
        <g stroke="var(--paper)" strokeWidth="1.1" strokeOpacity="0.75">
          <path d="M 482 13 L 500 23" />
          <path d="M 500 13 L 482 23" />
          <path d="M 512 13.3 L 530 22.8" />
          <path d="M 530 13.3 L 512 22.8" />
          <path d="M 542 13.6 L 560 22.4" />
          <path d="M 560 13.6 L 542 22.4" />
          <path d="M 572 14 L 590 22" />
          <path d="M 590 14 L 572 22" />
        </g>
        {/* Kashira — pommel cap */}
        <path
          d="M 622 14.5 C 630 14.5, 633 16.2, 633 18 C 633 19.8, 630 21.5, 622 21.5 Z"
          fill="var(--ink)"
        />
      </svg>
    </motion.div>
  );
}
