import { ENV } from '@config/env';

/**
 * Resolves relative image URLs to full URLs using API base URL.
 * Returns undefined for empty/invalid input.
 */
export function resolveImageUri(uri: string | undefined | null): string | undefined {
  if (!uri || typeof uri !== 'string' || !uri.trim()) return undefined;
  const trimmed = uri.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const base = ENV.API_BASE_URL.replace(/\/$/, '');
  return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`;
}
