/**
 * Camada de eventos de interface.
 *
 * Nenhum provedor de analytics é carregado por padrão: não há IDs reais
 * configurados neste projeto e instalar scripts com IDs fictícios seria
 * mensuração falsa. Este módulo apenas empurra eventos para `window.dataLayer`
 * quando o GTM estiver presente (ver docs/ANALYTICS.md).
 *
 * Nunca envie dados pessoais (nome, e-mail, telefone) nos parâmetros.
 */

type EventName =
  | "hero_cta_click"
  | "contact_cta_click"
  | "form_start"
  | "form_submit_success"
  | "form_submit_error";

type EventPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const firedOnce = new Set<string>();

export function track(event: EventName, payload: EventPayload = {}, onceKey?: string) {
  if (typeof window === "undefined") return;

  if (onceKey) {
    if (firedOnce.has(onceKey)) return;
    firedOnce.add(onceKey);
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}
