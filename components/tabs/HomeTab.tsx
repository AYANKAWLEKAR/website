"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
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

  // Murky liquid-ink reveal: a turbulence-displacement filter warps the
  // overview like ink diffusing through water, settling as the noise and
  // displacement animate to zero while the color soaks from sepia to ink.
  const [inkSettled, setInkSettled] = useState(false);
  const turbRef = useRef<SVGFETurbulenceElement | null>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const controls = animate(0, 1, {
      duration: 1.7,
      delay: 0.85,
      ease: [0.3, 0.55, 0.35, 1],
      onUpdate: (t) => {
        const u = 1 - t;
        dispRef.current?.setAttribute("scale", (110 * u * u).toFixed(1));
        blurRef.current?.setAttribute(
          "stdDeviation",
          (7 * Math.pow(u, 1.4)).toFixed(2)
        );
        // The murk roils: noise frequency drifts as the ink settles
        turbRef.current?.setAttribute(
          "baseFrequency",
          `${(0.011 + 0.024 * u).toFixed(4)} ${(0.026 + 0.04 * u).toFixed(4)}`
        );
      },
      onComplete: () => setInkSettled(true),
    });
    return () => controls.stop();
  }, [reduced]);

  return (
    <section className="flex min-h-[72dvh] flex-col">
      <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0">
        <defs>
          <filter id="ink-murk" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.035 0.066"
              numOctaves="3"
              seed="4"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="110"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur ref={blurRef} stdDeviation="7" />
          </filter>
        </defs>
      </svg>

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
          <p className="text-center font-display text-[clamp(3.4rem,12vw,8.75rem)] leading-[1.05] text-ink">
            {owner.name}
          </p>
          <HankoSeal className="absolute -right-8 top-4 max-md:-right-1 max-md:-top-1" />
          {/* The stroke sweeps a touch past the name, like brush follow-through */}
          <KatanaUnderline className="mt-5 w-[110%] -ml-[5%] max-md:ml-0 max-md:w-full" />
        </motion.div>

        <motion.p
          className="mx-auto mt-12 max-w-[52ch] text-center font-body text-[clamp(1.05rem,1.9vw,1.3rem)] leading-[1.85]"
          style={reduced || inkSettled ? undefined : { filter: "url(#ink-murk)" }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, color: "#8c7455" }}
          animate={
            reduced
              ? { opacity: 1 }
              : {
                  opacity: [0, 0.55, 1],
                  color: ["#8c7455", "#503c28", "#24180f"],
                }
          }
          transition={
            reduced
              ? { duration: 0.18 }
              : { duration: 1.7, delay: 0.85, times: [0, 0.5, 1], ease: "easeOut" }
          }
        >
          {owner.positioning}{" "}
          <span className="text-vermilion">{owner.availability}</span>
        </motion.p>
      </div>

      <motion.div
        className="mt-auto pt-14"
        variants={variants}
        initial="hidden"
        animate="show"
        custom={reduced ? 0 : 1.35}
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
