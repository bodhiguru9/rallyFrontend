import React from 'react';
import { Pressable, Platform } from 'react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { colors, spacing, borderRadius } from '@theme';
import { isToday } from '@utils/date-utils';
import { styles } from './DateOption.styles';

interface DateOptionProps {
  date: Date;
  isSelected: boolean;
  onPress: (date: Date) => void;
}

export const DateOption: React.FC<DateOptionProps> = ({ date, isSelected, onPress }) => {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateNum = date.getDate().toString();
  const isTodayDate = isToday(date);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.dateOption,
        isSelected && styles.dateOptionSelected,
        Platform.OS === 'ios' && pressed && { opacity: 0.7 },
      ]}
      onPress={() => onPress(date)}
      android_ripple={{ color: colors.primary, borderless: false, radius: 20 }}
    >
      <FlexView alignItems="center" gap={spacing.xs}>
        <TextDs size={14} weight="regular" color={isSelected ? 'white' : 'secondary'}>
          {dayOfWeek}
        </TextDs>
        <TextDs size={14} weight="regular" color={isSelected ? 'white' : 'secondary'}>
          •
        </TextDs>
        <FlexView
          width={40}
          height={40}
          borderRadius={borderRadius.full}
          backgroundColor={isSelected ? colors.primary : 'transparent'}
          justifyContent="center"
          alignItems="center"
        >
          <TextDs
            size={14}
            weight="regular"
            color={isSelected ? 'white' : isTodayDate ? 'primary' : 'secondary'}
          >
            {dateNum}
          </TextDs>
        </FlexView>
      </FlexView>
    </Pressable>
  );
};
