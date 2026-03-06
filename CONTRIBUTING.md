# Contributing to Rally App

Thank you for contributing to Rally App! This guide will help you understand our development workflow and coding standards.

## Development Setup

1. Ensure you have all prerequisites installed (Node.js 20+, React Native CLI, etc.)
2. Clone the repository and install dependencies
3. Run `npm run type-check` to verify TypeScript setup
4. Run `npm run lint` to verify ESLint setup

## Project Structure

Follow the established modular structure:

```
src/
├── components/    # Reusable UI components
├── screens/       # Screen components
├── navigation/    # Navigation configuration
├── services/      # API services
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript types
├── assets/        # Static assets
├── config/        # Configuration
├── theme/         # Theme settings
└── contexts/      # React contexts
```

## Coding Standards

### TypeScript

- Always use TypeScript for new files
- Define proper types for props, state, and API responses
- Use interfaces for object shapes
- Avoid `any` type unless absolutely necessary
- Enable strict mode features

### Component Structure

1. Keep components small and focused
2. Use functional components with hooks
3. Export components from index files
4. Follow this component structure:

```tsx
import React from 'react';
import { View, Text } from 'react-native';

interface ComponentProps {
  title: string;
  onPress?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onPress }) => {
  return (
    <View className="p-4">
      <Text className="text-lg">{title}</Text>
    </View>
  );
};
```

### Path Aliases

Always use path aliases for imports:

```typescript
// Good
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { colors } from '@theme';

// Bad
import { Button } from '../../components/Button';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../../theme';
```

### Styling with NativeWind

1. Use Tailwind classes via the `className` prop
2. Keep complex styles in separate theme configuration
3. Use design tokens from the theme for consistency

```tsx
// Good
<View className="flex-1 items-center justify-center bg-white p-4">
  <Text className="text-xl font-bold text-blue-600">Title</Text>
</View>

// Avoid inline styles unless necessary
<View style={{ flex: 1 }}>
  <Text style={{ fontSize: 20 }}>Title</Text>
</View>
```

### File Naming

- Components: PascalCase (e.g., `Button.tsx`, `HomeScreen.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase (e.g., `User.ts`, `ApiResponse.ts`)
- Constants: UPPER_SNAKE_CASE in config files

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and type checking:
   ```bash
   npm run lint
   npm run type-check
   npm run format
   ```
4. Commit with meaningful messages
5. Push and create a pull request

### Commit Messages

Follow conventional commit format:

```
feat: add user authentication
fix: resolve navigation bug on Android
docs: update README with setup instructions
refactor: simplify API service layer
test: add tests for Button component
```

## Code Quality Checks

Before committing, ensure:

1. **Linting passes**: `npm run lint`
2. **Types are valid**: `npm run type-check`
3. **Code is formatted**: `npm run format`
4. **Tests pass**: `npm test`

## Pull Request Guidelines

1. Describe what your PR does
2. Reference any related issues
3. Include screenshots for UI changes
4. Ensure all checks pass
5. Request review from team members

## Common Patterns

### API Service

```typescript
// src/services/api.ts
export const fetchUser = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};
```

### Custom Hook

```typescript
// src/hooks/useUser.ts
import { useState, useEffect } from 'react';

export const useUser = (userId: string) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user logic
  }, [userId]);

  return { user, loading };
};
```

### Screen Component

```typescript
// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { Button } from '@components/Button';

export const HomeScreen: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold mb-4">Home Screen</Text>
      <Button title="Get Started" onPress={() => {}} />
    </View>
  );
};
```

## Questions?

If you have questions about contributing, please reach out to the team.
