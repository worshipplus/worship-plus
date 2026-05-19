# PRD-005 — Edição da Escala no Evento

## 1. Objetivo
Permitir a edição da escala dentro do Event, garantindo que apenas Admin e o Owner atribuído ao Event (responsável no dia) possam alterar a lista.

## 2. Problema
Sem controle claro de edição da escala no detalhe do Event, há risco de alterações indevidas por usuários sem privilégio e perda de confiança operacional no fluxo do dia.

## 3. Escopo MVP
- Exibir seção de escala no detalhe do Event com lista de integrantes e papéis.
- Permitir adicionar integrante à escala do Event.
- Permitir remover integrante da escala do Event.
- Permitir editar papel do integrante na escala do Event.
- Restringir edição para Admin e Owner do próprio Event.
- Manter Team Member em modo somente leitura para a escala.

## 4. Fora de Escopo
- Sugestão automática de escala por disponibilidade avançada.
- Notificações automáticas para alterações de escala.
- Edição em lote de múltiplos Events.
- Definição de modelo de banco de dados.

## 5. Personas
- Admin
- Ministro/Owner
- Team Member

## 6. Requisitos Funcionais
1. O detalhe do Event deve exibir a lista de escala atual.
2. Usuário Admin deve conseguir adicionar, remover e editar papel na escala.
3. Usuário Owner do Event deve conseguir adicionar, remover e editar papel na escala.
4. Usuário que não seja Admin nem Owner do Event deve visualizar a escala sem ações de edição.
5. A UI deve refletir o estado de permissão (ações visíveis/desabilitadas com explicação).

## 7. Requisitos Não Funcionais
- Responsividade mobile-first (375px).
- Feedback visual claro para ações de adicionar/remover/editar papel.
- Comportamento consistente de autorização em UI e serviços mockados.

## 8. Regras de Negócio
- Apenas Admin ou Owner do Event podem editar a escala.
- Owner considerado é o responsável atribuído ao Event no dia (owner_id do próprio Event).
- Team Member não pode editar escala, mesmo quando escalado no Event.
- Terminologia deve seguir linguagem ubíqua: Event, Owner/Ministro, Privilégio.

## 9. Critérios de Aceitação
- [ ] Escala visível no detalhe do Event com dados mockados.
- [ ] Admin consegue adicionar, remover e editar papel de integrante na escala.
- [ ] Owner do Event consegue adicionar, remover e editar papel de integrante na escala.
- [ ] Team Member sem privilégio não vê ações de edição ou as vê desabilitadas com explicação.
- [ ] Regras de permissão cobertas por teste unitário de caminho feliz e de restrição.
- [ ] Sem definição de schema/modelagem de banco.

## 10. Dados e Persistência
- Utilizar mocks em `frontend/src/mocks/` para simular escala e permissões.
- Não definir schema, tabelas, migrations ou contratos de persistência finais.

## 11. Entregáveis
- Seção de escala no detalhe do Event com estados de visualização e edição.
- Regras de permissão aplicadas por perfil na UI.
- Testes unitários de edição permitida (Admin/Owner) e bloqueio (Team Member).