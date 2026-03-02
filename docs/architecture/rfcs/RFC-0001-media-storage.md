---
Title: RFC-0001: Armazenamento e Processamento de Mídia (WAV/MP3)
Author: Equipe Worship+
Status: Proposta
Date: 2026-02-23
---

# RFC-0001: Armazenamento e Processamento de Mídia (WAV/MP3)

## Contexto

O sistema precisa armazenar e disponibilizar arquivos de áudio (VS: .wav / .mp3) para reprodução e download em dispositivos móveis. Deve equilibrar custo, performance, disponibilidade e possibilidade de restauração de arquivos originais arquivados.

## Proposta

- Armazenamento ativo: usar AWS S3 (ou serviço equivalente) para versões ativas dos arquivos e servir via CDN.
- Arquivamento: mover/duplicar originais para storage mais barato (S3 IA / Glacier ou bucket separado) para reduzir custo; permitir restauração on-demand.
- Formatos suportados no MVP: .wav e .mp3 (não transcodificar no cliente).
- Processamento: transcodificação e geração de derivados (mp3 otimizado, webm, thumbnails) no backend via workers ou funções serverless (ex.: Lambda) enfileiradas (SQS / SNS / jobs).
- Upload: usar presigned URLs para uploads diretos ao bucket ativo; backend recebe notificação do upload e cria job de processamento.
- Download: oferecer presigned URLs para download em mp3 e wav; se o original estiver arquivado, iniciar fluxo de restauração e notificar o usuário.
- Segurança: política de IAM mínima, URLs presigned com TTL adequado, validação de tipo/tamanho no backend e cliente.
- Metadata: salvar metadados em banco (Postgres) com referências para buckets, chaves, status de processamento e histórico de lifecycle.
- Observabilidade: registrar métricas de sucesso/falha, duração de jobs, e custos estimados.

## Justificativa

- S3 + CDN oferece baixa latência e escalabilidade para playback móvel.
- Arquivamento reduz custos long-term mantendo possibilidade de recuperação.
- Backend processing centraliza lógica pesada (ffmpeg) e evita carga em dispositivos móveis.

## Alternativas consideradas

- Armazenamento local no servidor (rejeitado por escala e disponibilidade).
- Transcodificação no cliente (rejeitado por inconsistência de dispositivos e consumo de CPU/bateria).

## Impactos e próximos passos

- Implementar fluxo: presigned upload → notificacao → queue → worker → derived assets → CDN.
- Definir política de lifecycle (ex.: originals ativos 90 dias → IA → archive após 2 anos).
- Implementar endpoint para requisitar restauração de arquivos arquivados e emissão de presigned URL de download.

## Questões em aberto (mover para brainstorm-insights)

- TTL de presigned URLs (upload/download) ideal para mobile?
- Política exata de retenção (dias) para originals vs derivados?
- Limite de tamanho e compressão recomendada para uploads móveis?


