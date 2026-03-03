# US-050: Upload de Virtual Sound (VS) com Chunked Upload

**Como** Ministro  
**Quero** fazer upload direto de arquivos VS para S3  
**Para que** os músicos possam acessar os áudios de referência

**Bounded Context:** Media Context (Supporting)  
**Prioridade:** P1 - IMPORTANTE  
**Estimativa:** 13 pontos  
**Sprint:** Sprint 5

---

## Critérios de Aceitação

1. ✅ Upload de arquivos .wav, .mp3, .aac (máximo 200MB)
2. ✅ Chunked upload com resumable (conexões móveis instáveis)
3. ✅ Progress bar mostrando % do upload
4. ✅ Upload direto para S3 via presigned URL (sem passar pelo backend)
5. ✅ Processamento assíncrono após upload (Lambda transcodifica)
6. ✅ Notificação quando processamento completa
7. ✅ Fallback para upload tradicional se chunked falhar

---

## Regras de Negócio

- **Tamanho:** Máximo 200MB por arquivo
- **Formatos:** .wav (original), .mp3, .aac (aceitos)
- **Chunk size:** 5MB por chunk (otimizado para mobile)
- **Timeout:** 60s por chunk (conexões lentas)
- **Retry:** 3 tentativas por chunk antes de falhar
- **Storage:** S3 Active (eventos <30 dias), Glacier (>30 dias)

---

## Eventos de Domínio

| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `VSUploadStarted` | Cliente inicia upload | Media Context | Criar registro em `media_files` |
| `VSUploadCompleted` | Último chunk enviado | Media Context, Lambda | Processar arquivo (transcodificar) |
| `VSProcessingCompleted` | Lambda termina processamento | Notification Context | Notificar usuário |
| `VSUploadFailed` | 3 retries falharam | Notification Context | Notificar erro ao usuário |

---

## Dependências

### Técnicas
- [ ] AWS S3 bucket configurado (`worship-plus-media-active`)
- [ ] CloudFront CDN configurado
- [ ] Lambda function para processamento (ffmpeg)
- [ ] Presigned URLs funcionando (API endpoint `/media/upload-url`)
- [ ] Tabela `media_files` criada

### User Stories
- US-004: Criar Evento (para associar VS ao evento)
- US-010: Adicionar Música ao Event Setlist (para vincular VS)

---

## Definição de Pronto (DoD)

- [ ] Código implementado seguindo DDD (Media Context)
- [ ] Componente `VSUploader.jsx` criado e testado
- [ ] Hook `useChunkedUpload` criado (abstração de upload)
- [ ] Testes unitários escritos (coverage >80%)
- [ ] Testes de integração para upload end-to-end
- [ ] **ADR-050** documentando escolha de chunked upload (ver `adr-050.md`)
- [ ] **Sequence Diagram** mostrando fluxo completo (ver `sequence-diagram.mmd`)
- [ ] Contract API validado (presigned URLs)
- [ ] Scenarios BDD validados
- [ ] Code review aprovado
- [ ] Testado em conexões 3G/4G/WiFi
- [ ] Deploy em staging testado

---

## Referências

- **ADR:** [`adr-050-chunked-upload.md`](./adr-050-chunked-upload.md) (decisão técnica chunked vs single upload)
- **Sequence Diagram:** [`sequence-diagram.mmd`](./sequence-diagram.mmd) (fluxo completo de upload)
- **Contract API:** [`contract.yaml`](./contract.yaml)
- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md#media-context)
- **RFC-0001:** [`docs/architecture/rfcs/RFC-0001-media-storage.md`](../../architecture/rfcs/RFC-0001-media-storage.md)

---

## Notas Adicionais

### Performance
- Chunk size otimizado para mobile (5MB)
- Retry automático em falhas temporárias
- Progress granular (por chunk, não apenas arquivo completo)

### Segurança
- Presigned URLs expiram em 15 minutos
- Validação de MIME type no cliente e servidor
- Virus scanning após upload (ClamAV via Lambda)

### Custo
- Upload direto para S3 evita custo de bandwidth do backend
- Chunked upload reduz re-upload em falhas (apenas chunk falho)

---

**Criado em:** 3 de Março de 2026  
**Atualizado em:** 3 de Março de 2026  
**Responsável:** Architecture Agent
