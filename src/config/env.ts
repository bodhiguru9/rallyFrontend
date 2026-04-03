/**
 * Environment Configuration
 *
 * To use a different API URL:
 * 1. For development: Change the API_BASE_URL value below
 * 2. For production: Use app.config.js or environment-specific builds
 */

export const ENV = {
  API_BASE_URL: 'https://backend2.rallysports.ae/',
  /** Base URL for event share links. Used for rich preview in messaging apps (requires OG meta on web). */
  RALLY_WEB_BASE_URL: 'https://backend2.rallysports.ae/',
} as const;
