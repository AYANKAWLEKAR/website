import { chromium } from "playwright";

const OUT = process.env.OUT_DIR;
const consoleErrors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1600); // hero staged reveal completes
await page.screenshot({ path: `${OUT}/01-hero-1440.png` });

// Generate petals with mouse movement, capture mid-trail
await page.mouse.move(400, 400);
for (let i = 0; i <= 30; i++) {
  await page.mouse.move(400 + i * 22, 400 + Math.sin(i / 3) * 90);
  await page.waitForTimeout(16);
}
await page.screenshot({ path: `${OUT}/02-petal-trail.png` });

// Smoke transition frames: click Experience, sample the 1.5s timeline
await page.click('#tab-experience');
const marks = [180, 420, 700, 950, 1250, 1700];
let prev = 0;
for (const t of marks) {
  await page.waitForTimeout(t - prev);
  prev = t;
  await page.screenshot({ path: `${OUT}/03-smoke-${String(t).padStart(4, "0")}ms.png` });
}

// Rapid tab clicking — race check
for (const id of ["projects", "about", "home", "contact", "experience", "projects"]) {
  await page.click(`#tab-${id}`);
  await page.waitForTimeout(90);
}
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/04-after-rapid-clicks.png` });

// Keyboard navigation: focus tablist, arrow to About, Enter
await page.click("#tab-projects");
await page.waitForTimeout(1800);
await page.keyboard.press("ArrowRight");
const focused = await page.evaluate(() => document.activeElement?.id);
await page.keyboard.press("Enter");
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}/05-keyboard-nav.png` });
const focusAfter = await page.evaluate(() => document.activeElement?.id || document.activeElement?.getAttribute("role"));

// Tablet and mobile
await page.setViewportSize({ width: 768, height: 1024 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1600);
await page.screenshot({ path: `${OUT}/06-tablet-768.png` });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1600);
await page.screenshot({ path: `${OUT}/07-mobile-390.png` });
await page.click("#tab-experience");
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}/08-mobile-experience.png` });

// Horizontal overflow check at each width
const overflow = {};
for (const w of [1440, 768, 390]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(400);
  overflow[w] = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

// Reduced motion: fresh context
const rmContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const rmPage = await rmContext.newPage();
await rmPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
await rmPage.waitForTimeout(700);
const t0 = Date.now();
await rmPage.click("#tab-about");
await rmPage.waitForTimeout(450);
await rmPage.screenshot({ path: `${OUT}/09-reduced-motion-about.png` });
const rmCanvases = await rmPage.evaluate(() => ({
  smokeW: document.querySelector(".smoke-canvas")?.width ?? "absent",
  petalW: document.querySelector(".petal-canvas")?.width ?? "absent",
}));

console.log(JSON.stringify({
  consoleErrors,
  arrowFocusMovedTo: focused,
  focusAfterEnterTransition: focusAfter,
  horizontalOverflowPx: overflow,
  reducedMotionCanvasDims: rmCanvases,
}, null, 2));

await browser.close();
