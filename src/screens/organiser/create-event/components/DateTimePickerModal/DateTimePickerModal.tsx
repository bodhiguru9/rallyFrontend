import React, { useState, useEffect, useRef, startTransition } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { colors } from '@theme';
import { TimePicker, type TimeValue } from '@designSystem/molecules/time-picker';
import { FrequencyModal } from '../FrequencyModal';
import { formValueToFrequency, getFrequencyDisplayLabel } from './frequencyUtils';
import type { DateTimePickerModalProps, TimeSelection } from './DateTimePickerModal.types';
import { styles } from './style/DateTimePickerModal.styles';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react-native';
import { FlexView, TextDs } from '@components';
import type { FrequencySelection } from '../FrequencyModal';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const PICKER_MINUTES = [0, 15, 30, 45];

const getDefaultTimes = (): { start: TimeSelection; end: TimeSelection } => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const roundedMinute =
    PICKER_MINUTES.reduce((prev, curr) =>
      Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev,
    );
  const start: TimeSelection = { hour, minute: roundedMinute };
  const endDate = new Date(now);
  endDate.setHours(hour + 1, roundedMinute, 0, 0);
  const end: TimeSelection = {
    hour: endDate.getHours(),
    minute: roundedMinute,
  };
  return { start, end };
};

