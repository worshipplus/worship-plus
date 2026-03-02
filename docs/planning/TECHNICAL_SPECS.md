# Worship+ - Especificações Técnicas e Código de Referência

> Documentação técnica gerada a partir das decisões do brainstorm. Este documento fornece código de referência para implementação das features principais relacionadas a armazenamento e distribuição de arquivos VS (Voice Stems).

Data: 2 de março de 2026

---

## Índice

1. [Feature A: Arquivamento Inteligente Baseado em Eventos](#feature-a-arquivamento-inteligente-baseado-em-eventos)
2. [Feature B: Geração Automática de ZIP por Evento](#feature-b-geração-automática-de-zip-por-evento)
3. [Feature C: Sistema de Download com Cache CDN](#feature-c-sistema-de-download-com-cache-cdn)
4. [Feature D: Interface de Download no Frontend](#feature-d-interface-de-download-no-frontend)

---

## Feature A: Arquivamento Inteligente Baseado em Eventos

### Specifications

**Objetivo:** Reduzir custos de armazenamento em ~80% movendo arquivos VS automaticamente entre tiers de storage (S3 Standard ↔ Glacier IR) baseado em eventos agendados.

**Comportamento:**
- Arquivos VS ficam em **Glacier IR** (baixo custo) por padrão
- São promovidos para **S3 Standard** (acesso rápido) quando a música está em eventos nos **próximos 30 dias**
- Retornam ao **Glacier IR** após **30 dias** do último evento que usou a música
- Processo totalmente automático via worker/cron

**Economia estimada:**
- Storage: $0.004/GB (Glacier IR) vs $0.023/GB (S3 Standard) = 83% economia
- Exemplo: 10GB archive = $0.04/mês vs $0.23/mês

### Target

- **Backend:** Node.js/TypeScript com cron job ou event-driven worker
- **Cloud:** AWS S3 com lifecycle policies
- **Frequência:** Job diário ou triggered por criação/edição de evento

### Example Code

#### Worker: Atualização Automática de Disponibilidade de Mídia

```typescript
// workers/update-media-availability.ts

import { addDays, subDays } from 'date-fns'
import { db } from './database'
import { s3 } from './aws-clients'
import { notifyTeam } from './notifications'

interface Song {
  id: string
  title: string
  media: {
    s3Key: string
    storageClass: 'STANDARD' | 'GLACIER_IR'
    mp3Key?: string
    wavKey?: string
  }
}

interface Event {
  id: string
  title: string
  date: Date
  songs: Song[]
  teamMembers: string[]
}

const THRESHOLDS = {
  activateWindow: 30,  // dias antes do evento
  keepWarmWindow: 30   // dias após evento
}

/**
 * Worker principal que gerencia lifecycle de arquivos VS
 * Executa diariamente via cron ou event-driven
 */
async function updateMediaAvailability() {
  const now = new Date()
  
  console.log('[Media Lifecycle] Starting daily update...')
  
  // 1. Encontrar músicas que precisam ser ATIVADAS
  await activateSongsForUpcomingEvents(now)
  
  // 2. Encontrar músicas que podem ser ARQUIVADAS
  await archiveUnusedSongs(now)
  
  console.log('[Media Lifecycle] Update completed')
}

/**
 * Promove músicas para S3 Standard quando há eventos próximos
 */
async function activateSongsForUpcomingEvents(now: Date) {
  const futureDate = addDays(now, THRESHOLDS.activateWindow)
  
  // Buscar eventos nos próximos 30 dias
  const upcomingEvents = await db.events
    .where('date')
    .between(now, futureDate)
    .include('songs')
    .execute()
  
  // Coletar todas as músicas únicas desses eventos
  const songsToActivate = new Map<string, Song>()
  
  for (const event of upcomingEvents) {
    for (const song of event.songs.filter(s => s.media)) {
      if (!songsToActivate.has(song.id)) {
        songsToActivate.set(song.id, song)
      }
    }
  }
  
  console.log(`[Activate] Found ${songsToActivate.size} songs to activate`)
  
  // Processar cada música
  for (const [_, song] of songsToActivate) {
    if (song.media.storageClass !== 'STANDARD') {
      try {
        // Mover para S3 Standard (tier ativo)
        await moveToStandardTier(song.media.s3Key)
        
        // Invalidar cache CDN para forçar reload
        await invalidateCDN(song.id)
        
        // Atualizar metadados no DB
        await db.songs.update(song.id, {
          'media.storageClass': 'STANDARD',
          'media.activatedAt': now
        })
        
        console.log(`[Activate] ✓ ${song.title} moved to Standard`)
        
        // Notificar equipe (opcional, pode ser batched)
        // await notifyTeam(event, `VS disponível: ${song.title}`)
        
      } catch (error) {
        console.error(`[Activate] ✗ Failed for ${song.title}:`, error)
      }
    }
  }
}

/**
 * Arquiva músicas não utilizadas recentemente para Glacier IR
 */
async function archiveUnusedSongs(now: Date) {
  const warmThreshold = subDays(now, THRESHOLDS.keepWarmWindow)
  
  // Buscar eventos recentes (últimos 30 dias)
  const recentEvents = await db.events
    .where('date')
    .between(warmThreshold, now)
    .include('songs')
    .execute()
  
  // Coletar IDs de músicas que DEVEM permanecer ativas
  const recentSongIds = new Set<string>()
  
  for (const event of recentEvents) {
    for (const song of event.songs) {
      recentSongIds.add(song.id)
    }
  }
  
  // Buscar próximos eventos para excluir suas músicas também
  const futureDate = addDays(now, THRESHOLDS.activateWindow)
  const upcomingEvents = await db.events
    .where('date')
    .between(now, futureDate)
    .include('songs')
    .execute()
  
  for (const event of upcomingEvents) {
    for (const song of event.songs) {
      recentSongIds.add(song.id)
    }
  }
  
  // Buscar músicas em S3 Standard que NÃO estão na lista de ativas
  const songsToArchive = await db.songs
    .where('media.storageClass')
    .equals('STANDARD')
    .whereNotIn('id', Array.from(recentSongIds))
    .execute()
  
  console.log(`[Archive] Found ${songsToArchive.length} songs to archive`)
  
  // Processar cada música
  for (const song of songsToArchive) {
    try {
      // Mover para Glacier IR (tier arquivado)
      await moveToGlacierIR(song.media.s3Key)
      
      // Atualizar metadados no DB
      await db.songs.update(song.id, {
        'media.storageClass': 'GLACIER_IR',
        'media.archivedAt': now
      })
      
      console.log(`[Archive] ✓ ${song.title} moved to Glacier IR`)
      
    } catch (error) {
      console.error(`[Archive] ✗ Failed for ${song.title}:`, error)
    }
  }
}

/**
 * Move arquivo para S3 Standard usando COPY
 */
async function moveToStandardTier(s3Key: string): Promise<void> {
  await s3.copyObject({
    Bucket: process.env.S3_BUCKET_NAME,
    CopySource: `${process.env.S3_BUCKET_NAME}/${s3Key}`,
    Key: s3Key,
    StorageClass: 'STANDARD',
    MetadataDirective: 'COPY'
  }).promise()
}

/**
 * Move arquivo para Glacier Instant Retrieval
 */
async function moveToGlacierIR(s3Key: string): Promise<void> {
  await s3.copyObject({
    Bucket: process.env.S3_BUCKET_NAME,
    CopySource: `${process.env.S3_BUCKET_NAME}/${s3Key}`,
    Key: s3Key,
    StorageClass: 'GLACIER_IR',
    MetadataDirective: 'COPY'
  }).promise()
}

/**
 * Invalida cache CDN para forçar reload
 */
async function invalidateCDN(songId: string): Promise<void> {
  // CloudFront invalidation
  // Implementar conforme seu setup de CDN
  console.log(`[CDN] Invalidating cache for song ${songId}`)
}

// Export para uso em cron ou event-driven system
export { updateMediaAvailability }

// Exemplo de uso com cron (usando node-cron)
// import cron from 'node-cron'
// cron.schedule('0 2 * * *', updateMediaAvailability) // Diariamente às 2am
```

---

## Feature B: Geração Automática de ZIP por Evento

### Specifications

**Objetivo:** Gerar pacotes ZIP contendo todos arquivos VS de um evento para otimizar downloads e reduzir custos de transfer em até 90%.

**Comportamento:**
- Quando evento é criado/editado com músicas VS, enfileira job para gerar ZIP
- ZIP contém: arquivos MP3 e WAV de todas músicas, README com metadados
- ZIP é armazenado em bucket separado com cache CDN de 7 dias
- Usuários baixam 1 arquivo ZIP ao invés de N arquivos individuais
- CDN cacheia ZIP: primeiro usuário paga, demais obtêm cache hit (grátis)

**Economia estimada:**
- Evento com 5 músicas (500MB): $18 → $1.80 (90% economia com CDN)
- Evento com 20 músicas (2GB): $72 → $7.20 (90% economia com CDN)

### Target

- **Backend:** Node.js/TypeScript com queue system (Bull, BullMQ, AWS SQS)
- **Processamento:** Worker assíncrono (pode levar 30s-2min para eventos grandes)
- **Storage:** S3 bucket separado para ZIPs com lifecycle de 90 dias

### Example Code

#### Worker: Geração de ZIP de Evento

```typescript
// workers/generate-event-zip.ts

import JSZip from 'jszip'
import { db } from './database'
import { s3 } from './aws-clients'
import { notifyTeam } from './notifications'
import { sanitizeFilename } from './utils'

interface GenerateZipJob {
  eventId: string
  priority: 'high' | 'normal'
}

/**
 * Worker que gera ZIP de evento
 * Triggered quando evento é criado/editado
 */
async function generateEventZip(job: GenerateZipJob): Promise<void> {
  const { eventId } = job
  
  console.log(`[ZIP Generator] Starting for event ${eventId}`)
  
  try {
    // 1. Buscar dados do evento
    const event = await db.events
      .findById(eventId)
      .include('songs')
      .execute()
    
    if (!event) {
      throw new Error(`Event ${eventId} not found`)
    }
    
    // 2. Filtrar apenas músicas com VS
    const songsWithVS = event.songs.filter(song => 
      song.media?.mp3Key || song.media?.wavKey
    )
    
    if (songsWithVS.length === 0) {
      console.log(`[ZIP Generator] No VS files for event ${eventId}, skipping`)
      return
    }
    
    // 3. Criar ZIP em memória
    const zip = new JSZip()
    
    // 4. Adicionar cada música ao ZIP
    for (const song of songsWithVS) {
      const safeName = sanitizeFilename(song.title)
      
      // Download MP3 do S3
      if (song.media.mp3Key) {
        try {
          const mp3Buffer = await downloadFromS3(song.media.mp3Key)
          zip.file(`${safeName}.mp3`, mp3Buffer)
          console.log(`[ZIP] ✓ Added ${safeName}.mp3`)
        } catch (error) {
          console.error(`[ZIP] ✗ Failed to add ${safeName}.mp3:`, error)
        }
      }
      
      // Download WAV do S3
      if (song.media.wavKey) {
        try {
          const wavBuffer = await downloadFromS3(song.media.wavKey)
          zip.file(`${safeName}.wav`, wavBuffer)
          console.log(`[ZIP] ✓ Added ${safeName}.wav`)
        } catch (error) {
          console.error(`[ZIP] ✗ Failed to add ${safeName}.wav:`, error)
        }
      }
    }
    
    // 5. Gerar README com informações do evento
    const readme = generateEventReadme(event, songsWithVS)
    zip.file('README.txt', readme)
    
    // 6. Gerar buffer do ZIP (com compressão)
    console.log(`[ZIP] Generating zip file...`)
    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 } // Balanço entre tamanho e velocidade
    })
    
    // 7. Upload para S3 (bucket de downloads)
    const timestamp = Date.now()
    const zipKey = `event-zips/${eventId}/${timestamp}-${sanitizeFilename(event.title)}.zip`
    
    await s3.upload({
      Bucket: process.env.S3_DOWNLOADS_BUCKET,
      Key: zipKey,
      Body: zipBuffer,
      ContentType: 'application/zip',
      CacheControl: 'public, max-age=604800', // 7 dias
      Metadata: {
        eventId: event.id,
        songCount: songsWithVS.length.toString(),
        generatedAt: new Date().toISOString()
      }
    }).promise()
    
    console.log(`[ZIP] ✓ Uploaded to S3: ${zipKey}`)
    
    // 8. Gerar URL do CloudFront
    const cdnUrl = `https://${process.env.CDN_DOMAIN}/downloads/${zipKey}`
    
    // 9. Atualizar evento no DB com link do ZIP
    await db.events.update(eventId, {
      zipUrl: cdnUrl,
      zipKey: zipKey,
      zipGeneratedAt: new Date(),
      zipSizeBytes: zipBuffer.length
    })
    
    console.log(`[ZIP] ✓ Event updated with ZIP URL`)
    
    // 10. Notificar equipe escalada no evento
    if (event.teamMembers && event.teamMembers.length > 0) {
      await notifyTeam(event.teamMembers, {
        type: 'vs_available',
        title: `VS disponível: ${event.title}`,
        message: `Pacote com ${songsWithVS.length} musik(s) pronto para download`,
        actionUrl: `/events/${event.id}`,
        actionLabel: 'Baixar agora'
      })
    }
    
    console.log(`[ZIP Generator] ✓ Completed for event ${eventId}`)
    
  } catch (error) {
    console.error(`[ZIP Generator] ✗ Failed for event ${eventId}:`, error)
    
    // Marcar erro no evento
    await db.events.update(eventId, {
      zipError: error.message,
      zipLastAttempt: new Date()
    })
    
    throw error // Re-throw para retry do queue
  }
}

/**
 * Download arquivo do S3 como Buffer
 */
async function downloadFromS3(s3Key: string): Promise<Buffer> {
  const response = await s3.getObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key
  }).promise()
  
  return response.Body as Buffer
}

