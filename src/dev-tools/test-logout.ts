import { storageHelper } from '@utils/storage-helper';
import * as SecureStore from 'expo-secure-store';

/**
 * Debug utility to check auth storage state
 * Run this after logout to verify cleanup
 */
export const debugAuthStorage = async () => {
  console.log('=== DEBUG AUTH STORAGE ===');

  try {
    // Check AsyncStorage (Zustand persisted data)
    const authStorage = await storageHelper.getItem('auth-storage');
    console.log('AsyncStorage (auth-storage):', authStorage);

    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      console.log('Parsed state:', {
        user: parsed.state?.user,
        isAuthenticated: parsed.state?.isAuthenticated,
        requiresOTPVerification: parsed.state?.requiresOTPVerification,
      });
    }

    // Check SecureStore (token)
    const token = await SecureStore.getItemAsync('auth-token');
    console.log('SecureStore (auth-token):', token ? `EXISTS (${token.length} chars)` : 'NULL');

    // Note: getAllKeys is not available in storageHelper, but we can check specific keys
    console.log('Storage accessibility check passed');

  } catch (error) {
    console.error('Error debugging auth storage:', error);
  }

  console.log('=== END DEBUG ===');
};

/**
 * Force clear all auth storage (for testing)
 */
export const forceCleanAuthStorage = async () => {
  console.log('Force cleaning auth storage...');

  try {
    await storageHelper.removeItem('auth-storage');
    await SecureStore.deleteItemAsync('auth-token');
    console.log('Auth storage cleared successfully');
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
};
