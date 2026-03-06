# Dev Tools

Comprehensive development utilities for the Rally App including logging, error handling, and debugging tools.

## Components

1. **Logger** - Structured logging with multiple levels and specialized loggers
2. **ErrorBoundary** - React error boundary with native Alert dialogs

---

# Logger

A comprehensive logging utility that provides structured logging with different log levels, colors for terminal output, and useful debugging capabilities.

## Features

- 📊 **Multiple Log Levels**: DEBUG, INFO, WARN, ERROR
- 🎨 **Colored Output**: Terminal colors for better readability
- ⏱️ **Timestamps**: Automatic timestamp formatting
- 🔍 **Specialized Loggers**: API, Navigation, Store, Performance logging
- 🎯 **Development Mode**: Automatic detection of dev/production mode
- 📦 **Structured Data**: Pretty-print complex objects
- 🔧 **Configurable**: Customize log levels, colors, and prefixes

## Installation

The logger is already set up and exported from `@dev-tools`. Just import it:

```typescript
import { logger } from '@dev-tools';
```

## Basic Usage

### Simple Logging

```typescript
import { logger } from '@dev-tools';

// Debug level - detailed information
logger.debug('Component rendered', { props, state });

// Info level - general information
logger.info('User profile loaded', { userId: '123' });

// Success level - successful operations
logger.success('Data saved successfully', { id: 'abc123' });

// Warning level - warnings that don't prevent execution
logger.warn('API rate limit approaching', { remaining: 10 });

// Error level - errors and exceptions
logger.error('Failed to fetch data', error);
```

## Specialized Loggers

### API Logging

Automatically logs API requests and responses:

```typescript
// API Request
logger.api('POST', '/api/users', { name: 'John' });

// API Response
logger.apiResponse(200, '/api/users', { id: 1, name: 'John' });
```

**Already integrated in:** [axios-config.ts](../services/api/axios-config.ts:23)

### Navigation Logging

Track navigation events:

```typescript
logger.navigation('ProfileScreen', { userId: '123' });
```

**Already integrated in:** [AppNavigator.tsx](../navigation/AppNavigator.tsx:37)

### Store/State Logging

Track state changes:

```typescript
logger.store('setUser', { userId: '123', userType: 'player' });
```

**Already integrated in:** [auth-store.ts](../store/auth-store.ts:27)

### Performance Logging

Measure and log execution time:

```typescript
// Manual timing
logger.perf('Database Query', 45.67); // Logs: Database Query: 45.67ms

// Auto timing with timer
const endTimer = logger.time('Expensive Operation');
// ... do some work ...
endTimer(); // Automatically logs duration
```

## Advanced Features

### Grouping Logs

Group related logs together:

```typescript
logger.group('User Registration Flow');
logger.info('Validating email');
logger.info('Checking for existing user');
logger.success('User created');
logger.groupEnd();
```

### Table Logging

Display arrays of objects in table format:

```typescript
const users = [
  { id: 1, name: 'John', role: 'player' },
  { id: 2, name: 'Jane', role: 'organiser' },
];

logger.table(users);
```

### Child Loggers

Create specialized loggers with custom prefixes:

```typescript
const authLogger = logger.child('[Auth]');
authLogger.info('User logged in'); // Output: [Rally][Auth] [INFO] User logged in
```

## Configuration

### Customize Logger Settings

```typescript
import { logger, LogLevel } from '@dev-tools';

logger.configure({
  level: LogLevel.INFO, // Set minimum log level
  enableTimestamp: true, // Show/hide timestamps
  enableColors: true, // Enable/disable colors
  prefix: '[MyApp]', // Custom prefix
});
```

### Log Levels

- `LogLevel.DEBUG` (0) - Most verbose, all logs
- `LogLevel.INFO` (1) - Informational messages
- `LogLevel.WARN` (2) - Warnings only
- `LogLevel.ERROR` (3) - Errors only
- `LogLevel.NONE` (4) - No logs

**Default in development:** `DEBUG`
**Default in production:** `WARN`

## Development-Only Logging

Use `devLog` for logs that should only appear in development:

```typescript
import { devLog } from '@dev-tools';

// These logs will be completely stripped in production builds
devLog.debug('Debugging info');
devLog.info('Development info');
devLog.warn('Development warning');
devLog.error('Development error');
```

## Integration Examples

### In React Components

```typescript
import { useEffect } from 'react';
import { logger } from '@dev-tools';

export const MyComponent = () => {
  useEffect(() => {
    logger.debug('MyComponent mounted');

    return () => {
      logger.debug('MyComponent unmounted');
    };
  }, []);

  const handleClick = () => {
    logger.info('Button clicked', { timestamp: Date.now() });
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

### In Custom Hooks

```typescript
import { logger } from '@dev-tools';

