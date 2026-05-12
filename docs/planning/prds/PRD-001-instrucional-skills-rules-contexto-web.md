# PRD-001 — Instrucional, Skills e Rules para Contexto Web

## 1. Objetivo
Criar uma base de contexto enxuta e reutilizável para próximas sessões de desenvolvimento MVP, a partir das configurações atuais do projeto web (React + Vite + TypeScript + Vitest + Playwright + ESLint + Prettier), reduzindo ambiguidade e retrabalho.

## 2. Problema
As próximas features podem ser executadas com inconsistências se não houver um pacote único de instruções operacionais (instrucional), capacidades esperadas (skills) e regras objetivas (rules) para os agentes e colaboradores.

## 3. Escopo MVP
- Definir um **instrucional** curto para início de sessão.
- Definir **skills** práticas para execução de PRDs de frontend.
- Definir **rules** de qualidade, nomenclatura e fluxo de entrega.
- Alinhar conteúdo com stack/configuração web atual do repositório.

## 4. Fora de Escopo
- Implementação de código de produto.
- Alterações de arquitetura.
- Definição de modelo de banco de dados.

## 5. Requisitos Funcionais
1. Deve existir um artefato de instrucional com checklist de abertura de sessão.
2. Deve existir um artefato de skills com capacidades operacionais para UI, testes e validação.
3. Deve existir um artefato de rules com políticas claras de execução (escopo, qualidade, terminologia e validação).
4. Os artefatos devem referenciar comandos e padrões já existentes no projeto web.

## 6. Requisitos Não Funcionais
- Clareza: leitura em até 10 minutos.
- Objetividade: regras acionáveis, sem conteúdo genérico.
- Baixo custo de contexto: foco em resumos e links para documentos fonte.

## 7. Fluxo de Uso
1. Iniciar sessão e carregar instrucional.
2. Ler skills aplicáveis à feature do momento.
3. Aplicar rules durante planejamento, implementação e validação.
4. Executar PRD da feature alvo com o mesmo padrão.

## 8. Domínios e Linguagem Ubíqua (MVP - Fase Atual)
### 8.1 Domínios (Bounded Contexts)
- **Worship Context (Core):** eventos de louvor, event setlist e operação de culto.
- **Team Context (Supporting):** membros, papéis e disponibilidade da equipe.
- **User Management Context (Generic):** autenticação, sessão e autorização por privilégio.
- **Media Context (Supporting, post-MVP):** gestão de arquivos de mídia (fora do escopo desta fase).

### 8.2 Linguagem Ubíqua mínima
- **Setlist:** biblioteca global de músicas.
- **Event Setlist:** lista de músicas de um evento específico.
- **Event:** culto/evento de louvor.
- **Owner/Ministro:** líder responsável pelo evento.
- **Backing Vocal:** segunda voz (não substitui papel de ministro).
- **Locked Event:** evento finalizado, sem novas edições.
- **Privilégio:** nível de permissão para ações e visualização.

## 9. Critérios de Aceitação
- [ ] Instrucional criado com checklist de início/fim de sessão.
- [ ] Skills criadas e organizadas por tipo de tarefa (planejamento, UI, testes, revisão).
- [ ] Rules definidas para escopo, qualidade e consistência de domínio.
- [ ] Domínios MVP e linguagem ubíqua mínima definidos e aprovados para uso imediato.
- [ ] Conteúdo compatível com a stack/configuração web do repositório.
- [ ] Sem definição de schema/modelagem de banco.

## 10. Dependências
- Documentação de roadmap e guias do projeto.
- Configuração do frontend (scripts, stack e ferramentas).

## 11. Dados e Persistência
- Usar dados mockados apenas para exemplificação de fluxo.
- Não definir estrutura de banco, tabelas, migrations ou contratos de persistência.

## 12. Entregáveis
- Documento de instrucional.
- Documento de skills.
- Documento de rules.
- Referência cruzada com PRDs 002, 003 e 004.
