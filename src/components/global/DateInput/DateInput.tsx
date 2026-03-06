import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { colors, spacing } from '@theme';
import { Calendar } from '../../private/sign-up/profile-setup/Calendar';
import type { DateInputProps } from './DateInput.types';
import { styles } from './style/DateInput.styles';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';

export const DateInput: React.FC<DateInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  containerStyle,
  error,
  format = 'DD/MM/YYYY',
  leftIcon,
  maximumDate,
  minimumDate,
  allowFutureDates = false,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date: Date): string => {
    if (format === 'MM/YYYY') {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${year}`;
    } else if (format === 'DD/MM/YYYY') {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  };

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setShowCalendar(false);
  };

  return (
    <FlexView gap={spacing.sm} style={containerStyle}>
      {label && <TextDs size={14} weight="medium">{label}</TextDs>}
      <FlexView style={[
        styles.inputContainer,
        ...(error ? [styles.inputError] : []),
      ]}>
        {leftIcon && <FlexView style={styles.leftIconContainer}>{leftIcon}</FlexView>}
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={styles.dateButton}
          activeOpacity={0.7}
        >
          <TextDs style={[styles.dateText, !value && styles.dateTextPlaceholder]}>
            {value ? formatDate(value) : placeholder}
          </TextDs>
        </TouchableOpacity>
        <FlexView style={styles.rightIconContainer}>
          <CalendarIcon size={20} color={colors.text.secondary} />
        </FlexView>
      </FlexView>
      {error && <TextDs style={styles.errorText}>{error}</TextDs>}

      {showCalendar && (
        <Calendar
          visible={showCalendar}
          value={value instanceof Date ? value : undefined}
          onSelectDate={handleDateSelect}
          onClose={() => setShowCalendar(false)}
          maximumDate={maximumDate !== undefined ? maximumDate : (allowFutureDates ? undefined : new Date())}
          minimumDate={minimumDate}
        />
      )}
    </FlexView>
  );
};
