import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import type { BackdropBlurProps } from './BackdropBlur.types';

export const BackdropBlur: React.FC<BackdropBlurProps> = ({
  children,
  // Expo Blur props
  intensity = 50,
  tint = 'default',
  experimentalBlurMethod,
  // Flex props
  flex,
  flexDirection,
  justifyContent,
  alignItems,
  alignSelf,
  flexWrap,
  gap,
  rowGap,
  columnGap,
  // Dimensions
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  aspectRatio,
  // Padding
  padding,
  p,
  paddingHorizontal,
  px,
  paddingVertical,
  py,
  paddingTop,
  pt,
  paddingBottom,
  pb,
  paddingLeft,
  pl,
  paddingRight,
  pr,
  // Margin
  margin,
  m,
  marginHorizontal,
  mx,
  marginVertical,
  my,
  marginTop,
  mt,
  marginBottom,
  mb,
  marginLeft,
  ml,
  marginRight,
  mr,
  // Background
  backgroundColor,
  bg,
  // Border
  borderWidth,
  borderColor,
  borderRadius,
  borderTopWidth,
  borderBottomWidth,
  borderLeftWidth,
  borderRightWidth,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  // Position
  position,
  top,
  bottom,
  left,
  right,
  zIndex,
  // Overflow
  overflow,
  // Opacity
  opacity,
  // Shadow (iOS)
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
  // Elevation (Android)
  elevation,
  // Box Shadow
  boxShadow,
  // Additional styles
  style,
  // Accessibility
  accessible,
  accessibilityLabel,
  testID,
}) => {
  const dynamicStyles = StyleSheet.create({
    container: {
      // Flex
      ...(flex !== undefined && { flex }),
      ...(flexDirection && { flexDirection }),
      ...(justifyContent && { justifyContent }),
      ...(alignItems && { alignItems }),
      ...(alignSelf && { alignSelf }),
      ...(flexWrap && { flexWrap }),
      ...(gap !== undefined && { gap }),
      ...(rowGap !== undefined && { rowGap }),
      ...(columnGap !== undefined && { columnGap }),
      // Dimensions
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(minWidth !== undefined && { minWidth }),
      ...(maxWidth !== undefined && { maxWidth }),
      ...(minHeight !== undefined && { minHeight }),
      ...(maxHeight !== undefined && { maxHeight }),
      ...(aspectRatio !== undefined && { aspectRatio }),
      // Padding (shorthands take precedence)
      ...(padding !== undefined && { padding }),
      ...(p !== undefined && { padding: p }),
      ...(paddingHorizontal !== undefined && { paddingHorizontal }),
      ...(px !== undefined && { paddingHorizontal: px }),
      ...(paddingVertical !== undefined && { paddingVertical }),
      ...(py !== undefined && { paddingVertical: py }),
      ...(paddingTop !== undefined && { paddingTop }),
      ...(pt !== undefined && { paddingTop: pt }),
      ...(paddingBottom !== undefined && { paddingBottom }),
      ...(pb !== undefined && { paddingBottom: pb }),
      ...(paddingLeft !== undefined && { paddingLeft }),
      ...(pl !== undefined && { paddingLeft: pl }),
      ...(paddingRight !== undefined && { paddingRight }),
      ...(pr !== undefined && { paddingRight: pr }),
      // Margin (shorthands take precedence)
      ...(margin !== undefined && { margin }),
      ...(m !== undefined && { margin: m }),
      ...(marginHorizontal !== undefined && { marginHorizontal }),
      ...(mx !== undefined && { marginHorizontal: mx }),
      ...(marginVertical !== undefined && { marginVertical }),
      ...(my !== undefined && { marginVertical: my }),
      ...(marginTop !== undefined && { marginTop }),
      ...(mt !== undefined && { marginTop: mt }),
      ...(marginBottom !== undefined && { marginBottom }),
      ...(mb !== undefined && { marginBottom: mb }),
      ...(marginLeft !== undefined && { marginLeft }),
      ...(ml !== undefined && { marginLeft: ml }),
      ...(marginRight !== undefined && { marginRight }),
      ...(mr !== undefined && { marginRight: mr }),
      // Background
      ...(backgroundColor && { backgroundColor }),
      ...(bg && { backgroundColor: bg }),
      // Border
      ...(borderWidth !== undefined && { borderWidth }),
      ...(borderColor && { borderColor }),
      ...(borderRadius !== undefined && { borderRadius }),
      ...(borderTopWidth !== undefined && { borderTopWidth }),
      ...(borderBottomWidth !== undefined && { borderBottomWidth }),
      ...(borderLeftWidth !== undefined && { borderLeftWidth }),
      ...(borderRightWidth !== undefined && { borderRightWidth }),
      ...(borderTopLeftRadius !== undefined && { borderTopLeftRadius }),
      ...(borderTopRightRadius !== undefined && { borderTopRightRadius }),
      ...(borderBottomLeftRadius !== undefined && { borderBottomLeftRadius }),
      ...(borderBottomRightRadius !== undefined && {
        borderBottomRightRadius,
      }),
      // Position
      ...(position && { position }),
      ...(top !== undefined && { top }),
      ...(bottom !== undefined && { bottom }),
      ...(left !== undefined && { left }),
      ...(right !== undefined && { right }),
      ...(zIndex !== undefined && { zIndex }),
      // Overflow
      ...(overflow && { overflow }),
      // Opacity
      ...(opacity !== undefined && { opacity }),
      // Shadow (iOS)
      ...(shadowColor && { shadowColor }),
      ...(shadowOffset && { shadowOffset }),
      ...(shadowOpacity !== undefined && { shadowOpacity }),
      ...(shadowRadius !== undefined && { shadowRadius }),
      // Elevation (Android)
      ...(elevation !== undefined && { elevation }),
      // Box Shadow
      ...(boxShadow && { boxShadow }),
    },
  });

  if (Platform.OS === 'android') {
    return (
      <View
        style={[dynamicStyles.container, style]}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[dynamicStyles.container, style]}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </BlurView>
  );
};
