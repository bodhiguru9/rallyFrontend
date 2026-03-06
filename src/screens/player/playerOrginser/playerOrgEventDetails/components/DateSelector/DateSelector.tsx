import React from 'react';
import { TextDs,  FlexView } from '@components';
import {Pressable, Platform, ScrollView, StyleSheet} from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface DateItem {
  date: number;
  day: string;
  isSelected: boolean;
}

interface DateSelectorProps {
  month: string;
  dates: DateItem[];
  onDateSelect: (date: number) => void;
  onCalendarPress: () => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  month,
  dates,
  onDateSelect,
  onCalendarPress,
}) => {
  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.header}>
        <TextDs style={styles.monthText}>Date • {month}</TextDs>
        <Pressable
          style={({ pressed }) => [
            styles.calendarButton,
            Platform.OS === 'ios' && pressed && { opacity: 0.7 },
          ]}
          onPress={onCalendarPress}
          android_ripple={{ color: `${colors.primary  }30`, borderless: false }}
        >
          <TextDs style={styles.calendarButtonText}>Calendar</TextDs>
        </Pressable>
      </FlexView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesContainer}
        nestedScrollEnabled={true}
      >
        {dates.map((item) => (
          <Pressable
            key={item.date}
            style={({ pressed }) => [
              styles.dateButton,
              item.isSelected && styles.dateButtonSelected,
              Platform.OS === 'ios' && pressed && { opacity: 0.7 },
            ]}
            onPress={() => onDateSelect(item.date)}
            android_ripple={{
              color: item.isSelected ? `${colors.primary  }80` : `${colors.primary  }30`,
              borderless: false,
              radius: 25,
            }}
          >
            <TextDs style={[styles.dateText, item.isSelected && styles.dateTextSelected]}>
              {item.date}
            </TextDs>
            <TextDs style={[styles.dayText, item.isSelected && styles.dayTextSelected]}>
              {item.day}
            </TextDs>
          </Pressable>
        ))}
      </ScrollView>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  calendarButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.md,
  },
  calendarButtonText: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
  },
  datesContainer: {
    gap: spacing.sm,
  },
  dateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  dateButtonSelected: {
    backgroundColor: colors.primary,
  },
  dateText: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.secondary,
  },
  dateTextSelected: {
    color: colors.text.white,
  },
  dayText: {
    ...getFontStyle(6, 'regular'),
    color: colors.text.tertiary,
    marginTop: 2,
  },
  dayTextSelected: {
    color: colors.text.white,
  },
});
