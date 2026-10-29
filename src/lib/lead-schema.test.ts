import { describe, expect, it } from "vitest";
import { parseLead } from "@/lib/lead-schema";

const validLead = {
  name: "Arthur Souza",
  email: "Arthur@Empresa.com",
  company: "Empresa Exemplo",
  segment: "E-commerce",
  goal: "Aumentar o volume de leads qualificados com previsibilidade.",
  investment: "R$ 5 mil a R$ 15 mil/mês",
  website: "",
};

describe("leadSchema", () => {
  it("aceita um lead válido e normaliza o e-mail", () => {
    const result = parseLead(validLead);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.email).toBe("arthur@empresa.com");
  });

  it("aceita investimento vazio por ser campo opcional", () => {
    expect(parseLead({ ...validLead, investment: "" }).ok).toBe(true);
  });

  it("rejeita faixa de investimento fora da lista", () => {
    expect(parseLead({ ...validLead, investment: "R$ 1 milhão" }).ok).toBe(false);
  });

  it("rejeita e-mail inválido com mensagem de campo", () => {
    const result = parseLead({ ...validLead, email: "arthur@" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.email).toBe("Informe um e-mail válido.");
  });

  it("rejeita objetivo curto e retorna a primeira mensagem do campo", () => {
    const result = parseLead({ ...validLead, goal: "curto" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.goal).toMatch(/pelo menos 10 caracteres/);
  });

  it("aceita honeypot preenchido para a rota descartar em silêncio", () => {
    const result = parseLead({ ...validLead, website: "spam" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.website).toBe("spam");
  });

  it("rejeita corpo incompleto sem lançar exceção", () => {
    const result = parseLead({});
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
  });
});
