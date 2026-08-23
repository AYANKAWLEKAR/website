# Master Build Prompt — Interactive Parchment-Scroll Portfolio

> **Use this document as the full implementation brief for Claude Code.**
>
> Before changing code: read this entire file, inspect the existing repository and tech stack, and return a concise implementation plan covering architecture, files to modify, asset strategy, and the order of work. Then implement in small, testable increments and visually review the result in a real browser.

---

## 1. Objective

Build a visually memorable personal portfolio website that looks and feels like an **aged parchment scroll** interpreted through a modern, editorial digital experience.

The site should make a recruiter, founder, engineer, or potential collaborator think:

> "This person is technically serious, has distinct taste, and actually builds."

The design must be polished, immersive, responsive, accessible, and fast. It must **not** look like a generic SaaS dashboard, an AI-generated card grid, an anime fan page, a video-game interface, or a cliché cyberpunk site.

### Owner identity and context

- UC Berkeley applied mathematics student
- Builds AI agents, ML/data systems, and full-stack products
- Interested in AI/ML, robotics systems, finance, startups, and technical systems
- Wants the site to communicate technical depth, ambition, originality, and strong visual taste

### Primary site goal

Present the owner's identity, experience, work, current interests, and contact information in a way that is memorable but still easy to skim in 20–30 seconds.

---

## 2. Required tools and setup

### Claude Code plugin

Install and use Anthropic's **Frontend Design** plugin as the design/art-direction layer:

```text
/plugin install frontend-design@anthropics/claude-code
```

Use it to make deliberate choices about:

- Typography
- Parchment texture and backgrounds
- Layout hierarchy and whitespace
- Themes and color restraint
- Motion and transitions
- Responsive presentation

### Recommended frontend stack

Assume **Next.js + TypeScript + Tailwind CSS**, unless the existing project uses another stack. Preserve the repository's existing framework and conventions where possible.

Install the motion/particle tooling:

```bash
npm install motion gsap pixi.js
npm install @tsparticles/react @tsparticles/slim
```

### Tool responsibilities

| Tool | Use it for | Do not use it for |
|---|---|---|
| `motion` / Motion for React | React component entrance/exit choreography, route/tab lifecycle, fade/position transitions, hover states, reduced-motion fallbacks | Large particle-field simulation or GPU-heavy smoke |
| `gsap` | Optional tightly timed motion timelines, special micro-interactions, coordinating multi-part effects | Default page transitions if Motion handles them cleanly |
| `pixi.js` | Optional WebGL/canvas particle layer for the signature smoke effect | Ordinary DOM layout or text animation |
| `@tsparticles/react` | Optional configurable particle starting point | Use only if a bespoke cursor trail is not implemented; avoid stock-looking particle presets |
| Custom Canvas API | Preferred implementation for the lightweight cherry-blossom cursor trail | Complex smoke simulation if Canvas performance becomes poor |
| Chrome DevTools MCP | Browser visual QA: responsive layout, console errors, network failures, performance, overflow, mobile testing | Replacing thoughtful design review |

### Recommended quality tooling

If available in the repository, use:

- Chrome DevTools MCP for visual, console, network, and responsive inspection
- Playwright for repeatable visual and interaction smoke tests
- Axe or an accessibility MCP for deterministic accessibility checks

---

## 3. Visual direction

### Core concept

The entire site is a single aged parchment scroll: **quiet physical paper texture, dark ink, restrained vermilion details, and rare sakura-pink particles**.

It should feel like a modern, tasteful digital interpretation of an archival Japanese manuscript—not a literal historical reconstruction, an anime theme, a "dojo" UI, a game HUD, or a collection of unrelated Japanese symbols.

Use material and compositional cues—paper, ink, floral movement, meticulous spacing, visual rhythm—rather than costume-like decoration.

### Design personality

- Editorial
- Cinematic but restrained
- Technical
- Calm and intentional
- Slightly experimental
- High signal
- Premium, not ornate
- Modern digital craftsmanship over decorative clutter

### Non-negotiable exclusions

Do **not** use:

- Generic purple gradients
- Glassmorphism
- Neon cyberpunk styling
- Endless rounded cards
- Generic SaaS dashboard composition
- Generic "AI-powered" badges
- Stock anime or samurai imagery
- Random Japanese/Chinese characters or invented translations
- Fake statistics
- Overuse of parallax
- Scroll-jacking
- Audio autoplay
- Full-screen explosions, fire, or combat effects
- Constant animation of every decorative element

---

## 4. Color system and parchment CSS

### Base color tokens

Use these as a starting point. You may tune them slightly after reviewing them in-browser, but retain the restrained ink / parchment / vermilion / sakura relationship.

