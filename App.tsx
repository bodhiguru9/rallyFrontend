import { useCallback, useEffect, useState } from 'react';
import { AppNavigator } from '@navigation';
import { HomeProvider } from '@screens';
import { useFonts } from '@hooks';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { SplashVideoScreen } from './src/screens/welcome-splash/SplashVideoScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import { logger } from '@dev-tools/logger';
import { ErrorBoundary } from '@dev-tools';
import { useAuthStore, useLocationStore } from '@store';
import { useAppUpdate } from '@hooks';
import { UpdateModal, LoadingOverlay } from '@components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

const isValidStripePublishableKey = (value?: string | null): value is string => {
  if (!value) return false;
  const key = value.trim();
  if (!key) return false;
  if (!/^pk_(test|live)_/.test(key)) return false;
  if (key.toLowerCase().includes('placeholder')) return false;
  return key.length > 20;
};

const pickStripePublishableKey = (
  ...candidates: Array<string | undefined | null>
): string => {
  const valid = candidates.find(isValidStripePublishableKey);
  return valid?.trim() || '';
};

// Keep the native splash screen visible while we load resources
SplashScreen.preventAutoHideAsync().catch(() => {
  // Silently fail — the splash screen may have already been hidden
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const fontsLoaded = useFonts();
  const [showSplashVideo, setShowSplashVideo] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const { updateType, redirectToStore, currentVersion } = useAppUpdate();
  const [showUpdateModal, setShowUpdateModal] = useState(true);
  const isGlobalLoading = useAuthStore((state) => state.isGlobalLoading);
  const globalLoadingMessage = useAuthStore((state) => state.globalLoadingMessage);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const storedStripeKey = useAuthStore((state) => state.stripePublishableKey);
  const stripePublishableKey = pickStripePublishableKey(
    storedStripeKey,
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    (Constants.expoConfig?.extra as { stripe?: { publishableKey?: string } } | undefined)?.stripe
      ?.publishableKey,
  );

  // Initialize authentication on app startup
  useEffect(() => {
    if (!isAuthInitialized) {
      logger.info('🔐 Initializing authentication...');
      initializeAuth().catch((error) => {
        logger.error('Failed to initialize authentication', error);
      });
    }
  }, [isAuthInitialized, initializeAuth]);

  // Request location permission and save to device when app opens
  const initializeLocation = useLocationStore((state) => state.initializeLocation);
  useEffect(() => {
    if (fontsLoaded && isAuthInitialized) {
      initializeLocation().catch((error) => {
        logger.error('Failed to initialize location', error);
      });
    }
  }, [fontsLoaded, isAuthInitialized, initializeLocation]);

  useEffect(() => {
    logger.info('🎯 Rally App Initialized', {
      // colorScheme: isDarkMode ? 'dark' : 'light',
      colorScheme: 'light',
      fontsLoaded,
      isAuthInitialized,
    });
  }, [isDarkMode, fontsLoaded, isAuthInitialized]);

  useEffect(() => {
    if (fontsLoaded && isAuthInitialized) {
      console.log('🚀 [APP] Everything loaded, hiding native splash');
      setIsAppReady(true);
      SplashScreen.hideAsync().catch((err) => {
        console.warn('Failed to hide splash screen', err);
      });
    }
  }, [fontsLoaded, isAuthInitialized]);

  useEffect(() => {
    if (!stripePublishableKey) {
      const envKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      const configKey =
        (Constants.expoConfig?.extra as { stripe?: { publishableKey?: string } } | undefined)
          ?.stripe?.publishableKey || '';
      logger.error('Stripe publishable key is missing or invalid.', {
        envKeyPrefix: envKey ? envKey.slice(0, 12) : 'none',
        configKeyPrefix: configKey ? configKey.slice(0, 12) : 'none',
      });
    }
  }, [stripePublishableKey]);

  // Hide the native splash screen once fonts + auth are ready.
  // The video splash will still be visible on top, providing a seamless transition.
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && isAuthInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAuthInitialized]);

  const handleSplashVideoFinish = useCallback(() => {
    console.log('🎬 [APP] Splash video finished');
    setShowSplashVideo(false);
  }, []);

  // Wait for both fonts and auth initialization before rendering app content
  // We return a View to ensure the onLayout (if used) or just the mount happens
  if (!isAppReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        {/* Native splash screen is still visible */}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <StripeProvider
            publishableKey={stripePublishableKey}
            merchantIdentifier="merchant.com.rallysports"
          >
            <SafeAreaProvider>
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
              {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView
                  style={styles.keyboardAvoid}
                  behavior="padding"
                  keyboardVerticalOffset={0}
                >
                  <HomeProvider>
                    <AppNavigator />
                  </HomeProvider>
                  <LoadingOverlay visible={isGlobalLoading} message={globalLoadingMessage} />
                </KeyboardAvoidingView>
              ) : (
                <>
                  <HomeProvider>
                    <AppNavigator />
                  </HomeProvider>
                  <LoadingOverlay visible={isGlobalLoading} message={globalLoadingMessage} />
                </>
              )}

              {/* App Update Prompt */}
              <UpdateModal
                visible={updateType !== 'none' && showUpdateModal}
                type={updateType === 'mandatory' ? 'mandatory' : 'optional'}
                onUpdate={redirectToStore}
                onDismiss={() => setShowUpdateModal(false)}
                currentVersion={currentVersion}
              />

              {/* Phase 2: Animated splash video overlay */}
              {showSplashVideo && (
                <SplashVideoScreen onFinish={handleSplashVideoFinish} />
              )}
            </SafeAreaProvider>
          </StripeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
});

export default App;
