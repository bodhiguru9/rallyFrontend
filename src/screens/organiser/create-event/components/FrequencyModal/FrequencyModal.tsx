import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Calendar, Check } from 'lucide-react-native';
import { FlexView, TextDs } from '@components';
import type { FrequencyModalProps, FrequencySelection } from './FrequencyModal.types';
import { styles } from './FrequencyModal.styles';

/** Day labels per Figma: S=Sun, M=Mon, T=Tue, W=Wed, T=Thu, F=Fri, S=Sat */
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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

  useEffect(() => {
    if (visible && initialFrequency) {
      setWeeklyDays(initialFrequency.weeklyDays ?? []);
      setEndsNever(initialFrequency.ends === 'never');
      setEndsOnDate(
        initialFrequency.ends !== 'never' && typeof initialFrequency.ends === 'object'
          ? initialFrequency.ends.on
          : new Date(),
      );
      setShowCustom(!!initialFrequency.customValue);
      setCustomValue(initialFrequency.customValue ?? '');
    }
  }, [visible, initialFrequency]);

  const toggleDay = (dayIndex: number) => {
    setWeeklyDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort((a, b) => a - b),
    );
  };

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
                <TouchableOpacity
                  style={styles.endsDateRow}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <FlexView style={styles.endsDateButton}>
                    <Calendar size={18} color="#3D6F92" />
                    <TextDs style={styles.endsDateText}>
                      {formatEndDate(endsOnDate)}
                    </TextDs>
                  </FlexView>
                </TouchableOpacity>
              )}
            </FlexView>

            {/* Custom option - expandable */}
            <TouchableOpacity
              style={styles.customToggle}
              onPress={() => setShowCustom(!showCustom)}
              activeOpacity={0.7}
            >
              <TextDs size={14} weight="medium" color="primary">
                {showCustom ? 'Hide custom' : '+ Custom recurrence'}
              </TextDs>
            </TouchableOpacity>
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
