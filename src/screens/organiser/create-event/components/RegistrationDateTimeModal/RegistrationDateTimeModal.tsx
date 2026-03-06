import React, { useState, useEffect, useRef } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '@theme';
import { TimePicker, type TimeValue } from '@designSystem/molecules/time-picker';
import { FlexView, TextDs } from '@components';
import type { RegistrationDateTimeModalProps } from './RegistrationDateTimeModal.types';
import { styles } from './style/RegistrationDateTimeModal.styles';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const PICKER_MINUTES = [0, 10, 20, 30, 40, 50];

const getStartOfDay = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);

const getDefaultTimeFromDate = (date: Date): { hour: number; minute: number } => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const roundedMinute = PICKER_MINUTES.reduce((prev, curr) =>
    Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev,
  );
  return { hour, minute: roundedMinute };
};

const timeToTimeValue = (hour: number, minute: number): TimeValue => ({
  hour,
  minute: PICKER_MINUTES.includes(minute) ? minute : 0,
  period: 'AM',
});

export const RegistrationDateTimeModal: React.FC<RegistrationDateTimeModalProps> = ({
  visible,
  onClose,
  step,
  initialDate,
  registrationStartTime,
  eventDateTime,
  onConfirmStart,
  onConfirmEnd,
}) => {
  const now = new Date();
  /** Registration must be between now and event date/time (parent only opens modal when eventDateTime is set) */
  const maxDateTime = eventDateTime != null ? new Date(eventDateTime.getTime()) : now;

  const minDateTime = step === 'start'
    ? now
    : (registrationStartTime ? new Date(registrationStartTime.getTime()) : now);
  const minCalendarDate = getStartOfDay(minDateTime);
  const maxCalendarDate = getStartOfDay(maxDateTime);

  const getInitialDate = (): Date => {
    if (step === 'end' && registrationStartTime) {
      return new Date(registrationStartTime.getTime());
    }
    if (initialDate && initialDate instanceof Date) {
      return new Date(initialDate.getTime());
    }
    return step === 'start' ? new Date(now.getTime()) : (registrationStartTime ? new Date(registrationStartTime.getTime()) : new Date(now.getTime()));
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());
  const [currentMonth, setCurrentMonth] = useState(getInitialDate().getMonth());
  const [currentYear, setCurrentYear] = useState(getInitialDate().getFullYear());
  const [time, setTime] = useState<{ hour: number; minute: number }>(() => {
    const d = getInitialDate();
    return getDefaultTimeFromDate(d);
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const prevStepRef = useRef(step);
  const prevVisibleRef = useRef(visible);

  // When modal opens or step changes, reset state for the new step
  useEffect(() => {
    if (visible && (prevVisibleRef.current !== visible || prevStepRef.current !== step)) {
      prevVisibleRef.current = visible;
      prevStepRef.current = step;
      const initial = getInitialDate();
      setSelectedDate(initial);
      setCurrentMonth(initial.getMonth());
      setCurrentYear(initial.getFullYear());
      setTime(getDefaultTimeFromDate(initial));
      setValidationError(null);
    }
    if (!visible) {
      prevVisibleRef.current = false;
    }
  }, [visible, step, registrationStartTime, initialDate]);

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setValidationError(null);
  };

  const isDateDisabled = (day: number): boolean => {
    const date = getStartOfDay(new Date(currentYear, currentMonth, day));
    if (date < minCalendarDate) return true;
    if (date > maxCalendarDate) return true;
    return false;
  };

  const isDateSelected = (day: number) =>
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getFullYear() === currentYear;

  const handleTimeChange = (value: TimeValue) => {
    setTime({ hour: value.hour, minute: value.minute });
    setValidationError(null);
  };

  const handleConfirm = () => {
    const fullDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      time.hour,
      time.minute,
      0,
      0,
    );

    if (fullDate < minDateTime) {
      setValidationError(
        step === 'start'
          ? 'Registration start must be from now onwards.'
          : 'End time must be after the start time.',
      );
      return;
    }
    if (fullDate > maxDateTime) {
      setValidationError('Registration cannot be after the event date and time.');
      return;
    }
    if (step === 'end' && registrationStartTime && fullDate <= registrationStartTime) {
      setValidationError('End time must be after the start time.');
      return;
    }

    setValidationError(null);
    if (step === 'start') {
      onConfirmStart(fullDate);
      // Parent keeps modal visible and sets step='end' so calendar refreshes for end date
    } else {
      onConfirmEnd(fullDate);
      onClose();
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const timeValue: TimeValue = timeToTimeValue(time.hour, time.minute);
  const calendarDays = renderCalendarDays();
  const stepLabel = step === 'start' ? 'Registration start' : 'Registration end';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <FlexView style={styles.overlay} justifyContent="center" alignItems="center">
        <FlexView style={styles.modalContainer}>
          <FlexView style={styles.contentContainer}>
            <FlexView style={styles.dateSection}>
              <FlexView style={styles.dateHeader}>
                <TextDs size={14} weight="regular">
                  {MONTHS[currentMonth]} {currentYear}
                </TextDs>
                <FlexView flexDirection="row" alignItems="center">
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

              <FlexView style={styles.daysOfWeekContainer}>
                {DAYS_OF_WEEK.map((day, index) => (
                  <FlexView key={index} style={styles.dayOfWeek}>
                    <TextDs size={14} weight="regular">{day}</TextDs>
                  </FlexView>
                ))}
              </FlexView>

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
            </FlexView>

            <FlexView style={styles.timeSection}>
              <TextDs style={styles.timeSectionTitle}>{stepLabel} – Time</TextDs>
              <FlexView style={styles.timeInputContainer}>
                <TimePicker
                  value={timeValue}
                  onChange={handleTimeChange}
                  containerStyle={styles.timeInput}
                  use24Hour
                />
              </FlexView>
              {validationError && (
                <TextDs style={styles.errorText}>{validationError}</TextDs>
              )}
            </FlexView>

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
