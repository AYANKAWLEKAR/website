"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import KatanaUnderline from "@/components/KatanaUnderline";
import { owner } from "@/lib/content";

const stage: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stageReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18 } },
};

/** Small original hanko-style seal — abstract geometric mark, no characters. */
function HankoSeal() {
  return (
    <svg
      viewBox="0 0 18 18"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        fill="none"
        stroke="var(--vermilion)"
        strokeWidth="1.4"
        strokeOpacity="0.85"
      />
      <path
        d="M 5 13 L 9 5 L 13 13 M 6.5 10.2 L 11.5 10.2"
        fill="none"
        stroke="var(--vermilion)"
        strokeWidth="1.3"
        strokeOpacity="0.85"
      />
    </svg>
  );
}

export default function HomeTab() {
  const reduced = useReducedMotion();
  const variants = reduced ? stageReduced : stage;

  return (
    <section className="flex min-h-[72dvh] flex-col">
      <div className="my-auto">
        <motion.div
          className="flex items-baseline justify-between gap-6"
          variants={variants}
          initial="hidden"
          animate="show"
          custom={0.05}
        >
          <p className="meta-label">
            Personal scroll — {owner.location}
          </p>
          <HankoSeal />
        </motion.div>

        <motion.p
          className="mt-5 font-display text-[clamp(3.2rem,9vw,6.5rem)] leading-[1.05] text-ink"
          variants={variants}
          initial="hidden"
          animate="show"
          custom={0.18}
        >
          {owner.name}
        </motion.p>

        <KatanaUnderline className="mt-4 w-[min(58%,34rem)] max-w-full max-md:w-[min(100%,340px)]" />

        <motion.p
          className="mt-10 max-w-[36ch] text-[clamp(1.15rem,2.2vw,1.45rem)] leading-[1.6] text-ink"
          variants={variants}
          initial="hidden"
          animate="show"
          custom={0.68}
        >
          {owner.positioning}
        </motion.p>
      </div>

      <motion.div
        className="mt-auto pt-14"
        variants={variants}
        initial="hidden"
        animate="show"
        custom={0.85}
      >
        <hr className="ink-rule" />
        <div className="mt-4 flex flex-wrap gap-x-12 gap-y-3 md:justify-between">
          <p className="meta-label">
            Currently —{" "}
            <span className="font-body normal-case tracking-normal text-ink-muted">
              {owner.currently}
            </span>
          </p>
          <p className="meta-label">
            Interests —{" "}
            <span className="font-body normal-case tracking-normal text-ink-muted">
              {owner.interests}
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
