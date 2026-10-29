# ONZE — landing page

Landing page da ONZE, agência de tráfego pago e marketing de performance.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Verificações

```bash
npm run typecheck
npm run build
npm run lint
npm test
npm run test:e2e
node scripts/audit.mjs
node scripts/check-visibility.mjs
node scripts/check-a11y-perf.mjs
node scripts/check-styles.mjs
node scripts/check-motion.mjs
node scripts/verify-changes.mjs
```

Os scripts de auditoria sobem contra `http://localhost:3000` (ajustável por `AUDIT_URL`) e exigem o servidor de produção rodando (`npm run build && npm start`). `audit.mjs` cobre 6 larguras, overflow, console e fluxos; `check-visibility.mjs` mede contraste e âncoras sob o header fixo; `check-a11y-perf.mjs` roda axe-core (WCAG 2.1 AA), LCP/CLS e alvos de toque; `check-styles.mjs` confirma que a folha de estilos realmente chegou ao navegador (mede o CSS computado, não só o HTTP da home) e falha se o `.css` referenciado não for 200. `check-motion.mjs` valida que as animações rodam, que o parallax reage ao scroll e que `prefers-reduced-motion` desliga tudo. `npm run test:e2e` executa a suíte Playwright formal em Chrome desktop e mobile, cobrindo navegação, FAQ, formulário, API, CSS, console, motion e acessibilidade básica.

## Se a página abrir sem estilo

Sintoma: texto em fonte serifada, links azuis sublinhados, conteúdo em largura total. Quase sempre é um `next start` antigo ainda ocupando a porta, servindo uma build cujo arquivo CSS já não existe — a home responde 200, mas o `.css` responde 500.

```bash
node scripts/check-styles.mjs   # mede o CSS computado e denuncia o caso
```

Encerre os processos antigos na porta e suba um servidor limpo:

```bash
netstat -ano | grep ":3000" | grep LISTENING
npm run build && npm start
```

## Formulário de diagnóstico

O formulário está implementado com:

- Validação compartilhada no servidor com Zod.
- Mensagens de erro acessíveis e foco no primeiro campo inválido.
- Honeypot para spam simples.
- Rate limit em memória: 5 tentativas por IP a cada 10 minutos.
- Estado de carregamento, erro e envio duplicado bloqueado.
- Evento de interface preparado para `window.dataLayer`, sem script de analytics instalado.

A rota `/api/diagnostico` não simula um envio: sem um destino comercial, responde `503` com estado de integração não configurada. Para conectar um CRM ou webhook, defina no ambiente:

```env
LEAD_WEBHOOK_URL=https://seu-endpoint-privado.example/leads
NEXT_PUBLIC_SITE_URL=https://seu-dominio.example
```

O endpoint é chamado apenas no servidor. Não coloque tokens ou URLs com credenciais no código enviado ao navegador. Para produção com múltiplas instâncias, substitua o rate limit em memória por um armazenamento compartilhado.

## Analytics

Nenhum Google Analytics, GTM, Meta Pixel ou ID fictício é carregado. Os eventos de interface são enviados somente para `window.dataLayer` quando um provedor externo estiver presente. Consulte [docs/ANALYTICS.md](docs/ANALYTICS.md) antes de conectar mensuração e consentimento LGPD.

## 21st.dev

A pesquisa de referências foi feita no catálogo público do 21st.dev para hero, CTA e FAQ. O CLI/MCP não estava instalado ou autenticado neste ambiente, então nenhum componente externo foi instalado ou alegado como utilizado. A implementação final usa componentes próprios, com a direção de composição inspirada nas categorias pesquisadas.

## Conteúdo comercial pendente

Ainda dependem de informação da ONZE:

- Domínio final, canais de contato e perfis oficiais.
- Política de privacidade publicada.
- URL de CRM/webhook e eventual provedor de e-mail.
- Estudos de caso, depoimentos, logos e métricas autorizadas.
- CNPJ e demais informações institucionais.

A página mantém esses itens ausentes ou claramente marcados para não inventar prova social, contato ou resultado.
