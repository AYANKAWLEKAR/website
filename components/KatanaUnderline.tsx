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
        {/* Blade — gentle sori curve, tapering to the kissaki at left.
            Extended so the blade/handle break clears the middle of the name. */}
        <path
          d="M6 27
             C 100 17, 280 12.5, 500 15
             L 500 21
             C 280 20, 110 24, 10 28.6
             C 8 28.7, 5.6 27.9, 6 27 Z"
          fill="var(--ink)"
          fillOpacity="0.92"
        />
        {/* Temper line (hamon suggestion) — faint, brightens slightly on hover */}
        <path
          d="M 24 25.5 C 130 20, 300 16.5, 496 18.2"
          stroke="var(--paper-light)"
          strokeWidth="0.8"
          strokeOpacity="0.35"
          className="transition-[stroke-opacity] duration-300 group-hover:[stroke-opacity:0.6]"
        />
        {/* Habaki — blade collar */}
        <rect x="500" y="12.5" width="10" height="11" rx="1" fill="var(--ink)" fillOpacity="0.95" />
        {/* Tsuba — guard */}
        <ellipse cx="516" cy="18" rx="5" ry="13.5" fill="var(--ink)" />
        {/* Vermilion sageo knot — the composition's single color accent */}
        <path
          d="M 516 30.5 l 4 4.5 l -4 4.5 l -4 -4.5 Z"
          fill="var(--vermilion)"
          fillOpacity="0.88"
        />
        {/* Tsuka — handle with ito-wrap diamonds */}
        <path
          d="M 522 12.8 L 620 14.6 C 624 14.7, 626 16, 626 18 C 626 20, 624 21.3, 620 21.4 L 522 23.2 Z"
          fill="var(--ink)"
          fillOpacity="0.9"
        />
        {/* Wrap crossings — pick out diamonds in paper tone */}
        <g stroke="var(--paper)" strokeWidth="1.1" strokeOpacity="0.75">
          <path d="M 530 13 L 546 23" />
          <path d="M 546 13 L 530 23" />
          <path d="M 554 13.3 L 570 22.8" />
          <path d="M 570 13.3 L 554 22.8" />
          <path d="M 578 13.6 L 594 22.4" />
          <path d="M 594 13.6 L 578 22.4" />
          <path d="M 600 14 L 614 22" />
          <path d="M 614 14 L 600 22" />
        </g>
        {/* Kashira — pommel cap */}
        <path
          d="M 620 14.5 C 628 14.5, 631 16.2, 631 18 C 631 19.8, 628 21.5, 620 21.5 Z"
          fill="var(--ink)"
        />
      </svg>
    </motion.div>
  );
}
