---
title: "Continuidade após limite de tokens"
theme: "Continuidade de execução"
tags: ["execucao", "continuidade"]
updated: 2026-10-29T21:34:10.293Z
via: llm
sources: ["quando uma execução travar por orçamento de tokens excedido, repetir a requisição e continuar do ponto interrompido, conferindo o estado atual antes de agir."]
---

# Continuidade após limite de tokens

> **TL;DR:** Quando uma execução exceder o orçamento de tokens, repita a requisição e retome do ponto interrompido.

- Repetir a requisição quando a execução travar por exceder o orçamento de tokens.
- Conferir o estado atual antes de tomar qualquer ação.
- Continuar a execução a partir do ponto em que foi interrompida.
