# AI Coding Guide - Rally App

This document provides comprehensive guidelines for AI coding assistants working in this React Native codebase. Follow these rules strictly to maintain consistency and code quality.

## 🏗️ Tech Stack

- **Framework**: React Native 0.81.5 + Expo 54
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation (Native Stack)
- **State Management**: Zustand (global state) + React Context (feature state)
- **Data Fetching**: React Query (@tanstack/react-query) + Axios
- **Styling**: StyleSheet API + Custom Theme System
- **Fonts**: Roboto & Noto Sans (via expo-font)
- **Icons**: lucide-react-native

## 🔥 Critical Rules (MANDATORY)

### 1. File and Folder Naming

**React Native components use PascalCase, but folders use kebab-case:**

✅ **Correct**:

- `user-profile/UserProfile.tsx` - Component file in kebab-case folder
- `auth-context/AuthContext.tsx` - Context file in kebab-case folder
- `use-events.ts` - Hook files always kebab-case
- `auth-service.ts` - Service files always kebab-case
- `auth-store.ts` - Store files always kebab-case
- `event.types.ts` - Type files always kebab-case

❌ **Incorrect**:

- `UserProfile/UserProfile.tsx` - PascalCase folder
- `authContext/AuthContext.tsx` - camelCase folder
- `UseEvents.ts` - PascalCase hook
- `AuthService.ts` - PascalCase service

**Rule Summary**:

- **Folders**: Always kebab-case
- **Components**: PascalCase files (e.g., `UserProfile.tsx`)
- **Hooks/Services/Stores/Types**: kebab-case files (e.g., `use-auth.ts`, `auth-service.ts`)

### 2. Component Structure

**Each component must be in its own subdirectory with an index.ts barrel export:**

✅ **Correct**:

```
src/components/event-card/
├── EventCard.tsx          ✅ PascalCase component
├── EventCard.types.ts     ✅ kebab-case types
└── index.ts               ✅ Barrel export
```

```typescript
// index.ts
export { EventCard } from './EventCard';
export type { EventCardProps } from './EventCard.types';
```

❌ **Incorrect**:

```
src/components/
└── EventCard.tsx          ❌ Loose component file
```

### 3. React Native Styling Rules

**Use StyleSheet.create with the theme system. NO CSS modules, NO inline styles:**

✅ **Correct**:

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing.base,
    borderRadius: borderRadius.md,
  },
});
```

❌ **Incorrect**:

```typescript
// ❌ NO inline styles
<View style={{ padding: 16, backgroundColor: '#fff' }}>

