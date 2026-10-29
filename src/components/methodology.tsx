import { Reveal } from "@/components/reveal";
import { steps } from "@/content/site";

export function Methodology() {
  return (
    <section
      id="metodologia"
      className="relative overflow-hidden border-y border-line bg-ink-raised/60 py-20 md:py-28"
      aria-labelledby="methodology-title"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="onze-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent_70%)]" />
      </div>

      <div className="shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Como trabalhamos</p>
            <h2
              id="methodology-title"
              className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-fg"
            >
              Um processo em quatro etapas,
              <span className="text-muted"> sem atalho.</span>
            </h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
              A sequência existe por um motivo: campanha sem diagnóstico repete
              erro, e otimização sem estratégia só acelera o desperdício.
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.number} className="h-full">
              <Reveal delay={index * 80} className="h-full">
                <div className="group relative flex h-full flex-col bg-ink p-6 transition-colors duration-300 hover:bg-surface lg:p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-4xl leading-none font-semibold tracking-[-0.05em] text-white/40 transition-colors duration-300 group-hover:text-brand-light/80">
                      {step.number}
                    </span>
                    {index < steps.length - 1 ? (
                      <span aria-hidden="true" className="text-muted-dim">
                        →
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-8 font-display text-lg font-medium tracking-[-0.02em] text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-muted">
                    {step.description}
                  </p>

                  <p className="mt-6 border-t border-line pt-4 text-[0.6875rem] leading-relaxed tracking-wide text-muted-dim">
                    <span className="block text-[0.625rem] tracking-[0.12em] uppercase">
                      Entrega
                    </span>
                    <span className="mt-1 block text-muted">{step.deliverable}</span>
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={120}>
          <p className="mt-8 text-[0.8125rem] leading-relaxed text-muted-dim">
            O ciclo de otimização não tem data de encerramento enquanto a parceria
            estiver ativa. A frequência de análise é definida no escopo.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
