import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { Calendar } from '../Calendar';
import { IDateInputProps } from './DateInput.types';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';

export const DateInput: React.FC<IDateInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  // mode = 'date',
  format = 'DD/MM/YYYY',
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

  const handlePress = () => {
    setShowCalendar(true);
  };

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setShowCalendar(false);
  };

  return (
    <FlexView gap={spacing.sm}>
      {label && <TextDs size={14} weight="medium">{label}</TextDs>}
      <FlexView style={[
        styles.inputContainer,
        ...(error ? [styles.inputError] : []),
      ]}>
        <TouchableOpacity
          onPress={handlePress}
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

      <Calendar
        visible={showCalendar}
        value={value}
        onSelectDate={handleDateSelect}
        onClose={() => setShowCalendar(false)}
        maximumDate={new Date()}
      />
    </FlexView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.white,
    gap: spacing.sm,
    flex: 1,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  rightIconContainer: {
    position: 'absolute',
    right: spacing.base,
    zIndex: 1,
  },
  dateButton: {
    flex: 1,
    paddingRight: spacing.xl + spacing.sm,
  },
  dateText: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.primary,
  },
  dateTextPlaceholder: {
    color: colors.text.tertiary,
  },
  errorText: {
    ...getFontStyle(8, 'regular'),
    color: colors.status.error,
    marginTop: spacing.xs,
  },
});