/**
 * Gera README.txt com informações do evento
 */
function generateEventReadme(event: Event, songs: Song[]): string {
  return `
═══════════════════════════════════════════════
  WORSHIP+ - Voice Stems Package
═══════════════════════════════════════════════

Evento: ${event.title}
Data: ${new Date(event.date).toLocaleDateString('pt-BR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Descrição: ${event.description || 'N/A'}

───────────────────────────────────────────────
Músicas Incluídas (${songs.length}):
───────────────────────────────────────────────

${songs.map((song, i) => `${i + 1}. ${song.title}${song.author ? ` - ${song.author}` : ''}`).join('\n')}

───────────────────────────────────────────────
Formatos Disponíveis:
───────────────────────────────────────────────

• MP3: Arquivos comprimidos (menor tamanho)
  Recomendado para: Rehearsal, playback casual

• WAV: Arquivos sem compressão (alta qualidade)
  Recomendado para: Performance ao vivo, mixagem

───────────────────────────────────────────────
Instruções de Uso:
───────────────────────────────────────────────

1. Extraia este arquivo ZIP
2. Escolha o formato desejado (MP3 ou WAV)
3. Importe no seu dispositivo/DAW
4. Configure fones/monitors antes de reproduzir

───────────────────────────────────────────────

Gerado em: ${new Date().toLocaleString('pt-BR')}
Worship+ © ${new Date().getFullYear()}

Para suporte: suporte@worshipplus.com.br
`.trim()
}

