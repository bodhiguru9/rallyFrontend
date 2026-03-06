# Rally App

A modern React Native application built with TypeScript, NativeWind (Tailwind CSS), and a modular architecture.

## Features

- ⚡️ **React Native 0.83** - Latest version with improved performance
- 🎨 **NativeWind** - Tailwind CSS for React Native
- 📘 **TypeScript** - Type safety and better developer experience
- 🏗️ **Modular Structure** - Organized codebase with path aliases
- 🔧 **ESLint & Prettier** - Code quality and formatting
- 🎯 **Path Aliases** - Clean imports using `@components`, `@screens`, etc.

## Project Structure

```
src/
├── components/      # Reusable UI components
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── services/        # API services and external integrations
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── assets/          # Images, fonts, and other static assets
├── config/          # App configuration and constants
├── theme/           # Theme configuration (colors, spacing, typography)
└── contexts/        # React contexts for state management
```

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Button } from '@components/Button';
import { HomeScreen } from '@screens/HomeScreen';
import { useAuth } from '@hooks/useAuth';
import { colors } from '@theme';
```

## Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment set up ([Guide](https://reactnative.dev/docs/environment-setup))
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and SDK

### Installation

1. Clone the repository:

```bash
git clone https://github.com/navneet9971/rally-frontend-player.git
cd rally-app
```

2. Install dependencies:

```bash
npm install
```

3. For iOS, install CocoaPods dependencies:

```bash
cd ios && bundle install && bundle exec pod install && cd ..
```

### Running the App

#### iOS

```bash
npm run ios
```

#### Android

```bash
npm run android
```

#### Start Metro bundler separately

```bash
npm start
```

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Building for Production

### Android (APK)

To build a release APK directly without EAS:

1.  **Navigate to the `android` directory:**
    ```bash
    cd android
    ```

2.  **Run the `assembleRelease` Gradle task:**

    On macOS or Linux:
    ```bash
    ./gradlew assembleRelease
    ```

    On Windows:
    ```bash
    gradlew.bat assembleRelease
    ```

3.  **Locate the APK:**
    After the build is complete, you can find your APK file in the following directory:
    `android/app/build/outputs/apk/release/app-release.apk`

    **Note:** This command builds a release APK. For publishing to the Google Play Store, you will need to follow the official React Native documentation for [generating a signed APK](https://reactnative.dev/docs/signed-apk-android).

## Code Quality

### ESLint

The project uses a comprehensive ESLint configuration with:

- TypeScript support
- React and React Hooks rules
- Import ordering and organization
- Security rules
- Best practices enforcement

### Prettier

Consistent code formatting is enforced with Prettier:

- Single quotes
- Trailing commas
- 100 character line width
- 2 space indentation

## NativeWind Setup

NativeWind is configured and ready to use. Simply add Tailwind classes to your components:

```tsx
<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-2xl font-bold text-blue-600">Hello World</Text>
</View>
```

## Troubleshooting

If you're having issues, see the [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

- [React Native Website](https://reactnative.dev) - learn more about React Native
- [NativeWind Documentation](https://www.nativewind.dev) - NativeWind docs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript documentation

## Contributing

1. Follow the established project structure
2. Use path aliases for imports
3. Ensure code passes ESLint checks
4. Format code with Prettier
5. Write meaningful commit messages

## License

This project is private and proprietary.
