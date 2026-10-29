# Analytics e atribuição

## Estado atual

Nenhum provedor de analytics, GTM ou pixel publicitário está instalado. Não há ID fictício no código. A função `track` em `src/lib/analytics.ts` envia eventos apenas para um `window.dataLayer` já existente, o que permite conectar GTM sem alterar os componentes.

## Eventos de interface implementados

| Evento | Onde dispara | Observação |
| --- | --- | --- |
| `hero_cta_click` | CTA do hero | Intenção, não conversão |
| `form_start` | primeiro foco no formulário | uma vez por preenchimento |
| `form_submit_success` | resposta `ok` do servidor | conversão confirmada |
| `form_submit_error` | falha de rede ou servidor | inclui motivo técnico, sem dado pessoal |

Eventos de CTA de navbar e contato devem usar o mesmo padrão ao serem adicionados.

## O que fazer antes de ativar

1. Definir provedor e contêiner (GTM, GA4, Meta).
2. Implementar consentimento de cookies não essenciais conforme LGPD, com opt-in real e registro de escolha.
3. Carregar o script somente após consentimento, nunca no `<head>` incondicional.
4. Mapear `form_submit_success` como conversão; manter os demais como microconversões.
5. Não enviar e-mail, nome, telefone ou texto livre em parâmetros de URL, eventos ou títulos de página.
6. Testar em modo debug e confirmar que não há evento duplicado em navegação de retorno.

## UTMs

Se houver campanha paga, preserve parâmetros UTM apenas na URL e em campos ocultos do formulário, nunca em eventos com dado pessoal. Não implementado hoje porque não há destino comercial configurado.
