"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Deslocamento total em px ao longo da passagem pela viewport. */
  distance?: number;
};

/**
 * Parallax leve: só transforma elementos decorativos, roda em rAF e
 * desliga em prefers-reduced-motion. Não sequestra o scroll.
 */
export function Parallax({ children, className = "", distance = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      if (rect.bottom >= viewport + 200) return;
      // -1 (entrando por baixo) → 1 (saindo por cima)
      const progress = (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2);
      node.style.setProperty("--parallax-y", `${(progress * distance * -1).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      node.style.removeProperty("--parallax-y");
    };
  }, [distance]);

  return (
    <div ref={ref} className={`parallax-layer ${className}`}>
      {children}
    </div>
  );
}
