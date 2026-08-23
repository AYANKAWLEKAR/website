"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
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

type TransitionMode = "animated" | "reduced" | "instant";

// Transition choreography (~1.5s total when motion is allowed):
//  exit: intent dim (0–120ms) → dissolve up (120–850ms)
//  enter: breath (~130ms delay) → reveal rise (~500ms)
// "reduced" keeps the swap inside the spec's 150–200ms single-fade budget.
// "instant" serves deep links and hidden-document navigation.
const panelVariants: Variants = {
  initial: (mode: TransitionMode) =>
    mode === "animated" ? { opacity: 0, y: 14 } : { opacity: 0 },
  enter: (mode: TransitionMode) =>
    mode === "animated"
      ? {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.13, ease: [0.16, 1, 0.3, 1] },
        }
      : {
          opacity: 1,
          transition: { duration: mode === "instant" ? 0 : 0.09 },
        },
  exit: (mode: TransitionMode) =>
    mode === "animated"
      ? {
          opacity: [1, 0.85, 0],
          y: [0, -4, -20],
          filter: ["blur(0px)", "blur(0px)", "blur(1px)"],
          transition: { duration: 0.85, times: [0, 0.14, 1], ease: "easeIn" },
        }
      : {
          opacity: 0,
          transition: { duration: mode === "instant" ? 0 : 0.09 },
        },
};

export default function ScrollSite() {
  // instant marks swaps that must not animate: the deep-link adoption and
  // navigation while the document is hidden (rAF is suspended there, and an
  // animated exit would wedge mid-transition).
  const [nav, setNav] = useState<{ tab: TabId; instant: boolean }>({
    tab: "home",
    instant: true,
  });
  const [focusedTab, setFocusedTab] = useState<TabId | null>(null);
  const reduced = useReducedMotion();
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map());
  const panelRef = useRef<HTMLDivElement>(null);
  const userNavigated = useRef(false);

  const active = nav.tab;
  const mode: TransitionMode = nav.instant
    ? "instant"
    : reduced
      ? "reduced"
      : "animated";

  // Deep-link support: #experience etc. — applied without a transition.
  // The hash is only readable client-side; a one-time post-hydration sync
  // is the standard way to adopt it without an SSR mismatch.
  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "") as TabId;
    if (TABS.some((t) => t.id === fromHash)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNav({ tab: fromHash, instant: true });
    }
  }, []);

  const selectTab = useCallback(
    (id: TabId) => {
      if (id === active) return;
      userNavigated.current = true;
      setNav({ tab: id, instant: document.hidden });
      window.history.replaceState(null, "", `#${id}`);
      if (!reduced && !document.hidden) {
        window.dispatchEvent(new CustomEvent(SMOKE_EVENT));
      }
    },
    [active, reduced]
  );

  // Browser back/forward and manual hash edits also switch tabs.
  useEffect(() => {
    const onHashChange = () => {
      const fromHash = window.location.hash.replace("#", "") as TabId;
      if (TABS.some((t) => t.id === fromHash)) selectTab(fromHash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [selectTab]);

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
  const rovingTab = focusedTab ?? active;

  return (
    <div className="scroll-content">
      <SmokeCanvas />
      <PetalCanvas />

      <header className="relative z-30">
        <h1 className="sr-only">Ayan Kawlekar</h1>
        <nav aria-label="Sections">
          <div
            role="tablist"
            aria-label="Site sections"
            className="flex flex-wrap items-center gap-x-7 gap-y-1 border-b border-ink-muted/25 md:gap-x-10"
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
                  aria-controls={isActive ? `panel-${tab.id}` : undefined}
                  tabIndex={rovingTab === tab.id ? 0 : -1}
                  onClick={() => selectTab(tab.id)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  onFocus={() => setFocusedTab(tab.id)}
                  onBlur={() => setFocusedTab(null)}
                  className={`relative inline-flex min-h-11 items-center font-body text-[0.82rem] uppercase tracking-[0.22em] transition-colors duration-200 ${
                    isActive ? "text-ink" : "text-ink-faint hover:text-ink-muted"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-seal"
                      aria-hidden="true"
                      className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-vermilion"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="tab-ink"
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px bg-ink"
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
        <AnimatePresence mode="wait" initial={false} custom={mode}>
          <motion.div
            key={active}
            ref={panelRef}
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            tabIndex={-1}
            className="pt-10 outline-none md:pt-14"
            custom={mode}
            variants={panelVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            onAnimationComplete={(definition) => {
              if (definition !== "enter") return;
              if (!userNavigated.current) return;
              userNavigated.current = false;
              // Move focus into the incoming panel — but never yank it from
              // a user who has already moved elsewhere during the transition.
              const ae = document.activeElement;
              const stillOnTrigger =
                ae === document.body || ae === tabRefs.current.get(active);
              if (stillOnTrigger) {
                panelRef.current?.focus({ preventScroll: true });
              }
            }}
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 mt-20">
        <hr className="ink-rule" />
        <p className="meta-label mt-4">
          Ayan Kawlekar — {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
