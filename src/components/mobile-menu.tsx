"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

const ctaHref = "/#contato";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="grid size-10 place-items-center rounded-full border border-line text-fg transition-colors hover:bg-white/5 focus-visible:outline-brand-bright md:hidden"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {open ? (
        <div
          ref={panelRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="fixed inset-0 z-50 flex flex-col bg-ink/98 px-5 pb-7 pt-5 backdrop-blur-xl md:hidden"
        >
          <div className="flex items-center justify-between">
            <Logo markClassName="h-8" />
            <button
              type="button"
              onClick={close}
              className="grid size-10 place-items-center rounded-full border border-line"
              aria-label="Fechar menu"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <nav aria-label="Navegação principal mobile" className="mt-16 flex flex-col">
            {nav.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="group flex items-center justify-between border-b border-line py-5 font-display text-3xl font-medium tracking-[-0.04em] text-fg"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs font-normal text-muted">0{index + 1}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto border-t border-line pt-6">
            <a
              href={ctaHref}
              onClick={close}
              className="flex h-14 w-full items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Solicitar diagnóstico
            </a>
            <p className="mt-5 text-center text-xs leading-relaxed text-muted">
              Estratégia, mídia e dados para aquisição com direção.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}