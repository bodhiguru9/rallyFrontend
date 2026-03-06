import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '@theme';
import type { SportDisplayProps } from './SportDisplay.types';
import { styles } from './style/SportDisplay.styles';

export const SportDisplay: React.FC<SportDisplayProps> = ({
  label,
  value,
  onRemove,
  onPress,
}) => {
  return (
    <FlexView style={styles.container}>
      <TextDs style={styles.label}>{label}</TextDs>
      <FlexView style={styles.content}>
        <TouchableOpacity
          style={styles.displayField}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <TextDs style={styles.displayText}>{value}</TextDs>
          <ChevronDown size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <TextDs style={styles.removeButtonText}>Remove</TextDs>
        </TouchableOpacity>
      </FlexView>
    </FlexView>
  );
};

