import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.AUDIT_URL ?? "http://localhost:3000";
const problems = [];
const note = (message) => {
  problems.push(message);
  console.log(`PROBLEMA: ${message}`);
};

const browser = await chromium.launch();

for (const device of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    locale: "pt-BR",
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__vitals.lcp = Math.max(window.__vitals.lcp, entry.startTime);
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const vitals = await page.evaluate(() => window.__vitals);
  const lcp = Math.round(vitals.lcp);
  const cls = Number(vitals.cls.toFixed(4));
  console.log(`${device.name}: LCP ${lcp}ms · CLS ${cls}`);
  if (lcp > 2500) note(`${device.name}: LCP ${lcp}ms acima de 2500ms`);
  if (cls > 0.1) note(`${device.name}: CLS ${cls} acima de 0.1`);

  const ui = await page.evaluate(() => {
    const small = [...document.querySelectorAll("a, button, [role='button']")]
      .map((node) => {
        const rect = node.getBoundingClientRect();
        const label = node.textContent?.trim().slice(0, 30) || node.getAttribute("aria-label") || "";
        return { label: `${node.tagName.toLowerCase()} "${label}" ${Math.round(rect.width)}x${Math.round(rect.height)}`, w: rect.width, h: rect.height };
      })
      .filter((item) => item.h > 0 && item.w > 0 && !(item.h >= 24 && item.w >= 24))
      .map((item) => item.label);
    const noAlt = [...document.querySelectorAll("img")].filter((img) => !img.hasAttribute("alt")).length;
    const clipped = [...document.querySelectorAll("h1, h2, h3, p, a, button")]
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        if (node.classList.contains("sr-only")) return false;
        const style = getComputedStyle(node);
        if (style.overflowX === "visible" && style.textOverflow !== "ellipsis") return false;
        return node.scrollWidth > node.clientWidth + 2;
      })
      .map((node) => `${node.tagName.toLowerCase()} "${node.textContent?.trim().slice(0, 40)}"`);
    return { small, noAlt, clipped };
  });

  if (ui.small.length) console.log(`${device.name}: alvos abaixo de 24px -> ${ui.small.join(" | ")}`);
  if (ui.noAlt) note(`${device.name}: ${ui.noAlt} imagem(ns) sem alt`);
  if (ui.clipped.length) note(`${device.name}: texto cortado -> ${ui.clipped.join(" | ")}`);

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  for (const violation of results.violations) {
    note(`${device.name} a11y [${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length}x)`);
    for (const node of violation.nodes) {
      console.log(`  ${node.target.join(" ")} -> ${node.failureSummary?.replace(/\s+/g, " ").slice(0, 220)}`);
    }
  }

  await context.close();
}

console.log("\n=== RESUMO ===");
console.log(problems.length ? problems.join("\n") : "Nenhum problema encontrado");

await browser.close();
