# PRD-003 — Visualização da Página de Eventos

## 1. Objetivo
Criar a feature de visualização da página de eventos para que usuários acompanhem agenda e detalhes principais de cada evento no MVP.

## 2. Problema
Sem uma visão central de eventos, membros e líderes perdem contexto de datas, responsabilidades e preparação.

## 3. Escopo MVP
- Lista de eventos com filtros básicos (todos, próximos).
- Card/item de evento com data, título, status e responsável.
- Navegação para detalhe de evento.
- Página de detalhe com informações essenciais e setlist associado (somente visualização).

## 4. Fora de Escopo
- Criação/edição completa de evento nesta entrega.
- Notificações push.
- Integrações externas de calendário.
- Definição de modelo de banco de dados.

## 5. Personas
- Admin
- Ministro/Owner
- Team Member

## 6. Requisitos Funcionais
1. Exibir listagem de eventos futuros.
2. Permitir filtro rápido por período.
3. Permitir abrir detalhe do evento.
4. Exibir no detalhe: título, data/hora, descrição, responsáveis e músicas relacionadas.
5. Respeitar visibilidade conforme privilégios do usuário.

## 7. Requisitos Não Funcionais
- Responsividade para mobile.
- Leitura clara de data/hora.
- Acessibilidade mínima em navegação e contraste.

## 8. Regras de Negócio
- Eventos em rascunho podem ter visibilidade restrita conforme perfil.
- Terminologia deve seguir linguagem do domínio (Event, Event Setlist, Owner).

## 9. Critérios de Aceitação
- [ ] Lista de eventos renderizada com dados mockados.
- [ ] Filtros básicos funcionando.
- [ ] Navegação para detalhe funcionando.
- [ ] Informações principais do evento visíveis em detalhe.
- [ ] Sem definição de schema/modelagem de banco.

## 10. Dados e Persistência
- Usar dados mockados para lista e detalhe.
- Não definir estrutura de banco, tabelas ou migrations.

## 11. Entregáveis
- Tela de listagem de eventos.
- Tela de detalhe de evento (read-only MVP).
- Fluxo de navegação entre lista e detalhe.

## 12. Atualizacao de Regras de Negocio (2026-05)

Contexto da atualizacao:
- O integrante pode possuir multiplas habilidades no cadastro do projeto (ex.: violao e voz; piano e bateria).
- O integrante precisa ter um papel principal e pode ter papeis secundarios.
- Em cada Event, o integrante executa apenas um papel na Escala.

Novas regras aplicadas ao dominio:
1. Cadastro de integrante deve permitir definir 1 papel principal e 0..N papeis secundarios.
2. Papel principal do integrante deve ser sugerido por padrao na montagem da Escala do Event.
3. Papel definido na Escala pode ser alterado durante o planejamento do Event, respeitando Privilégio.
4. Alteracao de papel na Escala deve ser permitida apenas para admin ou Owner/Ministro responsavel pelo Event.
5. Team Member pode informar disponibilidade de papeis no cadastro, mas nao pode alterar papeis de terceiros na Escala.
6. Event Locked nao aceita mudanca de papel na Escala.

Critérios de aceite adicionais:
- [ ] Cadastro de integrante suporta papel principal e papeis secundarios.
- [ ] Escala do Event atribui apenas um papel por integrante no mesmo Event.
- [ ] Papel principal e sugerido automaticamente na insercao do integrante na Escala.
- [ ] Fluxo de edicao de papel na Escala respeita Privilégio e bloqueio de Event Locked.
