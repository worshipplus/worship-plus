# Brainstorm Insights — Worship+

Data gerada automaticamente pelo agente (pré-validate com o Product Manager Agent)

## Objetivo
Agrupar dúvidas e decisões que precisam de validação com stakeholders para garantir coesão do produto.

---

## Perguntas-chave para o `product-manager-agent` / stakeholder

1. Autenticação e cadastro
- O cadastro deve ser sempre protegido por token gerado pelo admin? Quais cenários precisam de auto-registro (convidados)?
- Quais campos são obrigatórios no cadastro inicial e quais podem ser completados depois?

A: Não será mais necessário o token de admin, apenas teremos tela de login, e cadastro comum, protegido pela plataforma padrão.

2. Permissões e papéis
- Além de `Admin` e `Team Member`, precisamos de papéis intermediários (ex.: Diretor Musical, Coordenador de Mídia)?
- Admin pode delegar poder de aprovação de eventos? Quais ações devem exigir dupla aprovação?

A: Inicialmente não é necessário dupla aprovação

3. Armazenamento de mídia
- Onde iremos armazenar os arquivos de mídia (VS .wav/.mp3) em produção — S3 na cloud, armazenamento local, ou ambos?
- Política de retenção e lifecycle: quanto tempo manteremos arquivos originais vs versões transcodificadas?
- Devemos transcodificar automaticamente para formatos otimizados (mp3-aac, webm) ao upload?

4. Limites e formatos
- Tamanho máximo sugerido para avatar (ex.: 5 MB) está OK com stakeholders? E para arquivos VS (ex.: 50–200 MB)?
- Quais codecs/formats precisamos suportar inicialmente (wav, mp3) e quais são opcionais?

5. Fluxo de upload e UX
- Preferem upload direto do cliente para object storage via presigned URL (recomendado) ou upload via backend?
- Qual comportamento UX em uploads grandes (resume, chunked upload, barra de progresso)?

6. Setlist e direitos autorais
- Como iremos tratar metadados de direitos autorais (autor, publisher)? Precisamos de um fluxo para armazenar licenças?

7. Eventos e escala
- Critérios para publicar um evento (aprovado pelo PM? por admin?)
- Regras para montar escala: restrições por instrumento, duplicidade, disponibilidade dos membros?

8. Integração com ferramentas externas
- É necessário integrar com plataformas de partitura (CifraClub, Ultimate Guitar) ou com armazenamento corporativo?

9. Privacidade e compliance
- Precisamos suportar requisitos específicos de privacidade (LGPD/GDPR)? Política de consentimento para fotos e gravações?

10. MVP scope
- Para o MVP, qual é a prioridade entre: gerenciamento de eventos, setlist, escalas, e perfil de usuário? (ordenar)

---

## Decisões sugeridas (propostas do agente para validação rápida)

- Autenticação: manter cadastro por token gerado por admin para o lançamento inicial; permitir convite por e-mail no roadmap.
- Papéis: começar com Admin e Team Member; adicionar roles granulares posteriormente.
- Armazenamento: usar S3 (ou equivalente) com presigned uploads; processar arquivos VS em workers com ffmpeg para gerar versões otimizadas.
 - Armazenamento: usar S3 (ou equivalente) para as versões ativas e entrega via CDN; manter os arquivos originais em um armazenamento mais barato/arquivamento (ex.: S3 Infrequent/Glacier ou bucket separado com lifecycle) que permita recuperação sob demanda pelo usuário.
 - Downloads: **formato padrão é pacote ZIP por evento** contendo todas músicas VS. Links gerados via presigned URLs. Sistema pode gerar ZIP on-demand ou pré-gerar ao criar evento. Download individual de música avulsa disponível como fallback.
 - Processamento: uploads do original serão aceitos e o processamento/transcodificação (geração de MP3/AAC, WebM, thumbnails) será realizado no backend (workers ou funções serverless, ex.: Lambda) de forma assíncrona; o frontend mostrará status e notificações quando as versões otimizadas estiverem disponíveis.
