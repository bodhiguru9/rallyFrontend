import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import type { RootStackParamList } from '@navigation';
import { authService } from '@services';
import { useAuthStore } from '@store';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

/**
 * Custom hook for ForgotPassword screen
 * Collects: phone/email
 * Sends OTP via API before navigating to VerifyOTP screen
 */
export const useForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const setGlobalLoading = useAuthStore((state) => state.setGlobalLoading);

  // Form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [useEmail, setUseEmail] = useState(false);

  /**
   * Validates forgot password form data
   */
  const validateForgotPasswordData = (): string | null => {
    if (useEmail && !email) {
      return 'Please enter your email';
    }
    if (!useEmail && !phoneNumber) {
      return 'Please enter your phone number';
    }
    return null;
  };

  /**
   * Validates phone number format with country code
   */
  const validatePhoneNumber = (phone: string): boolean => {
    // Must start with + and have 10-15 digits after country code
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const sanitizePhoneNumber = (phone: string): string => {
    const cleaned = phone.trim().replace(/[\s()-]/g, '');
    if (!cleaned) {
      return '';
    }

    if (cleaned.startsWith('+')) {
      return `+${cleaned.slice(1).replace(/\D/g, '')}`;
    }

    return cleaned.replace(/\D/g, '');
  };

  /**
   * Send forgot password OTP mutation
   */
  const sendOTPMutation = useMutation({
    mutationFn: authService.sendForgotPasswordOTP,
    onMutate: () => {
      setGlobalLoading(true, 'Sending OTP...');
    },
    onSuccess: (response, variables) => {
      setGlobalLoading(false);

      // Navigate to OTP screen with collected data
      navigation.navigate('VerifyOTP', {
        flow: 'forgotPassword',
        phoneNumber: variables.mobileNumber,
        email: variables.email,
      });
    },
    onError: (error: any) => {
      setGlobalLoading(false);
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    },
  });

  /**
   * Handles sending OTP to phone/email
   * Calls API to send OTP before navigating to VerifyOTP screen
   */
  const handleSendCode = () => {
    // Validation
    const validationError = validateForgotPasswordData();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    // Format phone number with country code if not using email
    let formattedPhone: string | undefined;
    if (!useEmail && phoneNumber) {
      const sanitizedPhone = sanitizePhoneNumber(phoneNumber);
      formattedPhone = sanitizedPhone.startsWith('+')
        ? sanitizedPhone
        : `+971${sanitizedPhone}`;

      // Validate phone number format
      if (!validatePhoneNumber(formattedPhone)) {
        Alert.alert(
          'Invalid Phone Number',
          'Please enter a valid phone number with country code (e.g., +919971698097)'
        );
        return;
      }
    }

    // Call API to send OTP
    sendOTPMutation.mutate({
      email: useEmail ? email : undefined,
      mobileNumber: formattedPhone,
    });
  };

  /**
   * Toggle to email input
   */
  const handleUseEmail = () => {
    setUseEmail(true);
  };

  /**
   * Toggle to WhatsApp input
   */
  const handleUseWhatsApp = () => {
    setUseEmail(false);
  };

  return {
    // State
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    useEmail,
    isLoading: sendOTPMutation.isPending,

    // Actions
    handleSendCode,
    handleUseEmail,
    handleUseWhatsApp,
  };
};
