import React, { useState, useEffect } from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface CalendarProps {
  value?: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
  visible: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onSelectDate,
  onClose,
  visible,
  maximumDate,
  minimumDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value instanceof Date ? value : new Date());
  const [currentMonth, setCurrentMonth] = useState(
    value instanceof Date ? value.getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    value instanceof Date ? value.getFullYear() : new Date().getFullYear()
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setCurrentMonth(value.getMonth());
      setCurrentYear(value.getFullYear());
    }
  }, [value]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    onSelectDate(newDate);
    onClose();
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    setShowMonthPicker(false);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setShowYearPicker(false);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // If maximumDate is undefined, allow future years (up to 10 years ahead)
    const maxYear = maximumDate ? maximumDate.getFullYear() : currentYear + 10;
    const minYear = minimumDate ? minimumDate.getFullYear() : currentYear - 100;

    for (let i = maxYear; i >= minYear; i--) {
      years.push(i);
    }
    return years;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    // Only check maximumDate if it's provided
    if (maximumDate !== undefined && date > maximumDate) { return true; }
    // Only check minimumDate if it's provided
    if (minimumDate !== undefined && date < minimumDate) { return true; }
    return false;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) { return false; }
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const calendarDays = renderCalendarDays();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <FlexView style={styles.calendarWrapper}>
          <FlexView style={styles.calendarContainer} onStartShouldSetResponder={() => true}>
          {/* Header with Month and Year Selectors */}
          <FlexView style={styles.header}>
            <TouchableOpacity
              onPress={() => setShowMonthPicker(true)}
              style={styles.selectorButton}
              activeOpacity={0.7}
            >
              <TextDs style={styles.selectorText}>{MONTHS[currentMonth]}</TextDs>
              <ChevronDown size={16} color={colors.text.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowYearPicker(true)}
              style={styles.selectorButton}
              activeOpacity={0.7}
            >
              <TextDs style={styles.selectorText}>{currentYear}</TextDs>
              <ChevronDown size={16} color={colors.text.primary} />
            </TouchableOpacity>
          </FlexView>

          {/* Days of Week */}
          <FlexView style={styles.daysOfWeekContainer}>
            {DAYS_OF_WEEK.map((day, index) => (
              <FlexView key={index} style={styles.dayOfWeek}>
                <TextDs style={styles.dayOfWeekText}>{day}</TextDs>
              </FlexView>
            ))}
          </FlexView>

          {/* Calendar Grid */}
          <FlexView style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <FlexView key={index} style={styles.dayCell} />;
              }

              const disabled = isDateDisabled(day);
              const selected = isDateSelected(day);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    selected && styles.dayCellSelected,
                    disabled && styles.dayCellDisabled,
                  ]}
                  onPress={() => !disabled && handleDateSelect(day)}
                  disabled={disabled}
                  activeOpacity={0.7}
                >
                  <TextDs
                    style={[
                      styles.dayText,
                      selected && styles.dayTextSelected,
                      disabled && styles.dayTextDisabled,
                    ]}
                  >
                    {day}
                  </TextDs>
                </TouchableOpacity>
              );
            })}
          </FlexView>

          {/* Month Picker Modal */}
          <Modal
            visible={showMonthPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowMonthPicker(false)}
          >
            <TouchableOpacity
              style={styles.pickerOverlay}
              activeOpacity={1}
              onPress={() => setShowMonthPicker(false)}
            >
              <FlexView
                style={styles.pickerContainer}
                onStartShouldSetResponder={() => true}
              >
                <FlatList
                  data={MONTHS}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        currentMonth === index && styles.pickerItemSelected,
                      ]}
                      onPress={() => handleMonthChange(index)}
                      activeOpacity={0.7}
                    >
                      <TextDs
                        style={[
                          styles.pickerItemText,
                          currentMonth === index && styles.pickerItemTextSelected,
                        ]}
                      >
                        {item}
                      </TextDs>
                      {currentMonth === index && (
                        <Check size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </FlexView>
            </TouchableOpacity>
          </Modal>

          {/* Year Picker Modal */}
          <Modal
            visible={showYearPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowYearPicker(false)}
          >
            <TouchableOpacity
              style={styles.pickerOverlay}
              activeOpacity={1}
              onPress={() => setShowYearPicker(false)}
            >
              <FlexView
                style={styles.pickerContainer}
                onStartShouldSetResponder={() => true}
              >
                <FlatList
                  data={generateYearOptions()}
                  keyExtractor={item => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        currentYear === item && styles.pickerItemSelected,
                      ]}
                      onPress={() => handleYearChange(item)}
                      activeOpacity={0.7}
                    >
                      <TextDs
                        style={[
                          styles.pickerItemText,
                          currentYear === item && styles.pickerItemTextSelected,
                        ]}
                      >
                        {item}
                      </TextDs>
                      {currentYear === item && (
                        <Check size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </FlexView>
            </TouchableOpacity>
          </Modal>
        </FlexView>
        </FlexView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  calendarWrapper: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '85%',
  },
  calendarContainer: {
    experimental_backgroundImage: colors.gradient.mainBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    paddingBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  selectorText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.blueGray,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  dayOfWeek: {
    flex: 1,
    alignItems: 'center',
  },
  dayOfWeekText: {
    ...getFontStyle(10, 'medium'),
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: spacing.lg,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  dayCellSelected: {
    backgroundColor: colors.surface.blueGray,
    borderRadius: borderRadius.full,
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  dayTextSelected: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.white,
  },
  dayTextDisabled: {
    color: colors.text.tertiary,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    width: '70%',
    maxHeight: '60%',
    padding: spacing.md,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  pickerItemSelected: {
    backgroundColor: colors.background.secondary,
  },
  pickerItemText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  pickerItemTextSelected: {
    ...getFontStyle(14, 'medium'),
    color: colors.primary,
  },
});

