import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import type { RootStackParamList } from '@navigation';
import { authService } from '@services';
import { useAuthStore } from '@store';

type VerifyOTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyOTP'>;
type VerifyOTPScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'VerifyOTP'>['route'];

const RESEND_COUNTDOWN_SECONDS = 60;

/**
 * Custom hook for VerifyOTP screen (Step 2 of 3)
 * Collects: OTP code
 * Verifies OTP via API before navigating to ProfileSetup
 */
export const useVerifyOTP = () => {
  const navigation = useNavigation<VerifyOTPScreenNavigationProp>();
  const route = useRoute<VerifyOTPScreenRouteProp>();
  const setGlobalLoading = useAuthStore((state) => state.setGlobalLoading);
  const setSignupToken = useAuthStore((state) => state.setSignupToken);
  const setVerificationToken = useAuthStore((state) => state.setVerificationToken);

  // Get data passed from previous screen
  const { flow, phoneNumber, email, userType } = route.params;

  // OTP form state
  const [otpCode, setOtpCode] = useState('');
  const [hasInteracted, setHasInteracted] = useState(true);
  // Initialize countdown directly instead of using useEffect
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN_SECONDS);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref to prevent multiple verification calls
  const isVerifyingRef = useRef(false);

  // Handle countdown timer - only start when user has interacted
  useEffect(() => {
    if (hasInteracted && countdown > 0) {
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
  }, [countdown, hasInteracted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  /**
   * Validates OTP code
   */
  const validateOTP = (): string | null => {
    if (!otpCode) {
      return 'Please enter the OTP code';
    }
    if (otpCode.length !== 6) {
      return 'OTP must be 6 digits';
    }
    return null;
  };

  /**
   * Verify Signup OTP mutation
   */
  const verifySignupOTPMutation = useMutation({
    mutationFn: authService.verifySignupOTP,
    onMutate: () => {
      setGlobalLoading(true, 'Verifying OTP...');
    },
    onSuccess: (response) => {
      setGlobalLoading(false);
      // Reset verification flag
      isVerifyingRef.current = false;

      // Store signup token for use in ProfileSetup/signup API call
      setSignupToken(response.data.signupToken);

      // Navigate to ProfileSetup with all collected data
      navigation.navigate('ProfileSetup', {
        phoneNumber,
        email,
        userType: userType || 'player',
      });
    },
    onError: (error: any) => {
      setGlobalLoading(false);
      // Reset verification flag
      isVerifyingRef.current = false;
      Alert.alert('Error', error.message || 'Failed to verify OTP. Please try again.');
    },
  });

  /**
   * Verify Forgot Password OTP mutation
   */
  const verifyForgotPasswordOTPMutation = useMutation({
    mutationFn: authService.verifyForgotPasswordOTP,
    onMutate: () => {
      setGlobalLoading(true, 'Verifying OTP...');
    },
    onSuccess: (response) => {
      setGlobalLoading(false);
      // Reset verification flag
      isVerifyingRef.current = false;

      // Store verification token for use in CreateNewPassword
      setVerificationToken(response.data.verificationToken);

      // Navigate to CreateNewPassword
      navigation.navigate('CreateNewPassword', {
        phoneNumber,
        email,
      });
    },
    onError: (error: any) => {
      setGlobalLoading(false);
      // Reset verification flag
      isVerifyingRef.current = false;
      Alert.alert('Error', error.message || 'Failed to verify OTP. Please try again.');
    },
  });

  /**
   * Resend Signup OTP mutation
   */
  const resendSignupOTPMutation = useMutation({
    mutationFn: authService.sendSignupOTP,
    onMutate: () => {
      setGlobalLoading(true, 'Resending OTP...');
    },
    onSuccess: (_response) => {
      setGlobalLoading(false);
      // Reset countdown timer
      setCountdown(RESEND_COUNTDOWN_SECONDS);
    },
    onError: (error: any) => {
      setGlobalLoading(false);
      Alert.alert('Error', error.message || 'Failed to resend OTP. Please try again.');
    },
  });

  /**
   * Resend Forgot Password OTP mutation
   */
  const resendForgotPasswordOTPMutation = useMutation({
    mutationFn: authService.sendForgotPasswordOTP,
    onMutate: () => {
      setGlobalLoading(true, 'Resending OTP...');
    },
    onSuccess: (_response) => {
      setGlobalLoading(false);
      // Reset countdown timer
      setCountdown(RESEND_COUNTDOWN_SECONDS);
    },
    onError: (error: any) => {
      setGlobalLoading(false);
      Alert.alert('Error', error.message || 'Failed to resend OTP. Please try again.');
    },
  });

  /**
   * Handles OTP input focus - triggers resend button visibility
   */
  const handleOTPFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  /**
   * Handles OTP verification - routes to appropriate flow
   * Calls API to verify OTP before navigating
   */
  const handleVerifyOTP = useCallback(() => {
    // Prevent multiple simultaneous calls
    if (isVerifyingRef.current) {
      return;
    }

    // Check if mutation is already pending
    const isPending =
      verifySignupOTPMutation.isPending || verifyForgotPasswordOTPMutation.isPending;
    if (isPending) {
      return;
    }

    // Validation
    const validationError = validateOTP();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    // Set flag to prevent multiple calls
    isVerifyingRef.current = true;

    if (flow === 'forgotPassword') {
      // Forgot password flow
      verifyForgotPasswordOTPMutation.mutate({
        ...(email && { email }),
        ...(phoneNumber && { mobileNumber: phoneNumber }),
        otp: otpCode,
      });
    } else {
      // Signup flow - userType is already in correct format ('player' | 'organiser')
      verifySignupOTPMutation.mutate({
        userType: (userType || 'player') as 'player' | 'organiser',
        ...(email && { email }),
        ...(phoneNumber && { mobileNumber: phoneNumber }),
        otp: otpCode,
      });
    }
  }, [
    flow,
    email,
    phoneNumber,
    otpCode,
    userType,
    verifySignupOTPMutation,
    verifyForgotPasswordOTPMutation,
  ]);

  /**
   * Handles OTP completion (auto-submit when all 6 digits entered)
   */
  const handleOTPComplete = useCallback(
    (code: string) => {
      setOtpCode(code);
      // Auto-verify when all digits are entered
      if (code.length === 6 && !isVerifyingRef.current) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          handleVerifyOTP();
        }, 100);
      }
    },
    [handleVerifyOTP],
  );

  /**
   * Handles resending OTP code - routes to appropriate flow
   */
  const handleResendOTP = () => {
    if (countdown > 0) {
      return; // Prevent clicking during countdown
    }

    if (flow === 'forgotPassword') {
      // Forgot password flow
      resendForgotPasswordOTPMutation.mutate({
        ...(email && { email }),
        ...(phoneNumber && { mobileNumber: phoneNumber }),
      });
    } else {
      // Signup flow - userType is already in correct format ('player' | 'organiser')
      resendSignupOTPMutation.mutate({
        userType: (userType || 'player') as 'player' | 'organiser',
        ...(email && { email }),
        ...(phoneNumber && { mobileNumber: phoneNumber }),
      });
    }
  };

  return {
    // Data from previous screen
    flow,
    phoneNumber,
    email,

    // OTP form state
    otpCode,
    setOtpCode,
    countdown,
    hasInteracted,

    // Loading state
    isLoading:
      verifySignupOTPMutation.isPending ||
      verifyForgotPasswordOTPMutation.isPending ||
      resendSignupOTPMutation.isPending ||
      resendForgotPasswordOTPMutation.isPending,

    // Actions
    handleVerifyOTP,
    handleResendOTP,
    handleOTPComplete,
    handleOTPFocus,
  };
};