```css
:root {
  --paper: #e7d3a5;
  --paper-light: #f1e2bd;
  --paper-deep: #b99259;
  --paper-shadow: #8c6239;
  --ink: #24180f;
  --ink-muted: #604a35;
  --ink-faint: #8c7455;
  --vermilion: #9f271d;
  --vermilion-dark: #721d16;
  --sakura: #d37b91;
  --sakura-light: #efb7c3;
  --smoke: #31261d;
  --smoke-light: #807060;
}
```

### Parchment surface CSS

Build the parchment from subtle layers. Preserve readability: body content belongs in a quieter central region with low texture contrast.

(See `app/globals.css` — `.scroll-surface`, `.scroll-surface::before`, `.scroll-surface::after`, `.scroll-content`.)

### Visual rules

- The parchment texture must remain **subtle**. It should be noticed after looking, not impair reading on first glance.
- The darkest texture and aging effects belong near edges and corners, not behind paragraphs.
- Use vermilion only for active states, tiny stamps/seals, selected tab details, or subtle emphasis.
- Sakura pink belongs almost exclusively to petals and should never become a broad site background.
- Use thin ink rules, intentional margins, and editorial alignment rather than card-heavy composition.
- Avoid excessive border radius. If surfaces need corners, use small radii or sharp edges.

---

## 5. Typography

### Type hierarchy

| Element | Font direction | Notes |
|---|---|---|
| Owner name | **Yuji Mai** or a properly licensed custom Latin calligraphy wordmark/SVG | Use only for the owner's name and very short display moments. |
| Navigation labels | Restrained serif or small-caps sans | Small, tracked, ink-colored, easy to scan |
| Section headings | Elegant serif | Strong hierarchy without competing with the name |
| Experience role/company | Legible serif or clean sans, medium/semibold | Must scan quickly |
| Experience sentences | Conventional, highly legible serif or sans | Never use calligraphy/display font for paragraphs |
| Dates/technical metadata | Narrow sans or monospace | Small and subdued, not ornamental |

### Font recommendations

- Display/name: `Yuji Mai`
- Body: `Noto Serif`, `Noto Sans`, `Source Serif 4`, or similarly legible alternative
- Metadata: `IBM Plex Mono` or similar restrained monospace

### Typography rules

- Use the calligraphic typeface only for the owner's name; never for paragraph copy or nav.
- Minimum body text: 16px on mobile; 16–18px on desktop.
- Maintain 1.6–1.75 line height for experience descriptions.
- Use strong text contrast against parchment.
- Favor oversized display text, strong line breaks, and intentional asymmetry in the hero.
- Avoid default Inter-only styling and avoid making all text decorative.

---

## 6. Site information architecture

### Primary navigation

Use tabs or tab-like navigation for: Home, Experience, Projects, About, Contact.

The tabs should feel like content sections of one scroll, not completely disconnected visual worlds. Preserve URL navigation/deep links if the existing site uses routes.

### Home / hero

- Owner's name at the top in the calligraphy display font
- A custom monochrome katana SVG immediately below as an underline
- One sharp positioning line describing the owner's focus
- Optional concise current-focus/location metadata
- A full-height first impression that feels authored and editorial
- The hero must communicate identity in the first three seconds

### Experience

- Experience entries must be quickly scannable
- Use a small custom inline **shuriken SVG** as the bullet marker
- Role / company / dates should have a clear hierarchy
- Supporting sentences use the legible body font
- Use outcomes, scale, technical details, and impact concisely

### Projects

Treat projects as editorial artifacts / case-study exhibits, not generic rounded cards. Each can include: index number, project title, one-sentence thesis, technical stack/method metadata, result or meaningful outcome, optional preview visual.

### About

Concise "operating system" section: background and technical direction, what kinds of systems/products the owner builds, current intellectual interests. Avoid a long chronological autobiography.

### Contact

Low-friction but visually distinctive CTA: Email / LinkedIn / GitHub links. Keep it legible and usable. Do not hide contact behind a decorative interaction.

### Optional "Now" section

Current projects, learning, research direction, reading, or experiments. Keep it honest and concise.

---

## 7. Katana underline

- Original or properly licensed **SVG** katana asset; simple one-color ink drawing.
- Desktop: ~45–65% of hero width; mobile: cap ~300–360px.
- Base color: near-black ink; optional nearly imperceptible vermilion accent.
- Initial reveal: 450–650ms, as if the blade is drawn or inked across the page.
- Hover: subtle 2–4px shift and restrained highlight.
- Respect `prefers-reduced-motion`: static katana or short fade-in.
- No metallic gaming gradients, repeated swinging, sounds, or oversized weapons.

---

## 8. Shuriken experience bullets

- Custom inline SVG shuriken (no Unicode star/emoji); minimalist, ink-like, consistent with the katana.
- Size 12–16px; base ink; active/hover vermilion, sparingly.
- Entry/hover: rotate approximately 45° once, then stop.
- Align optical center with the first text baseline. No constant spinning.

---

## 9. Sakura petal cursor trail

