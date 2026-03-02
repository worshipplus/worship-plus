# Worship+ POC

> Proof of Concept para sistema de gestão de escalas e setlist musical para ministérios de louvor de igrejas evangélicas.

## 📋 Sobre o Projeto

O **Worship+** é uma aplicação projetada para facilitar a organização e gestão de ministérios de louvor em igrejas evangélicas. Este POC demonstra as funcionalidades principais do sistema, incluindo gestão de eventos, equipe e setlist musical.

O projeto foi criado como uma prova de conceito para validar a experiência do usuário (UX) e estruturas de dados antes da implementação do backend completo e infraestrutura de produção.

## ✨ Funcionalidades Principais

### 🎯 Gestão de Eventos
- **Listagem de eventos** em três categorias: Próximos, Passados e Todos
- **Criar, editar e excluir** eventos (cultos, ensaios, conferências)
- **Escalar membros da equipe** para cada evento
- **Adicionar músicas do setlist** ao evento
- **Visualização de data** com indicadores visuais para eventos passados
- **Avatar stack** mostrando membros escalados
- **Busca e seleção** de músicas do setlist com preview

### 👥 Gestão de Equipe
- **Cadastro completo de membros**: nome, email, instrumento, função e congregação
- **Filtros por função**: Cantores, Músicos, Mídia, Som
- **Edição e remoção** de integrantes
- **Avatar personalizado** por integrante
- **Badges** indicando funções específicas

### 🎵 Gestão de Setlist
- **Catálogo de músicas** com título, autor, link para partitura e arquivo de áudio
- **Busca** por título ou autor
- **Player de áudio integrado** com controles de play/pause, seek e volume
- **Preview de músicas** antes de adicionar aos eventos
- **Criar, editar e excluir** músicas do setlist

### 🎨 Experiência do Usuário
- **Interface moderna e responsiva** adaptada para desktop e mobile
- **Navegação lateral** (sidebar) com transição entre views
- **Lazy loading** de componentes para otimização
- **Modais** para formulários de criação/edição
- **Confirmações** para ações destrutivas (exclusão)
- **Estados vazios** (empty states) com chamadas para ação

## 🛠 Tecnologias

Este POC utiliza tecnologias modernas e leves para garantir performance e facilidade de desenvolvimento:

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React** | 19.0.0 | Biblioteca JavaScript para interfaces de usuário |
| **Vite** | 5.0.0 | Build tool ultrarrápida com HMR |
| **@vitejs/plugin-react** | 5.1.4 | Plugin oficial React para Vite |
| **JavaScript (ES6+)** | — | Linguagem de programação |
| **CSS3** | — | Estilização com CSS Modules e custom properties |

### Arquitetura de Frontend
- **Component-based architecture**: Componentes reutilizáveis e modulares
- **State lifting**: Estado compartilhado gerenciado no componente `App`
- **Lazy loading**: Views carregadas sob demanda com `React.lazy()` e `Suspense`
- **Mock data**: Dados simulados em `src/mock/data.js` para demonstração

## 🚀 Setup e Execução

### Pré-requisitos
- **Node.js**: versão 18 ou superior
- **npm**: versão 8 ou superior (incluído com Node.js)

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/worshipplus/worship-plus-poc.git
cd worship-plus-poc
```

2. **Instale as dependências:**
```bash
npm install
```

### Executando o Projeto

**Modo de desenvolvimento (com hot-reload):**
```bash
npm run dev
```

O servidor de desenvolvimento será iniciado em `http://127.0.0.1:5173`

**Build para produção:**
```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

**Preview da build de produção:**
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
poc/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── AudioPlayer.jsx # Player de áudio com controles
│   │   ├── Avatar.jsx      # Avatar de usuário
│   │   ├── Badge.jsx       # Badge para labels
│   │   ├── Icons.jsx       # Ícones SVG
│   │   ├── Modal.jsx       # Modal genérico
│   │   └── Sidebar.jsx     # Navegação lateral
│   ├── views/              # Views principais (lazy-loaded)
│   │   ├── EventsView.jsx  # Gestão de eventos
│   │   ├── TeamView.jsx    # Gestão de equipe
│   │   └── SetlistView.jsx # Gestão de setlist
│   ├── styles/             # Estilos CSS modulares
│   │   ├── base.css        # Reset e estilos base
│   │   ├── components.css  # Estilos de componentes
│   │   ├── layout.css      # Grid e layout
│   │   ├── responsive.css  # Media queries
│   │   ├── rows.css        # Estilos de linhas/listas
│   │   └── tokens.css      # Design tokens (cores, espaçamentos)
│   ├── mock/
│   │   └── data.js         # Dados simulados
│   ├── App.jsx             # Componente raiz
│   └── main.jsx            # Entry point
├── index.html              # Template HTML
├── vite.config.mjs         # Configuração do Vite
├── package.json            # Dependências e scripts
└── README.md               # Este arquivo
```

## 🎯 Próximos Passos (Evolução para MVP)

Para transformar este POC em um produto mínimo viável (MVP), será necessário:

### Backend & Infraestrutura
- **API REST ou GraphQL** (Node.js/Express, FastAPI ou similar)
- **Banco de dados** (PostgreSQL) para persistência de dados
- **Object Storage** (AWS S3, Digital Ocean Spaces) para arquivos de mídia
- **Autenticação e autorização** (JWT, OAuth, controle de roles)
- **Pipeline de processamento de áudio** (ffmpeg workers) para arquivos VS/multitracks

### Qualidade & Deploy
- **Testes automatizados** (Jest, React Testing Library, Cypress)
- **Storybook** para documentação de componentes
- **CI/CD pipeline** (GitHub Actions, GitLab CI)
- **Monitoramento** (Sentry para erros, Prometheus para métricas)
- **Containerização** (Docker) e deploy em cloud provider

### Features Adicionais
- Sistema de notificações (push/email)
- Geração automática de PDFs (partituras, escalas)
- Integrações com plataformas de streaming (cifraclub, letras.mus.br)
- Aplicativo mobile nativo (React Native)
- Sistema de permissões granulares por igreja/congregação

## 📝 Notas

Este POC é intencionalmente simples e focado. Ele demonstra:
- **Layout e fluxos principais** da aplicação
- **Estruturas de dados** necessárias
- **Interações do usuário** e UX geral

Use este protótipo para validar requisitos com stakeholders antes de implementar o backend e infraestrutura completos.

## 📄 Licença

Este projeto é proprietário e de uso interno do projeto Worship+.