- Limites: avatar <= 5MB, arquivo VS inicialmente <= 200MB (rever após uso real).
 - Limites: avatar <= 5MB recomendado (aceitável até 5MB para casos específicos); arquivo VS inicialmente <= 200MB (rever após uso real).
 - Formatos: armazenar apenas `wav` e `mp3` por enquanto.
- UX uploads: upload direto via presigned URL com suporte a chunking/resumable e barra de progresso.
 - UX uploads: upload direto via presigned URL com suporte a chunking/resumable e barra de progresso. O backend enfileira o job de transcodificação e atualiza o estado do arquivo no metadata store.
 - UX downloads: **formato padrão é ZIP por evento** (pacote com todas músicas VS do evento). Sistema gera ZIP automaticamente ao criar/atualizar evento e notifica equipe quando disponível. Download individual disponível como fallback para músicas avulsas.
- Setlist: salvar metadados no DB; arquivos em object storage; política de licenciamento explicita no cadastro da música.
- MVP scope: 1) Eventos + Escalas, 2) Setlist básico com upload, 3) Perfis e autenticação, 4) Integrações e compliance.

---

## Ações propostas

- `product-manager-agent`: revisar essas perguntas e decisões, priorizar e agendar 1 reunião com stakeholders para validação.
- Registrar decisões aprovadas em `decision_log.md` com data, autor e impacto.
- Atualizar `project-details.md` com quaisquer requisitos novos ou modificados.
 - `product-manager-agent`: revisar essas perguntas e decisões, priorizar e agendar 1 reunião com stakeholders para validação; incluir a necessidade de endpoints de download (ZIP de evento + fallback individual) nas histórias.
 - `software-architecture-agent`: especificar buckets S3 (active vs archival), lifecycle rules, retrieval workflow (user-requested restore), presigned URL patterns, ZIP generation strategy (on-demand vs pre-generated), and recommended worker/lambda design for transcodes and retries.
 - Registrar decisões aprovadas em `decision_log.md` com data, autor e impacto.
 - Atualizar `project-details.md` com quaisquer requisitos novos ou modificados.

## Perguntas abertas geradas pela RFC do projeto

- Autenticação e contas:
	- Queremos verificação por e-mail no signup ou permitimos cadastro imediato?
	- Sim, verificação de email ou celular
	- Haverá suporte a login social (Google/Facebook) ou SSO corporativo no MVP?
	A: sim, conta google e apple
- Permissões e papéis:
	- Precisamos de papéis adicionais (Diretor Musical, Coordenador de Mídia) no MVP? Quais permissões específicas cada papel terá?
	
	A: Sim, teremos uma nova label dentro dos papeis dos cantores, a label se resume ao papel que o integrante irá executar naquele momento. Podemos dizer que é a role do integrante naquele evento. Irei detalhar a seguir:
	
	### Singer's asignments:

	**Contexto:**
	Desejo ter a possíbilidade de delegar um papel para os cantores, essa tag/label nos cantores além da função ja existente, os cantores no caso serão definidos ou como ministro ou backing-vocal. 
	
	O ministro/owner é o responsável por aquele culto/evento, no que tange a escolha do setlist e também quem irá guiar as musicas.
	
	### Permições de acesso.
	O Owner/ministro tem permição ainda que não seja administrador do app para editar as musicas dos eventos que ele irá participar guiar.

	Para isso será necessário termos duas features, adicionar essa propriedade de delegação no staf e oferecer a funcionalidade 'lock/unlock-event-managment' que é o bloqueio das edições do evento. Sendo assim, possível não apenas ter o evento desbloqueado para o owner do evento, como também mostrar para os outros integrantes que seu acesso é de nivel read/only.

- Retenção e compliance:
	- Confirmações sobre períodos de retenção (sugestão inicial: 90 dias para mover para archival)?

	A: Sim, 90 dias é muito conservador. Proposta: armazenamento inteligente 
