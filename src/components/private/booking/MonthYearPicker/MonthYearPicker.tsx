import React, { useState, useEffect } from 'react';
import { TextDs,  FlexView } from '@components';
import {Modal, TouchableOpacity, FlatList, Pressable} from 'react-native';
import { Check, ChevronDown, X } from 'lucide-react-native';
import { colors } from '@theme';
import { styles } from './style/MonthYearPicker.styles';
import { IMonthYearPickerProps } from './MonthYearPicker.types';

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

export const MonthYearPicker: React.FC<IMonthYearPickerProps> = ({
  visible,
  value,
  onSelect,
  onClose,
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Initialize state with value prop or current date
  // Only sync when value actually changes (derived state pattern)
  const [selectedMonth, setSelectedMonth] = useState<number>(
    () => value?.month ?? currentDate.getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState<number>(() => value?.year ?? currentYear);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Sync state with prop when it changes (controlled component pattern)
  // This is acceptable as it's updating state based on new prop values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedMonth(value.month);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedYear(value.year);
    }
  }, [value]); // Only update when actual values change

  // Reset nested modals when main modal closes
  // This is acceptable - managing local UI state based on parent visibility
  useEffect(() => {
    if (!visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowMonthPicker(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowYearPicker(false);
    }
  }, [visible]);

  // Generate years from current year to 10 years ahead (for card expiry)
  const generateYears = () => {
    const years = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
    // Update parent immediately so preview shows the change
    onSelect(month, selectedYear);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setShowYearPicker(false);
    // Update parent immediately so preview shows the change
    onSelect(selectedMonth, year);
  };

  const handleDone = () => {
    // Final confirmation when user clicks Done
    onSelect(selectedMonth, selectedYear);
    onClose();
  };

  const formatMonthYear = () => {
    const month = String(selectedMonth + 1).padStart(2, '0');
    const year = String(selectedYear).slice(-2);
    return `${month}/${year}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <FlexView style={styles.header}>
            <TextDs style={styles.title}>Select Expiry Date</TextDs>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </FlexView>

          <FlexView style={styles.pickerRow}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowMonthPicker(true)}
              activeOpacity={0.7}
            >
              <TextDs style={styles.pickerButtonText}>{MONTHS[selectedMonth]}</TextDs>
              <ChevronDown size={16} color={colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowYearPicker(true)}
              activeOpacity={0.7}
            >
              <TextDs style={styles.pickerButtonText}>{selectedYear}</TextDs>
              <ChevronDown size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          </FlexView>

          <FlexView style={styles.preview}>
            <TextDs style={styles.previewLabel}>Selected:</TextDs>
            <TextDs style={styles.previewValue}>{formatMonthYear()}</TextDs>
          </FlexView>

          {/* Done Button */}
          <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.8}>
            <TextDs style={styles.doneButtonText}>Done</TextDs>
          </TouchableOpacity>

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
              <FlexView style={styles.pickerModal}>
                <TextDs style={styles.pickerModalTitle}>Select Month</TextDs>
                <FlatList
                  data={MONTHS}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        selectedMonth === index && styles.pickerItemSelected,
                      ]}
                      onPress={() => handleMonthSelect(index)}
                      activeOpacity={0.7}
                    >
                      <TextDs
                        style={[
                          styles.pickerItemText,
                          selectedMonth === index && styles.pickerItemTextSelected,
                        ]}
                      >
                        {item}
                      </TextDs>
                      {selectedMonth === index && (
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
              <FlexView style={styles.pickerModal}>
                <TextDs style={styles.pickerModalTitle}>Select Year</TextDs>
                <FlatList
                  data={generateYears()}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        selectedYear === item && styles.pickerItemSelected,
                      ]}
                      onPress={() => handleYearSelect(item)}
                      activeOpacity={0.7}
                    >
                      <TextDs
                        style={[
                          styles.pickerItemText,
                          selectedYear === item && styles.pickerItemTextSelected,
                        ]}
                      >
                        {item}
                      </TextDs>
                      {selectedYear === item && (
                        <Check size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </FlexView>
            </TouchableOpacity>
          </Modal>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
