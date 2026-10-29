import { Logo } from "@/components/logo";
import { nav } from "@/content/site";
import { ArrowUpRight } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-10" aria-label="Rodapé">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <a
              href="#topo"
              aria-label="ONZE — ir para o início"
              className="inline-flex min-h-11 items-center focus-visible:outline-brand-bright"
            >
              <Logo markClassName="h-8" />
            </a>
            <p className="mt-4 max-w-xs text-[0.8125rem] leading-relaxed text-muted">
              Estratégia, mídia e dados para aquisição com direção.
            </p>
          </div>

          <nav aria-label="Links do rodapé" className="grid grid-cols-2 gap-x-12 gap-y-1 sm:flex sm:gap-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-6 items-center text-[0.75rem] text-muted transition-colors hover:text-fg focus-visible:outline-brand-bright sm:px-2 sm:first:pl-0 sm:last:pr-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contato"
              className="inline-flex min-h-6 items-center gap-1 text-[0.75rem] font-medium text-brand-light transition-colors hover:text-fg focus-visible:outline-brand-bright sm:px-2 sm:last:pr-0"
            >
              Contato <ArrowUpRight size={12} />
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-5 text-[0.6875rem] text-muted-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ONZE. Todos os direitos reservados.</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <a
              href="/privacidade"
              className="inline-flex min-h-6 items-center transition-colors hover:text-fg focus-visible:outline-brand-bright"
            >
              Política de privacidade
            </a>
            <span aria-hidden="true" className="text-line-strong">
              ·
            </span>
            <span>© ONZE</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
