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
function HankoSeal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
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
        {/* Signature block: the katana underline spans exactly the name's
            rendered width, and the seal sits beside it like a stamp. */}
        <motion.div
          className="relative mx-auto w-fit max-w-full"
          variants={variants}
          initial="hidden"
          animate="show"
          custom={0.08}
        >
          <p className="text-center font-display text-[clamp(3.2rem,9vw,6.5rem)] leading-[1.05] text-ink">
            {owner.name}
          </p>
          <HankoSeal className="absolute -right-7 top-3 max-md:-right-1 max-md:-top-1" />
          <KatanaUnderline className="mt-4 w-full" />
        </motion.div>

        {reduced ? (
          <motion.p
            className="mx-auto mt-12 max-w-[54ch] text-center text-[clamp(1.02rem,1.8vw,1.2rem)] leading-[1.7] text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {owner.positioning}
          </motion.p>
        ) : (
          <motion.p
            className="mx-auto mt-12 max-w-[54ch] text-center text-[clamp(1.02rem,1.8vw,1.2rem)] leading-[1.7]"
            // Ink-soak reveal: the overview bleeds in soft and pale, then
            // dries crisp and dark, like ink settling into the paper.
            initial={{ opacity: 0, filter: "blur(14px)", color: "#8c7455" }}
            animate={{
              opacity: [0, 0.72, 1],
              filter: ["blur(14px)", "blur(4px)", "blur(0px)"],
              color: ["#8c7455", "#503c28", "#24180f"],
            }}
            transition={{
              duration: 1.15,
              delay: 0.85,
              times: [0, 0.55, 1],
              ease: "easeOut",
            }}
          >
            {owner.positioning}
          </motion.p>
        )}
      </div>

      <motion.div
        className="mt-auto pt-14"
        variants={variants}
        initial="hidden"
        animate="show"
        custom={reduced ? 0 : 1.15}
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
