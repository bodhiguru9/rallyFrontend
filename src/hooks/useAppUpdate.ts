import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { ENV } from '../config/env';

// These would ideally come from your backend or a remote JSON file
// For example: https://your-api.com/app-config
const REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/your-username/your-repo/main/app-version.json';

interface VersionConfig {
  latestVersion: string;
  minRequiredVersion: string;
  storeUrls: {
    ios: string;
    android: string;
  };
}

export type UpdateType = 'none' | 'optional' | 'mandatory';

export const useAppUpdate = () => {
  const [updateType, setUpdateType] = useState<UpdateType>('none');
  const [storeUrl, setStoreUrl] = useState<string>('');

  const currentVersion = Constants.expoConfig?.version || '1.0.0';

  const checkVersion = async () => {
    try {
      // 1. Fetch config from your backend
      const response = await fetch(`${ENV.API_BASE_URL}api/app-config/version`);
      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch app config');
      }

      const config: VersionConfig = result.data;

      const isUpdateAvailable = compareVersions(currentVersion, config.latestVersion) < 0;
      const isMandatory = compareVersions(currentVersion, config.minRequiredVersion) < 0;

      if (isMandatory) {
        setUpdateType('mandatory');
      } else if (isUpdateAvailable) {
        setUpdateType('optional');
      } else {
        setUpdateType('none');
      }

      setStoreUrl(Platform.OS === 'ios' ? config.storeUrls.ios : config.storeUrls.android);
    } catch (error) {
      console.error('[UpdateCheck] Failed to check version:', error);
    }
  };

  const redirectToStore = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  useEffect(() => {
    checkVersion();
  }, []);

  return { updateType, redirectToStore, checkVersion, currentVersion };
};

/**
 * Compares two semantic version strings.
 * Returns:
 *  - 1 if v1 > v2
 *  - -1 if v1 < v2
 *  - 0 if v1 == v2
 */
function compareVersions(v1: string, v2: string) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}