export const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialDate,
  initialStartTime,
  initialEndTime,
  initialFrequency,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(
    initialDate?.getMonth() ?? new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(
    initialDate?.getFullYear() ?? new Date().getFullYear(),
  );
  const [startTime, setStartTime] = useState<TimeSelection>(() => {
    const d = getDefaultTimes();
    return initialStartTime || d.start;
  });
  const [endTime, setEndTime] = useState<TimeSelection>(() => {
    const d = getDefaultTimes();
    return initialEndTime || d.end;
  });

  // Ensure minutes match picker values (0, 10, 20, 30, 40, 50)
  const normalizeTime = (time: TimeSelection): TimeValue => {
    const minute = PICKER_MINUTES.includes(time.minute) ? time.minute : 0;
    return { hour: time.hour, minute, period: 'AM' };
  };

  const startTimeValue: TimeValue = normalizeTime(startTime);
  const endTimeValue: TimeValue = normalizeTime(endTime);

  const handleStartTimeChange = (value: TimeValue) => {
    setStartTime({ hour: value.hour, minute: value.minute });
  };

  const handleEndTimeChange = (value: TimeValue) => {
    setEndTime({ hour: value.hour, minute: value.minute });
  };
  const parsedFrequency = formValueToFrequency(initialFrequency);
  const [frequency, setFrequency] = useState<FrequencySelection>(
    parsedFrequency ?? { type: 'never', ends: 'never' },
  );
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);

  // Track previous initialDate to sync only when it actually changes
  const prevInitialDateRef = useRef<Date | undefined>(initialDate);

  // Sync state when initialDate prop changes (only when modal is visible)
  useEffect(() => {
    if (
      visible &&
      initialDate &&
      (!prevInitialDateRef.current ||
        initialDate.getTime() !== prevInitialDateRef.current.getTime())
    ) {
      prevInitialDateRef.current = initialDate;
      // Use startTransition to mark state updates as non-urgent
      startTransition(() => {
        setSelectedDate(initialDate);
        setCurrentMonth(initialDate.getMonth());
        setCurrentYear(initialDate.getFullYear());
      });
    }
  }, [visible, initialDate]);

  useEffect(() => {
    if (!visible) return;
    const parsed = formValueToFrequency(initialFrequency);
    setFrequency(parsed ?? { type: 'never', ends: 'never' });
  }, [visible, initialFrequency]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startTime.hour, startTime.minute, 0, 0);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endTime.hour, endTime.minute, 0, 0);

    onConfirm(startDateTime, endDateTime, frequency.type === 'never' ? undefined : frequency);
    onClose();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];

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

  const isDateSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const calendarDays = renderCalendarDays();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <FlexView style={styles.overlay} justifyContent="center" alignItems="center">
        <FlexView style={styles.modalContainer}>
          <FlexView style={styles.contentContainer}>
            {/* Date Picker Section */}
            <FlexView style={styles.dateSection}>
              {/* Month/Year Header with Navigation */}
              <FlexView style={styles.dateHeader}>
                <TextDs size={14} weight="regular">
                  {MONTHS[currentMonth]} {currentYear}
                </TextDs>
                <FlexView flexDirection='row' alignItems='center' >
                  <TouchableOpacity
                    onPress={handlePreviousMonth}
                    style={styles.monthNavigationButton}
                    activeOpacity={0.7}
                  >
                    <ChevronLeft size={24} color={colors.text.blueGray} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNextMonth}
                    style={styles.monthNavigationButton}
                    activeOpacity={0.7}
                  >
                    <ChevronRight size={24} color={colors.text.blueGray} />
                  </TouchableOpacity>
                </FlexView>
              </FlexView>

              {/* Days of Week */}
              <FlexView style={styles.daysOfWeekContainer}>
                {DAYS_OF_WEEK.map((day, index) => (
                  <FlexView key={index} style={styles.dayOfWeek}>
                    <TextDs size={14} weight="regular">{day}</TextDs>
                  </FlexView>
                ))}
              </FlexView>

              {/* Calendar Grid */}
              <FlexView style={styles.calendarGrid}>
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <FlexView key={index} style={styles.dayCell} />;
                  }

                  const selected = isDateSelected(day);

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.dayCell, selected && styles.dayCellSelected]}
                      onPress={() => handleDateSelect(day)}
                      activeOpacity={0.7}
                    >
                      <TextDs style={[styles.dayText, selected && styles.dayTextSelected]}>
                        {day}
                      </TextDs>
                    </TouchableOpacity>
                  );
                })}
              </FlexView>
            </FlexView>

            {/* Start & End Time Section */}
            <FlexView style={styles.timeSection}>
              <TextDs style={styles.timeSectionTitle}>Start & End Time</TextDs>
              <FlexView style={styles.timeInputContainer}>
                <TimePicker
                  value={startTimeValue}
                  onChange={handleStartTimeChange}
                  containerStyle={styles.timeInput}
                  use24Hour
                />
                <FlexView style={styles.timeSeparatorContainer}>
                  <TextDs size={14} weight="regular">:</TextDs>
                </FlexView>
                <TimePicker
                  value={endTimeValue}
                  onChange={handleEndTimeChange}
                  containerStyle={styles.timeInput}
                  use24Hour
                />
              </FlexView>
            </FlexView>

            {/* Frequency Section */}
            <FlexView style={styles.frequencySection}>
              <TextDs style={styles.frequencyTitle}>Frequency</TextDs>
              <TouchableOpacity
                style={styles.frequencyTrigger}
                onPress={() => setShowFrequencyModal(true)}
                activeOpacity={0.7}
              >
                <TextDs
                  style={[
                    styles.frequencyTriggerText,
                    frequency.type === 'never' && styles.frequencyPlaceholderText,
                  ]}
                >
                  {getFrequencyDisplayLabel(frequency)}
                </TextDs>
                <ChevronDown size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </FlexView>

            <FrequencyModal
              visible={showFrequencyModal}
              onClose={() => setShowFrequencyModal(false)}
              onConfirm={(selection) => setFrequency(selection)}
              initialFrequency={frequency}
            />

            {/* Action Buttons */}
            <FlexView style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
                <TextDs style={styles.cancelButtonText}>Cancel</TextDs>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <TextDs style={styles.confirmButtonText}>Confirm</TextDs>
              </TouchableOpacity>
            </FlexView>
          </FlexView>
        </FlexView>
      </FlexView>
    </Modal>
  );
};
