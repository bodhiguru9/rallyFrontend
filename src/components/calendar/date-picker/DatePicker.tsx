import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { FlexView } from '@components';
import { DateOption } from '../date-option';
import { styles } from './DatePicker.styles';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect }) => {
  const dateOptions = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = -7; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  return (
    <FlexView style={styles.datePickerWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datePickerContainer}
      >
        {dateOptions.map((date, index) => {
          const isSelected = selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
          return (
            <DateOption
              key={index}
              date={date}
              isSelected={isSelected}
              onPress={onDateSelect}
            />
          );
        })}
      </ScrollView>
    </FlexView>
  );
};
