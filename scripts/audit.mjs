import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.AUDIT_URL ?? "http://localhost:3000";
const OUT = ".audit";
const WIDTHS = [
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const problems = [];
const note = (message) => {
  problems.push(message);
  console.log(`PROBLEMA: ${message}`);
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const size of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    locale: "pt-BR",
  });
  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));

  const response = await page.goto(BASE, { waitUntil: "networkidle" });
  if (response?.status() !== 200) note(`${size.name}: status ${response?.status()}`);
  await page.waitForTimeout(400);

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    note(`${size.name}: overflow horizontal (${overflow.scrollWidth}px > ${overflow.clientWidth}px)`);
  }

  const h1Count = await page.locator("h1").count();
  if (h1Count !== 1) note(`${size.name}: ${h1Count} elementos h1 (esperado 1)`);

  const navVisible = await page.locator("nav[aria-label='Navegação principal']").isVisible();
  if (size.width < 768 && navVisible) note(`${size.name}: navbar desktop visível no mobile`);
  if (size.width >= 768 && !navVisible) note(`${size.name}: navbar desktop ausente`);

  if (consoleErrors.length) note(`${size.name}: erros de console -> ${consoleErrors.join(" | ")}`);

  await page.screenshot({ path: `${OUT}/home-${size.name}.png`, fullPage: true });
  await context.close();
}

// Fluxos interativos no mobile
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  locale: "pt-BR",
});
const page = await mobile.newPage();
const flowErrors = [];
page.on("pageerror", (error) => flowErrors.push(error.message));
await page.goto(BASE, { waitUntil: "networkidle" });

await page.getByRole("button", { name: "Abrir menu" }).click();
await page.getByRole("dialog", { name: "Menu de navegação" }).waitFor({ state: "visible" });
await page.screenshot({ path: `${OUT}/mobile-menu.png` });
await page.getByRole("button", { name: "Fechar menu" }).last().click();
await page.getByRole("dialog", { name: "Menu de navegação" }).waitFor({ state: "hidden" });

const faqTrigger = page.getByRole("button", { name: /Como funciona a contratação/i });
if ((await faqTrigger.getAttribute("aria-expanded")) !== "true") {
  note("FAQ: primeira pergunta deveria iniciar aberta");
}
await faqTrigger.click();
await page.waitForTimeout(250);
if ((await faqTrigger.getAttribute("aria-expanded")) !== "false") {
  note("FAQ: clique não fechou a resposta");
}

// Validação do formulário sem dados
await page.locator("#contato").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: /Enviar e falar com a ONZE/i }).click();
await page.waitForTimeout(250);
const nameInvalid = await page.locator("input[name='name']").getAttribute("aria-invalid");
if (nameInvalid !== "true") note("Formulário: submit vazio não marcou erro no nome");
if ((await page.locator("form p.text-red-300").count()) === 0) {
  note("Formulário: nenhuma mensagem de erro exibida");
}

// Preenchimento válido até a resposta honesta de integração ausente
await page.fill("input[name='name']", "Arthur Souza");
await page.fill("input[name='email']", "arthur@empresa.com");
await page.fill("input[name='company']", "Empresa Exemplo");
await page.fill("input[name='segment']", "Serviços B2B");
await page.fill("textarea[name='goal']", "Aumentar o volume de leads qualificados com previsibilidade.");
await page.selectOption("select[name='investment']", "R$ 5 mil a R$ 15 mil/mês");
await page.getByRole("button", { name: /Enviar e falar com a ONZE/i }).click();
await page.waitForTimeout(1500);
const statusText = (await page.locator("[role='status']").innerText()).trim();
if (!statusText) note("Formulário: envio não retornou nenhuma mensagem de estado");
if ((await page.locator("form").count()) === 0) {
  note("Formulário: sucesso simulado sem integração configurada");
}
await page.screenshot({ path: `${OUT}/form-state.png` });
if (flowErrors.length) note(`Fluxos: erros de página -> ${flowErrors.join(" | ")}`);

// Links internos precisam apontar para âncoras existentes
const brokenAnchors = await page.evaluate(() => {
  const hrefs = [...document.querySelectorAll("a[href^='#']")].map((a) => a.getAttribute("href"));
  return [...new Set(hrefs)].filter((href) => href && href !== "#" && !document.querySelector(href));
});
if (brokenAnchors.length) note(`Âncoras sem destino: ${brokenAnchors.join(", ")}`);

// Conteúdo revelado precisa ficar visível após rolar a página
const height = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < height; y += 600) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(700);
const hiddenReveals = await page.evaluate(() =>
  [...document.querySelectorAll(".reveal")]
    .filter((node) => node.getAttribute("data-visible") !== "true")
    .map((node) => node.textContent?.trim().slice(0, 60)),
);
if (hiddenReveals.length) note(`Reveal não revelado: ${hiddenReveals.join(" | ")}`);

console.log("\n=== STATUS DO ENVIO ===");
console.log(statusText || "(vazio)");
console.log("\n=== RESUMO ===");
console.log(problems.length ? problems.join("\n") : "Nenhum problema encontrado");

await browser.close();
