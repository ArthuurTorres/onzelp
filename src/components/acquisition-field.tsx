"use client";

import { useState, useCallback } from "react";

/* ── 6 nós do ciclo de aquisição ── */
type NodeData = {
  id: number;
  cx: number;
  cy: number;
  label: string;
  category: "estratégia" | "canal" | "métrica" | "técnica";
  detail: string;
  onze: string;
};

const NODES: NodeData[] = [
  {
    id: 0,
    cx: 450, cy: 135,
    label: "Orçamento",
    category: "estratégia",
    detail: "A verba é alocada por canal, campanha e período. Cada plataforma tem dinâmica própria de custo e alcance.",
    onze: "Mapeamos onde seu investimento tem mais retorno e ajustamos a distribuição.",
  },
  {
    id: 1,
    cx: 640, cy: 225,
    label: "Google Ads",
    category: "canal",
    detail: "Search, Display, Shopping e YouTube. Leilão em tempo real determina o custo por clique ou mil impressões.",
    onze: "Estrutura de campanhas, correspondência de palavras-chave e estratégia de lance.",
  },
  {
    id: 2,
    cx: 700, cy: 400,
    label: "Meta Ads",
    category: "canal",
    detail: "Facebook e Instagram. Segmentação por interesse, comportamento e público similar.",
    onze: "Criação de audiences, posicionamento de formato e otimização de frequência.",
  },
  {
    id: 3,
    cx: 640, cy: 575,
    label: "Lance",
    category: "técnica",
    detail: "CPC máximo, CPA alvo, ROAS mínimo — a forma como você compete no leilão determina quantas oportunidades recebe.",
    onze: "Estratégias Smart Bid e ajustes manuais conforme performance.",
  },
  {
    id: 4,
    cx: 260, cy: 575,
    label: "Impressões",
    category: "métrica",
    detail: "Quantas vezes seu anúncio foi exibido. Volume de alcance depende da concorrência, segmentação e lance.",
    onze: "Monitoramos taxa de share de impressão e custo por mil para corrigir desperdício.",
  },
  {
    id: 5,
    cx: 200, cy: 400,
    label: "Cliques",
    category: "métrica",
    detail: "Interações com o anúncio que levam ao site. Cada clique tem um custo e uma intenção por trás.",
    onze: "Otimizamos criativo, pública-alvo e página de destino para reduzir CPL.",
  },
];

const LOGO = { cx: 450, cy: 400 };

const CATEGORY_COLOR: Record<NodeData["category"], string> = {
  estratégia: "#a855f7",
  canal: "#6366f1",
  métrica: "#06b6d4",
  técnica: "#f59e0b",
};

/* ── Partículas que percorrem os caminhos ── */
type PathSegment = {
  id: string;
  d: string;
  duration: number;
  delay: number;
};

const PATHS: PathSegment[] = [
  // orçamento ↔ google
  { id: "p01", d: "M 450 285 C 510 220 580 200 640 225", duration: 2.2, delay: 0.0 },
  // orçamento ↔ cliques
  { id: "p05", d: "M 450 400 L 200 400", duration: 1.8, delay: 0.5 },
  // google ↔ meta
  { id: "p12", d: "M 640 260 C 670 320 680 360 700 400", duration: 2.5, delay: 0.8 },
  // google ↔ logo
  { id: "p1l", d: "M 640 265 Q 550 330 450 365", duration: 1.6, delay: 0.3 },
  // meta ↔ lance
  { id: "p23", d: "M 680 440 Q 660 510 640 545", duration: 2.0, delay: 1.1 },
  // meta ↔ logo
  { id: "p2l", d: "M 665 390 Q 560 390 490 390", duration: 1.5, delay: 0.6 },
  // lance ↔ logo
  { id: "p3l", d: "M 600 540 Q 520 490 460 430", duration: 2.3, delay: 1.4 },
  // lance ↔ impressões
  { id: "p34", d: "M 640 575 L 260 575", duration: 1.7, delay: 0.9 },
  // impressões ↔ cliques
  { id: "p45", d: "M 290 575 Q 230 575 200 540", duration: 2.1, delay: 1.7 },
  // impressões ↔ logo
  { id: "p4l", d: "M 300 540 Q 360 480 430 430", duration: 1.9, delay: 0.4 },
  // cliques ↔ logo
  { id: "p5l", d: "M 235 390 Q 330 390 410 390", duration: 1.4, delay: 0.7 },
  // orçamento ↔ logo
  { id: "p0l", d: "M 450 175 Q 450 280 450 340", duration: 1.3, delay: 0.2 },
];

