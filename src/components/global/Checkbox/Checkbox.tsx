import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity} from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@theme';
import type { CheckboxProps } from './Checkbox.types';
import { styles } from './style/Checkbox.styles';

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  value,
  onValueChange,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <FlexView style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Check size={16} color={colors.text.white} />}
      </FlexView>
      <TextDs style={styles.label}>{label}</TextDs>
    </TouchableOpacity>
  );
};

