import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Positioning } from "@/components/positioning";
import { Services } from "@/components/services";
import { Methodology } from "@/components/methodology";
import { Results } from "@/components/results";
import { Differentials } from "@/components/differentials";
import { ContactSection } from "@/components/contact-section";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ONZE | Tráfego Pago Estratégico",
  description:
    "Agência de tráfego pago e performance: estratégia, mídia e análise de dados para transformar investimento em oportunidades reais de negócio.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ONZE",
  description:
    "Agência de tráfego pago e marketing de performance. Estratégia, mídia e análise de dados para aquisição de clientes.",
  // Sem URL, CNPJ, endereço ou perfis sociais: dados institucionais ainda não fornecidos.
};

export default function HomePage() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-fg focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Pular para o conteúdo
      </a>

      <SiteHeader />

      <main id="conteudo">
        <Hero />
        <Positioning />
        <Services />
        <Methodology />
        <Results />
        <Differentials />
        <ContactSection />
        <FaqSection />
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        // Dados estruturados apenas com informações verdadeiras e confirmadas.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
