/**
 * Global Logger Utility for Rally App
 *
 * Provides structured logging with different log levels, colors, and debugging capabilities.
 * Use this for consistent logging across the application.
 *
 * @example
 * import { logger } from '@dev-tools/logger';
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('API call failed', error);
 * logger.debug('Component rendered', { props });
 */

// Check if running in development mode - __DEV__ is a global in React Native
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __DEV__: boolean;
const isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

// Log level configuration
interface LoggerConfig {
  level: LogLevel;
  enableTimestamp: boolean;
  enableColors: boolean;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig = {
    level: isDevelopment ? LogLevel.DEBUG : LogLevel.WARN,
    enableTimestamp: true,
    enableColors: true,
    prefix: '[Rally]',
  };

  /**
   * Configure logger settings
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Format timestamp
   */
  private getTimestamp(): string {
    if (!this.config.enableTimestamp) {
      return '';
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  /**
   * Apply color to text (if colors are enabled)
   */
  private colorize(text: string, color: string): string {
    if (!this.config.enableColors) {
      return text;
    }
    return `${color}${text}${colors.reset}`;
  }

  /**
   * Format log message
   */
  private formatMessage(
    level: string,
    message: string,
    levelColor: string
  ): string {
    const parts: string[] = [];

    if (this.config.prefix) {
      parts.push(this.colorize(this.config.prefix, colors.cyan));
    }

    if (this.config.enableTimestamp) {
      parts.push(this.colorize(this.getTimestamp(), colors.dim));
    }

    parts.push(this.colorize(level, levelColor));
    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Format data for display
   */
  private formatData(data: unknown): string {
    if (data === undefined) {
      return '';
    }
    if (data === null) {
      return 'null';
    }

    try {
      if (typeof data === 'object') {
        return JSON.stringify(data, null, 2);
      }
      return String(data);
    } catch (_error) {
      return '[Unserializable Data]';
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    levelName: string,
    levelColor: string,
    message: string,
    data?: unknown
  ): void {
    // Skip if below configured log level
    if (level < this.config.level) {
      return;
    }

    const formattedMessage = this.formatMessage(levelName, message, levelColor);

    // Choose appropriate console method
    const consoleMethod =
      level === LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'log';

    // eslint-disable-next-line no-console
    if (data !== undefined) {
      // eslint-disable-next-line no-console
      console[consoleMethod](formattedMessage, '\n', this.formatData(data));
    } else {
      // eslint-disable-next-line no-console
      console[consoleMethod](formattedMessage);
    }
  }

  /**
   * Debug level logging
   * Use for detailed debugging information
   */
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, '[DEBUG]', colors.magenta, message, data);
  }

  /**
   * Info level logging
   * Use for general informational messages
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, '[INFO]', colors.blue, message, data);
  }

  /**
   * Success level logging
   * Use for successful operations
   */
  success(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, '[SUCCESS]', colors.green, message, data);
  }

  /**
   * Warning level logging
   * Use for warnings that don't prevent execution
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, '[WARN]', colors.yellow, message, data);
  }

  /**
   * Error level logging
   * Use for errors and exceptions
   */
  error(message: string, error?: unknown): void {
    let errorData = error;

    // Extract useful information from Error objects
    if (error instanceof Error) {
      errorData = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    this.log(LogLevel.ERROR, '[ERROR]', colors.red, message, errorData);
  }

  /**
   * API request logging
   */
  api(method: string, url: string, data?: unknown): void {
    const message = `${this.colorize(method.toUpperCase(), colors.bright)} ${url}`;
    this.log(LogLevel.DEBUG, '[API]', colors.cyan, message, data);
  }

  /**
   * API response logging
   */
  apiResponse(status: number, url: string, data?: unknown): void {
    const statusColor = status >= 200 && status < 300 ? colors.green : colors.red;
    const isSuccess = status >= 200 && status < 300;

    // Only show essential info: status code and success/error message
    let logData: unknown = undefined;

    if (!isSuccess && data && typeof data === 'object') {
      // For errors, only log the error message if available
      const errorData = data as Record<string, unknown>;
      logData = {
        success: errorData.success ?? false,
        message: errorData.message ?? 'Request failed',
        error: errorData.error ?? undefined,
      };
    } else if (isSuccess && data && typeof data === 'object') {
      // For success, only log success status and message
      const responseData = data as Record<string, unknown>;
      logData = {
        success: responseData.success ?? true,
        message: responseData.message ?? 'Request successful',
      };
    }

    const message = `${this.colorize(String(status), statusColor)} ${url}`;
    this.log(LogLevel.DEBUG, '[API]', colors.cyan, message, logData);
  }

  /**
   * Navigation logging
   */
  navigation(screen: string, params?: unknown): void {
    const message = `Navigating to ${this.colorize(screen, colors.bright)}`;
    this.log(LogLevel.DEBUG, '[NAV]', colors.magenta, message, params);
  }

  /**
   * Store/State logging
   */
  store(action: string, state?: unknown): void {
    const message = `Store action: ${this.colorize(action, colors.bright)}`;
    this.log(LogLevel.DEBUG, '[STORE]', colors.yellow, message, state);
  }

  /**
   * Performance logging
   */
  perf(label: string, duration: number): void {
    const durationStr = `${duration.toFixed(2)}ms`;
    const message = `${label}: ${this.colorize(durationStr, colors.bright)}`;
    this.log(LogLevel.DEBUG, '[PERF]', colors.cyan, message);
  }

  /**
   * Group logs together
   */
  group(label: string): void {
    if (this.config.level <= LogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.group(this.colorize(`▼ ${label}`, colors.bright));
    }
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.config.level <= LogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }

  /**
   * Create a performance timer
   */
  time(label: string): () => void {
    const start = Date.now();

    return () => {
      const duration = Date.now() - start;
      this.perf(label, duration);
    };
  }

  /**
   * Log a table (useful for arrays of objects)
   */
  table(data: unknown): void {
    if (this.config.level <= LogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.table(data);
    }
  }

  /**
   * Clear console (web only - not supported in React Native)
   */
  clear(): void {
    // eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
    const consoleClear = (console as any).clear;
    if (typeof consoleClear === 'function') {
      // eslint-disable-next-line no-console
      consoleClear();
    }
  }

  /**
   * Create a child logger with a specific prefix
   */
  child(prefix: string): Logger {
    const childLogger = new Logger();
    childLogger.configure({
      ...this.config,
      prefix: `${this.config.prefix}${prefix}`,
    });
    return childLogger;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types
export type { LoggerConfig };

// Export utility for conditional logging in production
export const isDev = isDevelopment;

/**
 * Development-only logging wrapper
 * Logs will be stripped out in production builds
 */
export const devLog = {
  debug: (message: string, data?: unknown) =>
    isDevelopment && logger.debug(message, data),
  info: (message: string, data?: unknown) => isDevelopment && logger.info(message, data),
  warn: (message: string, data?: unknown) => isDevelopment && logger.warn(message, data),
  error: (message: string, error?: unknown) =>
    isDevelopment && logger.error(message, error),
};
