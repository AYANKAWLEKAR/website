"use client";

import { owner } from "@/lib/content";

const links = [
  { label: "Email", href: `mailto:${owner.email}`, display: owner.email },
  { label: "GitHub", href: owner.github, display: "github.com/AYANKAWLEKAR" },
  { label: "LinkedIn", href: owner.linkedin, display: "Placeholder — add profile URL" },
];

export default function ContactTab() {
  return (
    <section className="flex min-h-[60dvh] flex-col justify-center">
      <p className="meta-label">Correspondence</p>
      <h2 className="mt-2 max-w-[24ch] text-[clamp(1.9rem,3.5vw,2.6rem)] font-semibold leading-tight text-ink">
        If you are building something serious, write to me.
      </h2>

      <hr className="ink-rule mt-10 max-w-xl" />

      <ul className="mt-10 space-y-6">
        {links.map((link) => (
          <li key={link.label} className="flex flex-wrap items-baseline gap-x-8 gap-y-1">
            <span className="meta-label w-24">{link.label}</span>
            <a
              href={link.href}
              className="border-b border-ink-muted/50 pb-0.5 text-[1.05rem] text-ink transition-colors duration-200 hover:border-vermilion hover:text-vermilion"
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.display}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
