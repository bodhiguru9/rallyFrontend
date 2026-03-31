import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@app-types';
import { logger } from '@dev-tools/logger';
import { secureStorage } from '@utils/secure-storage';
import { storageHelper } from '@utils/storage-helper';
import { useSignupFormStore } from './signup-form-store';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  requiresOTPVerification: boolean;
  isGlobalLoading: boolean;
  globalLoadingMessage?: string;
  signupToken: string | null;
  verificationToken: string | null;
  selectedLocation: string;
  stripePublishableKey: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => Promise<void>;
  setAuth: (user: User, token: string, requiresOTP?: boolean) => Promise<void>;
  setRequiresOTPVerification: (requires: boolean) => void;
  setGlobalLoading: (isLoading: boolean, message?: string) => void;
  setStripePublishableKey: (key: string) => void;
  setSignupToken: (token: string | null) => void;
  clearSignupToken: () => void;
  setVerificationToken: (token: string | null) => void;
  clearVerificationToken: () => void;
  setSelectedLocation: (location: string) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthInitialized: false,
      requiresOTPVerification: false,
      isGlobalLoading: false,
      globalLoadingMessage: undefined,
      signupToken: null,
      verificationToken: null,
      selectedLocation: 'Dubai',
      stripePublishableKey: null,
      setUser: (user) => {
        logger.store('setUser', {
          userId: user.id,
          mobile: user.mobileNumber,
          userType: user.userType,
        });
        set({ user, isAuthenticated: true });
      },
      setToken: async (token) => {
        logger.store('setToken', { tokenLength: token.length });
        await secureStorage.setToken(token);
        set({ token });
      },
      setAuth: async (user, token, requiresOTP = false) => {
        console.log('🔍 [AUTH STORE] setAuth called with user:', {
          userId: user.id,
          mobile: user.mobileNumber,
          userType: user.userType,
          profilePic: user.profilePic,
          fullName: user.fullName,
          hasProfilePic: !!user.profilePic,
          requiresOTP,
        });
        logger.store('setAuth', {
          userId: user.id,
          mobile: user.mobileNumber,
          userType: user.userType,
          requiresOTP,
        });
        await secureStorage.setToken(token);
        set({ user, token, isAuthenticated: true, requiresOTPVerification: requiresOTP });
      },
      setRequiresOTPVerification: (requires) => {
        logger.store('setRequiresOTPVerification', { requires });
        set({ requiresOTPVerification: requires });
      },
      setGlobalLoading: (isLoading, message) => {
        logger.store('setGlobalLoading', { isLoading, message });
        set({ isGlobalLoading: isLoading, globalLoadingMessage: message });
      },
      setStripePublishableKey: (key) => {
        logger.store('setStripePublishableKey', { keyPrefix: key.slice(0, 10) });
        set({ stripePublishableKey: key });
      },
      setSignupToken: (token) => {
        logger.store('setSignupToken', { hasToken: !!token });
        set({ signupToken: token });
      },
      clearSignupToken: () => {
        logger.store('clearSignupToken', { action: 'Signup token cleared' });
        set({ signupToken: null });
      },
      setVerificationToken: (token) => {
        logger.store('setVerificationToken', { hasToken: !!token });
        set({ verificationToken: token });
      },
      clearVerificationToken: () => {
        logger.store('clearVerificationToken', { action: 'Verification token cleared' });
        set({ verificationToken: null });
      },
      setSelectedLocation: (location) => {
        logger.store('setSelectedLocation', { location });
        set({ selectedLocation: location });
      },
      logout: async () => {
        logger.store('logout', { action: 'Starting logout process' });

        // Step 1: Remove token from secure storage
        try {
          await secureStorage.removeToken();
          logger.store('logout', { action: 'Token removed from secure storage' });
        } catch (error) {
          logger.error('Failed to remove token from secure storage', error);
          // Don't throw - continue with logout even if token deletion fails
          // The orphaned token will be cleaned up on next app initialization
        }

        // Step 2: Clear all auth state (will be auto-persisted to AsyncStorage by Zustand)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          requiresOTPVerification: false,
          signupToken: null,
          verificationToken: null,
          stripePublishableKey: null,
        });
        // Clear any in-progress signup form data
        useSignupFormStore.getState().clearSignupForm();
        logger.store('logout', { action: 'Auth state cleared in memory' });

        // Step 3: Force AsyncStorage to persist the cleared state immediately
        // This ensures the state is saved even if the app is closed right after logout
        try {
          const success = await storageHelper.setItem(
            'auth-storage',
            JSON.stringify({
              state: {
                user: null,
                isAuthenticated: false,
                requiresOTPVerification: false,
                selectedLocation: useAuthStore.getState().selectedLocation,
              },
              version: 0,
            }),
          );
          if (success) {
            logger.store('logout', { action: 'Auth state persisted to AsyncStorage' });
          } else {
            logger.warn('Failed to persist cleared state to AsyncStorage');
          }
        } catch (error) {
          logger.error('Failed to persist cleared state to AsyncStorage', error);
          // Zustand's persist middleware should handle this anyway, so don't fail
        }

        logger.store('logout', { action: 'Logout completed successfully' });
      },
      initializeAuth: async () => {
        console.log('🔵 [AUTH] Starting initializeAuth');
        logger.store('initializeAuth', { action: 'Starting auth initialization' });
        set({ isAuthInitialized: false });
        try {
          // Check if storage is accessible before proceeding
          const isStorageAccessible = await storageHelper.isAccessible();
          if (!isStorageAccessible) {
            logger.warn('Storage is not accessible, clearing and retrying');
            await storageHelper.clear();
            // Wait a bit for storage to recover
            await new Promise<void>((resolve) => setTimeout(resolve, 100));
          }

          // Load token from secure storage on app initialization
          console.log('🔵 [AUTH] Loading token from secure storage');
          const token = await secureStorage.getToken();
          const state = useAuthStore.getState();
          console.log('🔵 [AUTH] Got token and state', { hasToken: !!token, hasUser: !!state.user });

          if (token) {
            if (state.user) {
              // Valid session - user and token both exist, restore authentication
              set({ token, isAuthenticated: true });
              console.log('✅ [AUTH] Valid session restored');
              logger.store('Auth initialized from secure storage', {
                hasUser: true,
                hasToken: true,
              });
            } else {
              // Orphaned token found (token exists but no user data)
              // This can happen if logout failed to delete the token
              // Clean it up to prevent security issues
              console.log('⚠️ [AUTH] Found orphaned token - cleaning up');
              logger.warn('Found orphaned token without user data - cleaning up', {
                tokenLength: token.length,
              });
              await secureStorage.removeToken();
              console.log('✅ [AUTH] Orphaned token cleaned up');
              logger.store('Orphaned token cleaned up successfully');
            }
          } else if (state.user) {
            // Orphaned user data found (user exists but no token)
            // This shouldn't happen but clean it up just in case
            console.log('⚠️ [AUTH] Found orphaned user data - cleaning up');
            logger.warn('Found orphaned user data without token - cleaning up', {
              userId: state.user.id,
            });
            set({ user: null, isAuthenticated: false });
            console.log('✅ [AUTH] Orphaned user data cleaned up');
            logger.store('Orphaned user data cleaned up successfully');
          } else {
            // No token and no user - clean state (user is logged out)
            console.log('✅ [AUTH] No stored session - user logged out');
            logger.store('No stored session found - user is logged out');
          }
        } catch (error) {
          console.error('❌ [AUTH] Initialization failed:', error);
          logger.error('Auth initialization failed', error);
          // On error, ensure we're in a clean logged-out state
          set({ user: null, token: null, isAuthenticated: false });
        } finally {
          console.log('🔵 [AUTH] Setting isAuthInitialized to true');
          set({ isAuthInitialized: true });
          console.log('✅ [AUTH] Auth initialization completed');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string): Promise<string | null> => {
          return storageHelper.getItem(name);
        },
        setItem: async (name: string, value: string): Promise<void> => {
          await storageHelper.setItem(name, value);
        },
        removeItem: async (name: string): Promise<void> => {
          await storageHelper.removeItem(name);
        },
      })),
      partialize: (state) => ({
        user: state.user,
        // Token is stored in secure storage, not persisted here
        isAuthenticated: state.isAuthenticated,
        requiresOTPVerification: state.requiresOTPVerification,
        selectedLocation: state.selectedLocation,
        stripePublishableKey: state.stripePublishableKey,
        // Exclude: token (stored in secure storage), signupToken, verificationToken, isGlobalLoading, globalLoadingMessage
      }),
    },
  ),
);
