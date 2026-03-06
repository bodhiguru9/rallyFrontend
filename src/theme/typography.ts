// Typography - Font families, sizes, weights, and spacing
// Based on Figma design specifications

export const typography = {
  // Font Families
  fontFamily: {
    primary: 'Roboto', // Primary font for most UI text
    secondary: 'Noto Sans', // Secondary font for special text
    system: 'System', // Fallback to system font
  },

  // Font Sizes (numeric scale: 6, 8, 10, 12, 14, 16, 20)
  fontSize: {
    6: 6,
    8: 8,
    10: 10,
    12: 12,
    14: 14,
    16: 16,
    18: 18,
    20: 20,
  },

  // Font Weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Helper function to get font style
export const getFontStyle = (
  size: keyof typeof typography.fontSize = 14,
  weight: keyof typeof typography.fontWeight = 'regular',
  family: keyof typeof typography.fontFamily = 'primary',
) => {
  let fontFamily = typography.fontFamily[family];

  // Map weight to specific font files
  if (family === 'primary') {
    // Roboto
    if (weight === 'bold') {
      fontFamily = 'Roboto-Bold';
    } else if (weight === 'medium' || weight === 'semibold') {
      fontFamily = 'Roboto-Medium';
    } else {
      fontFamily = 'Roboto-Regular';
    }
  } else if (family === 'secondary') {
    // Noto Sans
    if (weight === 'bold') {
      fontFamily = 'NotoSans-Bold';
    } else if (weight === 'semibold') {
      fontFamily = 'NotoSans-SemiBold';
    } else if (weight === 'medium') {
      fontFamily = 'NotoSans-Medium';
    } else {
      fontFamily = 'NotoSans-Regular';
    }
  }

  return {
    fontFamily,
    fontSize: typography.fontSize[size],
    fontWeight: typography.fontWeight[weight],
  };
};
