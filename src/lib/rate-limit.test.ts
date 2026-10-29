import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

const now = 1_800_000_000_000;

describe("checkRateLimit", () => {
  it("permite as primeiras requisições da janela", () => {
    const key = `permitido-${now}`;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(checkRateLimit(key, now).allowed).toBe(true);
    }
  });

  it("bloqueia a sexta requisição e informa espera", () => {
    const key = `bloqueado-${now}`;
    for (let attempt = 0; attempt < 5; attempt += 1) checkRateLimit(key, now);

    const blocked = checkRateLimit(key, now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("libera novamente depois da janela de 10 minutos", () => {
    const key = `reaberto-${now}`;
    for (let attempt = 0; attempt < 5; attempt += 1) checkRateLimit(key, now);

    const later = now + 10 * 60 * 1000 + 1;
    expect(checkRateLimit(key, later).allowed).toBe(true);
  });

  it("contadores de chaves diferentes não se misturam", () => {
    const first = `chave-a-${now}`;
    for (let attempt = 0; attempt < 5; attempt += 1) checkRateLimit(first, now);

    expect(checkRateLimit(`chave-b-${now}`, now).allowed).toBe(true);
  });
});