baseado em eventos agendados. Arquivos VS ficam em Glacier IR (baixo custo) 
por padrão e são automaticamente promovidos para S3 Standard quando a música 
está em eventos nos próximos 30 dias. Após 30 dias do evento, retornam ao 
archival. Economia estimada: ~80% em storage costs mantendo disponibilidade 
quando necessário.

	- Há requisitos legais (LGPD/GDPR) específicos para armazenamento/consentimento de gravações?
	
	A: Os arquivos VS em si não contêm dados pessoais identificáveis (são 
gravações musicais coletivas sem individualização de vozes), portanto 
NÃO requerem consentimento específico LGPD. Uso baseado em "legítimo 
interesse" para atividade religiosa sem fins lucrativos.

PORÉM, o sistema possui dados pessoais em outros contextos (cadastro 
de membros, fotos, escalas, logs) e DEVE estar em conformidade com LGPD:
- MVP: Política de Privacidade, Termos de Uso, consentimento no signup, 
  direitos de acesso/correção/exclusão
- Produção: DPO designado, registro de atividades de tratamento, logs 
  de auditoria

Documentar na Política de Privacidade que arquivos de áudio são usados 
apenas para fins internos do ministério.


- Infra e custo:
	- Qual o provedor de nuvem pretendido (AWS, GCP, Azure) para alinhar IaC e serviços serverless?
	
	A: Recomendação AWS + Supabase
	- AWS como cloud provider principal:
	  * Free Tier de 12 meses permite MVP custo zero
	  * S3 Glacier Instant Retrieval ideal para arquivamento inteligente
	  * Ecossistema maduro e documentação abundante
	  * Compatível com Supabase (simplifica auth + database)
	- Stack: Vercel/Netlify (frontend free) + Supabase (backend/auth/db free tier) + AWS S3 (storage)
	- Trade-offs vs outras clouds:
	  * GCP: Transfer gratuito atrativo mas menos ferramentas OSS
	  * Azure: Bom se igreja já usa Microsoft 365, senão sem vantagem
	  * AWS: Melhor custo-benefício para projeto sem fins lucrativos
	
	- Qual a meta de custo por GB/mês ou por usuário ativo (orientação para escolher tiers)?
	
	A: Dimensionamento baseado em uso real (60-300 músicas, 20-50 usuários)
	- Contexto importante:
	  * Adoção VS não é 100% (estimado 40-60% do setlist terá VS)
	  * Eventos variam: pequenos (3-5 músicas) são frequentes, grandes (20 músicas) são raros (1x/trimestre)
	  * Músicos baixam apenas VS das músicas do próximo evento, não todo setlist
	
	- Estimativas de custo:
	  * Ano 1 MVP (30 músicas com VS, 3GB): $0.38/mês em média
	    - Inclui eventos trimestrais grandes: ~$9/ano total
	  * Ano 2-3 Produção (100 músicas com VS, 10GB): $0.78/mês base + $1.80 por evento grande
	    - Total anual: ~$17/ano (~$1.40/mês médio)
	  * Com Supabase Free Tier: **custo total pode ser $0/mês no primeiro ano**
	
	- Breakdown técnico:
	  * Storage ativo (S3 Standard): ~700MB = $0.02/mês
	  * Storage archive (Glacier IR): ~9GB = $0.04/mês
	  * Transfer (bandwidth): principal custo = $0.70/mês (variável por uso)
	  * Database: Supabase Free (suficiente) ou $25/mês (Pro quando escalar)
	
	- Decisão de UX e otimização de custos:
	  * **Download padrão: arquivo ZIP por evento** (não downloads individuais)
	  * Sistema gera automaticamente pacote ZIP com todas músicas VS do evento
	  * Vantagens:
	    - Reduz transfer costs em até 70% (CloudFront cache serve múltiplos usuários)
	    - Melhor UX: 1 download vs múltiplos downloads individuais
	    - Menos requisições ao S3 (reduz custos API)
	    - Músico baixa tudo que precisa de uma vez
	  * Implementação: ao criar evento, backend gera ZIP e notifica equipe quando disponível
	  * Fallback: download individual disponível se necessário (música avulsa)
	
	Conclusão: Muito adequado para projeto sem fins lucrativos. Custo anual estimado < $20/ano nos primeiros anos.