/* ── Campos de pontos decorativos ── */
const DECO_POINTS = Array.from({ length: 40 }, (_, i) => {
  const seed = i * 17 + 7;
  const x = ((seed * 7) % 880) + 20;
  const y = ((seed * 13) % 640) + 20;
  const r = (seed % 3 === 0) ? 1.4 : (seed % 2 === 0) ? 0.8 : 0.5;
  const opacity = ((seed % 11) + 3) / 14;
  return { x, y, r, opacity };
});

export function AcquisitionField() {
  const [focused, setFocused] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const activeNode = selected ?? focused;

  const handleFocus = useCallback((id: number) => setFocused(id), []);
  const handleBlur = useCallback(() => setFocused(null), []);
  const handleSelect = useCallback((id: number) => setSelected((v) => (v === id ? null : id)), []);

  return (
    <div className="w-full">
      <svg
        viewBox="110 70 700 570"
        preserveAspectRatio="xMidYMid meet"
        className="w-full max-w-full overflow-visible"
        aria-label="Constelacao interativa do ciclo de aquisicao de trafego pago"
        role="group"
      >
        <defs>
          <linearGradient id="onze-mark" x1="8" y1="0" x2="56" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="55%" stopColor="#8B2FE0" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="node-glow-strategia" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="node-glow-canal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="node-glow-métrica" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="node-glow-técnica" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Campos de pontos decorativos ── */}
        {DECO_POINTS.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={pt.r}
            fill="#a855f7"
            opacity={pt.opacity}
            className="deco-point"
          />
        ))}

        {/* ── Brilho central ── */}
        <circle cx={LOGO.cx} cy={LOGO.cy} r={120} fill="url(#core-glow)" className="core-glow" />

        {/* ── Caminhos curvos ── */}
        {PATHS.map((p) => {
          const isActive = activeNode !== null && (
            p.id.startsWith(`p${activeNode}`) || p.id.endsWith(`${activeNode}l`)
          );
          return (
            <path
              key={p.id}
              d={p.d}
              fill="none"
              stroke={isActive ? "#c4a2fb" : "#c4a2fb"}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeDasharray={isActive ? "none" : "4 10"}
              opacity={isActive ? 0.7 : 0.25}
              className={`field-path${isActive ? " active-path" : ""}`}
            />
          );
        })}

        {/* ── Partículas que percorrem os caminhos ── */}
        {PATHS.map((p) => (
          <circle key={`particle-${p.id}`} r={2.5} fill="#c4a2fb" opacity={0.9} filter="url(#glow-filter)">
            <animateMotion dur={`${p.duration}s`} repeatCount="indefinite" begin={`${p.delay}s`} calcMode="linear">
              <mpath href={`#path-${p.id}`} />
            </animateMotion>
          </circle>
        ))}
        {/* Rotas nomeadas para mpath */}
        {PATHS.map((p) => (
          <path key={p.id} id={`path-${p.id}`} d={p.d} fill="none" stroke="none" />
        ))}

        {/* ── Nó central: logo ONZE ── */}
        <g transform={`translate(${LOGO.cx}, ${LOGO.cy})`} className="logo-node">
          {/* halo externo */}
          <circle r={55} fill="url(#core-glow)" className="core-glow" opacity={0.5} />
          {/* anel orbital externo */}
          <ellipse
            rx={52} ry={18}
            fill="none" stroke="#c4a2fb" strokeWidth={0.8}
            strokeDasharray="3 8" opacity={0.35}
            className="orbital-ring"
          />
          {/* anel orbital interno */}
          <ellipse
            rx={38} ry={14}
            fill="none" stroke="#a855f7" strokeWidth={0.6}
            strokeDasharray="2 10" opacity={0.2}
            className="orbital-ring-2"
          />
          {/* logo */}
          <g transform="scale(0.65) translate(-32,-44)">
            <rect width={64} height={88} rx={32} fill="url(#onze-mark)" />
            <rect x={18} y={13} width={28} height={62} rx={14} fill="#08080b" />
            <circle cx={32} cy={44} r={7} fill="#a855f7" />
          </g>
        </g>

        {/* ── Nós orbitais ── */}
        {NODES.map((n) => {
          const color = CATEGORY_COLOR[n.category];
          const isFocused = focused === n.id;
          const isActive = activeNode === n.id;
          const r = isActive ? 22 : (isFocused ? 20 : 18);
          const glowId = `node-glow-${n.category}`;

          return (
            <g
              key={n.id}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}: ${n.detail}`}
              onMouseEnter={() => handleFocus(n.id)}
              onMouseLeave={() => handleBlur()}
              onFocus={() => handleFocus(n.id)}
              onBlur={() => handleBlur()}
              onClick={() => handleSelect(n.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelect(n.id)}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {/* halo de fundo */}
              <circle
                cx={n.cx} cy={n.cy} r={isActive ? 55 : 40}
                fill={`url(#${glowId})`}
                className="node-halo-bg"
                style={{ transition: "r 0.3s ease-out, opacity 0.3s" }}
              />
              {/* núcleo do nó */}
              <circle
                cx={n.cx} cy={n.cy}
                r={r}
                fill={isActive ? color : `${color}cc`}
                stroke={isActive ? "#c4a2fb" : `${color}88`}
                strokeWidth={isActive ? 1.5 : 0.8}
                className="node-circle"
                style={{ transition: "r 0.25s, fill 0.25s, stroke 0.25s" }}
                filter={isActive ? "url(#glow-filter)" : undefined}
              />
              {/* brilho interno */}
              {isActive && (
                <circle cx={n.cx} cy={n.cy} r={r * 0.5} fill="#fff" opacity={0.5} />
              )}
              {/* label */}
              <text
                x={n.cx}
                y={n.cy + r + 14}
                textAnchor="middle"
                fill={isActive ? "#c4a2fb" : "#8f8f99"}
                fontSize={isActive ? 9.5 : 8}
                fontFamily="inherit"
                className="node-label"
                style={{ transition: "fill 0.25s, font-size 0.25s" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ── Painel de detalhe do nó selecionado ── */}
      {selected !== null && (() => {
        const n = NODES.find((nd) => nd.id === selected)!;
        const color = CATEGORY_COLOR[n.category];
        return (
          <div
            className="mt-3 rounded-2xl border border-line bg-surface/70 p-4 backdrop-blur-sm transition-all duration-200"
            role="region"
            aria-live="polite"
            aria-label={`Detalhes: ${n.label}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em]"
                  style={{ backgroundColor: `${color}22`, color }}
                >
                  {n.category}
                </span>
                <p className="mt-1.5 text-[0.875rem] font-semibold text-fg">{n.label}</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-muted">{n.detail}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Fechar detalhe"
                className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-fg"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-[0.8rem] leading-relaxed text-brand-light">
              <span className="font-medium">ONZE: </span>
              {n.onze}
            </p>
          </div>
        );
      })()}

      <p className="mt-3 text-center text-[0.6875rem] leading-relaxed text-muted-dim">
        Navegue entre os nós com mouse ou Tab · Enter para selecionar
      </p>
    </div>
  );
}
