const stages = [
  { label: "Investimento", x: 160, y: 50, delay: 0 },
  { label: "Mídia", x: 250, y: 150, delay: 1.6 },
  { label: "Dados", x: 160, y: 250, delay: 3.2 },
  { label: "Decisão", x: 70, y: 150, delay: 4.8 },
];

const labels = [
  { text: "Investimento", x: 160, y: 84, anchor: "middle" as const },
  { text: "Mídia", x: 220, y: 153, anchor: "middle" as const },
  { text: "Dados", x: 160, y: 222, anchor: "middle" as const },
  { text: "Decisão", x: 100, y: 153, anchor: "middle" as const },
];

export function FlowDiagram() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-x-8 -top-12 bottom-0 -z-10 rounded-[48px] bg-[radial-gradient(60%_50%_at_60%_35%,rgba(124,58,237,0.26),transparent_70%)] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/90 shadow-[0_40px_120px_-40px_rgba(124,58,237,0.45)] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="anim-pulse size-1.5 rounded-full bg-brand-bright" />
            <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-muted uppercase">
              O ciclo do tráfego pago
            </span>
          </div>
          <span className="rounded-full border border-line px-2 py-0.5 text-[0.625rem] tracking-wide text-muted-dim">
            ilustrativo
          </span>
        </div>

        <div className="px-3 py-4 sm:px-4">
          <svg
            viewBox="0 0 320 300"
            className="mx-auto h-auto w-full max-w-[340px]"
            role="img"
            aria-label="Diagrama ilustrativo do ciclo de tráfego pago: investimento vai para a mídia, a mídia gera dados, os dados orientam a decisão, que ajusta o investimento."
          >
            <defs>
              <linearGradient id="flow-track" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#A855F7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#C4A2FB" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="flow-mark" x1="8" y1="0" x2="56" y2="88" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#A855F7" />
                <stop offset="0.55" stopColor="#8B2FE0" />
                <stop offset="1" stopColor="#5B21B6" />
              </linearGradient>
              <radialGradient id="flow-core-glow">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="160" cy="150" r="96" fill="url(#flow-core-glow)" />

            <path
              d="M 100 50 H 220 A 30 30 0 0 1 250 80 V 220 A 30 30 0 0 1 220 250 H 100 A 30 30 0 0 1 70 220 V 80 A 30 30 0 0 1 100 50 Z"
              fill="none"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1.4"
            />

            <path
              className="anim-flow"
              d="M 100 50 H 220 A 30 30 0 0 1 250 80 V 220 A 30 30 0 0 1 220 250 H 100 A 30 30 0 0 1 70 220 V 80 A 30 30 0 0 1 100 50 Z"
              fill="none"
              stroke="url(#flow-track)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {stages.map((stage) => (
              <circle
                key={stage.label}
                className="anim-node"
                cx={stage.x}
                cy={stage.y}
                r="4.5"
                fill="#C4A2FB"
                style={{ animationDelay: `${stage.delay}s` }}
              />
            ))}

            <g transform="translate(160 150) scale(0.7) translate(-32 -44)">
              <rect width="64" height="88" rx="32" fill="url(#flow-mark)" />
              <rect x="18" y="13" width="28" height="62" rx="14" fill="#08080B" />
              <circle cx="32" cy="44" r="7" fill="#A855F7" />
            </g>

            {labels.map((label) => (
              <text
                key={label.text}
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                fill="#8F8F99"
                fontSize="9"
                letterSpacing="0.6"
              >
                {label.text}
              </text>
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2.5 border-t border-line px-4 pt-4 pb-4 sm:px-5">
          {[
            { label: "Canais", value: "Google · Meta" },
            { label: "Rotina", value: "Leitura semanal" },
            { label: "Foco", value: "Custo por oportunidade" },
            { label: "Decisão", value: "Baseada em dados" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-line bg-surface-2/70 px-3 py-2.5">
              <p className="text-[0.625rem] tracking-[0.12em] text-muted-dim uppercase">{item.label}</p>
              <p className="mt-0.5 text-[0.8125rem] font-medium text-fg">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-right text-[0.6875rem] leading-relaxed text-muted-dim">
        Representação ilustrativa do processo. Não são dados de clientes.
      </p>
    </div>
  );
}