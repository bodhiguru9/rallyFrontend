import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { borderRadius, colors } from '@theme';
import type { ArrowIconProps } from './ArrowIcon.types';

const sizeMap = {
  small: 18,
  default: 24,
  large: 32,
};

export const ArrowIcon: React.FC<ArrowIconProps> = ({ variant, onClick, size = 'default' }) => {
  const IconComponent = variant === 'left' ? ChevronLeft : ChevronRight;
  const iconSize = sizeMap[size];

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primaryDark,
      borderRadius: borderRadius.full,
      width: sizeMap[size] + 4,
      aspectRatio: 1 / 1,
      boxSizing: 'border-box'
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onClick} activeOpacity={0.7}>
      <IconComponent size={iconSize} color="white" />
    </TouchableOpacity>
  );
};
