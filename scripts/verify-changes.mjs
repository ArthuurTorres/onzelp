import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.AUDIT_URL ?? "http://localhost:3000";
const OUT = ".audit";
const problems = [];
const note = (message) => {
  problems.push(message);
  console.log(`PROBLEMA: ${message}`);
};
const ok = (message) => console.log(`OK: ${message}`);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

const scrollAll = async (page) => {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const steps = Math.ceil(height / 500);
  for (let i = 0; i !== steps; i += 1) {
    await page.evaluate((top) => window.scrollTo(0, top), i * 500);
    await page.waitForTimeout(45);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
};

for (const device of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    locale: "pt-BR",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));

  const response = await page.goto(BASE, { waitUntil: "networkidle" });
  if (response?.status() !== 200) note(`${device.name}: status ${response?.status()}`);
  await scrollAll(page);

  const data = await page.evaluate(() => {
    const box = (el) => {
      const rect = el.getBoundingClientRect();
      return { w: Math.round(rect.width), h: Math.round(rect.height) };
    };
    const posList = document.querySelector("#posicionamento ul");
    const methList = document.querySelector("#metodologia ol");
    const footerLinks = [...document.querySelectorAll("footer nav a")].map((el) => ({
      label: el.textContent.trim().slice(0, 22),
      ...box(el),
    }));
    const logo = document.querySelector("footer a[href='#topo']");
    const resultsCta = [...document.querySelectorAll("#resultados a")].find((el) =>
      el.textContent.includes("Falar sobre"),
    );
    const stepNumber = document.querySelector("#metodologia ol li span.font-display");
    const reveals = [...document.querySelectorAll("#posicionamento .reveal, #metodologia .reveal")];
    return {
      posChildren: posList ? [...posList.children].map((el) => el.tagName) : [],
      posLiPerReveal: posList
        ? [...posList.children].filter((li) => !li.querySelector(":scope > .reveal")).length
        : -1,
      methChildren: methList ? [...methList.children].map((el) => el.tagName) : [],
      methLiPerReveal: methList
        ? [...methList.children].filter((li) => !li.querySelector(":scope > .reveal")).length
        : -1,
      revealsHidden: reveals.filter((el) => el.getAttribute("data-visible") !== "true").length,
      footerLinks,
      logo: logo ? box(logo) : null,
      resultsCta: resultsCta ? box(resultsCta) : null,
      stepNumber: stepNumber
        ? { color: getComputedStyle(stepNumber).color, size: getComputedStyle(stepNumber).fontSize }
        : null,
    };
  });

  if (data.posChildren.length && data.posChildren.every((tag) => tag === "LI")) {
    ok(`${device.name}: #posicionamento ul só tem LI como filho`);
  } else {
    note(`${device.name}: #posicionamento ul com filhos inválidos -> ${data.posChildren.join(",")}`);
  }
  if (data.methChildren.length !== 4 || !data.methChildren.every((tag) => tag === "LI")) {
    note(`${device.name}: #metodologia ol esperava 4 LI -> ${data.methChildren.join(",")}`);
  } else {
    ok(`${device.name}: #metodologia ol com 4 LI`);
  }
  if (data.posLiPerReveal !== 0) note(`${device.name}: ${data.posLiPerReveal} li sem Reveal interno (posicionamento)`);
  if (data.methLiPerReveal !== 0) note(`${device.name}: ${data.methLiPerReveal} li sem Reveal interno (metodologia)`);
  if (data.revealsHidden) note(`${device.name}: ${data.revealsHidden} bloco(s) ainda invisível(is) após rolagem`);
  else ok(`${device.name}: todos os Reveal das seções alteradas visíveis`);

  const smallLinks = data.footerLinks.filter((item) => !(item.h >= 24 && item.w >= 24));
  if (smallLinks.length) {
    note(`${device.name}: links do rodapé abaixo de 24px -> ${smallLinks.map((i) => `${i.label} ${i.w}x${i.h}`).join(" | ")}`);
  } else {
    ok(`${device.name}: ${data.footerLinks.length} links do rodapé com área de toque >= 24px`);
  }

  if (!data.logo || !(data.logo.h >= 44 && data.logo.w >= 44)) {
    note(`${device.name}: logo do rodapé com alvo ${JSON.stringify(data.logo)}`);
  } else {
    ok(`${device.name}: logo do rodapé ${data.logo.w}x${data.logo.h}`);
  }
  if (!data.resultsCta || !(data.resultsCta.h >= 44)) {
    note(`${device.name}: CTA de resultados com alvo ${JSON.stringify(data.resultsCta)}`);
  } else {
    ok(`${device.name}: CTA de resultados ${data.resultsCta.w}x${data.resultsCta.h}`);
  }
  if (data.stepNumber) {
    ok(`${device.name}: número da etapa ${data.stepNumber.color} ${data.stepNumber.size}`);
  }

  await page.screenshot({ path: `${OUT}/verify-${device.name}.png`, fullPage: true });

  if (device.width < 768) {
    const menuButton = page.locator("header button[aria-expanded]").first();
    if (await menuButton.count()) {
      await menuButton.click();
      await page.waitForTimeout(350);
      const expanded = await menuButton.getAttribute("aria-expanded");
      if (expanded !== "true") note("mobile: menu não abriu");
      else ok("mobile: menu abriu");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
    } else {
      note("mobile: botão do menu não encontrado");
    }
  }

  const faqTrigger = page.locator("#faq button[aria-expanded]").first();
  if (await faqTrigger.count()) {
    const before = await faqTrigger.getAttribute("aria-expanded");
    await faqTrigger.click();
    await page.waitForTimeout(300);
    const after = await faqTrigger.getAttribute("aria-expanded");
    if (before === after) note(`${device.name}: FAQ não alternou estado`);
    else ok(`${device.name}: FAQ alternou ${before} -> ${after}`);
  }

  const form = page.locator("#formulario form").first();
  if (await form.count()) {
    await page.locator("#formulario button[type='submit']").first().click();
    await page.waitForTimeout(400);
    const invalid = await page.locator("#formulario [aria-invalid='true']").count();
    if (invalid === 0) note(`${device.name}: formulário vazio não sinalizou erro`);
    else ok(`${device.name}: validação marcou ${invalid} campo(s)`);
    await page.screenshot({ path: `${OUT}/verify-form-${device.name}.png` });
  }

  if (consoleErrors.length) note(`${device.name}: console -> ${consoleErrors.join(" | ")}`);
  else ok(`${device.name}: console sem erros`);

  await page.goto(`${BASE}/privacidade`, { waitUntil: "networkidle" });
  const privacyText = (await page.locator("main").innerText()).trim();
  if (!(privacyText.length >= 200)) note(`${device.name}: /privacidade com conteúdo insuficiente (${privacyText.length})`);
  else ok(`${device.name}: /privacidade renderizou ${privacyText.length} caracteres`);

  await context.close();
}

console.log("\n=== RESUMO ===");
console.log(problems.length ? problems.join("\n") : "Nenhum problema encontrado");

await browser.close();