import { chromium } from "@playwright/test";

const url = process.env.AUDIT_URL || "http://localhost:3000/";
const browser = await chromium.launch();
const problems = [];

// ---------- 1) Movimento normal ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

await page.goto(url, { waitUntil: "networkidle" });

const animations = await page.evaluate(() => {
  const read = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return { selector, found: false };
    const cs = getComputedStyle(el);
    return {
      selector,
      found: true,
      name: cs.animationName,
      duration: cs.animationDuration,
      iteration: cs.animationIterationCount,
    };
  };
  return {
    items: [
      read(".logo-orbit"),
      read(".logo-core"),
      read(".logo-shine"),
      read(".anim-flow"),
      read(".anim-node"),
    ],
    parallaxLayers: document.querySelectorAll(".parallax-layer").length,
  };
});

for (const item of animations.items) {
  if (!item.found) {
    problems.push(`animacao ausente do DOM: ${item.selector}`);
    continue;
  }
  if (item.name === "none") problems.push(`sem animacao: ${item.selector}`);
}

// ---------- 2) Parallax realmente varia com o scroll ----------
const readParallax = () =>
  page.evaluate(() =>
    [...document.querySelectorAll(".parallax-layer")].map(
      (el) => el.style.getPropertyValue("--parallax-y") || "0px",
    ),
  );

const before = await readParallax();
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(350);
const after = await readParallax();

const moved = before.some((v, i) => v !== after[i]);
if (!moved) problems.push(`parallax nao reagiu ao scroll (antes ${before} / depois ${after})`);

// ---------- 3) Diagrama do hero presente e acessivel ----------
const diagram = await page.evaluate(() => {
  const svg = document.querySelector('svg[aria-label*="ciclo de tráfego pago"]');
  if (!svg) return { found: false };
  const box = svg.getBoundingClientRect();
  return {
    found: true,
    label: svg.getAttribute("aria-label").slice(0, 50),
    width: Math.round(box.width),
    height: Math.round(box.height),
    nodes: svg.querySelectorAll(".anim-node").length,
  };
});
if (!diagram.found) problems.push("diagrama do hero nao encontrado");
else if (diagram.width === 0 || diagram.height === 0) problems.push("diagrama sem dimensao visivel");
if (diagram.found && diagram.nodes !== 4) problems.push(`diagrama com ${diagram.nodes} nos (esperado 4)`);

// ---------- 4) Logo animada apenas onde pedido ----------
const logoMarks = await page.evaluate(() => {
  const marks = [...document.querySelectorAll("svg")].filter((s) =>
    s.querySelector(".logo-core, .logo-orbit"),
  );
  return marks.length;
});

await page.screenshot({ path: ".audit/hero-motion.png" });

// ---------- 5) reduced-motion desliga tudo ----------
const rmCtx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const rmPage = await rmCtx.newPage();
await rmPage.goto(url, { waitUntil: "networkidle" });
const reduced = await rmPage.evaluate(() => {
  const el = document.querySelector(".logo-orbit");
  const flow = document.querySelector(".anim-flow");
  const layer = document.querySelector(".parallax-layer");
  return {
    logoOrbit: el ? getComputedStyle(el).animationName : "ausente",
    flow: flow ? getComputedStyle(flow).animationName : "ausente",
    parallaxTranslate: layer ? getComputedStyle(layer).translate : "ausente",
  };
});

if (reduced.logoOrbit !== "none" && reduced.logoOrbit !== "ausente")
  problems.push(`reduced-motion: logo ainda anima (${reduced.logoOrbit})`);
if (reduced.flow !== "none" && reduced.flow !== "ausente")
  problems.push(`reduced-motion: fluxo ainda anima (${reduced.flow})`);
if (reduced.parallaxTranslate !== "none" && reduced.parallaxTranslate !== "ausente")
  problems.push(`reduced-motion: parallax ainda desloca (${reduced.parallaxTranslate})`);

// ---------- 6) Layout nao quebra com o parallax ----------
const overflow = await rmPage.evaluate(() => {
  return document.documentElement.scrollWidth - document.documentElement.clientWidth;
});
if (overflow > 2) problems.push(`overflow horizontal: ${overflow}px`);

if (consoleErrors.length) problems.push(`console: ${consoleErrors.slice(0, 3).join(" | ")}`);

console.log(JSON.stringify({ animations, before, after, diagram, logoMarks, reduced, overflow }, null, 2));
console.log("\n=== RESUMO ===");
console.log(problems.length ? problems.join("\n") : "Nenhum problema encontrado");

await browser.close();
process.exit(problems.length ? 1 : 0);