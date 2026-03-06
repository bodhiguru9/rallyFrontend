import React, { useMemo } from 'react';
import { FlexView } from '@components';
import {ScrollView} from 'react-native';
import { DateOption } from '../DateOption';
import { styles } from './DatePicker.styles';

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect }) => {
  // Generate dates for date picker (7 days before and after current date)
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
          const isSelected = date.toDateString() === selectedDate.toDateString();
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
