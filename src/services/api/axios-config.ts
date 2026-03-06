import axios from 'axios';
import { Platform } from 'react-native';
import { ENV } from '@config';
import { useAuthStore } from '@store/auth-store';
import { logger } from '@dev-tools/logger';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData must use multipart/form-data. On Android, deleting Content-Type lets the native
    // layer set application/x-www-form-urlencoded, causing "multipart != application/x-www-form-urlencoded".
    // Explicitly set multipart/form-data so the correct type is sent (boundary is added by the runtime).
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    // #region agent log
    const fullUrl = (config.baseURL || '') + (config.url || '');
    if (__DEV__ && (config.url || '').includes('signup')) {
      console.warn('[SIGNUP_FLOW] 4. axios request interceptor: outgoing POST', {
        url: config.url,
        fullUrl,
        isFormData: config.data instanceof FormData,
        platform: Platform.OS,
      });
    }
    fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'axios-config.ts:request',
        message: 'API request',
        data: {
          platform: Platform.OS,
          method: config.method,
          url: config.url,
          fullUrl,
          baseURL: config.baseURL,
          isFormData: config.data instanceof FormData,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'H3',
      }),
    }).catch(() => {});
    // #endregion

    // Log API request
    logger.api(config.method?.toUpperCase() || 'REQUEST', config.url || '', {
      // params: config.params,
      // data: config.data,
    });

    return config;
  },
  (error) => {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Log API response
    logger.apiResponse(response.status, response.config.url || '', response.data);
    return response;
  },
  (error) => {
    if (__DEV__ && (error.config?.url || '').includes('signup')) {
      console.warn(
        '[SIGNUP_FLOW] 5. axios response ERROR interceptor — request failed (no success response)',
        {
          code: (error as any)?.code,
          message: (error as any)?.message,
          hasResponse: !!(error as any)?.response,
          status: (error as any)?.response?.status,
          hasRequest: !!(error as any)?.request,
          url: error.config?.url,
          platform: Platform.OS,
        },
      );
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'axios-config.ts:responseError',
        message: 'API response error',
        data: {
          code: (error as any)?.code,
          message: (error as any)?.message,
          hasResponse: !!(error as any)?.response,
          hasRequest: !!(error as any)?.request,
          status: (error as any)?.response?.status,
          url: error.config?.url,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'H2,H4',
      }),
    }).catch(() => {});
    // #endregion

    // Log API error
    const status = error.response?.status || 0;
    const url = error.config?.url || 'unknown';
    logger.apiResponse(status, url, error.response?.data);

    if (error.response?.status === 401) {
      // Handle unauthorized - logout user
      logger.warn('Unauthorized - logging out user');
      // Fire and forget - logout is async but we don't need to wait in interceptor
      useAuthStore
        .getState()
        .logout()
        .catch((err) => {
          logger.error('Failed to logout on 401', err);
        });
    }
    return Promise.reject(error);
  },
);
