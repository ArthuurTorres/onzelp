"use client";

import { useState } from "react";
import { faq } from "@/content/site";
import { PlusIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 md:py-28" aria-labelledby="faq-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <Reveal>
            <div>
              <p className="eyebrow">Dúvidas frequentes</p>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-fg"
              >
                Clareza também faz parte
                <span className="text-muted"> da estratégia.</span>
              </h2>
              <p className="mt-5 max-w-sm text-[0.875rem] leading-relaxed text-muted">
                As respostas abaixo são um ponto de partida. O diagnóstico existe
                justamente para aprofundar o contexto do seu negócio.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-line">
            {faq.map((item, index) => {
              const isOpen = open === index;
              const buttonId = `faq-trigger-${index}`;
              const answerId = `faq-answer-${index}`;

              return (
                <Reveal key={item.question} delay={index * 40}>
                  <div className="border-b border-line">
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpen(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[0.9375rem] font-medium tracking-[-0.015em] text-fg transition-colors hover:text-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright"
                      >
                        <span>{item.question}</span>
                        <span
                          aria-hidden="true"
                          className={`grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform duration-300 ${
                            isOpen ? "rotate-45 border-brand/40 bg-brand/15 text-brand-light" : ""
                          }`}
                        >
                          <PlusIcon size={15} />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className="max-w-2xl pb-5 pr-10 text-[0.8125rem] leading-relaxed text-muted"
                    >
                      {item.answer}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
