"use client";

import { about } from "@/lib/content";

export default function AboutTab() {
  return (
    <section>
      <p className="meta-label">Operating system</p>
      <h2 className="mt-2 text-[clamp(1.9rem,3.5vw,2.6rem)] font-semibold leading-tight text-ink">
        About
      </h2>

      <hr className="ink-rule mt-8" />

      <div className="mt-10 grid gap-14 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {about.paragraphs.map((paragraph, i) => (
            <p key={i} className="max-w-[62ch] leading-[1.75] text-ink">
              {paragraph}
            </p>
          ))}
        </div>

        <aside>
          <p className="meta-label">Now</p>
          <ul className="mt-4 space-y-4 border-l border-ink-muted/30 pl-5">
            {about.now.map((item, i) => (
              <li key={i} className="leading-[1.65] text-ink-muted">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