// ❌ NO CSS modules (this is React Native, not web)
import styles from './MyComponent.module.css';
```

### 4. Import Rules

**ALWAYS use path aliases. NEVER use relative imports:**

✅ **Correct**:

```typescript
import { Button } from '@components';
import { useAuthStore } from '@store/auth-store';
import { eventService } from '@services/event-service';
import { colors, spacing } from '@theme';
import type { Event } from '@types';
```

❌ **Incorrect**:

```typescript
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../store/auth-store';
```

## 📁 Directory Structure

```
rally-app/
├── src/
│   ├── screens/              # Screen components (top-level routes)
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── Home.context.tsx    # Screen-specific context
│   │   │   ├── Home.data.ts        # Mock/seed data
│   │   │   ├── Home.types.ts       # Screen-specific types
│   │   │   ├── HomeScreen.styles.ts # Screen-specific styles
│   │   │   └── index.ts
│   │   ├── sign-in/
│   │   │   ├── SignInScreen.tsx
│   │   │   └── index.ts
│   │   └── sign-up/
│   │       ├── SignUpScreen.tsx
│   │       ├── profile-setup/      # Nested screen
│   │       │   ├── ProfileSetupScreen.tsx
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── components/           # Global reusable components
│   │   ├── button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── event-card/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventCard.types.ts
│   │   │   └── index.ts
│   │   └── index.ts          # Barrel exports
│   │
│   ├── navigation/           # React Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── index.ts
│   │
│   ├── services/             # API services (Axios + React Query)
│   │   ├── api/
│   │   │   ├── axios-config.ts     # Axios instance
│   │   │   └── api-client.ts       # Base API client
│   │   ├── auth-service.ts
│   │   ├── event-service.ts
│   │   └── index.ts
│   │
│   ├── store/                # Global Zustand stores
│   │   ├── auth-store.ts
│   │   ├── settings-store.ts
│   │   └── index.ts
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-fonts.ts
│   │   ├── use-events.ts     # React Query hooks
│   │   ├── use-auth.ts
│   │   └── index.ts
│   │
│   ├── contexts/             # React Context providers
│   │   ├── auth-context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── types/                # Global TypeScript types
│   │   ├── models/           # Domain models
│   │   │   ├── event.ts
│   │   │   ├── user.ts
│   │   │   └── organiser.ts
│   │   ├── api/              # API request/response types
│   │   │   ├── auth.types.ts
│   │   │   └── event.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── date-utils.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   │
│   ├── config/               # App configuration
│   │   ├── env.ts            # Environment variables
│   │   ├── constants.ts      # App constants
│   │   └── index.ts
│   │
│   ├── theme/                # Design system tokens
│   │   └── index.ts          # colors, spacing, typography
│   │
│   └── assets/               # Static assets
│       ├── fonts/
│       └── images/
│
├── App.tsx                   # Root component
├── babel.config.js           # Path aliases config
├── tsconfig.json             # TypeScript config
└── package.json
```

## 🎨 Current Path Aliases

These are configured in `babel.config.js` and `tsconfig.json`:

```typescript
@components     → src/components
@screens        → src/screens
@navigation     → src/navigation
@services       → src/services
@hooks          → src/hooks
@utils          → src/utils
@types          → src/types
@assets         → src/assets
@config         → src/config
@theme          → src/theme
@contexts       → src/contexts
@store          → src/store
@dev-tools      → src/dev-tools
@data           → src/data
```

## 📝 Code Organization Rules

### Where to Put New Files

#### Components

1. **Global reusable components** → `src/components/{component-name}/`

   ```
   src/components/button/
   ├── Button.tsx
   └── index.ts
   ```

2. **Screen-specific components** → Keep in screen folder (for now)
   ```
   src/screens/home/
   ├── HomeScreen.tsx
   └── components/           # If needed later
       └── event-list/
   ```

#### Hooks

1. **Global hooks** → `src/hooks/`

   ```typescript
   // src/hooks/use-events.ts
   import { useQuery } from '@tanstack/react-query';
   import { eventService } from '@services/event-service';

   export const useEvents = (filters?: EventFilters) => {
     return useQuery({
       queryKey: ['events', filters],
       queryFn: () => eventService.getEvents(filters),
     });
   };
   ```

2. **Screen-specific hooks** → Keep in screen folder
   ```typescript
   // src/screens/home/use-home-filters.ts
   ```

#### Services (API Layer)

**All services go in** → `src/services/`

```typescript
// src/services/event-service.ts
import { apiClient } from './api/api-client';
import type { Event, EventFilters } from '@types';

export const eventService = {
  getEvents: async (filters?: EventFilters): Promise<Event[]> => {
    const { data } = await apiClient.get('/events', { params: filters });
    return data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get(`/events/${id}`);
    return data;
  },
};
```

#### Stores (Zustand)

**All global stores go in** → `src/store/`

```typescript
// src/store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: AsyncStorage,
    },
  ),
);
```

#### Types

1. **Domain models** → `src/types/models/`

   ```typescript
   // src/types/models/event.ts
   export interface Event {
     id: string;
     title: string;
     date: string;
     location: string;
     organiser: Organizer;
   }
   ```

2. **API types** → `src/types/api/`

   ```typescript
   // src/types/api/auth.types.ts
   export interface LoginRequest {
     email: string;
     password: string;
   }

   export interface LoginResponse {
     user: User;
     token: string;
   }
   ```

3. **Component props** → Co-locate with component
   ```typescript
   // src/components/event-card/EventCard.types.ts
   export interface EventCardProps {
     event: Event;
     onPress: () => void;
   }
   ```

## 🔌 React Query Setup

### Query Client Configuration

```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

### Custom Query Hooks Pattern

```typescript
// src/hooks/use-events.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@services/event-service';
import type { Event, EventFilters } from '@types';

// Query hook
export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventService.getEvents(filters),
  });
};

// Mutation hook
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
```

### Usage in Components

```typescript
// src/screens/home/HomeScreen.tsx
import { useEvents } from '@hooks/use-events';

export const HomeScreen = () => {
  const { data: events, isLoading, error } = useEvents({ city: 'Mumbai' });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} />}
    />
  );
};
```

## 🌐 Axios Setup

### Base Configuration

```typescript
// src/services/api/axios-config.ts
import axios from 'axios';
import { useAuthStore } from '@store/auth-store';

const API_BASE_URL = 'https://api.rally-app.com'; // Move to env config

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - logout user
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
```

## 🎨 Theme System Usage

