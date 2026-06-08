# PRD-004 — Cadastro de Usuário com Privilégios e Papéis no Grupo

## 1. Objetivo
Disponibilizar no MVP o cadastro de usuário com definição de privilégios e papéis no grupo para controlar acesso e melhorar a organização das escalas.

## 2. Problema
Sem cadastro estruturado com privilégios e papéis musicais, o sistema perde controle sobre quem pode criar/editar conteúdos sensíveis e dificulta a montagem de escalas.

## 3. Escopo MVP
- Formulário de cadastro de usuário.
- Definição de perfil de acesso no cadastro.
- Definição de papéis/habilidades musicais do usuário.
- Definição de papel primário padrão do usuário.
- Lista básica de usuários cadastrados.
- Edição de privilégios por usuário autorizado.

## 4. Fora de Escopo
- Fluxos avançados de convite multi-etapas.
- Provisionamento externo complexo.
- Auditoria completa de segurança.
- Definição de modelo de banco de dados.

## 5. Perfis de Acesso (MVP)
- Admin: gestão completa.
- Ministro/Owner: gestão operacional de eventos e setlists permitidos.
- Team Member: acesso limitado e foco em visualização/autoatualização.

## 6. Requisitos Funcionais
1. Admin deve conseguir cadastrar usuário com dados básicos e perfil de acesso.
2. Admin deve definir ao menos um papel/habilidade do usuário no grupo (ex.: Cantor, Violão, Piano, Baixo, Bateria, Guitarra).
3. Admin deve conseguir marcar um papel primário padrão entre as habilidades atribuídas.
4. Admin deve conseguir editar privilégios e papéis de qualquer usuário.
5. Membro deve conseguir editar apenas o próprio perfil.
6. Usuário sem privilégio administrativo não deve alterar privilégios ou papéis de terceiros.
7. Sistema deve bloquear ações fora do perfil permitido.

## 7. Requisitos Não Funcionais
- Validação de formulário com mensagens claras.
- Interface responsiva e acessível.
- Comportamento previsível de autorização na UI e serviços mockados.

## 8. Regras de Negócio
- Apenas Admin pode conceder/revogar privilégios administrativos.
- Usuário pode ter múltiplas habilidades/papéis no grupo.
- Todo usuário com habilidades cadastradas deve ter exatamente um papel primário padrão.
- Privilégios devem ser aplicados imediatamente na sessão após atualização.
- Terminologia deve seguir glossário do projeto.

## 9. Critérios de Aceitação
- [ ] Cadastro de usuário disponível com seleção de perfil.
- [ ] Cadastro de usuário permite definir múltiplas habilidades/papéis (Cantor, Violão, Piano, Baixo, Bateria, Guitarra).
- [ ] Cadastro exige definição de papel primário padrão.
- [ ] Edição de privilégios disponível para Admin.
- [ ] Edição de papéis/habilidades disponível para Admin.
- [ ] Membro só consegue editar informações do próprio perfil.
- [ ] Restrição de acesso aplicada por perfil.
- [ ] Fluxo validado com dados mockados.
- [ ] Sem definição de schema/modelagem de banco.

## 10. Dados e Persistência
- Utilizar dados mockados para cadastro/listagem/permissões.
- Não definir modelagem de banco, migrations ou entidades persistentes finais.

## 11. Entregáveis
- Tela de cadastro de usuário com privilégios e papéis/habilidades.
- Tela/lista simples de usuários.
- Regras de autorização no fluxo de interface e camada de serviço mockada.