- Media specifics:
	- Bitrate/sample-rate máximos aceitáveis para `wav`/`mp3`? Restrições de qualidade que impactam tamanho?
	
	A: Especificações técnicas recomendadas baseadas em uso real e custo-benefício:
	
	**WAV (arquivo master/original):**
	- Sample Rate: 44.1 kHz ou 48 kHz (aceitar ambos)
	- Bit Depth: 16-bit (padrão) ou 24-bit (opcional para gravações de estúdio)
	- Canais: Estéreo (2 canais)
	- Tamanho esperado: ~40-70 MB por música de 4 minutos
	- Uso: Performance ao vivo, backup de qualidade, mixagem
	
	**MP3 (formato de trabalho/ensaio):**
	- Bitrate: 256 kbps (recomendado) ou 320 kbps (máximo)
	- Sample Rate: 44.1 kHz ou 48 kHz (derivado do WAV)
	- Canais: Estéreo
	- Tamanho esperado: ~8-10 MB por música de 4 minutos
	- Uso: Rehearsal, playback em dispositivos móveis, ensaios
	
	**Limites técnicos para upload:**
	- WAV: máximo 200 MB (equivale a ~5 minutos em 48kHz/24bit)
	- MP3: máximo 50 MB (equivale a ~20 minutos em 320 kbps)
	- Rejeitar uploads com sample rates > 96 kHz (desnecessário e muito grande)
	- Rejeitar uploads mono (forçar estéreo mínimo)
	
	**Impacto no storage (100 músicas):**
	- MP3 256 kbps: ~800 MB total = $0.003/mês (Glacier IR)
	- WAV 44.1kHz/16bit: ~4 GB total = $0.016/mês (Glacier IR)
	- Total: ~$0.02/mês em archive (muito viável!)
	
	**Transcodificação automática:**
	- Se usuário upar WAV, gerar MP3 256 kbps automaticamente
	- Se usuário upar MP3 > 256 kbps, re-encodar para 256 kbps (economia de espaço)
	- Manter WAV original sempre (backup)
	
	Conclusão: 256 kbps MP3 + WAV original oferece melhor custo-benefício. Qualidade suficiente para uso ao vivo e ensaios mantendo storage baixo.
	
	- Desejamos gerar `webm` para previews no futuro ou manter apenas mp3 derivado inicialmente?
	
	A: Para MVP, manter apenas MP3. WebM é desnecessário no curto prazo.
	
	**WebM - O que é:**
	- Formato de áudio moderno (codec Opus)

	- Melhor compressão que MP3 (menor arquivo para mesma qualidade)
	- Suporte nativo em browsers modernos
	- Vantagem: ~30% menor que MP3 para mesma qualidade
	
	**Por que NÃO priorizar agora:**
	- MP3 tem suporte universal (iOS, Android, todos browsers, equipamentos de som)
	- WebM não é suportado nativamente em devices/equipamentos de PA/som ao vivo
	- Músicos precisam baixar para dispositivos diversos (alguns antigos)
	- Economia de bandwidth seria pequena (~30% de savings já pequenos)
	- Complexidade adicional no pipeline de transcodificação
	
	**Quando considerar WebM:**
	- V2/V3: Se adicionarmos player web para preview/ensaio online
	- Uso: Streaming no browser apenas (não download)
	- Implementação: Gerar WebM apenas para preview no app (< 30s de sample)
	- Manter MP3/WAV para downloads
	
	**Roadmap sugerido:**
	- MVP (Fase 1): MP3 + WAV apenas
	- V2 (Fase 2): Adicionar preview WebM de 30s para player no app
	- V3 (Futuro): Considerar WebM full se houver demanda de streaming ao invés de download
	
	Conclusão: MP3 suficiente para MVP. WebM pode ser roadmap item se surgir necessidade de player web otimizado.

