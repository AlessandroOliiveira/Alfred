# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Alfred" is a personal virtual secretary mobile app built with Expo React Native. The app helps users manage their daily routine, track studies (English + MP exam prep), monitor finances, manage Fiverr tasks, and interact with an AI assistant powered by Perplexity API.

**Tech Stack:**
- React Native 0.81.5 with Expo SDK 54
- Expo Router for file-based routing
- NativeWind v4 for Tailwind CSS styling
- Zustand for state management with AsyncStorage persistence
- Firebase (Firestore + Auth) for backend
- Perplexity API for AI chat assistant
- Expo Notifications for reminders

## Development Commands

```bash
# Start development
npx expo start          # Start development server
npm run android         # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web

# Code quality
npm run lint           # Run ESLint
```

## Environment Setup

Copy `.env.example` to `.env` and configure:
```bash
# Firebase credentials
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Perplexity API
EXPO_PUBLIC_PERPLEXITY_API_KEY=
```

## Architecture

### Project Structure

The project follows a clean architecture pattern with code organized in `src/`:

```
alfred/
├── app/                    # Expo Router routes (Next.js-style)
├── src/                    # Source code (main application logic)
│   ├── components/        # React components
│   ├── store/            # Zustand stores
│   ├── services/         # External services (Firebase, Perplexity, etc)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   └── constants/        # App constants
├── assets/                # Static assets (images, fonts)
├── global.css            # Tailwind global styles
└── tailwind.config.js    # Tailwind configuration
```

### State Management (Zustand)

The app uses Zustand stores with AsyncStorage persistence located in `src/store`:

- **useUserStore** - User profile and authentication state
- **useRoutineStore** - Daily routine items with completion tracking
- **useFinanceStore** - Transactions, balance, and financial summaries
- **useStudyStore** - Study sessions and progress tracking
- **useFiverrStore** - Fiverr tasks and client management

All stores follow this pattern:
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Routing Structure

**Authentication Flow:**
- `app/(auth)/` - Authentication screens
  - `index.tsx` - Checks if user is logged in, redirects accordingly
  - `login.tsx` - Login/signup screen (demo mode, can integrate Firebase Auth)

**Main App:**
- `app/(app)/` - Main application with tab navigation
  - `index.tsx` - Dashboard with overview cards
  - `rotina/` - Daily routine management
  - `estudos/` - Study tracking (English + MP exam)
  - `financeiro/` - Financial management
  - `fiverr/` - Fiverr task and client management
  - `secretaria/chat.tsx` - AI chat assistant

### Services

**Firebase Service** (`src/services/firebase.ts`):
- Configured with AsyncStorage persistence for auth
- Exports `auth` and `db` instances
- Singleton pattern to avoid re-initialization

**Perplexity Service** (`src/services/perplexity.ts`):
- `PerplexityService` class for AI interactions
- Automatically includes user context (routine, finances, study progress)
- Methods: `sendMessage()`, `generateWeeklyReport()`, `generateMonthlyReport()`, `getFinancialAdvice()`, `getStudyRecommendations()`
- Uses singleton pattern via `getPerplexityService()`

**Notification Service** (`src/services/notifications.ts`):
- `NotificationService` class for managing notifications
- Methods to schedule routine reminders, Fiverr deadlines, study reminders
- Uses Expo Notifications with proper Android channel configuration

### NativeWind Styling

The app uses NativeWind v4 with Tailwind CSS. Configuration:

**tailwind.config.js** - Custom colors defined:
```javascript
colors: {
  primary: '#6366F1',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  background: '#F3F4F6',
  // ... more colors
}
```

**Usage in components:**
```tsx
<View className="flex-1 bg-background p-4">
  <Text className="text-2xl font-bold text-text-primary">Title</Text>
  <Button className="mt-4" />
</View>
```

### Reusable Components (`src/components/common/`)

- **Button** - Supports variants (primary, secondary, outline, danger), loading state
- **Card** - Container with shadow and border, optional onPress
- **Input** - Text input with label, error message, validation
- **LoadingSpinner** - Full screen loading indicator
- **EmptyState** - Empty state UI with optional action button

### Utility Functions

**Formatters** (`src/utils/formatters.ts`):
- `formatCurrency(amount)` - Brazilian Real currency
- `formatDate(date)` - Formatted dates in pt-BR
- `formatDuration(minutes)` - Human-readable duration
- `formatPercentage(value, total)` - Percentage calculation

**Validators** (`src/utils/validators.ts`):
- `validateEmail(email)` - Email validation
- `validatePassword(password)` - Password strength
- `validateRequired(value)` - Required field check
- `validatePositiveNumber(value)` - Numeric validation

**Helpers** (`src/utils/helpers.ts`):
- `generateId()` - Unique ID generation
- `getCurrentDate()` - ISO string timestamp
- `isToday(date)` - Date comparison
- `debounce(func, wait)` - Debounce function

## TypeScript Types

All types are defined in `src/types` and exported from `src/types/index.ts`:

- **User** - User profile
- **RoutineItem** - Daily routine task
- **Transaction** - Financial transaction (income/expense)
- **StudySession** - Study session record
- **FiverrTask** - Fiverr task with priority
- **FiverrClient** - Client information
- **AIMessage** / **AIConversation** - Chat history

## Key Features to Implement

### Dashboard (`app/(app)/index.tsx`)
- Shows routine progress bar
- Financial balance card
- Study progress (weekly goal)
- Pending Fiverr tasks count
- Quick action buttons

### AI Integration
Use `getPerplexityService()` to interact with AI:
```typescript
const service = getPerplexityService();
const response = await service.sendMessage('How am I doing this week?');
```

The service automatically includes context about user's current routine, finances, and study progress.

### Notifications
Schedule notifications using `getNotificationService()`:
```typescript
const notificationService = getNotificationService();
await notificationService.scheduleRoutineNotification(
  routineId,
  'Morning Exercise',
  '07:00'
); // Notifies 15 min before
```

## Development Guidelines

1. **NativeWind classes** - Always use Tailwind utility classes via `className` prop
2. **State updates** - Use Zustand actions, never mutate state directly
3. **Navigation** - Use `useRouter()` from `expo-router` for navigation
4. **Path aliases** - Import using `@/` prefix which maps to `src/` (e.g., `@/components/common/Button`)
5. **TypeScript** - Enable strict mode, define proper types for all data
6. **Firebase** - Use the initialized `db` and `auth` instances from `src/services/firebase`
7. **Persistence** - Zustand stores automatically sync with AsyncStorage

## Next Steps for Full Implementation

The current implementation includes:
- Complete project structure
- All stores and services configured
- Authentication flow
- Dashboard with real data
- Component library
- Utility functions

To complete the app, implement:
1. Full routine management screens (add/edit/delete routine items)
2. Study tracking screens (log sessions, view progress charts)
3. Financial management (add transactions, view reports, category breakdown)
4. Fiverr task management (CRUD operations, client management)
5. AI chat interface with conversation history
6. Firebase Firestore integration for cloud sync
7. Notification scheduling for routine items
8. Weekly/monthly report generation

## Notes

- The app currently uses demo auth (no Firebase Auth integration yet)
- Stores are persisted locally with AsyncStorage
- Firebase is configured but not actively used for data sync
- Perplexity API integration is ready but requires API key
- All screens beyond Dashboard are placeholder stubs ready for implementation
