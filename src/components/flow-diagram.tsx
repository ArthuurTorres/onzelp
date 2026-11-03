"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ── 10 nós do ecossistema de tráfego pago ── */
const NODES = [
  {
    id: 0,
    x: 215, y: 42,
    label: "Orçamento",
    category: "estratégia",
    detail:
      "A verba é alocada por canal, campanha e período. Cada plataforma tem dinâmica própria de custo e alcance.",
    onze: "Mapeamos onde seu investimento tem mais retorno e ajustamos a distribuição.",
  },
  {
    id: 1,
    x: 390, y: 135,
    label: "Google Ads",
    category: "canal",
    detail:
      "Search, Display, Shopping e YouTube. Leilão em tempo real determina o custo por clique ou mil impressões.",
    onze: "Estrutura de campanhas, correspondência de palavras-chave e estratégia de lance.",
  },
  {
    id: 2,
    x: 415, y: 310,
    label: "Meta Ads",
    category: "canal",
    detail:
      "Facebook e Instagram. Segmentação por interesse, comportamento e público similar. Formato de engajamento.",
    onze: "Criação de audiences, posicionamento de formato e otimização de frequência.",
  },
  {
    id: 3,
    x: 310, y: 418,
    label: "Lance",
    category: "técnica",
    detail:
      "CPC máximo, CPA alvo, ROAS mínimo — a forma como você compete no leilão determina quantas oportunidades recebe.",
    onze: "Estratégias Smart Bid e ajustes manuais conforme performance.",
  },
  {
    id: 4,
    x: 120, y: 418,
    label: "Impressões",
    category: "métrica",
    detail:
      "Quantas vezes seu anúncio foi exibido. Volume de alcance depends da concorrência, segmentação e lance.",
    onze: "Monitoramos taxa de share de impressão e custo por mil para corrigir desperdício.",
  },
  {
    id: 5,
    x: 15, y: 310,
    label: "Cliques",
    category: "métrica",
    detail:
      "Interações com o anúncio que levam ao site. Cada clique tem um custo e uma intenção por trás.",
    onze: "Otimizamos criativo, pública-alvo e página de destino para reduzir CPL.",
  },
  {
    id: 6,
    x: 40, y: 135,
    label: "Landing",
    category: "conversão",
    detail:
      "A página onde o clique lands. Tempo de carregamento, relevância e clareza da oferta determinam a decisão de compra.",
    onze: "Sugestões de copy e estrutura para que a landing converta o tráfego que chega.",
  },
  {
    id: 7,
    x: 215, y: 205,
    label: "Campanha",
    category: "estratégia",
    detail:
      "Estrutura que agrupa anúncios por objetivo, público e canal. É onde a estratégia vira operação.",
    onze: "Montamos e mantemos a estrutura com segmentação, objetivos e budget pacing.",
  },
  {
    id: 8,
    x: 215, y: 295,
    label: "Dados",
    category: "análise",
    detail:
      "Cost, CTR, CPC, CPL, ROAS — cada métrica conta uma parte da história. Juntas, mostram o caminho.",
    onze: "Leitura semanal com contexto de mercado, sazonalidade e saídas de dados.",
  },
  {
    id: 9,
    x: 215, y: 380,
    label: "Decisão",
    category: "análise",
    detail:
      "Com os dados em mãos, identificamos o que ajustar: lance, público, criativo ou estrutura.",
    onze: "Recomendação técnica com justificativa antes de cada mudança.",
  },
] as const;

/* arestas: fluxo real do tráfego pago — objetos diretos, sem indexação por número */
const EDGES = [
  [NODES[7], NODES[0]],
  [NODES[0], NODES[1]],
  [NODES[0], NODES[2]],
  [NODES[1], NODES[3]],
  [NODES[2], NODES[3]],
  [NODES[3], NODES[4]],
  [NODES[4], NODES[5]],
  [NODES[5], NODES[6]],
  [NODES[6], NODES[7]],
  [NODES[5], NODES[8]],
  [NODES[8], NODES[9]],
  [NODES[9], NODES[0]],
  [NODES[8], NODES[1]],
  [NODES[8], NODES[2]],
] as const;

type NodeId = number;

const CATEGORY_COLOR: Record<string, string> = {
  estratégia: "#A855F7",
  canal:      "#7C3AED",
  técnica:    "#6D28D9",
  métrica:    "#9333EA",
  conversão:  "#A855F7",
  análise:    "#C4A2FB",
};

/** Tempo em ms antes de o card fechar ao perder o foco */
const BLUR_TIMEOUT = 400;

