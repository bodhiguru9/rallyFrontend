import { ENV } from '@config/env';

/**
 * Resolves relative image URLs to full URLs using API base URL.
 * Returns undefined for empty/invalid input.
 */
export function resolveImageUri(uri: string | undefined | null): string | undefined {
  if (!uri || typeof uri !== 'string' || !uri.trim()) {
    return undefined;
  }
  const trimmed = uri.trim();
  let result: string;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    result = trimmed;
  } else {
    const base = ENV.API_BASE_URL.replace(/\/$/, '');
    result = trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`;
  }
  return result;
}
