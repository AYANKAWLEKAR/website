"use client";

import Shuriken from "@/components/Shuriken";
import { experience } from "@/lib/content";

export default function ExperienceTab() {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="meta-label">Record of work</p>
          <h2 className="mt-2 text-[clamp(1.9rem,3.5vw,2.6rem)] font-semibold leading-tight text-ink">
            Experience
          </h2>
        </div>
        <a
          href="/pmresume.pdf"
          download="Ayan-Kawlekar-Resume.pdf"
          className="group inline-flex items-center gap-3 border border-ink-muted/60 px-5 py-2.5 font-meta text-[0.78rem] uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:border-vermilion hover:text-vermilion"
        >
          <svg
            viewBox="0 0 14 14"
            width="12"
            height="12"
            aria-hidden="true"
            className="fill-current"
          >
            <path d="M6.3 0.5 h1.4 v7.2 l2.6-2.6 1 1L7 10.4 2.7 6.1l1-1 2.6 2.6 Z M1.5 12 h11 v1.4 h-11 Z" />
          </svg>
          Download résumé — PDF
        </a>
      </div>

      <hr className="ink-rule mt-8" />

      <ul className="mt-2 divide-y divide-ink-muted/20">
        {experience.map((entry, i) => (
          <li
            key={i}
            className="group grid grid-cols-[1.5rem_1fr] gap-x-4 py-8 md:grid-cols-[1.5rem_1fr_auto]"
          >
            <div className="pt-[0.45em] text-ink transition-colors duration-300 group-hover:text-vermilion">
              <Shuriken />
            </div>
            <div>
              <h3 className="text-[1.15rem] font-semibold leading-snug text-ink">
                {entry.role}{" "}
                <span className="font-normal text-ink-muted">
                  / {entry.organization}
                </span>
              </h3>
              <p className="mt-2 max-w-[62ch] leading-[1.7] text-ink">
                {entry.summary}
              </p>
              <p className="mt-1 max-w-[62ch] leading-[1.7] text-ink-muted">
                {entry.detail}
              </p>
              <p className="mt-3 font-meta text-[0.72rem] tracking-[0.14em] text-ink-faint md:hidden">
                {entry.dates}
              </p>
            </div>
            <p className="hidden pt-[0.35em] font-meta text-[0.72rem] tracking-[0.14em] text-ink-faint md:block">
              {entry.dates}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
