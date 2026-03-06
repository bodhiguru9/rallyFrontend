import React, { useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { MonthYearPicker } from '@components/private/booking';
import { colors } from '@theme';
import type { ExpiryDateInputProps } from './ExpiryDateInput.types';
import { styles } from './style/ExpiryDateInput.styles';

export const ExpiryDateInput: React.FC<ExpiryDateInputProps> = ({
  label,
  value,
  onSelect,
  containerStyle,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatExpiryDate = (): string => {
    if (!value) {return '';}
    const month = String(value.month + 1).padStart(2, '0');
    const year = String(value.year).slice(-2);
    return `${month}/${year}`;
  };

  const handleSelect = (month: number, year: number) => {
    onSelect(month, year);
    setShowPicker(false);
  };

  return (
    <FlexView style={[styles.container, containerStyle]}>
      <TextDs style={styles.label}>{label}</TextDs>
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <TextDs style={[styles.inputText, !value && styles.placeholder]}>
          {value ? formatExpiryDate() : 'MM/YY'}
        </TextDs>
        <ChevronDown size={16} color={colors.text.secondary} />
      </TouchableOpacity>
      {error && <TextDs style={styles.errorText}>{error}</TextDs>}

      <MonthYearPicker
        visible={showPicker}
        value={value}
        onSelect={handleSelect}
        onClose={() => setShowPicker(false)}
      />
    </FlexView>
  );
};

