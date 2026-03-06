import { Platform } from 'react-native';

export interface ParsedRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Parse rgba(r,g,b,a), rgb(r,g,b), or hex (#RGB, #RRGGBB, #RRGGBBAA) to normalized RGBA.
 * Returns null if the string is not a single color (e.g. linear-gradient).
 */
export function parseColorToRgba(color: string): ParsedRgba | null {
  const trimmed = color.trim();

  const rgbaMatch = trimmed.match(
    /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i,
  );
  if (rgbaMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbaMatch[1], 10)));
    const g = Math.min(255, Math.max(0, parseInt(rgbaMatch[2], 10)));
    const b = Math.min(255, Math.max(0, parseInt(rgbaMatch[3], 10)));
    const a = rgbaMatch[4] != null ? parseFloat(rgbaMatch[4]) : 1;
    return { r, g, b, a: Math.min(1, Math.max(0, a)) };
  }

  const hexMatch = trimmed.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    let r: number, g: number, b: number, a: number;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
      a = 1;
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = 1;
    } else {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = parseInt(hex.slice(6, 8), 16) / 255;
    }
    return { r, g, b, a };
  }

  return null;
}

function toHex(n: number): string {
  const h = Math.round(Math.min(255, Math.max(0, n))).toString(16);
  return h.length === 1 ? '0' + h : h;
}

/**
 * Convert RGBA to an opaque hex color.
 * If a < 1 and overBackground is provided, blend foreground over background; otherwise use same RGB with alpha 1.
 */
export function rgbaToOpaqueHex(
  r: number,
  g: number,
  b: number,
  a: number,
  overBackground?: string,
): string {
  if (a >= 1) {
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  if (overBackground) {
    const bg = parseColorToRgba(overBackground);
    if (bg) {
      const blend = (f: number, bChannel: number) =>
        Math.round(f * a + bChannel * (1 - a));
      const rOut = blend(r, bg.r);
      const gOut = blend(g, bg.g);
      const bOut = blend(b, bg.b);
      return '#' + toHex(rOut) + toHex(gOut) + toHex(bOut);
    }
  }

  return '#' + toHex(r) + toHex(g) + toHex(b);
}

/**
 * On Android, return an opaque version of the color (same RGB or blended over background).
 * On other platforms, return the color unchanged.
 */
export function withOpaqueForAndroid(
  color: string,
  overBackground?: string,
): string {
  if (Platform.OS !== 'android') {
    return color;
  }
  const parsed = parseColorToRgba(color);
  if (!parsed || parsed.a >= 1) {
    return color;
  }
  return rgbaToOpaqueHex(
    parsed.r,
    parsed.g,
    parsed.b,
    parsed.a,
    overBackground,
  );
}

/**
 * Recursively walk a plain object and replace string values that parse as rgba with alpha < 1
 * with their opaque equivalent on Android. Gradient strings and other non-single-color values are left unchanged.
 */
export function makeOpaqueForAndroid(
  obj: unknown,
  overBackground?: string,
): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => makeOpaqueForAndroid(item, overBackground));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      const parsed = parseColorToRgba(value);
      if (parsed && parsed.a < 1) {
        result[key] = rgbaToOpaqueHex(
          parsed.r,
          parsed.g,
          parsed.b,
          parsed.a,
          overBackground,
        );
      } else {
        result[key] = value;
      }
    } else {
      result[key] = makeOpaqueForAndroid(value, overBackground);
    }
  }
  return result;
}
