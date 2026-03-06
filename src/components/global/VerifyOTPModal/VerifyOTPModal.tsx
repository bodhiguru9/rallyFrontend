import React, { useState, useEffect, useRef, startTransition } from 'react';
import { Modal, TouchableOpacity, Animated, Platform, KeyboardAvoidingView } from 'react-native';
import { OTPInput } from '@components/private/verify-otp/OTPInput';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import type { VerifyOTPModalProps } from './VerifyOTPModal.types';
import { styles } from './style/VerifyOTPModal.styles';

const RESEND_COUNTDOWN_SECONDS = 60;

export const VerifyOTPModal: React.FC<VerifyOTPModalProps> = ({
  visible,
  onClose,
  onVerify,
  onResend,
  // phoneNumber,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN_SECONDS);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [slideAnim] = useState(new Animated.Value(0));
  const [modalKey, setModalKey] = useState(0);

  // Reset state when modal opens - key bumped in a transition to avoid cascading renders
  useEffect(() => {
    if (visible) {
      startTransition(() => setModalKey((prev) => prev + 1));
    }
  }, [visible]);

  // Update form state when modal opens (key changes)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (modalKey > 0) {
      setOtpCode('');
      setHasInteracted(false);
      setCountdown(RESEND_COUNTDOWN_SECONDS);
    }
  }, [modalKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (visible) {
      // Animate slide up
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      // Animate slide down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // Handle countdown timer
  useEffect(() => {
    if (visible && hasInteracted && countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [visible, countdown, hasInteracted]);

  const handleOTPFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleOTPComplete = (code: string) => {
    setOtpCode(code);
    // Auto-verify when all digits are entered
    if (code.length === 6) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        handleVerify();
      }, 100);
    }
  };

  const handleVerify = () => {
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResend = () => {
    if (countdown > 0) {
      return;
    }
    onResend();
    setCountdown(RESEND_COUNTDOWN_SECONDS);
    setOtpCode('');
    setHasInteracted(false);
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
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
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
                <TextDs style={styles.title}>Enter Code</TextDs>
              </FlexView>

              {/* Description */}
              <TextDs style={styles.description}>
                We have sent a code on your WhatsApp or Email
              </TextDs>

              {/* OTP Input */}
              <FlexView style={styles.otpContainer}>
                <OTPInput
                  length={6}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  onComplete={handleOTPComplete}
                  onFocus={handleOTPFocus}
                />
              </FlexView>

              {/* Resend Code Link */}
              {hasInteracted && (
                <TouchableOpacity
                  onPress={handleResend}
                  style={styles.resendContainer}
                  activeOpacity={countdown > 0 ? 1 : 0.7}
                  disabled={countdown > 0}
                >
                  <TextDs style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
                    {countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Code'}
                  </TextDs>
                </TouchableOpacity>
              )}

              {/* Send OTP Button */}
              <TouchableOpacity
                style={[styles.sendButton, otpCode.length === 6 && styles.sendButtonActive]}
                onPress={handleVerify}
                activeOpacity={0.8}
                disabled={otpCode.length !== 6}
              >
                <TextDs
                  style={[
                    styles.sendButtonText,
                    otpCode.length !== 6 && styles.sendButtonTextDisabled,
                  ]}
                >
                  Send OTP
                </TextDs>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

