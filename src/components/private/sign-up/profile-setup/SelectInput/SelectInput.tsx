import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value?: string;
  onSelect: (value: string) => void;
  containerStyle?: object;
  error?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  placeholder,
  options,
  value,
  onSelect,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option: SelectOption) => {
    onSelect(option.value);
    setShowPicker(false);
  };

  return (
    <FlexView gap={spacing.sm}>
      {label && <TextDs size={14} weight="regular">{label}</TextDs>}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[styles.selectButton, error && styles.selectButtonError]}
        activeOpacity={0.7}
      >
        <TextDs style={[styles.selectText, !selectedOption && styles.selectTextPlaceholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </TextDs>
        {showPicker ? (
          <ChevronUp size={16} color={colors.text.secondary} />
        ) : (
          <ChevronDown size={16} color={colors.text.secondary} />
        )}
      </TouchableOpacity>
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
          <FlexView style={styles.modalContent}>
            <FlexView style={styles.modalHeader}>
              <TextDs style={styles.modalTitle}>{label}</TextDs>
              <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.closeButton}>
                <X size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </FlexView>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, value === item.value && styles.optionItemSelected]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <TextDs
                    style={[styles.optionText, value === item.value && styles.optionTextSelected]}
                  >
                    {item.label}
                  </TextDs>
                  {value === item.value && <Check size={20} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </FlexView>
        </TouchableOpacity>
      </Modal>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  label: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.white,
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
  closeButton: {
    padding: spacing.xs,
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
  optionText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  optionTextSelected: {
    ...getFontStyle(14, 'medium'),
    color: colors.primary,
  },
});
