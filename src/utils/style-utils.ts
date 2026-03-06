import type { ViewStyle, TextStyle, StyleProp } from 'react-native';

/**
 * Filters out falsy values from a style array and returns a type-safe StyleProp.
 * Use when combining conditional styles to fix TS "filter" property conflict
 * between Array.prototype.filter and ViewStyle/TextStyle.
 */
export function viewStyleArray(
  styles: (ViewStyle | false | undefined)[]
): StyleProp<ViewStyle> {
  return styles.filter(Boolean) as ViewStyle[];
}

export function textStyleArray(
  styles: (TextStyle | false | undefined)[]
): StyleProp<TextStyle> {
  return styles.filter(Boolean) as TextStyle[];
}