- UX e suporte móvel:
	- Lista de dispositivos/browsers prioritários para suportar (iOS versions, Android min versions)?
	
	A: Suporte progressivo baseado em uso real esperado (igreja com membros de diferentes faixas etárias):
	
	**Browsers Prioritários (Desktop):**
	- Chrome/Edge: versões dos últimos 2 anos (2024+)
	- Safari: versões dos últimos 2 anos (16+)
	- Firefox: versões dos últimos 2 anos (2024+)
	- Cobertura esperada: ~95% dos usuários desktop
	
	**Mobile Browsers:**
	- iOS Safari: iOS 15+ (2021+)
	  * Justificativa: iOS 15+ tem 90%+ adoção, suporte bom a PWA
	  * Recursos críticos: Service Workers, Media Session API
	- Chrome Android: Android 10+ (2019+)
	  * Justificativa: Android 10+ tem 85%+ adoção entre usuários ativos
	  * Recursos críticos: PWA instalável, notificações
	
	**Devices Específicos:**
	- iPhone: iPhone 8 e posterior (iOS 15 compatível)
	- iPad: iPad (5ª geração, 2017) e posterior
	- Android: Mínimo Android 10 (API level 29)
	  * Realidade: maioria dos músicos tem devices 2019+
	
	**Features Modernas Usadas:**
	- CSS Grid/Flexbox (universal)
	- Fetch API (universal)
	- LocalStorage (universal)
	- Service Workers (iOS 15+, Android 10+)
	- Media Session API (iOS 15+, Android 10+)
	- Web Share API (iOS 15+, Android 10+)
	
	**Graceful Degradation:**
	- Browsers antigos: funcionalidade core funcionará, features avançadas desabilitadas
	- Sem Service Worker: sem cache offline, mas app funciona online
	- Sem Media Session: player funciona, sem controles lock screen
	
	**Testing Matrix (Prioritário):**
	1. iPhone 12+ (iOS 16/17) - Safari
	2. Samsung Galaxy (Android 12+) - Chrome
	3. Desktop Chrome (últimas 2 versões)
	4. Desktop Safari macOS (últimas 2 versões)
	
	Conclusão: Foco em iOS 15+ e Android 10+. Cobertura estimada 90%+ dos usuários. Testar principalmente em Safari iOS e Chrome Android.
	
	- Precisamos de suporte offline avançado (sync queue) no MVP ou podemos deixar para roadmap?
	
	A: Offline avançado é ROADMAP (V2/V3). MVP terá apenas cache básico.
	
	**Para MVP (Fase 1) - Cache Básico:**
	- Service Worker com cache de assets estáticos (HTML, CSS, JS, imagens)
	- Cache de API responses (escalas, eventos próximos) com TTL curto (5-15 min)
	- Arquivos VS baixados ficam em Downloads do device (não gerenciado pelo app)
	- Se offline: mostrar tela informativa "Você está offline"
	- Benefícios: App carrega rápido, funciona com internet instável
	
	**Para V2 (Futuro) - Offline Avançado:**
	- Sync queue para criar/editar eventos offline
	- IndexedDB para armazenar dados localmente
	- Conflict resolution (se admin editou online enquanto usuário offline)
	- Download gerenciado de VS (app mantém arquivos, não Downloads)
	- Background sync quando voltar online
	
	**Por que adiar offline avançado:**
	- Complexidade alta: sync conflicts, storage management, background sync
	- Uso real: músicos geralmente têm internet (4G/WiFi)
	- Arquivos VS são grandes (melhor baixar quando necessário, não manter todos localmente)
	- Prioridade MVP: funcionalidade core funcionando bem online primeiro
	
	**Cenário Realista:**
	- Músico baixa ZIP de evento 1 semana antes (quando tem WiFi)
	- Arquivos ficam em Downloads do celular/tablet
	- No dia do evento: importa no app de áudio/DAW localmente
	- Não precisa de internet no dia do evento (arquivos já baixados)
	
	Conclusão: MVP com Service Worker básico suficiente. Offline avançado é nice-to-have, não blocker. Adicionar em V2 se houver demanda real.

