import React, { useState, useEffect } from 'react';
import { TextDs,  FlexView } from '@components';
import {Modal, TouchableOpacity, Animated, Platform, KeyboardAvoidingView, Alert} from 'react-native';
import { FormInput } from '@components/global';
import { colors } from '@theme';
import type { ChangePasswordModalProps } from './ChangePasswordModal.types';
import { styles } from './style/ChangePasswordModal.styles';

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onForgotPassword,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
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
    setCurrentPassword('');
    setNewPassword('');
    setReEnterPassword('');
    onClose();
  };

  const handleConfirm = () => {
    // Validation
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== reEnterPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    // TODO: Implement password change API call
    console.log('Change password:', { currentPassword, newPassword });
    Alert.alert('Success', 'Password changed successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setCurrentPassword('');
          setNewPassword('');
          setReEnterPassword('');
          onClose();
        },
      },
    ]);
  };

  const isFormValid = currentPassword && newPassword.length >= 8 && newPassword === reEnterPassword;

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
              {/* Header */}
              <FlexView style={styles.header}>
                <TextDs style={styles.title}>Password</TextDs>
                <TextDs style={styles.subtitle}>Create a new password</TextDs>
              </FlexView>

              {/* Input Fields */}
              <FlexView style={styles.inputsContainer}>
                <FormInput
                  label="Enter Current Password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  containerStyle={styles.inputContainer}
                />

                <FormInput
                  label="Create Password"
                  placeholder="Enter an 8 digit password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  containerStyle={styles.inputContainer}
                />

                <FormInput
                  label="Re-enter Password"
                  placeholder="Enter an 8 digit password"
                  value={reEnterPassword}
                  onChangeText={setReEnterPassword}
                  secureTextEntry
                  containerStyle={styles.inputContainer}
                />
              </FlexView>

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={onForgotPassword}
                style={styles.forgotPasswordContainer}
                activeOpacity={0.7}
              >
                <TextDs style={styles.forgotPasswordText}>Forgot Password?</TextDs>
              </TouchableOpacity>

              {/* Confirm Button */}
              <TouchableOpacity
                style={[styles.confirmButton, isFormValid && styles.confirmButtonActive]}
                onPress={handleConfirm}
                activeOpacity={0.8}
                disabled={!isFormValid}
              >
                <TextDs
                  style={[
                    styles.confirmButtonText,
                    !isFormValid && styles.confirmButtonTextDisabled,
                  ]}
                >
                  Confirm
                </TextDs>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};
