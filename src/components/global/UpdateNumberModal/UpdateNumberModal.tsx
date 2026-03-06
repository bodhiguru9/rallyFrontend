import React, { useState, useEffect } from 'react';
import { TextDs,  FlexView } from '@components';
import {Modal, TouchableOpacity, TextInput, FlatList, Animated, Platform, KeyboardAvoidingView} from 'react-native';
import { ChevronDown, MessageCircle, X } from 'lucide-react-native';
import { colors } from '@theme';
import type { UpdateNumberModalProps, CountryCode } from './UpdateNumberModal.types';
import { styles } from './style/UpdateNumberModal.styles';

const countryCodes: CountryCode[] = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
];

export const UpdateNumberModal: React.FC<UpdateNumberModalProps> = ({
  visible,
  onClose,
  onSendOTP,
  initialValue = '',
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialValue);
  const [selectedCode, setSelectedCode] = useState<CountryCode>(countryCodes[1]); // Default to UAE
  const [showCodePicker, setShowCodePicker] = useState(false);
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
    // Reset phone number when modal closes
    setPhoneNumber(initialValue);
    onClose();
  };

  const handleSendOTP = () => {
    const fullNumber = `${selectedCode.code} ${phoneNumber}`;
    onSendOTP(fullNumber);
    // Reset after sending OTP
    setPhoneNumber(initialValue);
  };

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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              {/* Handle bar */}
              <FlexView style={styles.handleBar} />

              {/* Header */}
              <FlexView style={styles.header}>
                <TextDs style={styles.title}>Update Number</TextDs>
              </FlexView>

              {/* Description */}
              <TextDs style={styles.description}>
                Enter the new number and we will share a code to verify
              </TextDs>

              {/* WhatsApp Number Input */}
              <FlexView style={styles.inputSection}>
                <TextDs style={styles.inputLabel}>WhatsApp Number</TextDs>
                <FlexView style={styles.inputContainer}>
                  <TouchableOpacity
                    onPress={() => setShowCodePicker(true)}
                    style={styles.codeButton}
                    activeOpacity={0.7}
                  >
                    <FlexView style={styles.whatsappIconContainer}>
                      <MessageCircle size={18} color="#25D366" />
                    </FlexView>
                    <TextDs style={styles.codeText}>{selectedCode.code}</TextDs>
                    <ChevronDown size={16} color={colors.text.primary} />
                  </TouchableOpacity>

                  <FlexView style={styles.separator} />

                  <TextInput
                    style={styles.input}
                    placeholder="50 123 4567"
                    placeholderTextColor={colors.text.tertiary}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </FlexView>
              </FlexView>

              {/* Send OTP Button */}
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendOTP}
                activeOpacity={0.8}
              >
                <TextDs style={styles.sendButtonText}>Send OTP</TextDs>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableOpacity>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCodePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCodePicker(false)}
      >
        <TouchableOpacity
          style={styles.codePickerOverlay}
          activeOpacity={1}
          onPress={() => setShowCodePicker(false)}
        >
          <FlexView style={styles.codePickerContent}>
            <FlexView style={styles.codePickerHeader}>
              <TextDs style={styles.codePickerTitle}>Select Country</TextDs>
              <TouchableOpacity
                onPress={() => setShowCodePicker(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </FlexView>
            <FlatList
              data={countryCodes}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.codeItem}
                  onPress={() => {
                    setSelectedCode(item);
                    setShowCodePicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <TextDs style={styles.flag}>{item.flag}</TextDs>
                  <TextDs style={styles.codeItemText}>{item.code}</TextDs>
                  <TextDs style={styles.countryText}>{item.country}</TextDs>
                </TouchableOpacity>
              )}
            />
          </FlexView>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
};

