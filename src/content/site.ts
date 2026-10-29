export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Serviços", href: "#servicos" },
  { label: "Metodologia", href: "#metodologia" },
  { label: "Resultados", href: "#resultados" },
  { label: "Dúvidas", href: "#faq" },
];

export type Service = {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
};

export const services: Service[] = [
  {
    id: "midia",
    title: "Gestão de tráfego pago",
    summary:
      "Operação de mídia com estrutura de campanha, públicos e criativos construídos sobre um objetivo comercial — não sobre o botão de publicar.",
    bullets: ["Google Ads e Meta Ads", "Estrutura de contas e rastreamento", "Rotina de otimização"],
  },
  {
    id: "aquisicao",
    title: "Estratégia de aquisição",
    summary:
      "Definição de canais, ofertas e prioridades para saber onde investir primeiro e o que deve ser testado depois.",
    bullets: ["Mapa de canais", "Desenho de funil", "Priorização por potencial"],
  },
  {
    id: "campanhas",
    title: "Planejamento de campanhas",
    summary:
      "Hipóteses claras, metas mensuráveis e cronograma de testes para que cada real investido gere aprendizado.",
    bullets: ["Hipóteses de oferta", "Metas e orçamento", "Calendário de testes"],
  },
  {
    id: "otimizacao",
    title: "Monitoramento e otimização",
    summary:
      "Acompanhamento contínuo de entrega, custo e qualidade do lead, com ajustes feitos a partir de leitura de dados.",
    bullets: ["Cortes de desperdício", "Escala controlada", "Alertas de desvio"],
  },
  {
    id: "dados",
    title: "Análise de dados e performance",
    summary:
      "Painéis e leituras periódicas que traduzem a mídia em linguagem de negócio, com contexto para decidir.",
    bullets: ["Painel de performance", "Leitura mensal", "Atribuição por origem"],
  },
  {
    id: "conversao",
    title: "Otimização de conversão",
    summary:
      "Revisão da jornada entre o clique e o contato para que o investimento em mídia não se perca no caminho.",
    bullets: ["Revisão de página", "Testes de formulário", "Redução de atrito"],
  },
];

export type Step = {
  number: string;
  title: string;
  description: string;
  deliverable: string;
};

export const steps: Step[] = [
  {
    number: "01",
    title: "Diagnóstico",
    description:
      "Entendemos o negócio, o público, a oferta e o histórico de mídia. Sem isso, qualquer campanha começa no escuro.",
    deliverable: "Leitura do cenário e objetivos acordados",
  },
  {
    number: "02",
    title: "Estratégia",
    description:
      "Definimos canais, campanhas e prioridades. Cada frente recebe uma hipótese e um critério de sucesso antes de ir ao ar.",
    deliverable: "Plano de mídia com prioridades",
  },
  {
    number: "03",
    title: "Execução",
    description:
      "Configuramos, publicamos e acompanhamos as campanhas com rastreamento correto e rotina de leitura definida.",
    deliverable: "Campanhas ativas e mensuradas",
  },
  {
    number: "04",
    title: "Otimização",
    description:
      "Analisamos os dados, cortamos o que não performa e ampliamos o que funciona. O ciclo se repete com método.",
    deliverable: "Relatório de decisões e próximos testes",
  },
];

export type Differential = { title: string; description: string };

export const differentials: Differential[] = [
  {
    title: "Estratégia antes de mídia",
    description:
      "Nenhuma campanha começa antes de entender oferta, margem e objetivo comercial do negócio.",
  },
  {
    title: "Leitura de negócio, não de vaidade",
    description:
      "Custo por oportunidade e qualidade do lead pesam mais do que alcance e curtida.",
  },
  {
    title: "Acompanhamento próximo",
    description:
      "Rotina de contato e leitura periódica para que a decisão não dependa de um relatório no fim do mês.",
  },
  {
    title: "Estrutura transparente",
    description:
      "Você sabe o que está sendo feito, com qual orçamento e por qual motivo — inclusive quando o resultado pede recuo.",
  },
];

export type Faq = { question: string; answer: string };

export const faq: Faq[] = [
  {
    question: "Como funciona a contratação?",
    answer:
      "O primeiro passo é o diagnóstico, uma conversa para entender o negócio e o momento da operação. A partir dela, a ONZE apresenta escopo, prioridades e formato de trabalho. A contratação só acontece depois dessa etapa, com o escopo claro para os dois lados.",
  },
  {
    question: "Para quais negócios a gestão de tráfego é indicada?",
    answer:
      "Para negócios que já vendem e querem previsibilidade na aquisição de clientes, com oferta definida e capacidade de atender a demanda gerada. Se ainda não houver clareza sobre produto, margem ou processo comercial, isso é tratado antes de investir em mídia.",
  },
  {
    question: "Como funciona o diagnóstico inicial?",
    answer:
      "É uma conversa estruturada sobre o negócio, o público, o que já foi testado em mídia e quais são os objetivos. O resultado é uma leitura honesta do cenário: onde existe oportunidade real e o que precisa ser resolvido antes de aumentar investimento.",
  },
  {
    question: "Como são acompanhados os resultados?",
    answer:
      "Com métricas definidas antes do início das campanhas e leituras periódicas sobre investimento, custo por oportunidade, conversão e qualidade dos contatos gerados. O formato e a frequência são acordados no escopo do projeto.",
  },
  {
    question: "Qual é o investimento necessário?",
    answer:
      "O valor depende do objetivo, do canal e do volume de campanhas — por isso não trabalhamos com tabela fixa antes do diagnóstico. Existem dois valores distintos: o investimento em mídia, pago às plataformas, e a remuneração pelo serviço de gestão.",
  },
  {
    question: "Como começar a trabalhar com a ONZE?",
    answer:
      "Envie o formulário de diagnóstico com o contexto do seu negócio. A partir das informações, a ONZE entra em contato para agendar a conversa inicial e verificar se existe encaixe entre o momento da empresa e o trabalho proposto.",
  },
];

export type ResultMetric = { label: string; description: string };

export const resultMetrics: ResultMetric[] = [
  { label: "Investimento", description: "Quanto foi aplicado em mídia e em quais canais." },
  { label: "Custo por oportunidade", description: "Quanto custa gerar um contato qualificado." },
  { label: "Taxa de conversão", description: "Onde a jornada perde gente e por quê." },
  { label: "Qualidade do lead", description: "Se o contato gerado avança na conversa comercial." },
];

export const siteConfig = {
  name: "ONZE",
  tagline: "Agência de tráfego pago e marketing de performance",
  description:
    "A ONZE conecta estratégia, mídia e análise de dados para transformar investimento em campanhas mais inteligentes e oportunidades reais de negócio.",
  // URL pública usada em canonical, Open Graph e sitemap.
  // Troque pela URL final do domínio no arquivo .env.local (NEXT_PUBLIC_SITE_URL).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
