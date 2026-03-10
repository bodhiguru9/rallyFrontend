import React, { useState, useEffect } from 'react';
import { TextDs,  FlexView } from '@components';
import {Modal, TouchableOpacity, Animated, Platform, KeyboardAvoidingView, ScrollView} from 'react-native';
import { FormInput, Checkbox } from '@components/global';
import { ExpiryDateInput } from '../ExpiryDateInput';
import type { AddCardModalProps } from './AddCardModal.types';
import { styles } from './style/AddCardModal.styles';

export const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  onClose,
  onAddCard,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [expiryDate, setExpiryDate] = useState<{ month: number; year: number } | undefined>();
  const [slideAnim] = useState(new Animated.Value(0));

  // Handle animation
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleClose = () => {
    // Reset form when modal closes
    setCardNumber('');
    setCardHolderName('');
    setIsDefault(false);
    setExpiryDate(undefined);
    onClose();
  };

  const formatCardNumber = (text: string): string => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const formatExpiry = (month: number, year: number): string => {
    if (month === undefined || month === null || year === undefined || year === null) {
      return '';
    }
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedYear = String(year).slice(-2);
    return `${formattedMonth}/${formattedYear}`;
  };

  const handleAddCard = () => {
    // Validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      // TODO: Show error message
      return;
    }
    if (!cardHolderName.trim()) {
      // TODO: Show error message
      return;
    }
    if (!expiryDate || expiryDate.month === undefined || expiryDate.year === undefined) {
      // TODO: Show error message
      return;
    }

    onAddCard({
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardHolderName: cardHolderName.trim(),
      isDefault,
      expiry: formatExpiry(expiryDate.month, expiryDate.year),
    });
    // Reset form after successful card addition
    setCardNumber('');
    setCardHolderName('');
    setIsDefault(false);
    setExpiryDate(undefined);
  };

  const isFormValid =
    cardNumber.replace(/\s/g, '').length >= 16 &&
    cardHolderName.trim().length > 0 &&
    expiryDate !== undefined;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              {/* Drag Handle */}
              <FlexView style={styles.dragHandle} />

              {/* Header */}
              <FlexView style={styles.header}>
                <TextDs style={styles.title}>Add Card</TextDs>
              </FlexView>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {/* Card Number */}
                <FormInput
                  label="Card Number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="number-pad"
                  maxLength={19}
                  containerStyle={styles.inputContainer}
                />

                {/* Card Holder Name */}
                <FormInput
                  label="Card Holder Name"
                  placeholder="Enter card holder name"
                  value={cardHolderName}
                  onChangeText={setCardHolderName}
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                />

                {/* Expiry Date */}
                <ExpiryDateInput
                  label="Expiry Date"
                  value={expiryDate}
                  onSelect={(month, year) => setExpiryDate({ month, year })}
                  containerStyle={styles.inputContainer}
                />

                {/* Set as Default Card */}
                <Checkbox
                  label="Set as default card"
                  value={isDefault}
                  onValueChange={setIsDefault}
                  containerStyle={styles.inputContainer}
                />
              </ScrollView>

              {/* Add Card Button */}
              <TouchableOpacity
                style={[styles.addButton, isFormValid && styles.addButtonActive]}
                onPress={handleAddCard}
                activeOpacity={0.8}
                disabled={!isFormValid}
              >
                <TextDs
                  style={[
                    styles.addButtonText,
                    !isFormValid && styles.addButtonTextDisabled,
                  ]}
                >
                  Add Card
                </TextDs>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

