import { chromium } from "playwright";

const OUT = process.env.OUT_DIR;
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

// 1. Deep link: #projects must render Projects instantly, no wedge
await page.goto("http://localhost:3000/#projects", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const deepLink = await page.evaluate(() => ({
  activeTab: document.querySelector('[role="tab"][aria-selected="true"]')?.id,
  panelId: document.querySelector('[role="tabpanel"]')?.id,
  panelOpacity: getComputedStyle(document.querySelector('[role="tabpanel"]')).opacity,
  h2: document.querySelector("h2")?.textContent,
}));
await page.screenshot({ path: `${OUT}/11-deeplink-projects.png` });

// 2. Shuriken hover rotation on experience rows (hash-change navigation
// exercises the new hashchange listener + animated transition)
await page.goto("http://localhost:3000/#experience");
await page.waitForTimeout(2100);
const before = await page.evaluate(
  () => getComputedStyle(document.querySelector("li.group svg")).transform
);
await page.hover("li.group h3");
await page.waitForTimeout(450);
const after = await page.evaluate(
  () => getComputedStyle(document.querySelector("li.group svg")).transform
);

// 3. Contrast token applied + h1 outline
const semantics = await page.evaluate(() => {
  const faint = getComputedStyle(document.documentElement).getPropertyValue("--ink-faint").trim();
  const h1 = document.querySelector("h1");
  return {
    inkFaint: faint,
    h1Text: h1?.textContent,
    h1SrOnly: h1 ? getComputedStyle(h1).position === "absolute" : null,
    headings: [...document.querySelectorAll("h1,h2,h3")].slice(0, 4).map((h) => h.tagName),
  };
});

// 4. Tap target heights
const tapTargets = await page.evaluate(() => {
  const tab = document.querySelector('[role="tab"]');
  return { tabHeight: tab?.getBoundingClientRect().height };
});

// 5. Fresh hero + transition frames at 1440
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1700);
await page.screenshot({ path: `${OUT}/12-hero-v2.png` });
await page.click("#tab-experience");
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/13-smoke-v2-dissolve.png` });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/14-smoke-v2-reveal.png` });
await page.waitForTimeout(900);

// petals v3
for (let i = 0; i <= 28; i++) {
  await page.mouse.move(380 + i * 26, 430 + Math.sin(i / 3) * 100);
  await page.waitForTimeout(16);
}
await page.screenshot({ path: `${OUT}/15-petals-v3.png` });

// 6. Mobile hero with new texture/vignette
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1700);
await page.screenshot({ path: `${OUT}/16-mobile-v2.png` });

console.log(JSON.stringify({ deepLink, shurikenTransform: { before, after }, semantics, tapTargets, consoleErrors: errors }, null, 2));
await browser.close();
