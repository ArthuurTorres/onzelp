import { expect, test, type Page } from "@playwright/test";

const IP_PREFIX = process.env.E2E_IP_PREFIX ?? "203.0.113";

async function freshClient(page: Page, suffix: string) {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `${IP_PREFIX}.${suffix}` });
}

test.describe("landing page", () => {
  test("carrega com o CSS aplicado e um único H1", async ({ page }) => {
    await page.goto("/");

    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe("rgb(8, 8, 11)");

    const heading = page.locator("h1");
    await expect(heading).toHaveCount(1);
    await expect(heading).toContainText("Tráfego pago com");

    const font = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(font).toContain("Sora");

    const shell = page.locator(".shell").first();
    const maxWidth = await shell.evaluate((el) => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe("1200px");
  });

  test("navegação por âncoras leva à seção sem esconder o título", async ({ page }) => {
    await page.goto("/");

    const isMobile = (page.viewportSize()?.width ?? 1440) < 768;

    if (isMobile) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      const panel = page.getByRole("dialog");
      await expect(panel).toBeVisible();
      await panel.getByRole("link", { name: "Metodologia" }).click();
      await expect(panel).toHaveCount(0);
    } else {
      await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Metodologia" }).click();
    }

    await expect(page).toHaveURL(/#metodologia$/);

    const section = page.locator("#metodologia");
    await expect(section).toBeInViewport();

    const headerHeight = await page
      .locator("header")
      .evaluate((el) => el.getBoundingClientRect().height);
    const sectionTop = await section.evaluate((el) => el.getBoundingClientRect().top);
    expect(sectionTop).toBeGreaterThanOrEqual(headerHeight - 1);
  });

  test("FAQ alterna estado acessível", async ({ page }) => {
    await page.goto("/#faq");

    const trigger = page.getByRole("button", { name: /Como funciona a contratação/ });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("formulário valida no cliente antes de enviar", async ({ page }) => {
    await freshClient(page, "40");
    await page.goto("/#contato");

    const form = page.locator("#formulario form");
    await form.getByRole("button", { name: /Enviar e falar/ }).click();

    await expect(form.locator('[aria-invalid="true"]')).toHaveCount(5);
    await expect(form.locator('[name="name"]')).toBeFocused();
    await expect(form.getByRole("status")).toBeEmpty();
  });

  test("envio válido não finge sucesso quando a integração falta", async ({ page }) => {
    await freshClient(page, "41");
    await page.goto("/#contato");

    const form = page.locator("#formulario form");
    await form.locator('[name="name"]').fill("Arthur Teste");
    await form.locator('[name="email"]').fill("arthur@example.com");
    await form.locator('[name="company"]').fill("ONZE Teste");
    await form.locator('[name="segment"]').fill("Serviços");
    await form.locator('[name="goal"]').fill("Aumentar oportunidades qualificadas");
    await form.getByRole("button", { name: /Enviar e falar/ }).click();

    await expect(form.getByRole("status")).toContainText(/canal de recebimento ainda não está configurado/i);
    await expect(form.getByText("Diagnóstico enviado.")).toHaveCount(0);
  });

  test("sem overflow horizontal e sem erro de console", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThan(3);
    expect(errors).toEqual([]);
  });

  test("rota de privacidade responde e tem conteúdo", async ({ page }) => {
    const response = await page.goto("/privacidade");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const text = await page.locator("main").innerText();
    expect(text.length).toBeGreaterThan(200);
  });
});

test.describe("motion", () => {
  test("animações e parallax ativos por padrão", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const animations = await page.evaluate(() => {
      const read = (selector: string) => {
        const el = document.querySelector(selector);
        return el ? getComputedStyle(el).animationName : "ausente";
      };
      return {
        orbit: read(".logo-orbit"),
        core: read(".logo-core"),
        flow: read(".anim-flow"),
        node: read(".anim-node"),
        layers: document.querySelectorAll(".parallax-layer").length,
      };
    });

    expect(animations.orbit).toBe("onze-orbit");
    expect(animations.core).toBe("onze-core");
    expect(animations.flow).toBe("onze-flow");
    expect(animations.node).toBe("onze-node");
    expect(animations.layers).toBeGreaterThan(0);

    const before = await page.evaluate(() =>
      [...document.querySelectorAll(".parallax-layer")].map((el) =>
        getComputedStyle(el).getPropertyValue("--parallax-y"),
      ),
    );
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(350);
    const after = await page.evaluate(() =>
      [...document.querySelectorAll(".parallax-layer")].map((el) =>
        getComputedStyle(el).getPropertyValue("--parallax-y"),
      ),
    );
    expect(after).not.toEqual(before);
  });

  test("prefers-reduced-motion desliga o movimento", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });

    const state = await page.evaluate(() => {
      const read = (selector: string) => {
        const el = document.querySelector(selector);
        return el ? getComputedStyle(el).animationName : "ausente";
      };
      const layer = document.querySelector(".parallax-layer");
      return {
        orbit: read(".logo-orbit"),
        flow: read(".anim-flow"),
        node: read(".anim-node"),
        translate: layer ? getComputedStyle(layer).translate : "ausente",
      };
    });

    expect(state.orbit).toBe("none");
    expect(state.flow).toBe("none");
    expect(state.node).toBe("none");
    expect(state.translate === "none" || state.translate === "ausente").toBe(true);
  });
});

test.describe("api de diagnóstico", () => {
  test("rejeita payload inválido", async ({ request }) => {
    const response = await request.post("/api/diagnostico", {
      headers: { "x-forwarded-for": `${IP_PREFIX}.50` },
      data: { name: "A" },
    });
    expect(response.status()).toBe(400);
    expect((await response.json()).ok).toBe(false);
  });

  test("aceita honeypot sem vazar para o CRM", async ({ request }) => {
    const response = await request.post("/api/diagnostico", {
      headers: { "x-forwarded-for": `${IP_PREFIX}.51` },
      data: {
        name: "Bot Teste",
        email: "bot@example.com",
        company: "Empresa Bot",
        segment: "Automação",
        goal: "Preencher o formulário automaticamente sem ler o conteúdo.",
        investment: "",
        website: "http://spam.example",
      },
    });
    expect(response.status()).toBe(202);
    expect((await response.json()).ok).toBe(true);
  });

  test("informa integração ausente sem simular envio", async ({ request }) => {
    const response = await request.post("/api/diagnostico", {
      headers: { "x-forwarded-for": `${IP_PREFIX}.52` },
      data: {
        name: "Arthur Teste",
        email: "arthur@example.com",
        company: "ONZE Teste",
        segment: "Serviços",
        goal: "Aumentar oportunidades qualificadas",
        investment: "",
        website: "",
      },
    });
    expect(response.status()).toBe(503);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.code).toBe("INTEGRATION_NOT_CONFIGURED");
  });
});