- Lightweight **custom Canvas API** layer (bespoke, not a stock preset).
- Spawn only while pointer movement is occurring; one petal every **35–55ms** while moving, slightly behind the cursor.
- Cap active petals at ~**15–25**; randomize scale, rotation, drift, fall speed, opacity.
- Petals drift on simulated wind, rotate gently, fall, fade out; lifespan **700–1,200ms**.
- Several subtle pink/muted rose variants, not neon pink.
- `position: fixed; inset: 0; z-index: 50; pointer-events: none;`
- Disable on touch-only devices, `prefers-reduced-motion: reduce`, and low-end devices. No keyboard-triggered petals.

---

## 10. Signature smoke tab transition

Outgoing content goes **up in smoke**; incoming content fades in. Total ~**1.5 seconds**. Visual language: dissipating incense/ink smoke — warm gray-brown, soft, upward, restrained. Not fire or explosions.

### Architecture

- **Motion for React** with `AnimatePresence mode="wait"` for tab lifecycle.
- Separate lightweight Canvas (or Pixi) particle layer for smoke, `pointer-events: none`.
- Keep outgoing content mounted until its exit completes.

### Timing

| Phase | Time | Behavior |
|---|---:|---|
| Intent | 0–120ms | Click registers; nav marker shifts; outgoing content dims subtly |
| Dissolve | 120–850ms | Content fades, rises slightly, breaks into layered upward smoke |
| Breath | 850–980ms | Short parchment-and-smoke beat |
| Reveal | 900–1,500ms | Incoming content fades in and rises 8–16px while smoke dissipates |

### Reduced-motion fallback

No particle smoke, no petal trail; simple **150–200ms** opacity fade; preserve semantics/keyboard behavior and focus management.

### Constraints

No fire/flames, no explosions, no large full-screen blur, no page freezes. Works under rapid repeated clicks without state races. Smooth on typical laptop hardware; simplified on mobile.

---

## 11. Motion system

- One major signature interaction: the smoke tab transition. All other motion subtle and functional.
- Respect `prefers-reduced-motion` globally.
- 150–350ms for micro-interactions; 1.5s only for the signature transition.
- Moments: hero staged fade/slide, katana draw, tab ink marker, shuriken one-time rotation, small link position/opacity changes.
- Avoid: infinite motion, attention-grabbing parallax, motion during reading, cursor effects interfering with selection.

---

## 12. Accessibility and performance requirements

### Accessibility

Semantic HTML, correct heading hierarchy, full keyboard navigation, visible focus states on parchment, adequate contrast, never color-only state, `prefers-reduced-motion` respected, decorative canvases `pointer-events: none` + `aria-hidden="true"`, focus moved logically after tab navigation, decorative SVGs silent for screen readers.

### Performance

Minimal JS payload; dynamic-load heavy libs only if used; CSS-based texture; limited particles; efficient rAF stopped when tab hidden; tested on mobile; content readable before effects initialize.

### Responsive breakpoints to test

Desktop 1440px, tablet 768px, mobile 390px. Mobile: preserve the atmosphere, shrink the katana, reduce particles, keep tabs tappable, adapt hierarchy intentionally.

---

## 13. Final implementation plan

1. Audit existing repository
2. Base visual system (fonts, tokens, parchment surface, spacing, nav, responsive layout)
3. Information architecture and content shell
4. Custom vector assets (katana, shuriken)
5. Subtle basic motion
6. Petal cursor trail
7. Smoke transition
8. Visual QA and polish at 1440/768/390px

---

## 14–15. Execution and QA prompts

See repository history; the final QA pass scores: first-three-seconds impact, originality, material coherence, typography, hero clarity, katana integration, shuriken alignment, sakura trail restraint, smoke transition quality, mobile intentionality, accessibility/reduced-motion, performance/console cleanliness — then implements the three highest-impact improvements.

---

## 16. Completion checklist

- [ ] Frontend Design plugin installed and used
- [ ] Parchment background is subtle, layered, and readable
- [ ] Owner name uses calligraphic display styling only
- [ ] Katana is a custom/properly licensed SVG underline
- [ ] Body/experience text is conventional and easy to skim
- [ ] Experience bullets use a custom shuriken SVG
- [ ] Sakura trail is lightweight, capped, non-interactive, and organic
- [ ] Petals disable on touch/reduced-motion contexts
- [ ] Tab transition is approximately 1.5 seconds
- [ ] Outgoing tab dissolves upward into smoke before incoming tab appears
- [ ] Incoming tab fades/rises in with a calm reveal
- [ ] Reduced-motion fallback uses only a short fade
- [ ] Mobile design is intentionally adapted
- [ ] Keyboard navigation and focus behavior work
- [ ] Browser visual QA completed at desktop, tablet, and mobile widths
- [ ] Console/network checks are clean
- [ ] No unlicensed stock/screenshot asset has been added
- [ ] The final result feels authored, restrained, and memorable
