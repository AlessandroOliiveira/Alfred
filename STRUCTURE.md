# Estrutura Completa do Projeto Alfred

## Visão Geral da Arquitetura

```
alfred/
│
├── 📦 CÓDIGO FONTE
│   │
│   ├── 📱 app/                  # Expo Router - Rotas do aplicativo
│   │   ├── _layout.tsx         # Layout raiz (ThemeProvider, Notifications)
│   │   ├── (auth)/            # Grupo de rotas - Autenticação
│   │   │   ├── _layout.tsx    # Layout de autenticação
│   │   │   ├── index.tsx      # Verificação de login
│   │   │   └── login.tsx      # Tela de login/cadastro
│   │   └── (app)/             # Grupo de rotas - App principal
│   │       ├── _layout.tsx    # Layout com tabs
│   │       ├── index.tsx      # 🏠 Dashboard principal
│   │       ├── rotina/        # Módulo Rotina
│   │       │   ├── _layout.tsx
│   │       │   └── index.tsx
│   │       ├── estudos/       # Módulo Estudos
│   │       │   ├── _layout.tsx
│   │       │   └── index.tsx
│   │       ├── financeiro/    # Módulo Financeiro
│   │       │   ├── _layout.tsx
│   │       │   └── index.tsx
│   │       ├── fiverr/        # Módulo Fiverr
│   │       │   ├── _layout.tsx
│   │       │   └── index.tsx
│   │       └── secretaria/    # Módulo Secretária IA
│   │           └── chat.tsx
│   │
│   └── 🎯 src/                  # Lógica e componentes
│       ├── components/         # Componentes React
│       │   ├── common/        # Componentes reutilizáveis
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── LoadingSpinner.tsx
│       │   │   └── EmptyState.tsx
│       │   ├── charts/        # Componentes de gráficos
│       │   ├── forms/         # Componentes de formulário
│       │   ├── themed-text.tsx
│       │   ├── themed-view.tsx
│       │   ├── parallax-scroll-view.tsx
│       │   ├── hello-wave.tsx
│       │   ├── haptic-tab.tsx
│       │   ├── external-link.tsx
│       │   └── ui/            # UI components
│       │       ├── icon-symbol.tsx
│       │       ├── icon-symbol.ios.tsx
│       │       └── collapsible.tsx
│       │
│       ├── store/              # Zustand - Gerenciamento de Estado
│       │   ├── useUserStore.ts     # 👤 Estado do usuário
│       │   ├── useRoutineStore.ts  # 📅 Estado da rotina
│       │   ├── useFinanceStore.ts  # 💰 Estado financeiro
│       │   ├── useStudyStore.ts    # 📚 Estado dos estudos
│       │   └── useFiverrStore.ts   # 💼 Estado Fiverr
│       │
│       ├── services/           # Serviços externos
│       │   ├── firebase.ts         # 🔥 Firebase (Auth + Firestore)
│       │   ├── perplexity.ts       # 🤖 Perplexity API (IA)
│       │   └── notifications.ts    # 🔔 Sistema de notificações
│       │
│       ├── types/              # TypeScript - Definições de tipos
│       │   ├── index.ts       # Barrel export
│       │   ├── user.ts        # Tipos de usuário
│       │   ├── routine.ts     # Tipos de rotina
│       │   ├── finance.ts     # Tipos financeiros
│       │   ├── study.ts       # Tipos de estudo
│       │   └── fiverr.ts      # Tipos Fiverr
│       │
│       ├── utils/              # Funções utilitárias
│       │   ├── constants.ts    # Constantes (categorias, cores)
│       │   ├── formatters.ts   # Formatação (moeda, data, etc)
│       │   ├── validators.ts   # Validações de input
│       │   └── helpers.ts      # Funções auxiliares
│       │
│       ├── hooks/              # Custom React Hooks
│       │   ├── use-color-scheme.ts
│       │   ├── use-color-scheme.web.ts
│       │   └── use-theme-color.ts
│       │
│       ├── constants/          # Constantes da aplicação
│       │   └── theme.ts       # Tema (cores, fontes)
│       │
│       └── index.ts           # Barrel export central
│
├── 🖼️  assets/                  # Assets estáticos
│   └── images/                # Imagens, ícones, etc
│
├── 📄 Arquivos de Configuração
│   ├── .env.example           # Template de variáveis de ambiente
│   ├── app.json              # Configuração Expo
│   ├── package.json          # Dependências npm
│   ├── tsconfig.json         # Configuração TypeScript
│   ├── tailwind.config.js    # Configuração Tailwind
│   ├── metro.config.js       # Configuração Metro + NativeWind
│   ├── eslint.config.js      # Configuração ESLint
│   └── global.css            # Estilos globais Tailwind
│
└── 📚 Documentação
    ├── README.md             # Guia de uso
    ├── CLAUDE.md             # Guia para desenvolvimento
    ├── MIGRATION.md          # Detalhes da migração para src/
    └── STRUCTURE.md          # Este arquivo
```

