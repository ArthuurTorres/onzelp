import { chromium } from "@playwright/test";

const url = process.env.AUDIT_URL || "http://localhost:3000/";
const browser = await chromium.launch();
const problems = [];

// ---------- 1) Constelacao: estrutura e particulas ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

await page.goto(url, { waitUntil: "networkidle" });

const structure = await page.evaluate(() => {
  const svg = document.querySelector('svg[aria-label*="Constelacao"]');
  if (!svg) return { found: false };
  return {
    found: true,
    nodes: svg.querySelectorAll('[role="button"]').length,
    paths: svg.querySelectorAll("path.field-path").length,
    particles: svg.querySelectorAll("animateMotion").length,
    orbitalRings: svg.querySelectorAll(".orbital-ring").length,
    ariaLabel: svg.getAttribute("aria-label"),
  };
});

if (!structure.found) {
  problems.push("constelacao: SVG nao encontrado no DOM");
} else {
  if (structure.nodes < 6) problems.push(`constelacao: ${structure.nodes} nos (esperado >= 6)`);
  if (structure.paths < 8) problems.push(`constelacao: ${structure.paths} caminhos (esperado >= 8)`);
  if (structure.particles < 8) problems.push(`constelacao: ${structure.particles} particulas (esperado >= 8)`);
  if (structure.orbitalRings < 1) problems.push(`constelacao: sem aneis orbitais`);
}

// ---------- 2) Anel orbital tem animacao ----------
const orbital = await page.evaluate(() => {
  const el = document.querySelector(".orbital-ring");
  if (!el) return { found: false };
  return { found: true, name: getComputedStyle(el).animationName };
});
if (orbital.found && orbital.name === "none")
  problems.push("sem animacao: .orbital-ring");

// ---------- 3) Parallax varia com scroll ----------
const readParallax = () =>
  page.evaluate(() =>
    [...document.querySelectorAll(".parallax-layer")].map(
      (el) => el.style.getPropertyValue("--parallax-y") || "0px"
    )
  );

const before = await readParallax();
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(350);
const after = await readParallax();

if (!before.some((v, i) => v !== after[i]))
  problems.push("parallax: nenhum deslocamento apos scroll");

// ---------- 4) reduced-motion ----------
const rmCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const rmPage = await rmCtx.newPage();
await rmPage.goto(url, { waitUntil: "networkidle" });

const reduced = await rmPage.evaluate(() => {
  const orbital = document.querySelector(".orbital-ring");
  const fieldPath = document.querySelector(".field-path");
  const layer = document.querySelector(".parallax-layer");
  return {
    orbital: orbital ? getComputedStyle(orbital).animationName : "ausente",
    fieldPath: fieldPath ? getComputedStyle(fieldPath).animationName : "ausente",
    parallax: layer ? getComputedStyle(layer).translate : "ausente",
  };
});

if (reduced.orbital !== "none" && reduced.orbital !== "ausente")
  problems.push(`reduced-motion: orbital ainda anima (${reduced.orbital})`);
if (reduced.fieldPath !== "none" && reduced.fieldPath !== "ausente")
  problems.push(`reduced-motion: campo ainda anima (${reduced.fieldPath})`);
if (reduced.parallax !== "none" && reduced.parallax !== "ausente")
  problems.push(`reduced-motion: parallax ainda desloca (${reduced.parallax})`);

// ---------- 5) Sem overflow ----------
const overflow = await rmPage.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth
);
if (overflow > 2) problems.push(`overflow horizontal: ${overflow}px`);

if (consoleErrors.length)
  problems.push(`console: ${consoleErrors.slice(0, 3).join(" | ")}`);

// ---------- 6) Output ----------
const debug = { structure, orbital, before, after, reduced };
console.log(JSON.stringify(debug, null, 2));
console.log("\n=== RESUMO ===");
console.log(problems.length ? problems.join("\n") : "Nenhum problema encontrado");

await browser.close();
process.exit(problems.length ? 1 : 0);
