import React, { useState } from 'react';
import { TouchableOpacity, Modal, FlatList } from 'react-native';
import { Check, ChevronDown, X } from 'lucide-react-native';
import { colors, spacing } from '@theme';
import type { SelectProps } from './Select.types';
import { styles } from './style/Select.styles';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder,
  options,
  value,
  onSelect,
  onValueChange,
  containerStyle,
  error,
  autoOpen = false,
  onModalClose,
  leftIcon,
  disabled = false,
  inputStyle,
  textStyle,
}) => {
  const [showPicker, setShowPicker] = useState(autoOpen && !disabled);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect?.(optionValue);
    onValueChange?.(optionValue);
    setShowPicker(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleClose = () => {
    setShowPicker(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  const handlePress = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  return (
    <FlexView gap={spacing.sm} style={containerStyle}>
      {label && <TextDs size={14} weight="regular">{label}</TextDs>}
      <FlexView style={[styles.inputContainer, inputStyle]}>
        <FlexView flex={1} flexDirection='row' alignItems='center' gap={spacing.sm}>
          {leftIcon && <FlexView style={styles.leftIconContainer}>{leftIcon}</FlexView>}
          <TouchableOpacity
            onPress={handlePress}
            style={[
              styles.selectButton,
            ]}
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
          >
            <TextDs
              style={[
                styles.selectText,
                !selectedOption && styles.selectTextPlaceholder,
                textStyle,
              ]}
              numberOfLines={1}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </TextDs>
          </TouchableOpacity>
        </FlexView>
        <ChevronDown size={16} color={colors.text.secondary} />
      </FlexView>
      {error && <TextDs style={styles.errorText}>{error}</TextDs>}

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <FlexView style={styles.modalContent}>
            <FlexView style={styles.modalHeader}>
              <TextDs style={styles.modalTitle}>{label || 'Select'}</TextDs>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </FlexView>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item.value && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                >
                  <TextDs
                    style={[
                      styles.optionText,
                      value === item.value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </TextDs>
                  {value === item.value && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </FlexView>
        </TouchableOpacity>
      </Modal>
    </FlexView>
  );
};
