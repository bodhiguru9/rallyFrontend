import React, { useState, useEffect, useMemo } from 'react';
import { Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Calendar, Check, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { FlexView, TextDs } from '@components';
import type { FrequencyModalProps, FrequencySelection } from './FrequencyModal.types';
import { styles } from './FrequencyModal.styles';
import { colors } from '@theme';

/** Day labels per Figma: S=Sun, M=Mon, T=Tue, W=Wed, T=Thu, F=Fri, S=Sat */
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const FrequencyModal: React.FC<FrequencyModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialFrequency,
}) => {
  const [weeklyDays, setWeeklyDays] = useState<number[]>(
    initialFrequency?.weeklyDays ?? [],
  );
  const [endsNever, setEndsNever] = useState(
    initialFrequency?.ends === 'never' || !initialFrequency?.ends,
  );
  const [endsOnDate, setEndsOnDate] = useState<Date>(
    initialFrequency?.ends !== 'never' && typeof initialFrequency?.ends === 'object'
      ? initialFrequency.ends.on
      : new Date(),
  );
  const [showCustom, setShowCustom] = useState(!!initialFrequency?.customValue);
  const [customValue, setCustomValue] = useState(
    initialFrequency?.customValue ?? '',
  );
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateCalendarMonth, setEndDateCalendarMonth] = useState(
    () => (initialFrequency?.ends !== 'never' && typeof initialFrequency?.ends === 'object'
      ? initialFrequency.ends.on.getMonth()
      : new Date().getMonth()),
  );
  const [endDateCalendarYear, setEndDateCalendarYear] = useState(
    () => (initialFrequency?.ends !== 'never' && typeof initialFrequency?.ends === 'object'
      ? initialFrequency.ends.on.getFullYear()
      : new Date().getFullYear()),
  );

  useEffect(() => {
    if (visible && initialFrequency) {
      setWeeklyDays(initialFrequency.weeklyDays ?? []);
      setEndsNever(initialFrequency.ends === 'never');
      const onDate = initialFrequency.ends !== 'never' && typeof initialFrequency.ends === 'object'
        ? initialFrequency.ends.on
        : new Date();
      setEndsOnDate(onDate);
      setEndDateCalendarMonth(onDate.getMonth());
      setEndDateCalendarYear(onDate.getFullYear());
      setShowCustom(!!initialFrequency.customValue);
      setCustomValue(initialFrequency.customValue ?? '');
      setShowEndDateCalendar(false);
    }
  }, [visible, initialFrequency]);

  const toggleDay = (dayIndex: number) => {
    setWeeklyDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort((a, b) => a - b),
    );
  };

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const handleEndDatePrevMonth = () => {
    if (endDateCalendarMonth === 0) {
      setEndDateCalendarMonth(11);
      setEndDateCalendarYear((y) => y - 1);
    } else {
      setEndDateCalendarMonth((m) => m - 1);
    }
  };

  const handleEndDateNextMonth = () => {
    if (endDateCalendarMonth === 11) {
      setEndDateCalendarMonth(0);
      setEndDateCalendarYear((y) => y + 1);
    } else {
      setEndDateCalendarMonth((m) => m + 1);
    }
  };

  const handleEndDateSelect = (day: number) => {
    const newDate = new Date(endDateCalendarYear, endDateCalendarMonth, day);
    setEndsOnDate(newDate);
    setShowEndDateCalendar(false);
  };

  const endDateCalendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(endDateCalendarMonth, endDateCalendarYear);
    const firstDay = getFirstDayOfMonth(endDateCalendarMonth, endDateCalendarYear);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [endDateCalendarMonth, endDateCalendarYear]);

  const isEndDateDaySelected = (day: number) =>
    endsOnDate.getDate() === day &&
    endsOnDate.getMonth() === endDateCalendarMonth &&
    endsOnDate.getFullYear() === endDateCalendarYear;

  const handleDone = () => {
    const selection: FrequencySelection = {
      type: showCustom ? 'custom' : weeklyDays.length > 0 ? 'weekly' : 'never',
      ends: endsNever ? 'never' : { on: endsOnDate },
    };
    if (selection.type === 'weekly') {
      selection.weeklyDays = weeklyDays;
    }
    if (selection.type === 'custom') {
      selection.customValue = customValue;
    }
    onConfirm(selection);
    onClose();
  };

  const formatEndDate = (d: Date) =>
    d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <FlexView style={styles.overlay} justifyContent="center" alignItems="center">
        <FlexView style={styles.modalContainer}>
          <TextDs style={styles.modalTitle}>Choose Frequency</TextDs>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Select Days (Weekly) - FIRST per Figma design */}
            <FlexView style={styles.selectDaysSection}>
              <TextDs style={styles.sectionTitle}>Select Days (Weekly)</TextDs>
              <FlexView style={styles.daysRow}>
                {DAY_LABELS.map((label, index) => {
                  const isSelected = weeklyDays.includes(index);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        isSelected && styles.dayButtonSelected,
                      ]}
                      onPress={() => toggleDay(index)}
                      activeOpacity={0.7}
                    >
                      <TextDs
                        style={[
                          styles.dayButtonText,
                          isSelected && styles.dayButtonTextSelected,
                        ]}
                      >
                        {label}
                      </TextDs>
                    </TouchableOpacity>
                  );
                })}
              </FlexView>
            </FlexView>

            {/* Ends - SECOND per Figma design */}
            <FlexView style={styles.endsSection}>
              <TextDs style={styles.sectionTitle}>Ends</TextDs>
              <FlexView style={styles.endsOptionsRow}>
                <TouchableOpacity
                  style={styles.endsOption}
                  onPress={() => setEndsNever(true)}
                  activeOpacity={0.7}
                >
                  <FlexView
                    style={[
                      styles.checkbox,
                      endsNever && styles.checkboxSelected,
                    ]}
                  >
                    {endsNever && <Check size={14} color="#FFFFFF" />}
                  </FlexView>
                  <TextDs size={14} weight="regular">
                    Never
                  </TextDs>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.endsOption}
                  onPress={() => setEndsNever(false)}
                  activeOpacity={0.7}
                >
                  <FlexView
                    style={[
                      styles.checkbox,
                      !endsNever && styles.checkboxSelected,
                    ]}
                  >
                    {!endsNever && <Check size={14} color="#FFFFFF" />}
                  </FlexView>
                  <TextDs size={14} weight="regular">
                    On
                  </TextDs>
                </TouchableOpacity>
              </FlexView>
              {!endsNever && (
                <FlexView style={styles.endsDateRow}>
                  <TouchableOpacity
                    style={styles.endsDateButton}
                    onPress={() => setShowEndDateCalendar((v) => !v)}
                    activeOpacity={0.7}
                  >
                    <Calendar size={18} color="#3D6F92" />
                    <TextDs style={styles.endsDateText}>
                      {formatEndDate(endsOnDate)}
                    </TextDs>
                  </TouchableOpacity>
                  {showEndDateCalendar && (
                    <FlexView style={styles.endsDateCalendar}>
                      <FlexView style={styles.endsDateCalendarHeader}>
                        <TextDs size={14} weight="medium">
                          {MONTHS[endDateCalendarMonth]} {endDateCalendarYear}
                        </TextDs>
                        <FlexView flexDirection="row" alignItems="center" style={styles.endsDateCalendarNav}>
                          <TouchableOpacity
                            onPress={handleEndDatePrevMonth}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <ChevronLeft size={22} color={colors.text.blueGray} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleEndDateNextMonth}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <ChevronRight size={22} color={colors.text.blueGray} />
                          </TouchableOpacity>
                        </FlexView>
                      </FlexView>
                      <FlexView style={styles.endsDateCalendarDaysRow}>
                        {DAYS_OF_WEEK.map((d) => (
                          <FlexView key={d} style={styles.endsDateCalendarDayHeader}>
                            <TextDs size={12} weight="regular" color="secondary">{d[0]}</TextDs>
                          </FlexView>
                        ))}
                      </FlexView>
                      <FlexView style={styles.endsDateCalendarGrid}>
                        {endDateCalendarDays.map((day, idx) =>
                          day === null ? (
                            <FlexView key={idx} style={styles.endsDateCalendarCell} />
                          ) : (
                            <TouchableOpacity
                              key={idx}
                              style={[
                                styles.endsDateCalendarCell,
                                isEndDateDaySelected(day) && styles.endsDateCalendarCellSelected,
                              ]}
                              onPress={() => handleEndDateSelect(day)}
                              activeOpacity={0.7}
                            >
                              <TextDs
                                size={14}
                                weight={isEndDateDaySelected(day) ? 'semibold' : 'regular'}
                                color={isEndDateDaySelected(day) ? 'white' : 'primary'}
                              >
                                {day}
                              </TextDs>
                            </TouchableOpacity>
                          ),
                        )}
                      </FlexView>
                    </FlexView>
                  )}
                </FlexView>
              )}
            </FlexView>

            {/* Custom option - expandable */}
            {/* <TouchableOpacity
              style={styles.customToggle}
              onPress={() => setShowCustom(!showCustom)}
              activeOpacity={0.7}
            >
              <TextDs size={14} weight="medium" color="primary">
                {showCustom ? 'Hide custom' : '+ Custom recurrence'}
              </TextDs>
            </TouchableOpacity> */}
            {showCustom && (
              <FlexView style={styles.customSection}>
                <TextInput
                  style={styles.customInput}
                  placeholder="e.g. Every 2 weeks on Monday"
                  placeholderTextColor="#999"
                  value={customValue}
                  onChangeText={setCustomValue}
                  multiline
                />
              </FlexView>
            )}
          </ScrollView>

          {/* Action buttons - Cancel (red), Done (blue) */}
          <FlexView style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <TextDs style={styles.cancelButtonText}>Cancel</TextDs>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleDone}
              activeOpacity={0.7}
            >
              <TextDs style={styles.doneButtonText}>Done</TextDs>
            </TouchableOpacity>
          </FlexView>
        </FlexView>
      </FlexView>
    </Modal>
  );
};
