import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { TouchableOpacity, ScrollView, NativeScrollEvent, NativeSyntheticEvent, Modal, View, StyleSheet } from 'react-native';
import { IDateFilterProps } from './DateFilter.types';
import { styles } from './style/DateFilter.styles';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';
import { borderRadius, colors, spacing } from '@theme';

export const DateFilter: React.FC<IDateFilterProps> = ({
  dates,
  onSelectDate,
  onScrollNearEnd,
  canLoadMore = false,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const isNearEndRef = useRef(false);

  // --- EXISTING STATES ---
  const [visibleMonth, setVisibleMonth] = useState<string | null>(null);

  // --- NEW STATES FOR CALENDAR POPUP ---
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<string | null>(null);

  // --- EXISTING SCROLL LOGIC (Untouched) ---
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const scrollX = contentOffset.x;
      const contentWidth = contentSize.width;
      const viewWidth = layoutMeasurement.width;

      const itemWidth = 60;
      const centerPosition = scrollX + viewWidth / 2;
      const centerIndex = Math.round(centerPosition / itemWidth);

      if (centerIndex >= 0 && centerIndex < dates.length) {
        const centerDate = dates[centerIndex];
        if (centerDate && centerDate.month !== visibleMonth) {
          setVisibleMonth(centerDate.month);
        }
      }

      if (onScrollNearEnd && canLoadMore) {
        const distanceFromEnd = contentWidth - (scrollX + viewWidth);
        const threshold = 200;

        if (distanceFromEnd < threshold && !isNearEndRef.current) {
          isNearEndRef.current = true;
          onScrollNearEnd();
        } else if (distanceFromEnd >= threshold) {
          isNearEndRef.current = false;
        }
      }
    },
    [onScrollNearEnd, canLoadMore, dates, visibleMonth],
  );

  const getFullMonthName = (shortMonth: string): string => {
    const monthMap: Record<string, string> = {
      'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
      'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
      'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December',
    };
    return monthMap[shortMonth] || shortMonth;
  };

  const today = useMemo(() => {
    const now = new Date();
    return { month: now.toLocaleDateString('en-US', { month: 'short' }) };
  }, []);

  useEffect(() => {
    const selectedIndex = dates.findIndex((d) => d.isSelected);
    if (selectedIndex !== -1) {
      const selectedDate = dates[selectedIndex];
      if (selectedDate) {
        setVisibleMonth(selectedDate.month);
      }
      if (scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ x: selectedIndex * 60, animated: true });
        }, 300);
      }
    }
  }, []);

  const handleDateSelect = (fullDate: string) => {
    const isAlreadySelected = dates.some((d) => d.fullDate === fullDate && d.isSelected);
    if (isAlreadySelected) {
      onSelectDate(null);
    } else {
      onSelectDate(fullDate);
    }
  };

  const isDateSelected = (dateItem: { date: number; month: string; isSelected?: boolean; fullDate?: string }) => {
    return dateItem.isSelected === true;
  };

  const displayMonth = useMemo(() => {
    let shortMonth: string;
    if (visibleMonth) shortMonth = visibleMonth;
    else {
      const selectedDateItem = dates.find((d) => d.isSelected);
      if (selectedDateItem) shortMonth = selectedDateItem.month;
      else shortMonth = today.month;
    }
    return getFullMonthName(shortMonth);
  }, [visibleMonth, dates, today.month]);


  // --- NEW CALENDAR LOGIC ---
  const openCalendar = () => {
    // Populate temp dates with currently selected dates from props
    const selected = dates.find(d => d.isSelected)?.fullDate || null;
    setTempSelectedDate(selected);
    setIsCalendarVisible(true);
  };

  const closeCalendarAndSave = () => {
    setIsCalendarVisible(false);
    onSelectDate(tempSelectedDate);
  };

  const toggleCalendarDate = (dateString: string) => {
    setTempSelectedDate(prev => prev === dateString ? null : dateString);
  };

  const renderCalendarGrid = () => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={localStyles.calendarCell} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      // Create a standard YYYY-MM-DD string for comparison
      const formattedMonth = String(month + 1).padStart(2, '0');
      const formattedDay = String(i).padStart(2, '0');
      const standardDateString = `${year}-${formattedMonth}-${formattedDay}`;

      // CRITICAL FIX: Match the exact 'fullDate' format used by your parent component.
      // We look inside your `dates` array to find the matching day and grab ITS fullDate.
      const matchedPropDate = dates.find(d =>
        d.fullDate?.startsWith(standardDateString) || // Matches if ISO string starts with YYYY-MM-DD
        (d.date === i && getFullMonthName(d.month) === getFullMonthName(calendarViewDate.toLocaleDateString('en-US', { month: 'short' })))
      );

      // If the date exists in your scroll list, use its exact string. Otherwise, fallback to standard.
      const exactDateString = matchedPropDate?.fullDate || standardDateString;

      const isSelected = tempSelectedDate === exactDateString;

      days.push(
        <TouchableOpacity
          key={`day-${i}`}
          style={localStyles.calendarCell}
          onPress={() => toggleCalendarDate(exactDateString)}
        >
          <View style={[localStyles.dayCircle, isSelected && localStyles.dayCircleSelected]}>
            <TextDs size={14} weight="semibold" color={isSelected ? 'blueGray' : 'white'}>
              {i}
            </TextDs>
          </View>
        </TouchableOpacity>
      );
    }
    return days;
  };
  const changeMonth = (offset: number) => {
    setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + offset, 1));
  };


  return (
    <FlexView>
      <FlexView style={styles.header}>
        <FlexView style={styles.titleContainer}>
          <TextDs size={14} weight="semibold">Date</TextDs>
          <TextDs size={14} weight="regular" color="secondary"> • </TextDs>
          <TextDs size={14} weight="regular" color="secondary">
            {displayMonth}
          </TextDs>
        </FlexView>

        {/* MODIFIED: Added onPress to open Modal */}
        <TouchableOpacity style={styles.calenderButton} onPress={openCalendar}>
          <TextDs size={14} weight="regular" color="blueGray">
            Calendar
          </TextDs>
        </TouchableOpacity>
      </FlexView>

      {/* --- EXISTING SCROLLVIEW (Untouched) --- */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {dates.map((dateItem) => {
          const isSelected = isDateSelected(dateItem);
          return (
            <TouchableOpacity
              key={dateItem.fullDate || `${dateItem.month}-${dateItem.date}`}
              onPress={() => handleDateSelect(dateItem.fullDate || '')}
              style={[
                styles.dateButton,
                isSelected ? styles.dateSelected : styles.dateUnselected,
              ]}
              activeOpacity={0.7}
            >
              <FlexView
                marginBottom={spacing.sm}
                width={38}
                borderRadius={borderRadius.full}
                backgroundColor={isSelected ? '' : colors.glass.background.white}
                alignItems="center"
                justifyContent="center"
                borderWidth={isSelected ? 0 : 1}
                borderColor="white"
                boxShadow={isSelected ? '' : colors.glass.boxShadow.light}
                aspectRatio={1 / 1}
              >
                <TextDs size={14} weight="semibold" color={isSelected ? 'white' : 'blueGray'}>
                  {dateItem.date}
                </TextDs>
              </FlexView>
              <TextDs size={14} weight="regular" color={isSelected ? 'white' : 'blueGray'}>
                {dateItem.day}
              </TextDs>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* --- NEW CALENDAR MODAL --- */}
      <Modal visible={isCalendarVisible} transparent animationType="fade" onRequestClose={() => setIsCalendarVisible(false)}>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.calendarContainer}>

            {/* Header: Month selector and Done button */}
            <FlexView row alignItems="center" justifyContent="space-between" marginBottom={spacing.md}>
              <FlexView row alignItems="center" gap={spacing.md}>
                <TextDs size={16} weight="semibold" color="white">
                  {calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </TextDs>
                {/* <FlexView row gap={spacing.sm}> */}
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                  <TextDs size={16} weight='bold' color="white">{'<       '}</TextDs>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                  <TextDs size={16} weight='bold' color="white">{'>'}</TextDs>
                </TouchableOpacity>
                {/* </FlexView> */}
              </FlexView>

              <TouchableOpacity style={localStyles.doneButton} onPress={closeCalendarAndSave}>
                <TextDs size={14} weight="semibold" color="blueGray">Done</TextDs>
              </TouchableOpacity>
            </FlexView>

            {/* Days of Week Header */}
            <FlexView row justifyContent="space-between" marginBottom={spacing.sm}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <View key={day} style={localStyles.calendarCell}>
                  <TextDs size={12} weight="semibold" color="white">{day}</TextDs>
                </View>
              ))}
            </FlexView>

            {/* Calendar Grid */}
            <FlexView row style={{ flexWrap: 'wrap' }}>
              {renderCalendarGrid()}
            </FlexView>

          </View>
        </View>
      </Modal>
    </FlexView>
  );
};

// --- NEW STYLES FOR CALENDAR ---
const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dimmed background
    padding: spacing.md,
  },
  calendarContainer: {
    backgroundColor: "#5b7c99ca",
    borderWidth: 1,
    borderColor: colors.border.white, // Glassmorphism blue tint, adjust to match your theme
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    // Add blur effect if using @react-native-community/blur or Expo BlurView
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderColor: colors.border.white,
  },
  calendarCell: {
    width: '14.28%', // 100% / 7 days
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Selected highlight like in the image
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 16,
  }
});
