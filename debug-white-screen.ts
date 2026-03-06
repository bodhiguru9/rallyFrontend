/**
 * Debug script to clear all storage and reset app state
 * Run this if you're seeing a white screen
 *
 * Usage:
 * 1. Import this in App.tsx temporarily
 * 2. Call clearAllStorage() in useEffect
 * 3. Reload the app
 * 4. Remove the import
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const clearAllStorage = async () => {
  console.log('🧹 [DEBUG] Clearing all storage...');

  try {
    // Clear AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    console.log('🧹 [DEBUG] AsyncStorage keys found:', keys);
    await AsyncStorage.clear();
    console.log('✅ [DEBUG] AsyncStorage cleared');

    // Clear SecureStore token
    await SecureStore.deleteItemAsync('auth-token');
    console.log('✅ [DEBUG] SecureStore cleared');

    console.log('✅ [DEBUG] All storage cleared successfully!');
    return true;
  } catch (error) {
    console.error('❌ [DEBUG] Error clearing storage:', error);
    return false;
  }
};

export const debugStorage = async () => {
  console.log('🔍 [DEBUG] Checking storage state...');

  try {
    // Check AsyncStorage
    const authStorage = await AsyncStorage.getItem('auth-storage');
    console.log('🔍 [DEBUG] AsyncStorage (auth-storage):', authStorage);

    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      console.log('🔍 [DEBUG] Parsed state:', JSON.stringify(parsed, null, 2));
    }

    // Check SecureStore
    const token = await SecureStore.getItemAsync('auth-token');
    console.log('🔍 [DEBUG] SecureStore (auth-token):', token ? `EXISTS (${token.length} chars)` : 'NULL');

    // List all AsyncStorage keys
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('🔍 [DEBUG] All AsyncStorage keys:', allKeys);

  } catch (error) {
    console.error('❌ [DEBUG] Error debugging storage:', error);
  }
};
