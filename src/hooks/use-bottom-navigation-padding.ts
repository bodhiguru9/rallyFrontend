import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@theme';

/**
 * Hook to calculate bottom padding for scrollable content
 * to avoid overlap with the bottom navigation bar.
 * 
 * This accounts for:
 * - Bottom navigation bar height
 * - Safe area insets (Android button navigation bar)
 * 
 * @param additionalPadding - Additional padding to add (default: 0)
 * @returns Bottom padding value in pixels
 * 
 * @example
 * ```tsx
 * const bottomPadding = useBottomNavigationPadding();
 * 
 * <ScrollView 
 *   contentContainerStyle={{ paddingBottom: bottomPadding }}
 * >
 *   {content}
 * </ScrollView>
 * ```
 */
export const useBottomNavigationPadding = (additionalPadding: number = 0): number => {
  const insets = useSafeAreaInsets();
  
  // Bottom navigation height calculation:
  // - Content padding: spacing.xxl (32px)
  // - Content height: ~62px (button height + padding)
  // - Total: ~94px base + safe area inset
  const bottomNavHeight = spacing.xxl + 62; // Base height of bottom nav
  const totalPadding = bottomNavHeight + insets.bottom + additionalPadding;
  
  return totalPadding;
};
