---
postId: 3
title: "Registro | Anytech: IA no desenvolvimento de software"
description: "Conteúdos apresentados em call com a equipe de desenvolvimento do dr.Jon."
date: 2025-04-29
tags: ["RLLMs", "agentes", "RAG", "embeddings"]
---

Durante uma apresentação realizado com a equipe de desenvolvedores do Dr.Jon sobre Inteligência Artificial aplicada ao desenvolvimento, resolvi registrar os principais conceitos que saíram de lá. Não como um glossário frio, mas como realmente faz sentido pra mim depois de tudo que foi discutido.
 
## O contexto geral
 
A velocidade com que as LLMs chegaram ao mercado obrigou as empresas a se adaptarem rápido. E quem trabalha com desenvolvimento precisa entender o que está acontecendo: não para ter medo, mas para não ficar pra trás.
 
A visão que ficou mais clara pra mim foi essa: as vagas júnior e estágio ainda existem, mas o perfil pedido mudou. Saber lógica, banco de dados e estrutura de dados ainda é necessário, mas saber usar IA para otimizar seu próprio trabalho virou diferencial real. Empresas estão reduzindo equipes e distribuindo as mesmas tarefas para menos pessoas com o apoio de agentes. A ideia de *"everyone is a manager with AI"* resume bem isso.

## LLMs — o que são de verdade
 
LLM (Large Language Model) é o nome técnico para os grandes modelos de linguagem como GPT, Gemini e outros. Eles são redes neurais treinadas em volumes enormes de dados e funcionam com base em probabilidade — dado um contexto, qual é a resposta mais provável?
 
A analogia mais simples é o corretor do celular: ele sugere a próxima palavra com base no que você digitou. A LLM faz isso em escala muito maior, com muito mais contexto.
 
Um detalhe importante: nas versões privadas e pagas, o uso é cobrado por **tokens** — pequenas unidades que representam pedaços de texto. Saber isso importa na hora de construir sistemas com IA, porque cada requisição tem um custo.

## Agentes de IA
 
Um chatbot comum recebe uma pergunta e retorna texto. Um **agente** vai além disso.
 
Ele usa uma LLM como "cérebro", mas tem acesso a ferramentas externas: pode navegar na web, consultar APIs, gravar dados em planilhas, enviar e-mails. Ele não só responde, ele age. E pode encadear várias ações em sequência para completar uma tarefa complexa.
 
É esse conceito que está por trás das automações reais que as empresas estão implementando no mercado atual.

## LangChain e LangGraph
 
São dois frameworks para construir aplicações com LLMs, e entender a diferença entre eles ajuda bastante.
 
**LangChain** segue um fluxo linear: entrada -> processamento -> saída. É útil quando você quer, por exemplo, cruzar a resposta de uma LLM com um documento de referência confiável antes de devolver o resultado.
 
**LangGraph** é para fluxos mais complexos. Ele trabalha com nós (ações), arestas (transições) e estados (memória), o que permite criar sistemas multi-agentes. Imagine um pipeline que lê um documento, extrai trechos relevantes, cruza com outra fonte, e envia o resultado por e-mail todo dia útil, isso é LangGraph.

## RAG — fazendo a IA falar sobre o seu conteúdo
 
**RAG (Retrieval Augmented Generation)** é a técnica de fazer uma LLM consultar uma base de conhecimento externa antes de responder. Em vez de depender só do que ela foi treinada, você alimenta ela com seus próprios documentos e ela responde com base nisso, sem precisar retreinar o modelo.
 
É a base de sistemas como assistentes internos de empresas, ferramentas de busca em documentação, chatbots com contexto específico.
 
**Graph RAG** é uma evolução disso. Em vez de recuperar trechos isolados, ele cria um grafo de conhecimento conectando as entidades dos documentos. Quando as informações relevantes estão espalhadas em vários arquivos, o RAG comum pode achar os fatos mas não consegue conectar as pontas. O Graph RAG cria esse mapa antes mesmo de receber a pergunta, e navega por ele para entregar uma resposta completa.

## Context Engineering
 
Muita gente conhece Prompt Engineering como a arte de escrever boas instruções para a IA. **Context Engineering** é um nível acima disso.
 
Enquanto o prompt foca na instrução, a engenharia de contexto foca na qualidade da informação que você fornece para o modelo. O objetivo é garantir que a LLM receba só o que é relevante, organizado da forma certa, reduzindo alucinações e evitando desperdício de tokens.
 
Na prática:
- Prompt Engineering funciona bem para tarefas pontuais e geração de conteúdo
- Context Engineering é o que sustenta assistentes conversacionais e ferramentas de análise de documentos
- Os dois juntos são o que separa um experimento de uma aplicação em produção

## Embeddings e Vector Stores
 
**Embeddings** são a forma como texto vira matemática. A técnica transforma palavras e frases em vetores numéricos, permitindo calcular a "distância semântica" entre eles. Com isso, o modelo entende que "cachorro" e "cão" são equivalentes, e a busca deixa de ser por palavra exata para ser por contexto.
 
**Vector Stores** são os bancos de dados que armazenam esses vetores. São eles que permitem recuperar informações semanticamente próximas de forma rápida, e são peça central em qualquer sistema RAG.

## PRD
 
Por último, um conceito mais de processo: o **PRD (Product Requirements Document)** é o documento que orienta todo mundo envolvido no desenvolvimento de um produto. Ele define o que o produto faz, para quem, quais os benefícios e quais recursos são necessários. Normalmente é responsabilidade do Product Owner.

---
 
Foram bastante conceitos num período curto, mas o que ficou foi a sensação de que o ecossistema de IA para desenvolvimento já tem estrutura suficiente para ser aprendido de forma sistemática. Não é só "usar o ChatGPT" — tem arquitetura, decisões técnicas, ferramentas específicas. Realmente uma ótima experiência.