// Hook: chamado quando evento é criado/editado
async function onEventSave(eventId: string, isNew: boolean): Promise<void> {
  const event = await db.events
    .findById(eventId)
    .include('songs')
    .execute()
  
  const hasVS = event.songs.some(s => s.media?.mp3Key || s.media?.wavKey)
  
  if (!hasVS) {
    console.log(`[Event Hook] No VS files, skipping ZIP generation`)
    return
  }
  
  // Determinar prioridade baseado em quão próximo está o evento
  const daysUntilEvent = Math.floor(
    (new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  
  const priority = daysUntilEvent <= 7 ? 'high' : 'normal'
  
  // Enfileirar job para gerar ZIP
  await queue.add('generate-event-zip', {
    eventId: event.id,
    priority
  }, {
    priority: priority === 'high' ? 10 : 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  })
  
  console.log(`[Event Hook] ZIP generation queued for event ${eventId} (priority: ${priority})`)
}

export { generateEventZip, onEventSave }
```

---

## Feature C: Sistema de Download com Cache CDN

### Specifications

**Objetivo:** Fornecer endpoint de download otimizado que reduz custos via CDN caching e presigned URLs.

**Comportamento:**
- Endpoint `/api/events/:id/download-vs` serve ZIP pré-gerado ou gera on-demand
- Usa presigned URLs do S3 para segurança (expiração de 1h)
- CloudFront CDN cacheia ZIPs por 7 dias
- Fallback para download individual de música avulsa

**Performance:**
- Hit rate esperado: 80%+ (múltiplos usuários baixando mesmo ZIP)
- Tempo de resposta: <500ms (redirect para CDN cached)
- Geração on-demand: 30s-2min (primeira vez apenas)

### Target

- **API:** Express.js, Fastify, ou similar
- **Auth:** Middleware valida token JWT
- **CDN:** CloudFront (AWS) ou similar

### Example Code

#### API: Endpoint de Download

```typescript
// routes/events.ts

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { db } from '../database'
import { s3, cloudfront } from '../aws-clients'
import { queue } from '../queue'

const router = Router()

/**
 * GET /api/events/:id/download-vs
 * Download ZIP de Voice Stems do evento
 */
router.get(
  '/events/:id/download-vs',
  authenticate, // Requer autenticação
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user.id
      
      // 1. Buscar evento
      const event = await db.events
        .findById(id)
        .include('songs')
        .execute()
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' })
      }
      
      // 2. Verificar permissão (usuário precisa estar escalado ou ser admin)
      const hasPermission = 
        req.user.role === 'admin' ||
        event.teamMembers.includes(userId)
      
      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'You must be assigned to this event to download VS files' 
        })
      }
      
      // 3. Verificar se há músicas com VS
      const hasVS = event.songs.some(s => s.media?.mp3Key || s.media?.wavKey)
      
      if (!hasVS) {
        return res.status(404).json({ 
          error: 'This event has no VS files available' 
        })
      }
      
      // 4. Check se ZIP já existe
      if (event.zipUrl && event.zipKey) {
        // Verificar se ZIP ainda existe no S3
        const zipExists = await checkS3ObjectExists(event.zipKey)
        
        if (zipExists) {
          // Gerar presigned URL (válido por 1 hora)
          const signedUrl = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.S3_DOWNLOADS_BUCKET,
            Key: event.zipKey,
            Expires: 3600, // 1 hora
            ResponseContentDisposition: `attachment; filename="${sanitizeFilename(event.title)}.zip"`
          })
          
          // Log de auditoria
          await logDownload({
            userId,
            eventId: event.id,
            zipKey: event.zipKey,
            method: 'pre-generated'
          })
          
          // Redirecionar para URL do CDN com signed query params
          return res.redirect(302, signedUrl)
        }
      }
      
      // 5. ZIP não existe - verificar se está sendo gerado
      const generationJob = await queue.getJob(`zip:${event.id}`)
      
      if (generationJob && await generationJob.getState() === 'active') {
        return res.status(202).json({
          status: 'processing',
          message: 'ZIP is being generated. Please try again in a few moments.',
          estimatedTime: '30-120 seconds',
          retryAfter: 30
        })
      }
      
      // 6. Enfileirar geração de ZIP com prioridade alta
      await queue.add('generate-event-zip', {
        eventId: event.id,
        priority: 'high',
        requestedBy: userId
      }, {
        jobId: `zip:${event.id}`,
        priority: 10,
        attempts: 3
      })
      
      // 7. Responder indicando que geração está em progresso
      return res.status(202).json({
        status: 'queued',
        message: 'ZIP generation started. Please try again in a few moments.',
        estimatedTime: '30-120 seconds',
        retryAfter: 30,
        pollUrl: `/api/events/${event.id}/download-status`
      })
      
    } catch (error) {
      console.error('[Download API] Error:', error)
      return res.status(500).json({ 
        error: 'Failed to prepare download',
        details: error.message 
      })
    }
  }
)

