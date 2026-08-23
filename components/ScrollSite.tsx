"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import HomeTab from "@/components/tabs/HomeTab";
import ExperienceTab from "@/components/tabs/ExperienceTab";
import ProjectsTab from "@/components/tabs/ProjectsTab";
import AboutTab from "@/components/tabs/AboutTab";
import ContactTab from "@/components/tabs/ContactTab";
import PetalCanvas from "@/components/PetalCanvas";
import SmokeCanvas, { SMOKE_EVENT } from "@/components/SmokeCanvas";

const TABS = [
  { id: "home", label: "Home", panel: HomeTab },
  { id: "experience", label: "Experience", panel: ExperienceTab },
  { id: "projects", label: "Projects", panel: ProjectsTab },
  { id: "about", label: "About", panel: AboutTab },
  { id: "contact", label: "Contact", panel: ContactTab },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ScrollSite() {
  const [active, setActive] = useState<TabId>("home");
  const reduced = useReducedMotion();
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map());
  const panelRef = useRef<HTMLDivElement>(null);
  const userNavigated = useRef(false);

  // Deep-link support: #experience etc.
  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "") as TabId;
    if (TABS.some((t) => t.id === fromHash)) setActive(fromHash);
  }, []);

  const selectTab = useCallback(
    (id: TabId) => {
      if (id === active) return;
      userNavigated.current = true;
      setActive(id);
      window.history.replaceState(null, "", `#${id}`);
      if (!reduced) {
        window.dispatchEvent(new CustomEvent(SMOKE_EVENT));
      }
    },
    [active, reduced]
  );

  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next !== null) {
      e.preventDefault();
      tabRefs.current.get(TABS[next].id)?.focus();
    }
  };

  const ActivePanel = TABS.find((t) => t.id === active)!.panel;

  // Transition choreography (~1.5s total when motion is allowed):
  //  exit: intent dim (0–120ms) → dissolve up (120–850ms)
  //  enter: breath (~130ms delay) → reveal rise (~500ms)
  const exitProps = reduced
    ? { opacity: 0, transition: { duration: 0.18 } }
    : {
        opacity: [1, 0.85, 0],
        y: [0, -4, -20],
        filter: ["blur(0px)", "blur(0px)", "blur(2px)"],
        transition: {
          duration: 0.85,
          times: [0, 0.14, 1],
          ease: "easeIn" as const,
        },
      };

  const enterInitial = reduced ? { opacity: 0 } : { opacity: 0, y: 14 };
  const enterAnimate = reduced
    ? { opacity: 1, transition: { duration: 0.18 } }
    : {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: 0.13,
          ease: [0.16, 1, 0.3, 1] as const,
        },
      };

  return (
    <div className="scroll-content">
      <SmokeCanvas />
      <PetalCanvas />

      <header className="relative z-10">
        <nav aria-label="Sections">
          <div
            role="tablist"
            aria-label="Site sections"
            className="flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-ink-muted/25 pb-3 md:gap-x-10"
          >
            {TABS.map((tab, i) => {
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    if (el) tabRefs.current.set(tab.id, el);
                  }}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(tab.id)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`relative pb-1 font-body text-[0.82rem] uppercase tracking-[0.22em] transition-colors duration-200 ${
                    isActive
                      ? "text-ink"
                      : "text-ink-faint hover:text-ink-muted"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-seal"
                      aria-hidden="true"
                      className="absolute -left-3.5 top-[0.42em] h-1.5 w-1.5 rotate-45 bg-vermilion"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="tab-ink"
                      aria-hidden="true"
                      className="absolute -bottom-[calc(0.75rem+1px)] left-0 right-0 h-px bg-ink"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            ref={panelRef}
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            tabIndex={-1}
            className="pt-10 outline-none md:pt-14"
            initial={enterInitial}
            animate={enterAnimate}
            exit={exitProps}
            onAnimationComplete={(definition) => {
              // Fires for both exit and enter; only act on the enter animation
              // (opacity: 1) so focus lands on the incoming panel.
              const isEnter =
                typeof definition === "object" &&
                definition !== null &&
                "opacity" in definition &&
                definition.opacity === 1;
              if (isEnter && userNavigated.current) {
                userNavigated.current = false;
                panelRef.current?.focus({ preventScroll: true });
              }
            }}
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-20">
        <hr className="ink-rule" />
        <p className="meta-label mt-4">
          Ayan Kawlekar — {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
