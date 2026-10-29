import { Reveal } from "@/components/reveal";

const pains = [
  {
    title: "Verba sem retorno claro",
    text: "O anúncio roda, o extrato chega, mas ninguém sabe dizer o que aquele investimento trouxe em vendas ou em conversas.",
  },
  {
    title: "Campanha sem estratégia comercial",
    text: "O objetivo da campanha não conversa com a meta do negócio. Resultado: volume de cliques sem efeito na operação.",
  },
  {
    title: "Oportunidades invisíveis",
    text: "Público, oferta e canal que poderiam performar melhor nunca foram testados — porque não há leitura para enxergar isso.",
  },
  {
    title: "Acompanhamento distante",
    text: "Relatório mensal chega tarde demais. Quando o dado aparece, o orçamento já foi consumido no que não funcionava.",
  },
];

export function Positioning() {
  return (
    <section id="posicionamento" className="relative py-20 md:py-28" aria-labelledby="positioning-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">O problema real</p>
              <h2
                id="positioning-title"
                className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-fg"
              >
                Anúncio não é
                <span className="text-muted"> estratégia.</span>
              </h2>
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-muted">
                A maioria das contas não perde dinheiro por falta de plataforma ou de
                criativo. Perde por falta de direção: oferta desalinhada, público
                errado, decisão tomada no impulso.
              </p>

              <div className="mt-9 rounded-xl border border-line bg-surface/60 p-5">
                <p className="text-[0.6875rem] tracking-[0.14em] text-muted-dim uppercase">
                  O que muda com a ONZE
                </p>
                <p className="mt-2 font-display text-lg leading-snug font-medium tracking-[-0.02em] text-fg">
                  De operador de anúncios para parceiro de aquisição.
                </p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                  A mídia passa a responder a uma pergunta comercial: qual é a
                  próxima decisão que aumenta a chance de venda?
                </p>
              </div>
            </div>
          </Reveal>

          <ul className="divide-y divide-line border-t border-line">
            {pains.map((pain, index) => (
              <li key={pain.title}>
                <Reveal delay={index * 70}>
                  <div className="group grid gap-3 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6">
                    <span className="font-mono text-xs text-muted-dim transition-colors group-hover:text-brand-light">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-fg">
                        {pain.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-muted">
                        {pain.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
