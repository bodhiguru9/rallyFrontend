import { useEffect } from 'react';
import { AppNavigator } from '@navigation';
import { HomeProvider } from '@screens';
import { useFonts } from '@hooks';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import { logger } from '@dev-tools/logger';
import { ErrorBoundary } from '@dev-tools';
import { LoadingOverlay } from '@components';
import { useAuthStore, useLocationStore } from '@store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const fontsLoaded = useFonts();
  const isGlobalLoading = useAuthStore((state) => state.isGlobalLoading);
  const globalLoadingMessage = useAuthStore((state) => state.globalLoadingMessage);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

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

  // Wait for both fonts and auth initialization before rendering app
  if (!fontsLoaded || !isAuthInitialized) {
    logger.debug('Loading app...', { fontsLoaded, isAuthInitialized });
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5B7C99" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <StripeProvider
            publishableKey="pk_test_placeholder"
            merchantIdentifier="merchant.com.rally.app"
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