> **Nota sobre a estrutura**: O diretório `app/` permanece na raiz por requisito técnico do Expo Router, mas conceitualmente faz parte do código fonte junto com `src/`. Ambos trabalham em conjunto para formar a aplicação.

## Fluxo de Navegação

```
┌─────────────────────────────────────────┐
│         App Inicialização               │
│         app/_layout.tsx                 │
│  - ThemeProvider                        │
│  - Notificações                         │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────┐    ┌──────────────┐
│  (auth)  │    │    (app)     │
│          │    │              │
│ - index  │    │ - Dashboard  │
│ - login  │    │ - Tabs       │
└──────────┘    └──────┬───────┘
                       │
        ┌──────────────┼──────────────┬──────────────┬──────────────┐
        │              │              │              │              │
        ▼              ▼              ▼              ▼              ▼
   ┌────────┐    ┌─────────┐   ┌──────────┐   ┌────────┐    ┌───────────┐
   │ Rotina │    │ Estudos │   │Financeiro│   │ Fiverr │    │Secretária │
   └────────┘    └─────────┘   └──────────┘   └────────┘    └───────────┘
```

## Fluxo de Dados (Zustand)

```
┌──────────────┐
│  Componente  │
│  (app/ ou    │
│   src/)      │
└──────┬───────┘
       │
       │ useStore((state) => state.data)
       │
       ▼
┌──────────────┐         ┌──────────────┐
│    Zustand   │ ◄─────► │ AsyncStorage │
│    Store     │  sync   │   (local)    │
│  (src/store) │         └──────────────┘
└──────┬───────┘
       │
       │ (opcional)
       │
       ▼
┌──────────────┐
│   Firebase   │
│  Firestore   │
└──────────────┘
```

## Path Aliases (tsconfig.json)

```typescript
// Imports disponíveis em app/ e src/:
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/useUserStore';
import { formatCurrency } from '@/utils/formatters';
import { User } from '@/types';
import { getPerplexityService } from '@/services/perplexity';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
```

## Divisão de Responsabilidades

### 📱 app/ - Interface do Usuário (UI Layer)
- **Responsabilidade**: Rotas, navegação e telas
- **Contém**: Layouts, screens, modais
- **Importa de**: `src/` (componentes, stores, services)
- **Tecnologias**: Expo Router, NativeWind

### 🎯 src/ - Lógica de Negócio (Business Layer)
- **Responsabilidade**: Lógica, estado, serviços
- **Contém**: Componentes, stores, services, utils
- **Usado por**: `app/`
- **Tecnologias**: Zustand, TypeScript, Firebase

## Tecnologias por Camada

### 🎨 UI Layer (app/)
- **Expo Router** - Navegação file-based
- **NativeWind v4** - Tailwind CSS para React Native
- **React Native Reanimated** - Animações

### 🧠 Logic Layer (src/)
- **Zustand** - State management
- **TypeScript** - Type safety
- **Custom Hooks** - Lógica reutilizável

### 🔌 Services Layer (src/services/)
- **Firebase** - Backend (Auth + Firestore)
- **Perplexity API** - IA conversacional
- **Expo Notifications** - Push notifications

### 💾 Data Layer
- **AsyncStorage** - Persistência local
- **Firestore** - Cloud database
- **Zustand Persist** - Sincronização automática

## Convenções de Nomenclatura

- **Componentes**: PascalCase (Button.tsx)
- **Hooks**: camelCase com "use" (useUserStore.ts)
- **Tipos**: PascalCase (User, Transaction)
- **Utils**: camelCase (formatCurrency)
- **Constantes**: UPPER_CASE (COLORS, EXPENSE_CATEGORIES)
- **Pastas**: kebab-case ou camelCase

## Status de Implementação

### ✅ Completo
- Estrutura de pastas (app/ + src/)
- Configuração TypeScript
- Stores Zustand com persistência
- Serviços (Firebase, Perplexity, Notifications)
- Componentes comuns
- Utils e helpers
- Sistema de tipos
- Fluxo de autenticação
- Dashboard principal

### 🚧 A Implementar
- CRUD completo de rotina
- CRUD completo de estudos
- CRUD completo financeiro
- CRUD completo Fiverr
- Interface de chat com IA
- Gráficos e visualizações
- Sincronização Firebase
- Notificações agendadas

## Contagem de Arquivos

- **app/**: 15 arquivos (rotas e telas)
- **src/**: 37 arquivos (lógica e componentes)
- **Total**: 52 arquivos TypeScript

## Próximos Passos

1. Configurar Firebase (criar projeto)
2. Obter API key da Perplexity
3. Implementar telas de CRUD
4. Adicionar gráficos (react-native-chart-kit)
5. Implementar chat com IA
6. Configurar notificações push
7. Adicionar testes

---

**Versão**: 1.0.0
**Última atualização**: 2025-11-07
**Arquitetura**: Clean Architecture com separação app/ + src/
