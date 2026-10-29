import { Reveal } from "@/components/reveal";
import { ArrowUpRight, CircleDot } from "@/components/icons";
import { services } from "@/content/site";

export function Services() {
  return (
    <section id="servicos" className="relative py-20 md:py-28" aria-labelledby="services-title">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 border-b border-line pb-10 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">O que fazemos</p>
              <h2
                id="services-title"
                className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-fg"
              >
                Seis frentes que sustentam
                <span className="text-muted"> a aquisição.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[0.875rem] leading-relaxed text-muted">
              Cada frente pode ser contratada dentro de um escopo combinado. O
              diagnóstico define o que faz sentido para o seu momento — e o que não
              faz.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const featured = index === 0;
            return (
              <Reveal
                key={service.id}
                delay={index * 50}
                className={featured ? "md:col-span-2 lg:col-span-2" : ""}
              >
                <article
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-line-strong hover:bg-surface ${
                    featured ? "lg:p-8" : ""
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-brand/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-[0.6875rem] tracking-wider text-muted-dim">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {featured ? (
                        <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[0.625rem] font-medium tracking-wide text-brand-light uppercase">
                          Frente principal
                        </span>
                      ) : (
                        <CircleDot size={14} className="text-muted-dim" />
                      )}
                    </div>

                    <h3
                      className={`mt-5 font-display font-medium tracking-[-0.025em] text-fg ${
                        featured ? "text-2xl lg:text-3xl" : "text-lg"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mt-3 leading-relaxed text-muted ${
                        featured ? "max-w-xl text-[0.9375rem]" : "text-[0.8125rem]"
                      }`}
                    >
                      {service.summary}
                    </p>
                  </div>

                  <ul className="relative mt-6 flex flex-wrap gap-x-2 gap-y-2">
                    {service.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="rounded-full border border-line bg-ink/50 px-2.5 py-1 text-[0.6875rem] text-muted"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}

          <Reveal delay={300}>
            <a
              href="#contato"
              className="group flex h-full min-h-[180px] flex-col justify-between rounded-xl border border-brand/25 bg-gradient-to-br from-brand/15 via-brand/5 to-transparent p-6 transition-colors duration-300 hover:border-brand/50"
            >
              <p className="text-[0.8125rem] leading-relaxed text-fg/90">
                Não sabe qual frente começa primeiro? O diagnóstico responde isso
                antes de qualquer contratação.
              </p>
              <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-brand-light">
                Solicitar diagnóstico
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