/**
 * GET /api/events/:id/download-status
 * Verificar status da geração do ZIP
 */
router.get(
  '/events/:id/download-status',
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params
      
      // Buscar evento atualizado
      const event = await db.events.findById(id).execute()
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' })
      }
      
      // Verificar se ZIP está pronto
      if (event.zipUrl && event.zipKey) {
        const zipExists = await checkS3ObjectExists(event.zipKey)
        
        if (zipExists) {
          return res.json({
            status: 'ready',
            downloadUrl: `/api/events/${id}/download-vs`,
            generatedAt: event.zipGeneratedAt,
            sizeBytes: event.zipSizeBytes
          })
        }
      }
      
      // Verificar se está sendo gerado
      const job = await queue.getJob(`zip:${id}`)
      
      if (job) {
        const state = await job.getState()
        const progress = job.progress()
        
        return res.json({
          status: state, // 'active', 'waiting', 'completed', 'failed'
          progress: progress || 0,
          message: state === 'active' ? 'Generating ZIP...' : 'Waiting in queue...'
        })
      }
      
      // Não encontrado
      return res.json({
        status: 'not_started',
        message: 'ZIP generation has not started yet'
      })
      
    } catch (error) {
      console.error('[Download Status] Error:', error)
      return res.status(500).json({ error: 'Failed to check status' })
    }
  }
)

/**
 * GET /api/songs/:id/download
 * Download individual de uma música (fallback)
 */
router.get(
  '/songs/:id/download',
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params
      const format = req.query.format as 'mp3' | 'wav' || 'mp3'
      
      const song = await db.songs.findById(id).execute()
      
      if (!song || !song.media) {
        return res.status(404).json({ error: 'Song or media not found' })
      }
      
      const s3Key = format === 'wav' ? song.media.wavKey : song.media.mp3Key
      
      if (!s3Key) {
        return res.status(404).json({ 
          error: `${format.toUpperCase()} format not available for this song` 
        })
      }
      
      // Gerar presigned URL
      const signedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Expires: 3600,
        ResponseContentDisposition: `attachment; filename="${sanitizeFilename(song.title)}.${format}"`
      })
      
      // Log de auditoria
      await logDownload({
        userId: req.user.id,
        songId: song.id,
        format,
        method: 'individual'
      })
      
      return res.redirect(302, signedUrl)
      
    } catch (error) {
      console.error('[Individual Download] Error:', error)
      return res.status(500).json({ error: 'Failed to prepare download' })
    }
  }
)

// Utility functions

async function checkS3ObjectExists(key: string): Promise<boolean> {
  try {
    await s3.headObject({
      Bucket: process.env.S3_DOWNLOADS_BUCKET,
      Key: key
    }).promise()
    return true
  } catch (error) {
    if (error.code === 'NotFound') {
      return false
    }
    throw error
  }
}

async function logDownload(data: {
  userId: string
  eventId?: string
  songId?: string
  zipKey?: string
  format?: string
  method: string
}): Promise<void> {
  await db.downloadLogs.create({
    ...data,
    timestamp: new Date(),
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  })
}

function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Substitui caracteres especiais
    .replace(/-+/g, '-') // Remove hífens duplicados
    .toLowerCase()
}

export default router
```

---

## Feature D: Interface de Download no Frontend

### Specifications

**Objetivo:** Fornecer UX intuitiva para download de arquivos VS, com feedback de status e fallback para downloads individuais.

**Comportamento:**
- Card destacado mostrando disponibilidade de VS
- Botão primário para download do ZIP completo
- Indicador de status (pronto, gerando, erro)
- Seção colapsável com downloads individuais (fallback)
- Polling automático quando ZIP está sendo gerado

**Design:**
- Seguir design system do projeto (tokens, cores, espaçamento)
- Responsivo (mobile-first)
- Acessível (ARIA labels, keyboard navigation)

### Target

- **Framework:** React 19 (conforme POC atual)
- **Styling:** CSS modules ou styled-components
- **Estado:** React hooks (useState, useEffect)

### Example Code

#### Componente React: Download de VS

```jsx
// src/components/EventVSDownload.jsx

