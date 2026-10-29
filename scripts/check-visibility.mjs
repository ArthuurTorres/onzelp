import { chromium } from "@playwright/test";

const BASE = process.env.AUDIT_URL ?? "http://localhost:3000";
const problems = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "pt-BR" });
await page.goto(BASE, { waitUntil: "networkidle" });

// Contraste dos textos principais sobre o fundo real
const contrast = await page.evaluate(() => {
  const parse = (value) => {
    const nums = value.match(/[\d.]+/g)?.map(Number) ?? [];
    return { r: nums[0] ?? 0, g: nums[1] ?? 1, b: nums[2] ?? 2 };
  };
  const luminance = ({ r, g, b }) => {
    const channel = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const background = parse(getComputedStyle(document.body).backgroundColor);
  const ratio = (fg) => {
    const l1 = luminance(fg);
    const l2 = luminance(background);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const targets = [
    ["h1", document.querySelector("h1")],
    ["parágrafo do hero", document.querySelector("h1")?.parentElement?.querySelector("p")],
    ["texto secundário", document.querySelector("p.text-muted")],
    ["rodapé", document.querySelector("footer p")],
  ];

  return targets
    .filter(([, node]) => node)
    .map(([label, node]) => ({
      label,
      size: parseFloat(getComputedStyle(node).fontSize),
      ratio: Number(ratio(parse(getComputedStyle(node).color)).toFixed(2)),
    }));
});

for (const item of contrast) {
  const minimum = item.size >= 18.66 ? 3 : 4.5;
  if (item.ratio < minimum) {
    problems.push(`${item.label}: contraste ${item.ratio} abaixo de ${minimum} (${item.size}px)`);
  }
}

// Âncoras: destino existe e o primeiro título não fica sob o header fixo
const anchors = await page.evaluate(() =>
  [...document.querySelectorAll("a[href^='#']")].map((a) => a.getAttribute("href")),
);
for (const href of [...new Set(anchors)]) {
  if (!href || href === "#") continue;
  const box = await page.evaluate((target) => {
    const el = document.querySelector(target);
    if (!el) return null;
    el.scrollIntoView();
    const reference = el.querySelector("h1, h2, h3") ?? el;
    const rect = reference.getBoundingClientRect();
    const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    return { top: Math.round(rect.top), header: Math.round(header) };
  }, href);
  if (!box) {
    problems.push(`Âncora sem destino: ${href}`);
  } else if (box.top < box.header - 1) {
    problems.push(`${href}: conteúdo escondido atrás do header fixo (${box.top} < ${box.header})`);
  }
}

console.log(JSON.stringify(contrast, null, 2));
console.log("\n=== RESUMO ===");
console.log(problems.length ? problems.join("\n") : "Nenhum problema encontrado");

await browser.close();
