import * as SecureStore from 'expo-secure-store';
import { logger } from '@dev-tools/logger';

const TOKEN_KEY = 'auth-token';

/**
 * Secure storage utility for storing sensitive data like auth tokens
 * Uses expo-secure-store which encrypts data using the device's keychain/keystore
 */
export const secureStorage = {
  /**
   * Store authentication token securely
   */
  setToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      logger.store('Token stored securely', { tokenLength: token.length });
    } catch (error) {
      logger.error('Failed to store token securely', error);
      throw error;
    }
  },

  /**
   * Get authentication token from secure storage
   */
  getToken: async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        logger.store('Token retrieved from secure storage', { tokenLength: token.length });
      }
      return token;
    } catch (error) {
      logger.error('Failed to retrieve token from secure storage', error);
      return null;
    }
  },

  /**
   * Remove authentication token from secure storage
   */
  removeToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      logger.store('Token removed from secure storage');
    } catch (error) {
      logger.error('Failed to remove token from secure storage', error);
      throw error;
    }
  },
};
