import { storageHelper } from './storage-helper';
import { logger } from '@dev-tools/logger';

/**
 * Storage recovery utility to fix SQLite/AsyncStorage corruption issues
 * Call this if you encounter SQLite errors
 */
export const storageRecovery = {
  /**
   * Clear all storage and reset app state
   * Use this as a last resort if storage is corrupted
   */
  clearAllStorage: async (): Promise<boolean> => {
    try {
      logger.info('Starting storage recovery - clearing all AsyncStorage');
      const success = await storageHelper.clear();
      if (success) {
        logger.info('Storage recovery completed successfully');
      } else {
        logger.error('Storage recovery failed');
      }
      return success;
    } catch (error) {
      logger.error('Storage recovery error', error);
      return false;
    }
  },

  /**
   * Clear specific storage key
   */
  clearKey: async (key: string): Promise<boolean> => {
    try {
      logger.info('Clearing storage key:', key);
      const success = await storageHelper.removeItem(key);
      return success;
    } catch (error) {
      logger.error('Failed to clear storage key', error);
      return false;
    }
  },

  /**
   * Verify storage health
   */
  verifyStorage: async (): Promise<boolean> => {
    try {
      const isAccessible = await storageHelper.isAccessible();
      if (!isAccessible) {
        logger.warn('Storage is not accessible');
        return false;
      }
      logger.info('Storage is healthy');
      return true;
    } catch (error) {
      logger.error('Storage verification failed', error);
      return false;
    }
  },
};
