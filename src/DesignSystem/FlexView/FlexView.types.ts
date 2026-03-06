import type { ViewStyle, StyleProp, ViewProps } from 'react-native';

export interface FlexViewProps extends Omit<ViewProps, 'style'> {
  children?: React.ReactNode;

  // Flex props
  flex?: number;
  flexDirection?: ViewStyle['flexDirection'];
  row?: boolean;
  column?: boolean;
  justifyContent?: ViewStyle['justifyContent'];
  alignItems?: ViewStyle['alignItems'];
  alignSelf?: ViewStyle['alignSelf'];
  flexWrap?: ViewStyle['flexWrap'];
  gap?: number;
  rowGap?: number;
  columnGap?: number;

  // Dimensions
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  isFullWidth?: boolean;
  isFullHeight?: boolean;
  minWidth?: ViewStyle['minWidth'];
  maxWidth?: ViewStyle['maxWidth'];
  minHeight?: ViewStyle['minHeight'];
  maxHeight?: ViewStyle['maxHeight'];
  aspectRatio?: ViewStyle['aspectRatio'];

  // Padding (all sides)
  padding?: number;
  p?: number; // shorthand for padding

  // Padding (directional)
  paddingHorizontal?: number;
  px?: number; // shorthand for paddingHorizontal
  paddingVertical?: number;
  py?: number; // shorthand for paddingVertical
  paddingTop?: number;
  pt?: number; // shorthand for paddingTop
  paddingBottom?: number;
  pb?: number; // shorthand for paddingBottom
  paddingLeft?: number;
  pl?: number; // shorthand for paddingLeft
  paddingRight?: number;
  pr?: number; // shorthand for paddingRight

  // Margin (all sides)
  margin?: number;
  m?: number; // shorthand for margin

  // Margin (directional)
  marginHorizontal?: number;
  mx?: number; // shorthand for marginHorizontal
  marginVertical?: number;
  my?: number; // shorthand for marginVertical
  marginTop?: number;
  mt?: number; // shorthand for marginTop
  marginBottom?: number;
  mb?: number; // shorthand for marginBottom
  marginLeft?: number;
  ml?: number; // shorthand for marginLeft
  marginRight?: number;
  mr?: number; // shorthand for marginRight

  // Background
  backgroundColor?: string;
  bg?: string; // shorthand for backgroundColor
  glassBg?: boolean;

  // Backdrop blur (expo-blur)
  backdropBlur?: boolean;
  blurIntensity?: number; // 0–100, default 50
  blurTint?: 'light' | 'dark' | 'default';

  // Border
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  rounded?: boolean;
  borderWhite?: boolean;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;

  // Position
  position?: ViewStyle['position'];
  top?: ViewStyle['top'];
  bottom?: ViewStyle['bottom'];
  left?: ViewStyle['left'];
  right?: ViewStyle['right'];
  zIndex?: ViewStyle['zIndex'];

  // Overflow
  overflow?: ViewStyle['overflow'];

  // Opacity
  opacity?: number;

  // Shadow (iOS)
  shadowColor?: string;
  shadowOffset?: ViewStyle['shadowOffset'];
  shadowOpacity?: number;
  shadowRadius?: number;

  // Elevation (Android)
  elevation?: number;

  // Box Shadow (CSS-style for web/compatible libraries)
  boxShadow?: string;

  // Additional styles
  style?: StyleProp<ViewStyle>;

  // Accessibility
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;

  // Animations
  animation?: 'none' | 'fade-up' | 'fade-down' | 'appear';
  animationDuration?: number; // in milliseconds, default 300
  animationDelay?: number; // in milliseconds, default 0
}
