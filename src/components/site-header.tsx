"use client";

import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { ArrowUpRight } from "@/components/icons";
import { track } from "@/lib/analytics";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className="fixed inset-x-0 top-0 z-40 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:bg-ink/80 data-[scrolled=true]:backdrop-blur-xl"
    >
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-[76px]">
        <a
          href="#topo"
          aria-label="ONZE — ir para o início"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-bright"
        >
          <Logo markClassName="h-7" animated />
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[0.8125rem] font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="#contato"
            onClick={() => track("contact_cta_click", { location: "header" })}
            className="group hidden h-10 items-center gap-2 rounded-full bg-fg px-5 text-[0.8125rem] font-semibold text-ink transition-colors hover:bg-brand-light hover:text-white md:inline-flex"
          >
            Solicitar diagnóstico
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
