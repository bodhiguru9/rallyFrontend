import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@dev-tools/logger';

/**
 * Storage helper with error handling and recovery for SQLite/AsyncStorage issues
 */
export const storageHelper = {
  /**
   * Safely get item from AsyncStorage with error handling
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error: any) {
      // SQLite error code 14 = SQLITE_CANTOPEN (unable to open database file)
      if (error?.code === 14 || error?.message?.includes('SQLite') || error?.message?.includes('sqLiteGetResultsError')) {
        logger.error('SQLite storage error detected, attempting recovery', error);
        
        // Try to clear the corrupted storage key
        try {
          await AsyncStorage.removeItem(key);
          logger.info('Cleared corrupted storage key:', key);
        } catch (clearError) {
          logger.error('Failed to clear corrupted storage key', clearError);
        }
        
        // Try to clear all storage if single key clear fails
        try {
          await AsyncStorage.clear();
          logger.info('Cleared all AsyncStorage due to corruption');
        } catch (clearAllError) {
          logger.error('Failed to clear all AsyncStorage', clearAllError);
        }
      } else {
        logger.error('AsyncStorage getItem error', error);
      }
      
      return null;
    }
  },

  /**
   * Safely set item in AsyncStorage with error handling
   */
  setItem: async (key: string, value: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error: any) {
      // SQLite error code 14 = SQLITE_CANTOPEN
      if (error?.code === 14 || error?.message?.includes('SQLite') || error?.message?.includes('sqLiteGetResultsError')) {
        logger.error('SQLite storage error on setItem, attempting recovery', error);
        
        // Try to clear corrupted storage
        try {
          await AsyncStorage.removeItem(key);
          // Retry setting the item
          await AsyncStorage.setItem(key, value);
          logger.info('Successfully set item after recovery');
          return true;
        } catch (retryError) {
          logger.error('Failed to set item after recovery', retryError);
          return false;
        }
      } else {
        logger.error('AsyncStorage setItem error', error);
        return false;
      }
    }
  },

  /**
   * Safely remove item from AsyncStorage
   */
  removeItem: async (key: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error: any) {
      logger.error('AsyncStorage removeItem error', error);
      return false;
    }
  },

  /**
   * Safely clear all AsyncStorage
   */
  clear: async (): Promise<boolean> => {
    try {
      await AsyncStorage.clear();
      logger.info('AsyncStorage cleared successfully');
      return true;
    } catch (error: any) {
      logger.error('AsyncStorage clear error', error);
      return false;
    }
  },

  /**
   * Check if AsyncStorage is accessible
   */
  isAccessible: async (): Promise<boolean> => {
    try {
      const testKey = '__storage_test__';
      await AsyncStorage.setItem(testKey, 'test');
      await AsyncStorage.removeItem(testKey);
      return true;
    } catch (error) {
      logger.error('AsyncStorage is not accessible', error);
      return false;
    }
  },
};
