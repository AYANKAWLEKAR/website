# website

This is the source code for my personal website — an interactive aged
parchment-scroll portfolio built with Next.js, TypeScript, Tailwind CSS,
and Motion.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Visual QA

With the dev server running:

```bash
OUT_DIR=./qa-shots node scripts/qa-visual.mjs
```

Captures the hero, petal cursor trail, smoke tab-transition timeline,
rapid-click behavior, keyboard navigation, tablet/mobile layouts, and a
reduced-motion pass; reports console errors and horizontal overflow.

## Structure

- `app/` — layout (fonts, metadata) and the single page
- `components/ScrollSite.tsx` — tab shell, navigation, smoke transition choreography
- `components/tabs/` — Home, Experience, Projects, About, Contact sections
- `components/KatanaUnderline.tsx`, `components/Shuriken.tsx` — original ink SVG assets
- `components/SmokeCanvas.tsx` — smoke transition canvas layer
- `components/PetalCanvas.tsx` — sakura cursor trail (currently unmounted)

## Fonts

- **Harukaze** (`app/fonts/harukaze.woff2`) — brush display face for the
  owner's name, by Andrie Nugrie (nugsproject.com). **Personal-use license
  only**; purchase a commercial license before any commercial use of this site.
- **Zen Old Mincho** — all other text, via Google Fonts (SIL OFL).
- `lib/content.ts` — all site copy (placeholders to fill in)
- `public/pmresume.pdf` — résumé served by the Experience tab's download button