import React, { useState, useEffect } from 'react'
import { 
  DownloadIcon, 
  MusicIcon, 
  LoadingIcon, 
  CheckIcon, 
  AlertIcon 
} from './Icons'
import './EventVSDownload.css'

/**
 * Componente de download de Voice Stems para um evento
 */
export default function EventVSDownload({ event }) {
  const [downloadStatus, setDownloadStatus] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  const [showIndividual, setShowIndividual] = useState(false)
  
  // Filtrar músicas que têm VS
  const songsWithVS = event.songs.filter(song => 
    song.media?.hasMP3 || song.media?.hasWAV
  )
  
  // Se não há VS, não renderizar
  if (songsWithVS.length === 0) {
    return null
  }
  
  // Determinar status inicial baseado nos dados do evento
  useEffect(() => {
    if (event.zipUrl) {
      setDownloadStatus('ready')
    } else if (event.zipGenerating) {
      setDownloadStatus('processing')
      startPolling()
    } else {
      setDownloadStatus('not_started')
    }
  }, [event])
  
  // Polling para verificar status de geração
  const startPolling = () => {
    if (isPolling) return
    
    setIsPolling(true)
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/events/${event.id}/download-status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        const data = await response.json()
        
        if (data.status === 'ready') {
          setDownloadStatus('ready')
          setIsPolling(false)
          clearInterval(pollInterval)
          
          // Atualizar dados do evento (opcional, via context/redux)
          // refreshEvent(event.id)
        } else if (data.status === 'failed') {
          setDownloadStatus('error')
          setIsPolling(false)
          clearInterval(pollInterval)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 5000) // Poll a cada 5 segundos
    
    // Limpar após 2 minutos
    setTimeout(() => {
      clearInterval(pollInterval)
      setIsPolling(false)
    }, 120000)
  }
  
  // Handler de download
  const handleDownload = async () => {
    if (downloadStatus === 'ready') {
      // Redirecionar para download
      window.location.href = `/api/events/${event.id}/download-vs?token=${localStorage.getItem('token')}`
      return
    }
    
    // Iniciar geração
    setDownloadStatus('processing')
    
    try {
      const response = await fetch(`/api/events/${event.id}/download-vs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.status === 202) {
        // Geração iniciada
        startPolling()
      } else if (response.status === 302 || response.ok) {
        // Redirect direto para download
        window.location.href = response.url
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      console.error('Download error:', error)
      setDownloadStatus('error')
    }
  }
  
  // Handler de download individual
  const handleIndividualDownload = (songId, format) => {
    window.location.href = `/api/songs/${songId}/download?format=${format}&token=${localStorage.getItem('token')}`
  }
  
  // Formatação de tamanho
  const formatBytes = (bytes) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }
  
  return (
    <div className="vs-download-section">
      <div className="vs-download-card">
        <div className="vs-icon-wrapper">
          <MusicIcon size={32} />
        </div>
        
        <div className="vs-info">
          <h3 className="vs-title">Arquivos VS (Voice Stems)</h3>
          <p className="vs-description">
            {songsWithVS.length} música{songsWithVS.length !== 1 ? 's' : ''} disponíve{songsWithVS.length !== 1 ? 'is' : 'l'}
            {event.zipSizeBytes && ` • ${formatBytes(event.zipSizeBytes)}`}
          </p>
          
          {/* Status indicators */}
          {downloadStatus === 'ready' && (
            <p className="vs-status vs-status--ready">
              <CheckIcon size={16} />
              Pacote pronto para download
            </p>
          )}
          
          {downloadStatus === 'processing' && (
            <p className="vs-status vs-status--processing">
              <LoadingIcon size={16} className="spin" />
              Gerando pacote... (pode levar até 2 minutos)
            </p>
          )}
          
          {downloadStatus === 'error' && (
            <p className="vs-status vs-status--error">
              <AlertIcon size={16} />
              Erro ao gerar pacote. Tente novamente.
            </p>
          )}
        </div>
      </div>
      
      {/* Download button */}
      <button 
        className="btn btn-primary"
        onClick={handleDownload}
        disabled={downloadStatus === 'processing'}
        aria-label={`Baixar todas as ${songsWithVS.length} músicas em ZIP`}
      >
        {downloadStatus === 'processing' ? (
          <>
            <LoadingIcon className="spin" />
            Preparando...
          </>
        ) : (
          <>
            <DownloadIcon />
            Baixar Todas (ZIP)
          </>
        )}
      </button>
      
      {/* Individual downloads (fallback) */}
      <details 
        className="vs-individual-section"
        open={showIndividual}
        onToggle={(e) => setShowIndividual(e.target.open)}
      >
        <summary className="vs-individual-toggle">
          Downloads individuais
        </summary>
        
        <ul className="vs-individual-list">
          {songsWithVS.map(song => (
            <li key={song.id} className="vs-individual-item">
              <div className="vs-song-info">
                <MusicIcon size={16} />
                <span className="vs-song-title">{song.title}</span>
                {song.author && (
                  <span className="vs-song-author">— {song.author}</span>
                )}
              </div>
              
              <div className="vs-song-actions">
                {song.media.hasMP3 && (
                  <button
                    className="btn-link"
                    onClick={() => handleIndividualDownload(song.id, 'mp3')}
                    aria-label={`Baixar ${song.title} em MP3`}
                  >
                    <DownloadIcon size={14} />
                    MP3
                  </button>
                )}
                
                {song.media.hasWAV && (
                  <button
                    className="btn-link"
                    onClick={() => handleIndividualDownload(song.id, 'wav')}
                    aria-label={`Baixar ${song.title} em WAV`}
                  >
                    <DownloadIcon size={14} />
                    WAV
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
```

#### CSS do Componente

```css
/* src/components/EventVSDownload.css */

.vs-download-section {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
  padding: var(--s4);
  background: var(--bg-2);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-1);
}

.vs-download-card {
  display: flex;
  align-items: flex-start;
  gap: var(--s3);
}

.vs-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--accent-1);
  border-radius: var(--radius-md);
  color: var(--accent-fg);
  flex-shrink: 0;
}

.vs-info {
  flex: 1;
}

.vs-title {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--fg-1);
  margin: 0 0 var(--s1) 0;
}

.vs-description {
  font-size: var(--text-sm);
  color: var(--fg-2);
  margin: 0 0 var(--s2) 0;
}

.vs-status {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  font-size: var(--text-xs);
  padding: var(--s1) var(--s2);
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.vs-status--ready {
  background: var(--success-bg);
  color: var(--success-fg);
}

.vs-status--processing {
  background: var(--warning-bg);
  color: var(--warning-fg);
}

.vs-status--error {
  background: var(--error-bg);
  color: var(--error-fg);
}

/* Individual downloads */
.vs-individual-section {
  margin-top: var(--s2);
}

.vs-individual-toggle {
  font-size: var(--text-sm);
  color: var(--fg-2);
  cursor: pointer;
  user-select: none;
  padding: var(--s2);
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.vs-individual-toggle:hover {
  background: var(--bg-3);
}

.vs-individual-list {
  list-style: none;
  padding: 0;
  margin: var(--s2) 0 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--s2);
}

.vs-individual-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--s2);
  background: var(--bg-1);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-1);
}

.vs-song-info {
  display: flex;
  align-items: center;
  gap: var(--s2);
  flex: 1;
  min-width: 0;
}

.vs-song-title {
  font-size: var(--text-sm);
  color: var(--fg-1);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vs-song-author {
  font-size: var(--text-xs);
  color: var(--fg-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vs-song-actions {
  display: flex;
  gap: var(--s2);
  flex-shrink: 0;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  background: none;
  border: none;
  color: var(--accent-fg);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  padding: var(--s1) var(--s2);
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.btn-link:hover {
  background: var(--accent-1);
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 640px) {
  .vs-download-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .vs-individual-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--s2);
  }
  
  .vs-song-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
```

---

## Notas de Implementação

### Ordem de Implementação Sugerida

1. **Fase 1 - MVP Core:**
   - Feature A: Arquivamento inteligente (worker básico)
   - Storage setup: S3 buckets, lifecycle policies
   - Database schema updates

2. **Fase 2 - Downloads:**
   - Feature B: Geração de ZIP (pré-geração)
   - Feature C: Endpoints de download
   - Queue system (Bull/BullMQ)

3. **Fase 3 - UX Polish:**
   - Feature D: Interface de download
   - Notificações push
   - Polling e feedback de status

4. **Fase 4 - Otimizações:**
   - CloudFront CDN setup
   - Cache strategies
   - Monitoring e logs

### Dependências Necessárias

```json
{
  "dependencies": {
    "jszip": "^3.10.1",
    "aws-sdk": "^2.1500.0",
    "bull": "^4.12.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/jszip": "^3.4.1"
  }
}
```

### Variáveis de Ambiente

```bash
# AWS Configuration
AWS_REGION=sa-east-1
AWS_ACCESS_KEY_ID=your_key_id
AWS_SECRET_ACCESS_KEY=your_secret_key

# S3 Buckets
S3_BUCKET_NAME=worship-plus-media
S3_DOWNLOADS_BUCKET=worship-plus-downloads

# CDN
CDN_DOMAIN=cdn.worshipplus.com.br
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC

# Queue
REDIS_URL=redis://localhost:6379

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/worship_plus
```

### Monitoramento e Logs

Recomendações para produção:

- **CloudWatch Logs** para logs de workers
- **CloudWatch Metrics** para métricas de S3 (requests, bandwidth)
- **Sentry** para error tracking
- **DataDog/NewRelic** para APM (opcional)
- **Dashboard customizado** para:
  - Custos mensais de storage/transfer
  - Taxa de hit do CDN
  - Tempo médio de geração de ZIP
  - Downloads por usuário/evento

---

## Estimativa de Custos com Features Implementadas

### Cenário Real (Ano 2 - 100 músicas, 40 usuários)

| Item | Sem Otimizações | Com Features | Economia |
|------|----------------|--------------|----------|
| Storage (10GB) | $2.30/mês | $0.06/mês | 97% |
| Transfer | $7.20/mês | $0.72/mês | 90% |
| **Total** | **$9.50/mês** | **$0.78/mês** | **92%** |

**ROI das Features:**
- Investimento: ~40h desenvolvimento
- Economia anual: ~$105/ano
- Payback: Imediato (projeto sem fins lucrativos)
- Benefício adicional: Melhor UX, escalabilidade

---

## Feature E: Padrões de Qualidade de Áudio e Transcodificação

### Specifications

**Objetivo:** Definir padrões técnicos de qualidade de áudio (bitrate, sample rate) para garantir balanço entre qualidade perceptível e custos de storage/bandwidth.

**Formatos Suportados:**

**WAV (Master/Original):**
- Sample Rate: 44.1 kHz ou 48 kHz
- Bit Depth: 16-bit (padrão) ou 24-bit (profissional)
- Canais: Estéreo (2 canais)
- Tamanho: ~40-70 MB por música (4 min)
- Uso: Performance ao vivo, backup original

**MP3 (Trabalho/Ensaio):**
- Bitrate: 256 kbps (recomendado) ou 320 kbps (máximo)
- Sample Rate: Derivado do WAV original
- Canais: Estéreo
- Tamanho: ~8-10 MB por música (4 min)
- Uso: Rehearsal, devices móveis, ensaios

**Limites de Upload:**
- WAV: máximo 200 MB (~5 min em 48kHz/24bit)
- MP3: máximo 50 MB (~20 min em 320 kbps)
- Rejeitar sample rates > 96 kHz
- Rejeitar arquivos mono (forçar estéreo)

### Target

- **Transcodificação:** ffmpeg via Lambda ou worker assíncrono
- **Validação:** No upload, antes de aceitar arquivo
- **Otimização:** Automática para economizar storage

### Example Code

#### Worker: Transcodificação e Otimização de Áudio

```typescript
// workers/audio-transcoder.ts

import ffmpeg from 'fluent-ffmpeg'
import { s3 } from './aws-clients'
import { db } from './database'
import { createReadStream, createWriteStream } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomBytes } from 'crypto'

interface AudioMetadata {
  format: 'wav' | 'mp3' | 'unknown'
  sampleRate: number
  bitrate?: number
  bitDepth?: number
  channels: number
  duration: number
  size: number
}

interface TranscodeJob {
  songId: string
  sourceKey: string
  sourceFormat: 'wav' | 'mp3'
}

/**
 * Analisa metadados de arquivo de áudio
 */
async function analyzeAudio(filePath: string): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err)
      
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio')
      if (!audioStream) return reject(new Error('No audio stream found'))
      
      resolve({
        format: detectFormat(audioStream.codec_name),
        sampleRate: audioStream.sample_rate || 0,
        bitrate: audioStream.bit_rate ? parseInt(audioStream.bit_rate) / 1000 : undefined,
        bitDepth: audioStream.bits_per_sample,
        channels: audioStream.channels || 0,
        duration: parseFloat(metadata.format.duration || '0'),
        size: parseInt(metadata.format.size || '0')
      })
    })
  })
}

function detectFormat(codec: string): 'wav' | 'mp3' | 'unknown' {
  if (codec === 'pcm_s16le' || codec === 'pcm_s24le') return 'wav'
  if (codec === 'mp3' || codec === 'mp3float') return 'mp3'
  return 'unknown'
}

/**
 * Valida se arquivo atende requisitos técnicos
 */
function validateAudioSpecs(metadata: AudioMetadata): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Validar sample rate
  if (metadata.sampleRate > 96000) {
    errors.push(`Sample rate too high (${metadata.sampleRate}Hz). Maximum: 96kHz`)
  }
  
  if (metadata.sampleRate < 44100) {
    errors.push(`Sample rate too low (${metadata.sampleRate}Hz). Minimum: 44.1kHz`)
  }
  
  // Validar canais (forçar estéreo)
  if (metadata.channels < 2) {
    errors.push(`Mono audio not supported. Please upload stereo (2 channels)`)
  }
  
  // Validar tamanho
  const maxSize = metadata.format === 'wav' ? 200 * 1024 * 1024 : 50 * 1024 * 1024
  if (metadata.size > maxSize) {
    errors.push(`File too large (${(metadata.size / 1024 / 1024).toFixed(1)}MB). Maximum: ${maxSize / 1024 / 1024}MB`)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Worker principal de transcodificação
 */
async function transcodeAudio(job: TranscodeJob): Promise<void> {
  const { songId, sourceKey, sourceFormat } = job
  
  console.log(`[Transcode] Starting for song ${songId}`)
  
  try {
    // 1. Download arquivo original do S3
    const tempId = randomBytes(8).toString('hex')
    const inputPath = join(tmpdir(), `${tempId}-input.${sourceFormat}`)
    const outputPath = join(tmpdir(), `${tempId}-output.mp3`)
    
    await downloadFromS3(sourceKey, inputPath)
    
    // 2. Analisar metadados
    const metadata = await analyzeAudio(inputPath)
    console.log(`[Transcode] Metadata:`, metadata)
    
    // 3. Validar especificações
    const validation = validateAudioSpecs(metadata)
    if (!validation.valid) {
      throw new Error(`Audio validation failed: ${validation.errors.join(', ')}`)
    }
    
    // 4. Decidir se precisa transcodificar
    let mp3Key: string
    
    if (sourceFormat === 'wav') {
      // WAV → MP3 256 kbps
      console.log(`[Transcode] Converting WAV to MP3 256kbps...`)
      
      await convertToMP3(inputPath, outputPath, {
        bitrate: 256,
        sampleRate: metadata.sampleRate
      })
      
      // Upload MP3 gerado
      mp3Key = sourceKey.replace(/\.wav$/i, '.mp3')
      await uploadToS3(outputPath, mp3Key, 'audio/mpeg')
      
      console.log(`[Transcode] ✓ MP3 generated: ${mp3Key}`)
      
    } else if (sourceFormat === 'mp3') {
      // Verificar se precisa otimizar
      if (metadata.bitrate && metadata.bitrate > 256) {
        console.log(`[Transcode] Re-encoding MP3 from ${metadata.bitrate}kbps to 256kbps...`)
        
        await convertToMP3(inputPath, outputPath, {
          bitrate: 256,
          sampleRate: metadata.sampleRate
        })
        
        // Upload MP3 otimizado
        mp3Key = sourceKey.replace(/\.mp3$/i, '-optimized.mp3')
        await uploadToS3(outputPath, mp3Key, 'audio/mpeg')
        
        console.log(`[Transcode] ✓ MP3 optimized: ${mp3Key}`)
      } else {
        // MP3 já está em formato ideal
        mp3Key = sourceKey
        console.log(`[Transcode] MP3 already optimized, skipping`)
      }
    } else {
      throw new Error(`Unsupported format: ${sourceFormat}`)
    }
    
    // 5. Atualizar database com keys e metadados
    await db.songs.update(songId, {
      'media.mp3Key': mp3Key,
      'media.wavKey': sourceFormat === 'wav' ? sourceKey : null,
      'media.duration': metadata.duration,
      'media.sampleRate': metadata.sampleRate,
      'media.bitrate': 256, // MP3 final sempre 256 kbps
      'media.format': 'ready',
      'media.processedAt': new Date()
    })
    
    console.log(`[Transcode] ✓ Completed for song ${songId}`)
    
    // Cleanup temp files
    await cleanup([inputPath, outputPath])
    
  } catch (error) {
    console.error(`[Transcode] ✗ Failed for song ${songId}:`, error)
    
    await db.songs.update(songId, {
      'media.format': 'error',
      'media.error': error.message,
      'media.lastAttempt': new Date()
    })
    
    throw error
  }
}

/**
 * Converte áudio para MP3 usando ffmpeg
 */
function convertToMP3(
  inputPath: string,
  outputPath: string,
  options: { bitrate: number; sampleRate: number }
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec('libmp3lame')
      .audioBitrate(options.bitrate)
      .audioFrequency(options.sampleRate)
      .audioChannels(2) // Force stereo
      .outputOptions([
        '-q:a 2', // Alta qualidade VBR
        '-compression_level 0' // Priorizar qualidade sobre velocidade
      ])
      .on('start', (cmd) => console.log('[ffmpeg] Command:', cmd))
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`[ffmpeg] Progress: ${progress.percent.toFixed(1)}%`)
        }
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .save(outputPath)
  })
}

async function downloadFromS3(key: string, destPath: string): Promise<void> {
  const response = await s3.getObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  }).promise()
  
  const fs = require('fs').promises
  await fs.writeFile(destPath, response.Body)
}

async function uploadToS3(filePath: string, key: string, contentType: string): Promise<void> {
  const fs = require('fs').promises
  const fileBuffer = await fs.readFile(filePath)
  
  await s3.upload({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1 ano (arquivo imutável)
    Metadata: {
      transcoded: 'true',
      transcodedAt: new Date().toISOString()
    }
  }).promise()
}

async function cleanup(paths: string[]): Promise<void> {
  const fs = require('fs').promises
  for (const path of paths) {
    try {
      await fs.unlink(path)
    } catch (error) {
      console.warn(`Failed to cleanup ${path}:`, error)
    }
  }
}

export { transcodeAudio, analyzeAudio, validateAudioSpecs }
```

#### API: Validação no Upload

```typescript
// routes/upload.ts

import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { s3 } from '../aws-clients'
import { analyzeAudio, validateAudioSpecs } from '../workers/audio-transcoder'
import { queue } from '../queue'
import { db } from '../database'

const router = Router()

/**
 * POST /api/songs/:id/upload-vs
 * Upload de arquivo VS (WAV ou MP3)
 */
router.post(
  '/songs/:id/upload-vs',
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params
      const { filename, contentType, fileSize } = req.body
      
      // Validar permissão
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can upload VS files' })
      }
      
      // Validar formato
      const format = detectFormatFromMime(contentType)
      if (!format) {
        return res.status(400).json({ 
          error: 'Invalid file format. Only WAV and MP3 are supported.' 
        })
      }
      
      // Validar tamanho antes do upload
      const maxSize = format === 'wav' ? 200 * 1024 * 1024 : 50 * 1024 * 1024
      if (fileSize > maxSize) {
        return res.status(400).json({ 
          error: `File too large (${(fileSize / 1024 / 1024).toFixed(1)}MB). Maximum: ${maxSize / 1024 / 1024}MB` 
        })
      }
      
      // Gerar presigned URL para upload direto
      const key = `uploads/${id}/${Date.now()}-${sanitizeFilename(filename)}`
      
      const presignedUrl = await s3.getSignedUrlPromise('putObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Expires: 3600, // 1 hora para completar upload
        Metadata: {
          songId: id,
          uploadedBy: req.user.id,
          originalFilename: filename
        }
      })
      
      // Criar registro pendente no DB
      await db.songs.update(id, {
        'media.status': 'uploading',
        'media.uploadKey': key,
        'media.uploadStarted': new Date()
      })
      
      return res.json({
        uploadUrl: presignedUrl,
        key,
        expiresIn: 3600,
        instructions: {
          method: 'PUT',
          headers: {
            'Content-Type': contentType
          },
          note: 'After upload completes, call POST /api/songs/:id/confirm-upload'
        }
      })
      
    } catch (error) {
      console.error('[Upload API] Error:', error)
      return res.status(500).json({ error: 'Failed to prepare upload' })
    }
  }
)

/**
 * POST /api/songs/:id/confirm-upload
 * Confirmar upload e iniciar transcodificação
 */
router.post(
  '/songs/:id/confirm-upload',
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params
      
      const song = await db.songs.findById(id).execute()
      if (!song || !song.media?.uploadKey) {
        return res.status(404).json({ error: 'No pending upload found' })
      }
      
      // Verificar se arquivo existe no S3
      const exists = await checkS3ObjectExists(song.media.uploadKey)
      if (!exists) {
        return res.status(400).json({ error: 'Upload not completed' })
      }
      
      // Detectar formato do arquivo
      const format = detectFormatFromKey(song.media.uploadKey)
      
      // Enfileirar transcodificação
      await queue.add('transcode-audio', {
        songId: song.id,
        sourceKey: song.media.uploadKey,
        sourceFormat: format
      }, {
        priority: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 10000
        }
      })
      
      // Atualizar status
      await db.songs.update(id, {
        'media.status': 'processing',
        'media.queuedAt': new Date()
      })
      
      return res.json({
        status: 'processing',
        message: 'File uploaded successfully. Processing started.',
        estimatedTime: '30-60 seconds',
        pollUrl: `/api/songs/${id}/processing-status`
      })
      
    } catch (error) {
      console.error('[Confirm Upload] Error:', error)
      return res.status(500).json({ error: 'Failed to process upload' })
    }
  }
)

function detectFormatFromMime(mime: string): 'wav' | 'mp3' | null {
  if (mime === 'audio/wav' || mime === 'audio/x-wav') return 'wav'
  if (mime === 'audio/mpeg' || mime === 'audio/mp3') return 'mp3'
  return null
}

function detectFormatFromKey(key: string): 'wav' | 'mp3' {
  return key.toLowerCase().endsWith('.wav') ? 'wav' : 'mp3'
}

function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

async function checkS3ObjectExists(key: string): Promise<boolean> {
  try {
    await s3.headObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    }).promise()
    return true
  } catch (error) {
    if (error.code === 'NotFound') return false
    throw error
  }
}

export default router
```

---

## Próximos Passos

1. Validar decisões com stakeholders
2. Configurar infraestrutura AWS (S3, CloudFront)
3. Implementar database schema changes
4. Desenvolver workers (Feature A e B primeiro)
5. Implementar endpoints de API (Feature C)
6. Construir UI (Feature D)
7. Implementar pipeline de transcodificação (Feature E)
8. Testar em staging com dados reais
9. Deploy gradual em produção
10. Monitorar métricas e ajustar

---

**Última Atualização:** 2 de março de 2026  
**Autor:** AI Assistant + Product Owner  
**Status:** Draft para validação com equipe técnica
