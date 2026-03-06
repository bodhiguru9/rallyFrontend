import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface BottomSheetModalProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;

  /**
   * Callback when the bottom sheet is closed
   */
  onClose: () => void;

  /**
   * Content to render inside the bottom sheet
   */
  children: ReactNode;

  /**
   * Snap points for the bottom sheet (e.g., ['25%', '50%', '90%']) or pixel height.
   * Defaults to ['90%']
   */
  snapPoints?: (string | number)[];

  /**
   * Initial snap index (defaults to 0)
   */
  initialSnapIndex?: number;

  /**
   * Enable backdrop (defaults to true)
   */
  enableBackdrop?: boolean;

  /**
   * Backdrop opacity (defaults to 0.5)
   */
  backdropOpacity?: number;

  /**
   * Enable pan down to close (defaults to true)
   */
  enablePanDownToClose?: boolean;

  /**
   * Custom style for the bottom sheet container
   */
  containerStyle?: ViewStyle;

  /**
   * Custom style for the content container
   */
  contentContainerStyle?: ViewStyle;

  /**
   * Show handle indicator (defaults to true)
   */
  showHandleIndicator?: boolean;

  /**
   * Handle indicator style
   */
  handleIndicatorStyle?: ViewStyle;

  /**
   * Background style
   */
  backgroundStyle?: ViewStyle;

  /**
   * Custom keyboard behavior
   */
  keyboardBehavior?: 'padding' | 'height' | 'position';

  /**
   * Enable keyboard dismiss on drag (defaults to false)
   */
  enableDismissOnClose?: boolean;

  /**
   * Callback when the sheet changes position
   */
  onChange?: (index: number) => void;
}
