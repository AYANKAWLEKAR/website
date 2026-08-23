"use client";

import { projects } from "@/lib/content";

export default function ProjectsTab() {
  return (
    <section>
      <p className="meta-label">Selected exhibits</p>
      <h2 className="mt-2 text-[clamp(1.9rem,3.5vw,2.6rem)] font-semibold leading-tight text-ink">
        Projects
      </h2>

      <hr className="ink-rule mt-8" />

      <ol className="divide-y divide-ink-muted/20">
        {projects.map((project) => (
          <li key={project.index}>
            <article className="group grid gap-x-10 gap-y-3 py-10 transition-transform duration-300 ease-out hover:translate-x-1 md:grid-cols-[4rem_1fr]">
              <p
                aria-hidden="true"
                className="font-meta text-[0.85rem] tracking-[0.2em] text-ink-faint"
              >
                {project.index}
              </p>
              <div>
                <h3 className="text-[1.35rem] font-semibold leading-snug text-ink">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-transparent transition-colors duration-200 hover:border-vermilion hover:text-vermilion"
                  >
                    {project.title}
                    <span className="sr-only"> — GitHub repository (opens in a new tab)</span>
                  </a>
                </h3>
                <p className="mt-3 max-w-[58ch] leading-[1.7] text-ink">
                  {project.thesis}
                </p>
                <p className="mt-4 font-meta text-[0.78rem] uppercase tracking-[0.14em] text-ink-faint">
                  {project.stack}
                </p>
                <p className="mt-2 max-w-[58ch] text-[0.95rem] leading-[1.7] text-ink-muted">
                  {project.outcome}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
