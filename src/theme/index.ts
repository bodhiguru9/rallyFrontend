// Design Tokens - Global UI Variables
// Based on Figma design specifications

// Import colors and typography from separate files
export { colors } from './colors';
export { withOpaqueForAndroid } from './color-utils';
export { typography, getFontStyle } from './typography';

// Spacing Scale
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 10,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

// Border Radius
export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Icon Sizes
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Avatar Sizes
export const avatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  xxl: 80,
  xxxl: 96,
};

// Z-Index Scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// Opacity Scale
export const opacity = {
  disabled: 0.4,
  hover: 0.8,
  loading: 0.6,
  overlay: 0.5,
};

// Transition Durations (in milliseconds)
export const transition = {
  fast: 150,
  base: 200,
  slow: 300,
  slower: 500,
};

// Layout
export const layout = {
  maxWidth: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  containerPadding: spacing.base,
  sectionSpacing: spacing.xl,
};

// Export all theme tokens as a single object
export const theme = {
  spacing,
  borderRadius,
  shadows,
  iconSize,
  avatarSize,
  zIndex,
  opacity,
  transition,
  layout,
};

export default theme;
