import { Reveal } from "@/components/reveal";
import { differentials } from "@/content/site";
import { CheckIcon } from "@/components/icons";

export function Differentials() {
  return (
    <section
      id="diferenciais"
      className="relative border-y border-line py-20 md:py-28"
      aria-labelledby="differentials-title"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <div>
              <p className="eyebrow">Diferenciais</p>
              <h2
                id="differentials-title"
                className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-fg"
              >
                O que sustenta
                <span className="text-muted"> a parceria.</span>
              </h2>
              <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
                Não são promessas de resultado. São escolhas de método que definem
                como o trabalho acontece no dia a dia.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {differentials.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="group">
                  <span className="inline-flex size-8 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand-light">
                    <CheckIcon size={15} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-medium tracking-[-0.015em] text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
