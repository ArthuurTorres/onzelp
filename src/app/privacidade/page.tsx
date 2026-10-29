import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Informações sobre o tratamento de dados no site da ONZE.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink py-12 text-fg md:py-20">
      <article className="shell max-w-3xl">
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-fg focus-visible:outline-brand-bright"
        >
          ← Voltar para a ONZE
        </Link>
        <p className="eyebrow mt-16">Privacidade</p>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
          Política de privacidade
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <p>
            Este documento descreve, de forma resumida, como o site da ONZE trata
            informações enviadas pelo formulário de diagnóstico.
          </p>
          <section aria-labelledby="dados">
            <h2 id="dados" className="font-display text-xl font-medium text-fg">
              Dados coletados
            </h2>
            <p className="mt-2">
              O formulário pode solicitar nome, e-mail, empresa, segmento, objetivo
              e faixa opcional de investimento. Esses dados são usados somente para
              avaliar o contexto comercial e responder ao contato.
            </p>
          </section>
          <section aria-labelledby="envio">
            <h2 id="envio" className="font-display text-xl font-medium text-fg">
              Armazenamento e compartilhamento
            </h2>
            <p className="mt-2">
              Enquanto um canal comercial não estiver configurado, o formulário não
              confirma o recebimento nem envia os dados para terceiros. Quando uma
              integração oficial for ativada, seu destino e suas regras deverão ser
              documentados antes da publicação.
            </p>
          </section>
          <section aria-labelledby="direitos">
            <h2 id="direitos" className="font-display text-xl font-medium text-fg">
              Seus direitos
            </h2>
            <p className="mt-2">
              Para solicitar acesso, correção ou exclusão de dados enviados, use o
              canal oficial informado pela ONZE. O contato institucional ainda será
              publicado nesta página quando fornecido.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
