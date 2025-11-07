# Alfred - Secretária Virtual Pessoal

Um aplicativo móvel completo de secretária virtual construído com Expo React Native que ajuda a gerenciar rotina diária, estudos, finanças, trabalho no Fiverr e fornece assistência via IA.

## Funcionalidades

- **Dashboard Inteligente** - Visão geral de todas as áreas da sua vida
- **Gestão de Rotina** - Acompanhe e gerencie suas atividades diárias
- **Controle Financeiro** - Registre receitas e despesas, visualize seu saldo
- **Acompanhamento de Estudos** - Rastreie progresso em Inglês e Concurso MP
- **Gestão Fiverr** - Gerencie tarefas e clientes do Fiverr
- **Assistente IA** - Chat com IA integrada via Perplexity API
- **Notificações** - Lembretes automáticos de rotina e prazos

## Stack Tecnológica

- **React Native 0.81.5** com Expo SDK 54
- **Expo Router** - Navegação file-based
- **NativeWind v4** - Styling com Tailwind CSS
- **Zustand** - Gerenciamento de estado com persistência
- **Firebase** - Backend (Firestore + Auth)
- **Perplexity API** - Assistente IA
- **Expo Notifications** - Sistema de notificações
- **TypeScript** - Type safety

## Pré-requisitos

- Node.js 20.19.4 ou superior
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Conta Firebase (gratuita)
- API Key da Perplexity (opcional)

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd alfred
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:
```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=sua_chave_aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_dominio.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_bucket.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Perplexity (opcional)
EXPO_PUBLIC_PERPLEXITY_API_KEY=sua_chave_perplexity
```

## Configuração do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Adicione um app Web ao projeto
4. Copie as credenciais para o arquivo `.env`
5. Habilite Firestore Database (modo de teste)
6. Habilite Authentication > Email/Password

## Executando o App

```bash
# Iniciar o servidor de desenvolvimento
npx expo start

# Executar no Android
npm run android

# Executar no iOS (apenas macOS)
npm run ios

# Executar no navegador
npm run web
```

## Estrutura do Projeto

Seguindo a convenção Next.js/moderna, o código principal está em `src/`:

```
alfred/
├── app/                    # Rotas do Expo Router (Next.js-style)
│   ├── (auth)/            # Fluxo de autenticação
│   │   ├── index.tsx      # Verificação de login
│   │   └── login.tsx      # Tela de login
│   └── (app)/             # App principal
│       ├── index.tsx      # Dashboard
│       ├── rotina/        # Gestão de rotina
│       ├── estudos/       # Acompanhamento de estudos
│       ├── financeiro/    # Controle financeiro
│       ├── fiverr/        # Gestão Fiverr
│       └── secretaria/    # Chat com IA
├── src/                   # Código fonte principal
│   ├── components/        # Componentes reutilizáveis
│   │   ├── common/       # Componentes básicos (Button, Card, Input)
│   │   ├── charts/       # Componentes de gráficos
│   │   └── forms/        # Componentes de formulário
│   ├── store/            # Stores Zustand
│   │   ├── useUserStore.ts
│   │   ├── useRoutineStore.ts
│   │   ├── useFinanceStore.ts
│   │   ├── useStudyStore.ts
│   │   └── useFiverrStore.ts
│   ├── services/         # Serviços
│   │   ├── firebase.ts
│   │   ├── perplexity.ts
│   │   └── notifications.ts
│   ├── types/            # TypeScript types
│   ├── utils/            # Funções utilitárias
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── hooks/            # Custom React hooks
│   └── constants/        # Constantes da aplicação
├── assets/                # Assets estáticos
├── global.css            # Estilos Tailwind
└── tailwind.config.js    # Configuração Tailwind
```

## Gerenciamento de Estado

O app usa **Zustand** com persistência via AsyncStorage. Todos os dados são salvos localmente e podem ser sincronizados com Firebase.

Exemplo de uso:
```typescript
import { useUserStore } from '@/store/useUserStore';

// No componente
const user = useUserStore((state) => state.user);
const setUser = useUserStore((state) => state.setUser);
```

## Estilização com NativeWind

Use classes Tailwind diretamente no `className`:

```tsx
<View className="flex-1 bg-background p-4">
  <Text className="text-2xl font-bold text-text-primary">
    Hello World
  </Text>
  <Button
    className="mt-4 bg-primary"
    title="Click me"
  />
</View>
```

## Integração com IA (Perplexity)

```typescript
import { getPerplexityService } from '@/services/perplexity';

const service = getPerplexityService();
const response = await service.sendMessage('Como está meu progresso esta semana?');
```

O serviço automaticamente inclui contexto do usuário (rotina, finanças, estudos).

## Notificações

```typescript
import { getNotificationService } from '@/services/notifications';

const notificationService = getNotificationService();

// Notificação de rotina (15 min antes)
await notificationService.scheduleRoutineNotification(
  'routine-id',
  'Exercício Matinal',
  '07:00'
);

// Lembrete de estudo
await notificationService.scheduleStudyReminder(9); // 9h
```

## Scripts Disponíveis

```bash
npm start           # Inicia o servidor Expo
npm run android     # Executa no Android
npm run ios         # Executa no iOS
npm run web         # Executa no navegador
npm run lint        # Executa ESLint
```

## Status do Projeto

### Implementado ✅
- Estrutura completa do projeto
- Configuração de NativeWind + Tailwind
- Stores Zustand com persistência
- Serviços (Firebase, Perplexity, Notificações)
- Componentes reutilizáveis
- Fluxo de autenticação
- Dashboard funcional
- Sistema de tipos TypeScript

### A Implementar 🚧
- Telas de CRUD completas (Rotina, Estudos, Finanças, Fiverr)
- Interface de chat com IA
- Sincronização com Firebase Firestore
- Gráficos e relatórios
- Notificações agendadas
- Testes unitários

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é open source e está disponível sob a licença MIT.

## Suporte

Para dúvidas ou suporte, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando Expo e React Native
