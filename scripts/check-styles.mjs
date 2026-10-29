import { chromium } from "@playwright/test";

const url = process.env.AUDIT_URL || "http://localhost:3000/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const requestsFailed = [];
const cssFailed = [];
page.on("requestfailed", (r) => {
  const entry = `${r.url()} :: ${r.failure()?.errorText}`;
  requestsFailed.push(entry);
  if (r.url().includes(".css")) cssFailed.push(entry);
});
page.on("response", (r) => {
  if (r.status() >= 400) {
    const entry = `${r.status()} ${r.url()}`;
    requestsFailed.push(entry);
    if (r.url().includes(".css")) cssFailed.push(entry);
  }
});

await page.goto(url, { waitUntil: "networkidle" });

const data = await page.evaluate(() => {
  const body = getComputedStyle(document.body);
  const h1 = document.querySelector("h1");
  const h1s = h1 ? getComputedStyle(h1) : null;
  const sheetCount = document.styleSheets.length;
  let rulesReachable = 0;
  for (const sheet of document.styleSheets) {
    try {
      rulesReachable += sheet.cssRules.length;
    } catch {
      rulesReachable = -1;
    }
  }
  return {
    sheets: sheetCount,
    rules: rulesReachable,
    bodyBg: body.backgroundColor,
    bodyColor: body.color,
    bodyFont: body.fontFamily.slice(0, 48),
    h1Font: h1s ? h1s.fontFamily.slice(0, 48) : null,
    h1Size: h1s ? h1s.fontSize : null,
    h1Color: h1s ? h1s.color : null,
    tailwindClassesApplied: !!document.querySelector(".shell"),
    shellMaxWidth: (() => {
      const el = document.querySelector(".shell");
      return el ? getComputedStyle(el).maxWidth : null;
    })(),
  };
});

await page.screenshot({ path: ".audit/hero-top.png" });

const ok =
  cssFailed.length === 0 &&
  data.sheets > 0 &&
  data.rules > 0 &&
  data.bodyBg !== "rgba(0, 0, 0, 0)" &&
  data.shellMaxWidth === "1200px" &&
  data.h1Font?.includes("Sora");

console.log(JSON.stringify(data, null, 2));
console.log("\nrequests com erro:", requestsFailed.length ? requestsFailed.slice(0, 8) : "nenhuma");
console.log("css com erro:", cssFailed.length ? cssFailed : "nenhum");
console.log(`\nCSS aplicado: ${ok ? "SIM" : "NAO"}`);

await browser.close();
process.exit(ok ? 0 : 1);