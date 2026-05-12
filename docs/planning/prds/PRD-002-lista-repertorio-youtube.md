# PRD-002 — Lista de Repertório com Link do YouTube

## 1. Objetivo
Entregar no MVP uma funcionalidade de listagem e gestão básica de repertório (Setlist) com link obrigatório do YouTube para apoio de ensaio e padronização musical.

## 2. Problema
A equipe precisa acessar rapidamente músicas corretas para ensaio/eventos, sem depender de envio manual por mensagens.

## 3. Escopo MVP
- Tela de listagem de repertório.
- Cadastro e edição básica de item de repertório.
- Campo de link do YouTube obrigatório.
- Busca por título e autor.
- Visualização rápida do link (abrir/preview simples).

## 4. Fora de Escopo
- Upload e processamento de VS/áudio.
- Player avançado interno.
- Recomendação automática de músicas.
- Definição de modelo de banco de dados.

## 5. Personas
- Admin
- Ministro/Owner
- Team Member (somente visualização, conforme privilégios)

## 6. Requisitos Funcionais
1. Usuário com permissão deve cadastrar música com: título, autor, tom opcional e URL do YouTube obrigatória.
2. Usuário com permissão deve editar e remover música.
3. Lista deve suportar busca textual por título/autor.
4. Usuários sem permissão de edição devem ter acesso apenas de leitura.

## 7. Requisitos Não Funcionais
- Interface mobile-first.
- Feedback de validação de formulário.
- Tempo de resposta adequado para lista pequena/média (MVP).

## 8. Regras de Negócio
- Link do YouTube é obrigatório no MVP.
- Termo de domínio: usar “Setlist” para biblioteca e “Event Setlist” para músicas de evento.
- Permissões devem respeitar perfil do usuário.

## 9. Critérios de Aceitação
- [ ] É possível listar itens de repertório.
- [ ] É possível cadastrar item com validação de URL do YouTube.
- [ ] É possível editar/remover item com permissão adequada.
- [ ] Usuário sem permissão vê apenas leitura.
- [ ] Sem definição de schema/modelagem de banco.

## 10. Dados e Persistência
- Implementação orientada a dados mockados no MVP inicial.
- Sem modelagem de banco, migrations ou contratos de persistência definitivos.

## 11. Entregáveis
- Fluxo de UX da lista de repertório.
- Componentes/telas de listagem e formulário.
- Regras de permissão no nível de interface e serviço mockado.
