type LogoMarkProps = {
  className?: string;
  title?: string;
  /** Liga órbita, núcleo pulsante e brilho (desligado no rodapé e em reduced-motion). */
  animated?: boolean;
};

export function LogoMark({ className = "", title, animated = false }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 88"
      className={`${animated ? "logo-mark" : ""} ${className}`}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <linearGradient id="onze-mark" x1="8" y1="0" x2="56" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A855F7" />
          <stop offset="0.55" stopColor="#8B2FE0" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="onze-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="onze-mark-clip">
          <rect width="64" height="88" rx="32" />
        </clipPath>
      </defs>

      <rect width="64" height="88" rx="32" fill="url(#onze-mark)" />

      {animated ? (
        <g clipPath="url(#onze-mark-clip)">
          <rect className="logo-shine" x="-24" y="-20" width="16" height="128" fill="url(#onze-shine)" />
        </g>
      ) : null}

      <rect x="18" y="13" width="28" height="62" rx="14" fill="#08080B" />

      {animated ? (
        <circle
          className="logo-orbit"
          cx="32"
          cy="44"
          r="11"
          fill="none"
          stroke="#C4A2FB"
          strokeWidth="1.2"
          strokeDasharray="3 6"
          strokeLinecap="round"
          opacity="0.55"
        />
      ) : null}

      <circle className="logo-core" cx="32" cy="44" r="7" fill="#A855F7" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  animated?: boolean;
};

export function Logo({ className = "", markClassName = "h-7", animated = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={`${markClassName} w-auto`} animated={animated} />
      <span className="font-display text-[1.35rem] leading-none font-semibold tracking-[-0.04em] text-fg">
        ONZE
      </span>
    </span>
  );
}