- Testing & QA:
	- Quais e2e flows são obrigatórios antes do lançamento (upload+process, create event, download original)?
	
	A: Definir 8 fluxos E2E críticos obrigatórios antes de produção:
	
	**Fluxo 1: Autenticação Completa**
	- Signup com email/senha + verificação
	- Login com Google OAuth
	- Login com Apple ID
	- Logout e re-login
	- Recuperação de senha
	- Critério sucesso: Usuário consegue acessar app por qualquer método
	
	**Fluxo 2: Gestão de Equipe (CRUD Básico)**
	- Admin cria novo membro
	- Edita dados do membro (nome, instrumento, foto)
	- Remove membro
	- Filtra membros por função
	- Critério sucesso: Operações CRUD funcionam sem erros
	
	**Fluxo 3: Upload e Processamento de VS**
	- Admin seleciona arquivo WAV (50MB)
	- Upload com barra de progresso
	- Backend transcodifica para MP3
	- Notificação quando pronto
	- Música fica disponível na biblioteca
	- Critério sucesso: WAV virou MP3, ambos acessíveis
	
	**Fluxo 4: Criação de Evento Completo**
	- Admin cria evento futuro (7 dias à frente)
	- Adiciona 5 músicas ao setlist
	- Escala 8 membros da equipe
	- Define ministro/owner do evento
	- Publica evento
	- Critério sucesso: Evento visível para membros escalados
	
	**Fluxo 5: Download de VS (Happy Path)**
	- Membro escalado acessa evento
	- Clica "Baixar Todas (ZIP)"
	- ZIP é gerado ou servido do cache
	- Download completa com sucesso
	- ZIP contém 5 músicas (MP3 + WAV) + README
	- Critério sucesso: Arquivos extraídos e reproduzíveis
	
	**Fluxo 6: Arquivamento Inteligente**
	- Música está em evento daqui 25 dias
	- Worker promove arquivo para S3 Standard
	- Música fica disponível para download rápido
	- Após evento + 30 dias, worker arquiva para Glacier IR
	- Critério sucesso: Storage class muda automaticamente
	
	**Fluxo 7: Permissões de Ministro/Owner**
	- Admin define João como ministro de evento X
	- João (não-admin) consegue editar músicas do evento X
	- João tenta editar evento Y (não é owner): bloqueado
	- Maria (backup vocal) vê evento X como read-only
	- Critério sucesso: Permissões funcionam corretamente
	
	**Fluxo 8: Navegação Mobile Completa**
	- Usuário acessa via iPhone Safari
	- Navega: Eventos → Equipe → Setlist → Perfil
	- Player de áudio funciona (play, pause, seek)
	- Download funciona em mobile
	- App é responsivo em 375px e 768px
	- Critério sucesso: Todas telas usáveis em mobile
	
	**Testes Adicionais (Importante mas não blocker):**
	- Performance: página carrega em < 3s
	- Acessibilidade: navegação por teclado funciona
	- Error handling: mensagens claras em caso de falha
	- Concurrent users: 10 usuários simultâneos sem degradação
	
	**Tools Recomendadas:**
	- Playwright ou Cypress para E2E
	- Jest + React Testing Library para unit/integration
	- Lighthouse para performance/accessibility
	- Manual QA em devices reais (1 iPhone, 1 Android)
	
	Conclusão: 8 fluxos críticos devem passar 100% antes de produção. Executar em CI/CD pipeline antes de cada deploy.

Adicione respostas ou comentários acima no `brainstorm-insights.md` para consolidarmos decisões e avançarmos com ADRs/implementação.