### Using Theme Tokens

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing.base,
    borderRadius: borderRadius.md,
  },
  title: {
    color: colors.text.primary,
    ...getFontStyle('xl', 'bold'),
  },
});
```

### Available Theme Tokens

- `colors` - Background, text, primary, secondary, status colors
- `spacing` - xxs, xs, sm, base, md, lg, xl, etc.
- `borderRadius` - xs, sm, md, lg, xl, full
- `getFontStyle(size, weight)` - Typography helper

## 🎯 Component Patterns

### Functional Component with Props

```typescript
// src/components/event-card/EventCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, getFontStyle } from '@theme';
import type { EventCardProps } from './EventCard.types';

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{event.date}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    backgroundColor: colors.background.secondary,
  },
  title: {
    ...getFontStyle('lg', 'medium'),
    color: colors.text.primary,
  },
  date: {
    ...getFontStyle('sm', 'regular'),
    color: colors.text.secondary,
  },
});
```

### Screen Component Pattern

```typescript
// src/screens/events/EventsScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useEvents } from '@hooks/use-events';
import { EventCard, LoadingSpinner, ErrorMessage } from '@components';
import { spacing } from '@theme';

export const EventsScreen = () => {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={({ item }) => <EventCard event={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: spacing.base,
  },
});
```

## 📋 Import Order (Recommended)

```typescript
// 1. React and React Native core
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react-native';

// 3. Path alias imports - grouped by category
import { Button, EventCard } from '@components';
import { useEvents } from '@hooks';
import { eventService } from '@services';
import { useAuthStore } from '@store';
import { colors, spacing } from '@theme';

// 4. Type imports (use 'type' keyword)
import type { Event } from '@types';
import type { EventCardProps } from './EventCard.types';
```

## 🚫 Common Anti-Patterns to Avoid

### ❌ DON'T: Use inline styles

```typescript
// ❌ Bad
<View style={{ padding: 16, backgroundColor: '#fff' }}>
  <Text style={{ fontSize: 18, color: '#000' }}>Hello</Text>
</View>
```

### ✅ DO: Use StyleSheet with theme

```typescript
// ✅ Good
<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    backgroundColor: colors.background.primary,
  },
  text: {
    ...getFontStyle('lg', 'regular'),
    color: colors.text.primary,
  },
});
```

### ❌ DON'T: Create loose component files

```
src/components/
├── Button.tsx        ❌ Component file at root
└── EventCard.tsx     ❌ Component file at root
```

### ✅ DO: Use component folders with barrel exports

```
src/components/
├── button/
│   ├── Button.tsx
│   └── index.ts
└── event-card/
    ├── EventCard.tsx
    ├── EventCard.types.ts
    └── index.ts
```

### ❌ DON'T: Use relative imports

```typescript
import { Button } from '../../../components/button/Button';
```

### ✅ DO: Use path aliases

```typescript
import { Button } from '@components';
```

### ❌ DON'T: Mix data fetching logic in components

```typescript
// ❌ Bad
const EventScreen = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('https://api.com/events')
      .then((res) => res.json())
      .then(setEvents);
  }, []);
};
```

### ✅ DO: Use React Query hooks

```typescript
// ✅ Good
const EventScreen = () => {
  const { data: events, isLoading } = useEvents();
};
```

## 🔧 Development Commands

```bash
# Install dependencies (use npm or yarn)
npm install

# Start development server
npm start

# Run on platforms
npm run ios
npm run android
npm run web

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Clean
npm run clean
npm run clean:ios
npm run clean:android
```

## ✅ Architecture Principles

1. **Screen-First Structure**: Screens are top-level routes, components are reusable UI
2. **React Query for Data**: All API calls through React Query hooks
3. **Zustand for Global State**: Auth, settings, and app-wide state
4. **Context for Screen State**: Use Context for complex screen-specific state
5. **Path Aliases Always**: Never use relative imports
6. **Theme System**: Use design tokens, never hardcode colors/spacing
7. **TypeScript Strict**: Always type props, state, and API responses
8. **Component Folders**: Each component in its own folder with barrel export

## 📌 Migration Notes

As the app grows, consider migrating to a **feature-first** architecture:

```
src/features/
├── events/
│   ├── screens/
│   ├── components/
│   ├── hooks/
│   └── services/
└── auth/
    ├── screens/
    ├── components/
    ├── hooks/
    └── services/
```

For now, the current **screen-first** structure is appropriate for the app's size.

## ✅ Final Checklist

Before submitting code:

- [ ] All folders use kebab-case naming
- [ ] All imports use path aliases
- [ ] Components in folders with index.ts barrel exports
- [ ] StyleSheet.create used (no inline styles)
- [ ] Theme tokens used (no hardcoded values)
- [ ] React Query for all API calls
- [ ] TypeScript types for all props and state
- [ ] No relative imports
- [ ] Type check passes: `npm run type-check`
- [ ] Lint passes: `npm run lint`

---

**Remember**: These guidelines maintain consistency and make the codebase scalable for both current development and future growth into a feature-first architecture.
