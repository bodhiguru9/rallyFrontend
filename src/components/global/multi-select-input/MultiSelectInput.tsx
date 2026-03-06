import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, FlatList, ScrollView } from 'react-native';
import { Check, ChevronDown, X } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import type { MultiSelectInputProps, SelectOption } from './MultiSelectInput.types';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  label,
  placeholder,
  options,
  value,
  onSelect,
  containerStyle,
  error,
  maxSelections,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  const handleToggle = (option: SelectOption) => {
    if (value.includes(option.value)) {
      // Remove from selection
      onSelect(value.filter(v => v !== option.value));
    } else {
      // Add to selection (check max limit)
      if (maxSelections && value.length >= maxSelections) {
        return;
      }
      onSelect([...value, option.value]);
    }
  };

  const isSelected = (optionValue: string) => value.includes(optionValue);

  const handleDone = () => {
    setShowPicker(false);
  };

  const displayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }
    return `${selectedOptions.length} sports selected`;
  };

  return (
    <FlexView gap={spacing.sm} style={containerStyle}>
      {label && <TextDs size={14} weight="regular">{label}</TextDs>}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[styles.selectButton, error && styles.selectButtonError]}
        activeOpacity={0.7}
      >
        <TextDs
          style={[
            styles.selectText,
            selectedOptions.length === 0 && styles.selectTextPlaceholder,
          ]}
        >
          {displayText()}
        </TextDs>
        <ChevronDown size={20} color={colors.text.secondary} />
      </TouchableOpacity>

      {selectedOptions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectedChipsContainer}
        >
          {selectedOptions.map(option => (
            <FlexView key={option.value} style={styles.chip}>
              <TextDs style={styles.chipText}>{option.label}</TextDs>
              <TouchableOpacity
                onPress={() => handleToggle(option)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={14} color={colors.text.secondary} />
              </TouchableOpacity>
            </FlexView>
          ))}
        </ScrollView>
      )}

      {error && <TextDs style={styles.errorText}>{error}</TextDs>}

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <FlexView style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <FlexView style={styles.modalHeader}>
              <TextDs style={styles.modalTitle}>{label}</TextDs>
              <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                <TextDs style={styles.doneButtonText}>Done</TextDs>
              </TouchableOpacity>
            </FlexView>
            {maxSelections && (
              <TextDs style={styles.helperText}>
                Select up to {maxSelections} sports ({value.length}/{maxSelections})
              </TextDs>
            )}
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => {
                const selected = isSelected(item.value);
                const disabled = !selected && maxSelections ? value.length >= maxSelections : false;

                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      selected && styles.optionItemSelected,
                      disabled && styles.optionItemDisabled,
                    ]}
                    onPress={() => handleToggle(item)}
                    activeOpacity={0.7}
                    disabled={disabled}
                  >
                    <TextDs
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                        disabled && styles.optionTextDisabled,
                      ]}
                    >
                      {item.label}
                    </TextDs>
                    {selected && <Check size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              }}
            />
          </FlexView>
        </TouchableOpacity>
      </Modal>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  selectButtonError: {
    borderColor: colors.status.error,
  },
  selectText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    flex: 1,
  },
  selectTextPlaceholder: {
    color: colors.text.tertiary,
  },
  selectedChipsContainer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
  },
  chipText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  errorText: {
    ...getFontStyle(8, 'regular'),
    color: colors.status.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  doneButton: {
    padding: spacing.xs,
  },
  doneButtonText: {
    ...getFontStyle(14, 'medium'),
    color: colors.primary,
  },
  helperText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  optionItemSelected: {
    backgroundColor: colors.background.secondary,
  },
  optionItemDisabled: {
    opacity: 0.4,
  },
  optionText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  optionTextSelected: {
    ...getFontStyle(14, 'medium'),
    color: colors.primary,
  },
  optionTextDisabled: {
    color: colors.text.tertiary,
  },
});
