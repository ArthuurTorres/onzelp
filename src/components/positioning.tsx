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

              {/* Ciclo de aquisição — visual decorativo */}
              <div aria-hidden="true" className="mt-8 hidden lg:block">
                <svg viewBox="0 0 240 240" className="w-full max-w-[240px]" role="presentation">
                  <defs>
                    <radialGradient id="journey-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="journey-core" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#5b21b6" />
                    </linearGradient>
                  </defs>

                  <circle cx="120" cy="120" r="104" fill="url(#journey-glow)" />
                  <circle
                    cx="120"
                    cy="120"
                    r="88"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1"
                    strokeDasharray="4 9"
                    opacity="0.35"
                    className="journey-path"
                  />
                  <ellipse
                    cx="120"
                    cy="120"
                    rx="88"
                    ry="30"
                    fill="none"
                    stroke="#c4a2fb"
                    strokeWidth="0.8"
                    strokeDasharray="3 7"
                    opacity="0.4"
                    className="journey-orbit"
                  />

                  <circle cx="120" cy="120" r="22" fill="#a855f7" opacity="0.12" />
                  <rect
                    x="108"
                    y="104"
                    width="24"
                    height="33"
                    rx="12"
                    fill="url(#journey-core)"
                  />
                  <rect x="115" y="109" width="10" height="23" rx="5" fill="#08080b" />
                  <circle cx="120" cy="120.5" r="3" fill="#a855f7" />

                  <circle cx="120" cy="32" r="7" fill="#a855f7" opacity="0.85" className="journey-dot" />
                  <circle cx="208" cy="120" r="7" fill="#6366f1" opacity="0.85" className="journey-dot" />
                  <circle cx="120" cy="208" r="7" fill="#06b6d4" opacity="0.85" className="journey-dot" />
                  <circle cx="32" cy="120" r="7" fill="#f59e0b" opacity="0.85" className="journey-dot" />

                  <text x="120" y="20" textAnchor="middle" fill="#a855f7" fontSize="8.5" opacity="0.75">
                    Orçamento
                  </text>
                  <text x="214" y="123" textAnchor="start" fill="#6366f1" fontSize="8.5" opacity="0.75">
                    Canal
                  </text>
                  <text x="120" y="226" textAnchor="middle" fill="#06b6d4" fontSize="8.5" opacity="0.75">
                    Dados
                  </text>
                  <text x="26" y="123" textAnchor="end" fill="#f59e0b" fontSize="8.5" opacity="0.75">
                    Decisão
                  </text>
                </svg>
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