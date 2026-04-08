/**
 * Error Handler Utility
 *
 * Centralized error handling for API responses and network errors.
 * Provides consistent error parsing and formatting across the application.
 */

import { logger } from '@dev-tools/logger';

/**
 * Standard API error response structure
 */
export interface IApiErrorResponse {
  success: false;
  error: string | string[];
  message?: string;
}

/**
 * Parsed error result
 */
export interface IParsedError {
  message: string;
  errors: string[];
  isNetworkError: boolean;
  statusCode?: number;
}

// Type alias for backward compatibility
// eslint-disable-next-line @typescript-eslint/naming-convention
export type ParsedError = IParsedError;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type ApiErrorResponse = IApiErrorResponse;

/**
 * Parse error from various sources (API, Axios, Network, etc.)
 * Handles both direct API errors and Axios-wrapped errors
 *
 * @param error - Error object from API call or thrown exception
 * @param defaultMessage - Default message if no error details found
 * @returns Parsed error information
 */
export function parseApiError(
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred. Please try again.',
): ParsedError {
  let message = defaultMessage;
  let errors: string[] = [];
  let isNetworkError = false;
  let statusCode: number | undefined;

  // Type guard: check if error is an object
  if (typeof error !== 'object' || error === null) {
    return { message, errors: [message], isNetworkError, statusCode };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as Record<string, any>;

  // Check if it's an ApiErrorResponse (thrown from service layer)
  if ('error' in err) {
    const apiError = err as ApiErrorResponse;
    if (Array.isArray(apiError.error)) {
      errors = apiError.error;
      message = apiError.error.join('\n');
    } else {
      errors = [apiError.error];
      message = apiError.error;
    }
    statusCode = 'statusCode' in err ? err.statusCode : err.response?.status;
    isNetworkError =
      err.isNetworkError === true ||
      ('code' in err && (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK'));
  }
  // Check if it's an Axios error with response data
  else if ('response' in err && err.response?.data?.error) {
    const apiError = err.response.data as ApiErrorResponse;
    if (Array.isArray(apiError.error)) {
      errors = apiError.error;
      message = apiError.error.join('\n');
    } else {
      errors = [apiError.error];
      message = apiError.error;
    }
    statusCode = err.response.status;
  }
  // Check if it's a message from API
  else if ('response' in err && err.response?.data?.message) {
    message = err.response.data.message;
    errors = [message];
    statusCode = err.response.status;
  }
  // Network error (no response from server)
  else if ('request' in err && !('response' in err)) {
    message = 'Network error. Please check your connection and try again.';
    errors = [message];
    isNetworkError = true;
  }
  // Generic error with message
  else if ('message' in err && typeof err.message === 'string') {
    message = err.message;
    errors = [message];
    isNetworkError = 'code' in err && (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK');
  }

  return {
    message,
    errors,
    isNetworkError,
    statusCode,
  };
}

/**
 * Format error messages for display in alerts
 * Creates a numbered list for multiple errors
 *
 * @param errors - Array of error messages
 * @returns Formatted string for display
 */
export function formatErrorMessage(errors: string[]): string {
  if (errors.length === 0) {
    return 'An unexpected error occurred.';
  }

  if (errors.length === 1) {
    return errors[0];
  }

  // Multiple errors - format as numbered list
  return errors.map((msg, index) => `${index + 1}. ${msg}`).join('\n');
}

/**
 * Format error for Alert display
 * Returns both title and message for Alert.alert()
 *
 * @param error - Error object from API call
 * @param context - Context for the error (e.g., 'Signup', 'Login', 'Profile Update')
 * @returns Object with title and message for Alert
 */
export function formatErrorForAlert(
  error: unknown,
  context: string = 'Operation',
): { title: string; message: string } {
  const parsedError = parseApiError(error);
  
  // Check if error has isTokenExpired flag (for signup token expiration)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as Record<string, any>;
  const isTokenExpired = err?.isTokenExpired === true;

  let title = `${context} Failed`;
  if (parsedError.isNetworkError) {
    title = 'Network Error';
  } else if (isTokenExpired || parsedError.statusCode === 410) {
    title = 'Session Expired';
  } else if (parsedError.statusCode === 401) {
    title = 'Authentication Error';
  } else if (parsedError.statusCode === 403) {
    title = 'Permission Denied';
  } else if (parsedError.statusCode === 404) {
    title = 'Not Found';
  } else if (parsedError.statusCode === 413) {
    title = 'Image Too Large';
    return {
      title,
      message: 'The total request size (including the image) exceeds the server limit of 100KB. Please select a smaller image.',
    };
  } else if (parsedError.statusCode && parsedError.statusCode >= 500) {
    title = 'Server Error';
  }

  return {
    title,
    message: formatErrorMessage(parsedError.errors),
  };
}

/**
 * Check if error is a specific type
 */
export const ErrorType = {
  isNetworkError: (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as Record<string, any>;
    return (
      ('request' in err && !('response' in err)) ||
      err.code === 'ECONNABORTED' ||
      err.code === 'ERR_NETWORK'
    );
  },

  isAuthError: (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as Record<string, any>;
    return err.response?.status === 401 || err.statusCode === 401;
  },

  isValidationError: (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as Record<string, any>;
    return err.response?.status === 400 || err.statusCode === 400;
  },

  isServerError: (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as Record<string, any>;
    const status = err.response?.status || err.statusCode;
    return status >= 500 && status < 600;
  },
};

/**
 * Log error with context (useful for debugging)
 *
 * @param error - Error object
 * @param context - Context where error occurred
 */
export function logError(error: unknown, context: string): void {
  const parsedError = parseApiError(error);

  logger.error(`[${context}] ${parsedError.message}`, {
    errors: parsedError.errors,
    statusCode: parsedError.statusCode,
    isNetworkError: parsedError.isNetworkError,
    rawError: error,
  });
}
