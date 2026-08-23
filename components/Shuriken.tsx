"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Original four-point shuriken SVG used as the experience bullet marker.
 * Ink-colored at rest; the parent row turns it vermilion on hover, and it
 * rotates 45° once on entry (and once more on row hover), then stops.
 */
export default function Shuriken({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className={`inline-block ${className}`}
      initial={reduced ? { opacity: 0 } : { rotate: -45, opacity: 0 }}
      whileInView={reduced ? { opacity: 1 } : { rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: reduced ? 0.2 : 0.45, ease: "easeOut" }}
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        focusable="false"
        className="block transition-transform duration-300 ease-out group-hover:rotate-45"
      >
        <path
          d="M8 0.4
             C 8.5 3.4, 9.4 5.4, 10.2 5.8
             L 15.6 8
             L 10.2 10.2
             C 9.4 10.6, 8.5 12.6, 8 15.6
             C 7.5 12.6, 6.6 10.6, 5.8 10.2
             L 0.4 8
             L 5.8 5.8
             C 6.6 5.4, 7.5 3.4, 8 0.4 Z
             M 8 6.9 A 1.1 1.1 0 1 0 8 9.1 A 1.1 1.1 0 1 0 8 6.9 Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </motion.span>
  );
}
