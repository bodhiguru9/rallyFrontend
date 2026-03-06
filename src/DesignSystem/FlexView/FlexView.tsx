import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, borderRadius as borderRadiusTokens } from '../../theme';
import type { FlexViewProps } from './FlexView.types';

export const FlexView: React.FC<FlexViewProps> = ({
  children,
  // Flex props
  flex,
  flexDirection,
  row,
  column,
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
  isFullWidth,
  isFullHeight,
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
  glassBg,
  // Backdrop blur
  backdropBlur,
  blurIntensity = 50,
  blurTint = 'default',
  // Border
  borderWidth,
  borderColor,
  borderRadius,
  rounded,
  borderWhite,
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
  // Animations
  animation = 'none',
  animationDuration = 300,
  animationDelay = 0,
}) => {
  // Animation values - useMemo to create once and avoid recreating
  const fadeAnim = useMemo(() => new Animated.Value(animation === 'none' ? 1 : 0), [animation]);
  const translateYAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (animation === 'none') {
      return;
    }

    // Reset values
    fadeAnim.setValue(0);

    // Set initial values based on animation type
    if (animation === 'fade-up') {
      translateYAnim.setValue(20);
    } else if (animation === 'fade-down') {
      translateYAnim.setValue(-20);
    } else {
      translateYAnim.setValue(0);
    }

    // Start animation
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }, animationDelay);

    return () => clearTimeout(timeout);
  }, [animation, animationDuration, animationDelay, fadeAnim, translateYAnim]);
  const dynamicStyles = StyleSheet.create({
    container: {
      // Flex
      ...(flex !== undefined && { flex }),
      ...(row && { flexDirection: 'row' }),
      ...(column && { flexDirection: 'column' }),
      ...(!row && !column && flexDirection && { flexDirection }),
      ...(justifyContent && { justifyContent }),
      ...(alignItems && { alignItems }),
      ...(alignSelf && { alignSelf }),
      ...(flexWrap && { flexWrap }),
      ...(gap !== undefined && { gap }),
      ...(rowGap !== undefined && { rowGap }),
      ...(columnGap !== undefined && { columnGap }),
      // Dimensions
      ...(isFullWidth && { width: '100%' }),
      ...(!isFullWidth && width !== undefined && { width }),
      ...(isFullHeight && { height: '100%' }),
      ...(!isFullHeight && height !== undefined && { height }),
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
      ...(glassBg && { backgroundColor: colors.glass.background.white }),
      ...(!glassBg && backgroundColor && { backgroundColor }),
      ...(!glassBg && bg && { backgroundColor: bg }),
      // Border
      ...(borderWhite && { borderWidth: 1, borderColor: colors.border.white }),
      ...(!borderWhite && borderWidth !== undefined && { borderWidth }),
      ...(!borderWhite && borderColor && { borderColor }),
      ...(rounded && { borderRadius: borderRadiusTokens.full }),
      ...(!rounded && borderRadius !== undefined && { borderRadius }),
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

  // Determine which component to use based on animation
  const Component = animation === 'none' ? View : Animated.View;

  // Animation styles
  const animatedStyle =
    animation !== 'none'
      ? {
        opacity: fadeAnim,
        transform: [{ translateY: translateYAnim }],
      }
      : {};

  const containerStyle = [dynamicStyles.container, style];
  const content = backdropBlur ? (
    Platform.OS === 'android' ? (
      <View style={containerStyle}>{children}</View>
    ) : (
      <BlurView
        intensity={blurIntensity}
        tint={blurTint}
        style={containerStyle}
      >
        {children}
      </BlurView>
    )
  ) : (
    children
  );

  return (
    <Component
      style={
        backdropBlur
          ? [dynamicStyles.container, animatedStyle]
          : [dynamicStyles.container, animatedStyle, style]
      }
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {content}
    </Component>
  );
};
