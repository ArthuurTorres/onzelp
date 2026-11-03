import { Reveal } from "@/components/reveal";
import { resultMetrics } from "@/content/site";
import { ArrowUpRight, SignalIcon } from "@/components/icons";

export function Results() {
  return (
    <section id="resultados" className="relative py-20 md:py-28" aria-labelledby="results-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="eyebrow">Como medimos</p>
              <h2
                id="results-title"
                className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-fg"
              >
                Resultado só é resultado
                <span className="text-muted"> quando é verificável.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
                Esta página não exibe número de cliente, print de painel ou
                depoimento. Estudos de caso e provas sociais entram aqui apenas com
                autorização formal e dados conferidos pela própria conta de anúncio.
              </p>

              <ul className="mt-9 space-y-px overflow-hidden rounded-xl border border-line bg-line">
                {resultMetrics.map((metric, index) => (
                  <li key={metric.label} className="group bg-ink px-5 py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[0.8125rem] font-medium text-fg">
                        {metric.label}
                      </span>
                      <SignalIcon size={14} className="shrink-0 text-brand-light/70" />
                    </div>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-muted">
                      {metric.description}
                    </p>
                    <div className="mt-3 h-px w-full overflow-hidden rounded-full bg-line">
                      <span
                        aria-hidden="true"
                        className="metric-bar block h-full rounded-full bg-gradient-to-r from-brand/60 to-brand-bright/80"
                        style={{ animationDelay: `${index * 160}ms` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface/60 p-7 md:p-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-10 size-64 rounded-full bg-brand/10 blur-3xl"
              />

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <span className="eyebrow">Estudos de caso</span>
                  <span className="rounded-full border border-line px-2.5 py-1 text-[0.625rem] tracking-wide text-muted-dim">
                    aguardando dados
                  </span>
                </div>

                <p className="mt-6 font-display text-2xl leading-snug font-medium tracking-[-0.03em] text-fg">
                  Espaço reservado para
                  <br />
                  <span className="text-muted">casos reais autorizados.</span>
                </p>

                <p className="mt-4 max-w-md text-[0.8125rem] leading-relaxed text-muted">
                  A estrutura abaixo já está pronta no código. Cada caso aceita
                  cliente, segmento, desafio, abordagem e resultado — e só aparece
                  na página quando esses dados existirem.
                </p>

                <div className="mt-7 space-y-2">
                  {["Cliente e segmento", "Desafio inicial", "Abordagem aplicada", "Resultado verificado"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-lg border border-dashed border-line px-4 py-3"
                      >
                        <span className="font-mono text-[0.625rem] text-muted-dim">
                          0{index + 1}
                        </span>
                        <span className="text-[0.8125rem] text-muted">{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="relative mt-8 border-t border-line pt-5">
                <p className="text-[0.75rem] leading-relaxed text-muted-dim">
                  A estrutura está pronta para receber estudos de caso e evidências
                  verificadas quando os dados forem autorizados.
                </p>
                <a
                  href="#contato"
                  className="group mt-4 inline-flex min-h-11 items-center gap-2 text-[0.8125rem] font-semibold text-brand-light"
                >
                  Falar sobre o seu cenário
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
