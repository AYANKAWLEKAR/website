"use client";

import { motion } from "motion/react";
import KatanaUnderline from "@/components/KatanaUnderline";
import { owner } from "@/lib/content";

const stage = {
  hidden: { opacity: 0, y: 10 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function HomeTab() {
  return (
    <section className="flex min-h-[72dvh] flex-col justify-center">
      <motion.p
        className="meta-label"
        variants={stage}
        initial="hidden"
        animate="show"
        custom={0.05}
      >
        Personal scroll — {owner.location}
      </motion.p>

      <motion.h1
        className="mt-5 font-display text-[clamp(3.2rem,9vw,6.5rem)] leading-[1.05] text-ink"
        variants={stage}
        initial="hidden"
        animate="show"
        custom={0.18}
      >
        {owner.name}
      </motion.h1>

      <KatanaUnderline className="mt-4 w-[min(58%,34rem)] max-w-full max-md:w-[min(100%,340px)]" />

      <motion.p
        className="mt-10 max-w-[36ch] text-[clamp(1.15rem,2.2vw,1.45rem)] leading-[1.6] text-ink"
        variants={stage}
        initial="hidden"
        animate="show"
        custom={0.68}
      >
        {owner.positioning}
      </motion.p>

      <motion.div
        className="mt-12 flex flex-wrap gap-x-12 gap-y-3 md:justify-end"
        variants={stage}
        initial="hidden"
        animate="show"
        custom={0.85}
      >
        <p className="meta-label">
          Currently — <span className="text-ink-muted normal-case tracking-normal">{owner.currently}</span>
        </p>
        <p className="meta-label">
          Interests — <span className="text-ink-muted normal-case tracking-normal">{owner.interests}</span>
        </p>
      </motion.div>
    </section>
  );
}