export const useMyHook = () => {
  const fetchData = async () => {
    const timer = logger.time('Fetch Data');

    try {
      logger.debug('Starting data fetch');
      const data = await api.getData();
      logger.success('Data fetched successfully', { count: data.length });
      return data;
    } catch (error) {
      logger.error('Failed to fetch data', error);
      throw error;
    } finally {
      timer(); // Logs total duration
    }
  };

  return { fetchData };
};
```

### In Services

```typescript
import { logger } from '@dev-tools';

export const eventService = {
  async getEvents() {
    logger.debug('Fetching events from API');

    try {
      const response = await apiClient.get('/events');
      logger.success('Events fetched', { count: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch events', error);
      throw error;
    }
  },
};
```

## Already Integrated

The logger is already integrated in the following places:

1. **API Client** ([axios-config.ts](../services/api/axios-config.ts))
   - Logs all API requests and responses
   - Logs authentication errors

2. **Auth Store** ([auth-store.ts](../store/auth-store.ts))
   - Logs user authentication state changes
   - Logs logout events

3. **Navigation** ([AppNavigator.tsx](../navigation/AppNavigator.tsx))
   - Logs screen navigation
   - Logs navigation initialization

4. **App Initialization** ([App.tsx](../../App.tsx))
   - Logs app startup
   - Logs font loading

5. **Auth Hooks** ([use-login.ts](../hooks/auth/use-login.ts))
   - Logs login attempts
   - Logs login success/failure

## Tips & Best Practices

### 1. Use Appropriate Log Levels

```typescript
// ✅ Good - Use debug for detailed info
logger.debug('User object structure', user);

// ❌ Bad - Don't use error for non-errors
logger.error('User clicked button'); // Use info instead
```

### 2. Include Context

```typescript
// ✅ Good - Include relevant data
logger.error('Failed to save user', { userId, error, timestamp });

// ❌ Bad - Vague message
logger.error('Something went wrong');
```

### 3. Use Specialized Loggers

```typescript
// ✅ Good - Use specialized logger
logger.api('GET', '/users/123');

// ❌ Bad - Manual formatting
logger.debug('[API] GET /users/123');
```

### 4. Performance Timing

```typescript
// ✅ Good - Use timer for automatic duration
const endTimer = logger.time('Complex Calculation');
performCalculation();
endTimer();

// ❌ Bad - Manual timing
const start = Date.now();
performCalculation();
logger.debug(`Took ${Date.now() - start}ms`);
```

### 5. Sensitive Data

```typescript
// ✅ Good - Don't log sensitive data
logger.info('User logged in', { userId: user.id });

// ❌ Bad - Logging passwords/tokens
logger.debug('User data', { password: user.password, token: user.token });
```

## Color Reference

The logger uses the following colors in terminal output:

- **DEBUG**: Magenta
- **INFO**: Blue
- **SUCCESS**: Green
- **WARN**: Yellow
- **ERROR**: Red
- **API**: Cyan
- **NAV**: Magenta
- **STORE**: Yellow
- **PERF**: Cyan

## Troubleshooting

### Logs Not Appearing

1. Check log level configuration:

   ```typescript
   logger.configure({ level: LogLevel.DEBUG });
   ```

2. Ensure you're in development mode:
   ```typescript
   import { isDev } from '@dev-tools';
   console.log('Dev mode:', isDev);
   ```

### Colors Not Working

Colors are automatically disabled in production. To force enable:

```typescript
logger.configure({ enableColors: true });
```

## TypeScript Support

The logger is fully typed with TypeScript. Import types as needed:

```typescript
import type { LoggerConfig } from '@dev-tools';
import { LogLevel } from '@dev-tools';

const config: LoggerConfig = {
  level: LogLevel.INFO,
  enableTimestamp: true,
  enableColors: true,
  prefix: '[MyApp]',
};
```

## Contributing

When adding new features to the app, please integrate the logger:

1. Import the logger: `import { logger } from '@dev-tools';`
2. Add appropriate logging for:
   - Component lifecycle (mount/unmount)
   - User actions (clicks, form submissions)
   - API calls (requests/responses)
   - State changes (store updates)
   - Errors (try/catch blocks)
   - Performance-critical operations (timer)

---

**Note:** The logger is designed for development debugging. In production, only WARN and ERROR level logs will appear by default.

---

# ErrorBoundary

A React Error Boundary component that catches errors in the component tree, prevents app crashes, and shows native Alert dialogs with error information.

## Features

- 🛡️ **Prevents App Crashes**: Catches React errors and prevents app termination
- 📱 **Native Alerts**: Uses device default Alert dialogs
- 🔍 **Dev Mode Details**: Shows full error stack traces in development
- 🔄 **Recovery**: Allows users to try again after errors
- 📝 **Auto Logging**: Automatically logs all errors to console

## Usage

### Basic Setup

Wrap your app root with the ErrorBoundary component:

```typescript
import { ErrorBoundary } from '@dev-tools';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

**Already integrated in:** [App.tsx](../../App.tsx:41)

### With Custom Error Handler

```typescript
import { ErrorBoundary } from '@dev-tools';
import { logger } from '@dev-tools';

function App() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Send to error tracking service
    logger.error('Custom error handler', { error, errorInfo });
    // Example: Sentry.captureException(error);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <YourApp />
    </ErrorBoundary>
  );
}
```

## Behavior

### Development Mode

When an error occurs in development:

1. **Console Logging**: Full error details logged to console with stack trace
2. **Alert Dialog**: Shows native alert with error summary:
   - Title: "🚨 Error Occurred (Dev Mode)"
   - Message: Error name and message
   - Buttons:
     - **View Full Error**: Shows detailed alert with complete stack trace
     - **Try Again**: Resets error boundary and attempts to recover
     - **Dismiss**: Dismisses alert without resetting

3. **Error Details Alert** (when "View Full Error" is pressed):
   - Shows complete error information
   - Includes stack trace
   - Includes component stack
   - Options to dismiss or try again

### Production Mode

When an error occurs in production:

1. **Console Logging**: Error logged to console (WARN level)
2. **Simple Alert**: Shows user-friendly message:
   - Title: "Something went wrong"
   - Message: "We encountered an unexpected error. Please try restarting the app."
   - Buttons:
     - **Try Again**: Attempts to recover
     - **OK**: Dismisses the alert

## How It Works

The ErrorBoundary component:

1. **Catches Errors**: Uses React's `componentDidCatch` lifecycle method
2. **Logs Details**: Automatically logs error to console via logger
3. **Shows Alert**: Displays native Alert dialog with appropriate detail level
4. **Continues Rendering**: App continues to render children (doesn't show blank screen)
5. **Allows Recovery**: Provides "Try Again" button to reset error state

## Error Information Logged

When an error is caught, the following information is logged:

```typescript
{
  error: {
    name: string,        // Error type (e.g., "TypeError")
    message: string,     // Error message
    stack: string        // Stack trace
  },
  componentStack: string // React component stack
}
```

## Integration Examples

### Multiple Error Boundaries

You can nest error boundaries for granular error handling:

```typescript
function App() {
  return (
    <ErrorBoundary>
      <Navigation />
      <ErrorBoundary>
        <CriticalFeature />
      </ErrorBoundary>
      <ErrorBoundary>
        <AnotherFeature />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
```

### With Error Tracking Service

```typescript
import { ErrorBoundary } from '@dev-tools';
import * as Sentry from '@sentry/react-native';

function App() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Send to Sentry
    Sentry.withScope((scope) => {
      scope.setContext('react_error_boundary', {
        componentStack: errorInfo.componentStack,
      });
      Sentry.captureException(error);
    });
  };

  return (
    <ErrorBoundary onError={handleError}>
      <YourApp />
    </ErrorBoundary>
  );
}
```

## Testing Error Boundary

To test the error boundary in development:

```typescript
// Create a component that throws an error
const BuggyComponent = () => {
  throw new Error('Test error for ErrorBoundary');
  return <Text>This will never render</Text>;
};

// Use it in your app
<ErrorBoundary>
  <BuggyComponent />
</ErrorBoundary>
```

## Console Output Example

When an error is caught:

```
LOG  [Rally] 22:30:45.123 [ERROR] 🚨 React Error Boundary caught an error
{
  "error": {
    "name": "TypeError",
    "message": "Cannot read property 'foo' of undefined",
    "stack": "TypeError: Cannot read property 'foo' of undefined\n    at MyComponent..."
  },
  "componentStack": "\n    in MyComponent (at App.tsx:45)\n    in ErrorBoundary..."
}
```

## Important Notes

1. **Error Boundaries Don't Catch:**
   - Errors in event handlers (use try-catch)
   - Asynchronous code (use try-catch or `.catch()`)
   - Server-side rendering errors
   - Errors in the error boundary itself

2. **Use Try-Catch For:**

   ```typescript
   // Event handlers
   const handleClick = async () => {
     try {
       await someAsyncOperation();
     } catch (error) {
       logger.error('Event handler error', error);
     }
   };

   // Async operations
   useEffect(() => {
     fetchData().catch((error) => {
       logger.error('Fetch error', error);
     });
   }, []);
   ```

3. **App Continues Running**: The error boundary allows the app to continue rendering, preventing a complete crash while still notifying the user.

## Best Practices

1. **Strategic Placement**: Place error boundaries at logical boundaries in your app
2. **Always Log**: Always implement logging when errors are caught
3. **User-Friendly Messages**: In production, show simple, reassuring messages
4. **Recovery Options**: Always provide a way for users to try again
5. **Track in Production**: Integrate with error tracking services like Sentry
6. **Test Thoroughly**: Test error boundaries with intentional errors during development

---

**The ErrorBoundary is already integrated in the app root and will catch any unhandled React errors throughout the application.**
