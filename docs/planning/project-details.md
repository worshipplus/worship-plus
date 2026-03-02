# Worship+

## Descrição do Projeto

Plataforma digital para gestão e organização de grupos de louvor de igrejas, focada em facilitar a comunicação, escalas, setlists e eventos.

**Objetivo:** Centralizar informações, melhorar a colaboração entre membros e otimizar o planejamento musical e de eventos.

**Público-alvo:** Equipes de louvor, músicos, cantores, técnicos de mídia e som, líderes de igrejas.

**Problema:** Dificuldade de organização, comunicação dispersa, falta de controle sobre setlists e escalas.

**Motivação:** Tornar o trabalho do grupo de louvor mais eficiente, transparente e acessível, promovendo melhor experiência para todos os envolvidos.

**Temas:** Música, colaboração, gestão de equipes, eventos, tecnologia para igrejas.

---

## Etapas do Projeto

1. **Brainstorming** (etapa atual)
2. Definição de stack
3. Desenvolvimento
4. Testes

---

## Modelagem de Dados

### Usuário
- Nome (obrigatório)
- E-mail (obrigatório)
- Endereço (obrigatório)
- Foto/Avatar (imagem de boa qualidade)
- Instrumento (texto até 144 caracteres, obrigatório)
- Área de atuação (lista: cantor, mídia, som, músico - obrigatório)
- Congregação (texto até 100 caracteres)

### Evento
- Data: Date
- Título: String
- Descrição: String
- Escala: lista de usuários envolvidos

### Música (Setlist)
- Título da música: String
- Autor: String
- Link: String
- Partitura/Arranjo: arquivo
- Arquivo de mídia do arranjo (VS - Virtual Sound): .wav ou .mp3

### Equipe
- Integrantes: lista de usuários

---

## Funcionalidades Principais

- Login e recuperação de senha
- Tela de cadastro (necessário token gerado pelo usuário admin)
- Gerenciamento de eventos (cultos, campanhas, congressos)
- Gerenciamento de setlist (cadastro, edição, exclusão de músicas)
- Gerenciamento de equipe (listagem e edição de integrantes)

---

## Regras de Negócio

### Permissões
- **Usuário Admin:**
    - Gerencia escala, setlist, equipes e eventos
- **Team Member:**
    - Visualiza escala e setlist
    - Edita informações do próprio perfil (e-mail, telefone, foto, instrumento, área de atuação, congregação)

### Cadastro de usuário
- Necessário token gerado pelo admin

### Música do setlist
- Pode ser cadastrada, editada ou excluída do sistema

---

## Glossário

- **Escala:** Organização dos membros para eventos
- **Setlist:** Biblioteca de músicas disponíveis para o grupo de louvor
- **Equipe:** Conjunto de integrantes do grupo de louvor

---

## Observações

- O projeto será desenvolvido em React.
- A definição da stack técnica será realizada na próxima fase.
- O arquivo project-details.md deve ser atualizado conforme novas decisões e avanços do projeto.
- **Terminologia:** O conceito de "Repertório" foi substituído por **Setlist** como termo de domínio oficial, por ser mais amplamente reconhecido no contexto de equipes de louvor e músicos.