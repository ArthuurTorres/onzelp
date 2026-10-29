import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/lead-form";
import { LogoMark } from "@/components/logo";
import { Parallax } from "@/components/parallax";

export function ContactSection() {
  return (
    <section id="contato" className="relative overflow-hidden py-20 md:py-28" aria-labelledby="contact-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px onze-hairline" />
        <Parallax distance={50} className="absolute top-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2">
          <div className="h-full w-full rounded-full bg-brand/12 blur-[120px]" />
        </Parallax>
      </div>

      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="lg:pt-6">
              <div className="flex items-center gap-3">
                <LogoMark className="h-9 w-auto" animated />
                <p className="eyebrow">Próximo passo</p>
              </div>
              <h2
                id="contact-title"
                className="mt-5 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-fg"
              >
                Seu próximo nível começa
                <span className="block text-muted">com uma estratégia melhor.</span>
              </h2>
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-muted">
                Vamos entender o momento do seu negócio e identificar oportunidades
                para evoluir sua aquisição de clientes.
              </p>

              <ul className="mt-9 space-y-4 border-t border-line pt-7">
                {[
                  "Diagnóstico antes de proposta comercial",
                  "Escopo claro, com o que está e o que não está incluído",
                  "Sem promessa de faturamento garantido",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.8125rem] text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-light"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div id="formulario">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
