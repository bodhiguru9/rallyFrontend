// Color Palette - All color tokens for the application
// Based on Figma design specifications

import { Platform } from 'react-native';
import { makeOpaqueForAndroid } from './color-utils';

const baseColors = {
  // Primary Brand Colors
  primary: '#5B7C99', // Blue-gray (used in header, active states)
  primaryLight: 'rgba(61, 111, 146, 0.5)',
  primaryDark: 'rgba(61, 111, 146, 0.7)',
  red: '#FF0000',
  buttonBackground: 'rgba(61, 111, 146, 0.50)',
  greenbutton: 'rgba(40, 161, 44, 0.50)',

  card: {
    primary: 'rgba(255, 253, 239, 0.50)',
  },

  gradient: {
    main: '#DDF5F4', // Light teal-green for calendar background
    mainBackground: 'linear-gradient(182deg, #DDF5F4 0.14%, #E9FBE8 98.35%)',
    blueRadial:
      'radial-gradient(80.6% 80.6% at 36.38% 24.47%, rgba(61, 111, 146, 0.70) 0%, rgba(180, 223, 234, 0.70) 50%, rgba(10, 117, 136, 0.70) 100%)',
  },

  glass: {
    background: {
      white: 'rgba(255, 253, 239, 0.50)',
    },
    boxShadow: {
      white: 'inset 3px 4px 5px -1px rgba(225,225,225,0.83)',
      light: 'inset 2px 2px 5px -1px rgba(225,225,225,0.83)',
    },
  },

  boxShadow: {
    lowRaised: '0px 4px 10px 1px rgba(0,0,0,0.50)',
    midRaised: '0px 4px 10px 1px rgba(0,0,0,0.75)',
    highRaised: '0px 6px 14px 1px rgba(0,0,0,0.75)',

    blue: '0 0 20px 0 rgba(61, 111, 146, 0.70)',
  },

  // Secondary Colors
  secondary: '#4ECDC4', // Teal
  accent: '#FF6B35', // Orange

  // Background Colors
  background: {
    primary: '#FEFDFB', // Main cream white background
    secondary: '#F7F6F3', // Light beige for sections
    tertiary: '#F5F5DC', // Beige
    light: '#FAFAF0', // Light cream
    cream: '#FFFCF5', // Cream for event cards
    lightYellow: '#FFF9E6', // Very light yellow for alternating sections
    white: '#FFFFFF', // Pure white for cards
  },

  // Surface Colors
  surface: {
    default: 'rgba(221, 245, 244, 0.40)',
    defaultNP: 'rgba(221, 245, 244, 1)',
    background: 'rgba(221, 245, 244, 1)',
    elevated: '#FFFFFF',
    blueGray: '#3D6F92',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradient: 'linear-gradient(180deg, #FEFDFB 0%, #FFF9E6 100%)',
    mainGradient: 'linear-gradient(182deg, #DDF5F4 0.14%, #E9FBE8 98.35%)',
    card: 'rgba(255, 253, 239, 0.50)',
  },

  // Text Colors
  text: {
    primary: '#000000',

    secondary: '#656565',
    tertiary: '#999999',
    light: '#CCCCCC',
    white: '#FFFFFF',
    'off-white': '#D9D9D9',
    inverse: '#FFFFFF',
    blueGray: '#3D6F92',
  },

  // Border Colors
  border: {
    default: '#E0E0E0',
    light: '#F0F0F0',
    white: '#ffffff',
    medium: '#CCCCCC',
    dark: '#999999',
  },

  // Status Colors
  status: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },

  // Category Badge Colors
  badge: {
    sports: {
      background: '#FEF3E7',
      text: '#FF6B35',
      border: '#FFE5D1',
    },
    social: {
      background: '#E0F7F5',
      text: '#4ECDC4',
      border: '#C7F0EC',
    },
    music: {
      background: '#F4E8FB',
      text: '#9B59B6',
      border: '#E8D4F4',
    },
    food: {
      background: '#FEF5E7',
      text: '#F39C12',
      border: '#FDEACC',
    },
    padel: {
      background: '#FEF3E7',
      text: '#FF6B35',
      border: '#FFE5D1',
    },
    tennis: {
      background: '#FEF5E7',
      text: '#F39C12',
      border: '#FDEACC',
    },
    basketball: {
      background: '#FFE8E8',
      text: '#E74C3C',
      border: '#FFD5D5',
    },
    class: {
      background: '#E3F2FD',
      text: '#2196F3',
      border: '#BBDEFB',
    },
    tournament: {
      background: '#F3E5F5',
      text: '#9C27B0',
      border: '#E1BEE7',
    },
  },

  // Interactive States
  interactive: {
    hover: 'rgba(91, 124, 153, 0.08)',
    pressed: 'rgba(91, 124, 153, 0.12)',
    focus: 'rgba(91, 124, 153, 0.16)',
    disabled: '#E0E0E0',
  },

  // Verified Badge
  verified: {
    background: '#EC4899',
    text: '#FFFFFF',
  },

  // Button Colors
  button: {
    primary: {
      background: '#5B7C99',
      text: '#FFFFFF',
      border: '#5B7C99',
    },
    secondary: {
      background: '#FFFFFF',
      text: '#5B7C99',
      border: '#E0E0E0',
    },
    ghost: {
      background: 'transparent',
      text: '#5B7C99',
      border: 'transparent',
    },
    cancel: {
      background: 'rgba(211, 85, 85, 0.20)',
      text: '#D35555',
    },
  },
};

export const colors =
  Platform.OS === 'android'
    ? (makeOpaqueForAndroid(baseColors, '#FEFDFB') as typeof baseColors)
    : baseColors;
