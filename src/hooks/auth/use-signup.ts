import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import type { RootStackParamList } from '@navigation';
import { logger } from '@dev-tools/logger';
import { authService } from '@services';
import { useAuthStore, useSignupFormStore } from '@store';
import { formatErrorForAlert, logError } from '@utils/error-handler';
import { useGoogleAuth } from './use-google-auth';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

/**
 * Custom hook for SignUp screen (Step 1 of 3)
 * Collects: userType, phone/email
 * Sends OTP via API before navigating to VerifyOTP screen
 */
export const useSignUp = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const setGlobalLoading = useAuthStore((state) => state.setGlobalLoading);
  const { signInWithGoogle } = useGoogleAuth();

  // Form state — persisted in signup form store so it survives back-navigation
  const userType = useSignupFormStore((s) => s.userType);
  const setUserType = useSignupFormStore((s) => s.setUserType);
  const phoneNumber = useSignupFormStore((s) => s.phoneNumber);
  const setPhoneNumber = useSignupFormStore((s) => s.setPhoneNumber);
  const email = useSignupFormStore((s) => s.email);
  const setEmail = useSignupFormStore((s) => s.setEmail);
  const useEmail = useSignupFormStore((s) => s.useEmail);
  const setUseEmail = useSignupFormStore((s) => s.setUseEmail);

  /**
   * Validates signup form data
   */
  const validateSignUpData = (): string | null => {
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
   * Send OTP mutation
   */
  const sendOTPMutation = useMutation({
    mutationFn: authService.sendSignupOTP,
    onMutate: () => {
      setGlobalLoading(true, 'Sending OTP...');
    },
    onSuccess: (response, variables) => {
      setGlobalLoading(false);

      // Navigate to OTP screen with collected data
      navigation.navigate('VerifyOTP', {
        flow: 'signup',
        phoneNumber: variables.mobileNumber,
        email: variables.email,
        userType, // Use component userType ('player' | 'organiser')
      });
    },
    onError: (error: any) => {
      setGlobalLoading(false);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'use-signup.ts:sendOTPMutation:onError',
          message: 'Send OTP error',
          data: {
            platform: Platform.OS,
            errorMessage: error?.message,
            errorCode: error?.code,
            hasResponse: !!error?.response,
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          hypothesisId: 'H5',
        }),
      }).catch(() => {});
      // #endregion
      // Use centralized error handler to extract and format the exact error message
      logError(error, 'SignUp - Send OTP');
      const { title, message } = formatErrorForAlert(error, 'Sign Up');
      Alert.alert(title, message);
    },
  });

  /**
   * Handles sending OTP to phone/email
   * Calls API to send OTP before navigating to VerifyOTP screen
   */
  const handleSignUp = () => {
    // Validation
    const validationError = validateSignUpData();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    // Format phone number with country code if not using email
    let formattedPhone: string | undefined;
    if (!useEmail && phoneNumber) {
      const sanitizedPhone = sanitizePhoneNumber(phoneNumber);
      formattedPhone = sanitizedPhone.startsWith('+') ? sanitizedPhone : `+971${sanitizedPhone}`;

      // Validate phone number format
      if (!validatePhoneNumber(formattedPhone)) {
        Alert.alert(
          'Invalid Phone Number',
          'Please enter a valid phone number with country code (e.g., +917893173030)',
        );
        return;
      }
    }

    // Call API to send OTP (userType is already in correct format)
    sendOTPMutation.mutate({
      userType: userType as 'player' | 'organiser', // Cast to API type
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

  /**
   * Handle social login
   */
  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    logger.info(`${provider} login pressed`);
    if (provider === 'google') {
      await signInWithGoogle(userType as 'player' | 'organiser');
    } else {
      Alert.alert('Coming Soon', `${provider} login will be available soon.`);
    }
  };

  /**
   * Navigate to sign in screen
   */
  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  /**
   * Handle terms and conditions press
   */
  const handleTermsPress = () => {
    logger.info('Terms & Conditions pressed');
    // TODO: Open terms & conditions modal/webview
  };

  return {
    // State
    userType,
    setUserType,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    useEmail,
    isLoading: sendOTPMutation.isPending,

    // Actions
    handleSignUp,
    handleUseEmail,
    handleUseWhatsApp,
    handleSocialLogin,
    handleSignIn,
    handleTermsPress,
  };
};
