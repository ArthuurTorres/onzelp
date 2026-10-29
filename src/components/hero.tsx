"use client";

import { ArrowDown, ArrowUpRight } from "@/components/icons";
import { FlowDiagram } from "@/components/flow-diagram";
import { Parallax } from "@/components/parallax";
import { track } from "@/lib/analytics";

const highlights = [
  "Estratégia antes da verba",
  "Leitura de dados com contexto",
  "Rotina de acompanhamento",
];

export function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-40 md:pb-24"
      aria-labelledby="hero-title"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Parallax distance={60} className="absolute inset-0">
          <div className="onze-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_15%,transparent_75%)]" />
        </Parallax>
        <Parallax distance={34} className="absolute inset-x-0 top-0 h-[620px]">
          <div className="onze-glow absolute inset-0 opacity-90" />
        </Parallax>
        <div className="absolute top-0 left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="anim-fade inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pr-4 pl-1.5 text-[0.6875rem] font-medium tracking-[0.1em] text-muted uppercase">
              <span className="rounded-full bg-brand/20 px-2.5 py-1 text-[0.625rem] text-brand-light">
                ONZE
              </span>
              Tráfego pago · Performance
            </p>

            <h1
              id="hero-title"
              className="anim-rise mt-6 font-display text-[clamp(2.5rem,6.4vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-fg"
              style={{ animationDelay: "80ms" }}
            >
              Tráfego pago com
              <br />
              estratégia.
              <span className="block text-muted">Crescimento com direção.</span>
            </h1>

            <p
              className="anim-rise mt-7 max-w-xl text-[0.9375rem] leading-relaxed text-muted sm:text-base"
              style={{ animationDelay: "160ms" }}
            >
              A ONZE conecta estratégia, mídia e análise de dados para transformar
              investimento em campanhas mais inteligentes e oportunidades reais de
              negócio — com clareza sobre o que cada real está comprando.
            </p>

            <div
              className="anim-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "240ms" }}
            >
              <a
                href="#contato"
                onClick={() => track("hero_cta_click", { location: "hero" })}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-[0_18px_40px_-16px_rgba(124,58,237,0.8)] transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright"
              >
                Quero escalar meu negócio
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <a
                href="#metodologia"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-6 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright"
              >
                Conhecer nossa estratégia
                <ArrowDown size={15} className="text-muted" />
              </a>
            </div>

            <ul
              className="anim-rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-line pt-6"
              style={{ animationDelay: "320ms" }}
            >
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-muted">
                  <span aria-hidden="true" className="size-1 rounded-full bg-brand-bright" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="anim-fade lg:pl-2" style={{ animationDelay: "200ms" }}>
            <Parallax distance={-26}>
              <FlowDiagram />
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
