import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Dropdown } from '@designSystem/molecules/dropdown/Dropdown';
import { RangeSlider } from '../RangeSlider';
import type { RestrictionsModalProps } from './RestrictionsModal.types';
import { styles } from './style/RestrictionsModal.styles';
import { spacing } from '@theme';
import { FlexView, TextDs } from '@components';

const GENDER_OPTIONS = [
  { label: 'Open to All', value: 'open' },
  { label: 'Male Only', value: 'male' },
  { label: 'Female Only', value: 'female' },
];

const SPORTS_LEVEL_OPTIONS = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

// Internal form component that uses initial props and doesn't need useEffect
const RestrictionsForm: React.FC<{
  initialGender?: string;
  initialSportsLevel?: string;
  initialAgeRange?: { min: number; max: number };
  initialLevelRestriction?: string;
  onClose: () => void;
  onConfirm: (data: {
    gender: string;
    sportsLevel: string;
    ageRange: { min: number; max: number };
    levelRestriction: string;
  }) => void;
}> = ({
  initialGender,
  initialSportsLevel,
  initialAgeRange,
  initialLevelRestriction,
  onClose,
  onConfirm,
}) => {
    const [gender, setGender] = useState<string>(initialGender || 'open');
    const [sportsLevel, setSportsLevel] = useState<string>(
      initialSportsLevel || 'all'
    );
    const [ageRange, setAgeRange] = useState<{ min: number; max: number }>(
      initialAgeRange || { min: 14, max: 26 }
    );
    const [levelRestriction, setLevelRestriction] = useState<string>(
      initialLevelRestriction || ''
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{
      ageRange?: string;
      levelRestriction?: string;
    }>({});

    const validateForm = (): boolean => {
      const newErrors: typeof errors = {};

      // Validate age range
      if (ageRange.min >= ageRange.max) {
        newErrors.ageRange = 'Minimum age must be less than maximum age';
      }
      if (ageRange.min < 5) {
        newErrors.ageRange = 'Minimum age cannot be less than 5';
      }
      if (ageRange.max > 100) {
        newErrors.ageRange = 'Maximum age cannot exceed 100';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      onConfirm({
        gender,
        sportsLevel,
        ageRange,
        levelRestriction,
      });
      setIsSubmitting(false);
      onClose();
    };

    const handleClose = () => {
      if (!isSubmitting) {
        onClose();
      }
    };

    return (
      <FlexView style={styles.modalContainer}>
        {/* Header with Close Button */}
        <FlexView width={"100%"} alignItems='center' justifyContent='center' mb={spacing.xxl}>
          <TextDs size={14} weight="regular" align='center'>Event Restrictions</TextDs>
        </FlexView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FlexView style={styles.content}>
            {/* Gender and Sports Level Row */}
            <FlexView style={styles.section}>
              <FlexView style={styles.row}>
                <FlexView style={styles.halfWidth}>
                  <Dropdown
                    label="Gender"
                    placeholder="Select gender"
                    options={GENDER_OPTIONS}
                    value={gender}
                    onSelect={setGender}
                    containerStyle={styles.selectContainer}
                    disabled={isSubmitting}
                  />
                </FlexView>
                <FlexView style={styles.halfWidth}>
                  <Dropdown
                    label="Skill Level"
                    placeholder="Select level"
                    options={SPORTS_LEVEL_OPTIONS}
                    value={sportsLevel}
                    onSelect={setSportsLevel}
                    containerStyle={styles.selectContainer}
                    disabled={isSubmitting}
                  />
                </FlexView>
              </FlexView>
            </FlexView>

            {/* Age Range */}
            <FlexView style={styles.section}>
              <TextDs size={14} weight="regular">Age Range</TextDs>
              <FlexView style={styles.ageRangeContainer}>
                <RangeSlider
                  min={5}
                  max={100}
                  initialMin={ageRange.min}
                  initialMax={ageRange.max}
                  onValueChange={(values) => {
                    setAgeRange(values);
                    setErrors((prev) => ({ ...prev, ageRange: undefined }));
                  }}
                />
                {errors.ageRange && (
                  <TextDs style={styles.errorText}>{errors.ageRange}</TextDs>
                )}
              </FlexView>
            </FlexView>

          </FlexView>
        </ScrollView>

        {/* Action Buttons */}
        <FlexView style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleClose}
            activeOpacity={0.7}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            accessibilityHint="Discards changes and closes the modal"
          >
            <TextDs style={styles.cancelButtonText}>Cancel</TextDs>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.doneButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleConfirm}
            activeOpacity={0.7}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Apply restrictions"
            accessibilityHint="Saves the restrictions and closes the modal"
          >
            <TextDs style={styles.doneButtonText}>
              {'Done'}
            </TextDs>
          </TouchableOpacity>
        </FlexView>
      </FlexView>
    );
  };

export const RestrictionsModal: React.FC<RestrictionsModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialGender,
  initialSportsLevel,
  initialAgeRange,
  initialLevelRestriction,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.overlay}>
          {/* Backdrop: only tapping outside the card closes the modal */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityLabel="Close restrictions modal"
            accessibilityRole="button"
          />
          {/* Modal content is a sibling on top so taps on it do not hit the backdrop */}
          {visible && (
            <View style={styles.modalContentWrapper} pointerEvents="box-none">
              <RestrictionsForm
                key={`restrictions-form-${visible}`}
                initialGender={initialGender}
                initialSportsLevel={initialSportsLevel}
                initialAgeRange={initialAgeRange}
                initialLevelRestriction={initialLevelRestriction}
                onClose={onClose}
                onConfirm={onConfirm}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
