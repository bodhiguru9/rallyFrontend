import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { styles } from './style/Seperator.styles';
import type { SeperatorProps } from './Seperator.types';

export const Seperator: React.FC<SeperatorProps> = ({ spacing = 'base', style }) => {
  return <FlexView style={[styles.horizontal, styles[`spacing_${spacing}`], style]} />;
};