export function FlowDiagram() {
  const [selected, setSelected] = useState<NodeId | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleFocus = useCallback((id: NodeId) => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setSelected(id);
  }, []);

  const handleBlur = useCallback(() => {
    blurTimer.current = setTimeout(() => setSelected(null), BLUR_TIMEOUT);
  }, []);

  const handleSelect = useCallback(
    (id: NodeId) => {
      if (blurTimer.current) clearTimeout(blurTimer.current);
      setSelected((prev) => (prev === id ? null : id));
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: NodeId) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(id);
      }
    },
    [handleSelect],
  );

  // Cleanup on unmount
  useEffect(() => () => { if (blurTimer.current) clearTimeout(blurTimer.current); }, []);

  const selectedNode = selected !== null ? NODES[selected] : null;

  return (
    <div className="relative" onMouseLeave={handleBlur}>
      {/* halo difuso */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-8 -top-12 bottom-0 -z-10 rounded-[48px] bg-[radial-gradient(68%_55%_at_62%_38%,rgba(124,58,237,0.28),transparent_72%)] blur-2xl"
      />

      {/* card principal */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/92 shadow-[0_40px_120px_-40px_rgba(124,58,237,0.5)] backdrop-blur-sm">
        {/* barra de status */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="anim-pulse size-1.5 rounded-full bg-brand-bright" />
            <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-muted uppercase">
              Ecossistema de tráfego pago
            </span>
          </div>
          <span className="rounded-full border border-line px-2 py-0.5 text-[0.625rem] tracking-wide text-muted-dim">
            interativo · ao vivo
          </span>
        </div>

        {/* SVG interativo */}
        <div className="px-3 py-4 sm:px-4">
          <svg
            ref={svgRef}
            viewBox="0 0 430 445"
            className="mx-auto h-auto w-full max-w-[380px] select-none"
            role="application"
            aria-label="Rede interativa do ecossistema de tráfego pago. Clique ou tabule até um nó para ver detalhes."
          >
            <defs>
              <radialGradient id="fd-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#A855F7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="fd-node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#C4A2FB" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C4A2FB" stopOpacity="0" />
              </radialGradient>
              <filter id="fd-blur">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
              <linearGradient id="fd-trace" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0" />
                <stop offset="45%"  stopColor="#A855F7" stopOpacity="1" />
                <stop offset="100%" stopColor="#C4A2FB" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="fd-logo" x1="8" y1="0" x2="56" y2="88" gradientUnits="userSpaceOnUse">
                <stop offset="0"    stopColor="#A855F7" />
                <stop offset="0.55" stopColor="#8B2FE0" />
                <stop offset="1"    stopColor="#5B21B6" />
              </linearGradient>
            </defs>

            {/* halo nuclear */}
            <circle cx="215" cy="222" r="108" fill="url(#fd-glow)" filter="url(#fd-blur)" />

            {/* arestas */}
            {EDGES.map(([na, nb]) => (
              <line
                key={`e-${na.id}-${nb.id}`}
                x1={na.x} y1={na.y}
                x2={nb.x} y2={nb.y}
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1"
              />
            ))}

            {/* traços animados nas arestas */}
            {([
              [[NODES[7],NODES[0]],[NODES[0],NODES[1]],[NODES[1],NODES[3]],[NODES[3],NODES[4]],[NODES[4],NODES[5]],[NODES[5],NODES[8]],[NODES[8],NODES[9]],[NODES[9],NODES[0]]],
              [[NODES[5],NODES[6]],[NODES[6],NODES[7]],[NODES[7],NODES[0]],[NODES[0],NODES[2]],[NODES[2],NODES[3]],[NODES[3],NODES[5]]],
              [[NODES[5],NODES[8]],[NODES[8],NODES[1]],[NODES[1],NODES[3]],[NODES[3],NODES[4]],[NODES[4],NODES[5]]],
            ] as const).map((path, ti) => {
              const d = path
                .map(([na, nb]) => `${na.x},${na.y} ${nb.x},${nb.y}`)
                .join(" ");
              return (
                <path
                  key={`t-${ti}`}
                  d={`M ${d}`}
                  stroke="url(#fd-trace)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                  className="network-trace"
                  style={{
                    strokeDasharray: 5,
                    animationDuration: `${2.8 + ti * 0.6}s`,
                    animationDelay: `${ti * 1.2}s`,
                  } as React.CSSProperties}
                />
              );
            })}

            {/* nós interativos */}
            {NODES.map((n) => {
              const isSelected = selected === n.id;
              const color = CATEGORY_COLOR[n.category] ?? "#A855F7";
              const r = n.id === 7 ? 14 : n.id === 8 || n.id === 9 ? 10 : 9;

              return (
                <g
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${n.label}: ${n.detail}`}
                  onClick={() => handleSelect(n.id)}
                  onFocus={() => handleFocus(n.id)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, n.id)}
                  className="cursor-pointer focus:outline-none"
                  style={{ WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
                >
                  {/* halo externo (ativo só quando selecionado) */}
                  {isSelected && (
                    <circle
                      cx={n.x} cy={n.y}
                      r={r * 4.5}
                      fill={color}
                      opacity="0.14"
                      className="node-halo"
                      style={{ animation: `onze-node-halo 1.4s ease-in-out infinite` }}
                    />
                  )}
                  {/* halo selecionado */}
                  {isSelected && (
                    <circle
                      cx={n.x} cy={n.y}
                      r={r * 2.5}
                      fill={color}
                      opacity="0.22"
                    />
                  )}
                  {/* núcleo */}
                  <circle
                    cx={n.x} cy={n.y}
                    r={r}
                    fill={isSelected ? color : `${color}CC`}
                    stroke={isSelected ? "#C4A2FB" : `${color}66`}
                    strokeWidth={isSelected ? 1.5 : 1}
                    className={isSelected ? "node-dot" : ""}
                    style={isSelected ? { animation: `onze-node-pulse 1.8s ease-in-out infinite` } as React.CSSProperties : undefined}
                  />
                  {/* brilho interno quando selecionado */}
                  {isSelected && (
                    <circle
                      cx={n.x} cy={n.y}
                      r={r * 0.55}
                      fill="#fff"
                      opacity="0.6"
                    />
                  )}
                  {/* rótulo do nó */}
                  <text
                    x={n.x}
                    y={n.y + r + 11}
                    textAnchor="middle"
                    fill={isSelected ? "#C4A2FB" : "#8f8f99"}
                    fontSize="7.5"
                    fontFamily="inherit"
                    className="pointer-events-none"
                    style={{ fontFamily: "inherit" }}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}

            {/* núcleo central: ONZE */}
            <g transform="translate(215,222) scale(0.68) translate(-32,-44)">
              <rect width="64" height="88" rx="32" fill="url(#fd-logo)" />
              <rect x="18" y="13" width="28" height="62" rx="14" fill="#08080B" />
              <circle cx="32" cy="44" r="7" fill="#A855F7" />
            </g>

            {/* anéis orbitais */}
            <ellipse
              cx="215" cy="222"
              rx="52" ry="20"
              fill="none"
              stroke="#C4A2FB"
              strokeWidth="0.8"
              strokeDasharray="3 8"
              opacity="0.35"
              className="orbital-ring"
            />
            <ellipse
              cx="215" cy="222"
              rx="72" ry="30"
              fill="none"
              stroke="#A855F7"
              strokeWidth="0.6"
              strokeDasharray="2 12"
              opacity="0.20"
              className="orbital-ring-2"
            />
          </svg>
        </div>

        {/* card de detalhe do nó selecionado */}
        <div
          className={`border-t border-line transition-all duration-200 ease-out ${
            selectedNode
              ? "max-h-40 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden border-t-0"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {selectedNode && (
            <div className="space-y-2.5 px-4 pt-3 pb-4 sm:px-5">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ background: CATEGORY_COLOR[selectedNode.category] }}
                />
                <span className="text-[0.625rem] font-medium uppercase tracking-[0.12em] text-muted-dim">
                  {selectedNode.category}
                </span>
              </div>
              <p className="text-[0.8125rem] font-medium leading-snug text-fg">
                {selectedNode.label}
              </p>
              <p className="text-[0.75rem] leading-relaxed text-muted">
                {selectedNode.detail}
              </p>
              <p className="text-[0.75rem] leading-relaxed text-brand-light">
                <span className="font-medium">ONZE: </span>
                {selectedNode.onze}
              </p>
            </div>
          )}
        </div>

        {/* barra de status inferior */}
        <div className="border-t border-line px-4 pt-3 pb-4 sm:px-5">
          <div className="flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-line bg-surface-2/70 px-4 py-3">
            <span className="shrink-0 text-[0.625rem] tracking-[0.12em] text-muted-dim uppercase">
              Status
            </span>
            <div className="flex min-w-0 flex-wrap justify-end gap-x-4 gap-y-1">
              <span className="text-[0.6875rem] text-muted">
                Campanhas · Google · Meta · Rotina semanal
              </span>
              <span className="shrink-0 text-[0.625rem] text-brand-light">ao vivo</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-right text-[0.6875rem] leading-relaxed text-muted-dim">
        Clique ou tabule até um nó para explorar cada etapa.
      </p>
    </div>
  );
}
