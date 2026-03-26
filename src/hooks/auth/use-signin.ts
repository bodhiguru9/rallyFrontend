import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '@services/auth-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import type { LoginRequest } from '../../types/api/auth.types';
import type { RootStackParamList } from '@navigation';
import { logger } from '@dev-tools/logger';
import { useGoogleAuth } from './use-google-auth';

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

/**
 * Custom hook for SignIn screen
 * Handles sign in with email or mobile number
 */
export const useSignIn = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { signInWithGoogle } = useGoogleAuth();

  // Form state
  const [useEmail, setUseEmail] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: authService.signIn,
    onSuccess: async (data) => {
      logger.success('Sign in successful', {
        userId: data.data.user.id,
        userType: data.data.user.userType,
      });

      // Map login response user to full User type
      const responseUser = data.data.user;
      const userId =
        typeof responseUser.id === 'string' ? parseInt(responseUser.id, 10) : responseUser.id;

      const user = {
        id: userId,
        userId: responseUser.userId ?? userId,
        mongoId: responseUser.mongoId ?? '',
        profilePic: responseUser.profilePic ?? null,
        isMobileVerified: responseUser.isMobileVerified ?? false,
        email: responseUser.email,
        mobileNumber: responseUser.mobileNumber,
        fullName: responseUser.fullName,
        userType: responseUser.userType,
        dob: responseUser.dob ?? '',
        gender: (responseUser.gender ?? 'male') as 'male' | 'female' | 'other',
        sport1: responseUser.sport1 ?? '',
        sport2: responseUser.sport2,
        sports: responseUser.sports ?? [],
        followingCount: responseUser.followingCount ?? 0,
        profileVisibility: (responseUser.profileVisibility ?? 'private') as 'public' | 'private' | undefined,
      };
      await setAuth(user, data.data.token);
    },
    onError: (error) => {
      logger.error('Sign in failed', error);
    },
  });

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
   * Validates sign in form data
   */
  const validateSignInData = (): string | null => {
    if (useEmail && !email.trim()) {
      return 'Please enter your email';
    }
    if (!useEmail && !phoneNumber.trim()) {
      return 'Please enter your phone number';
    }
    if (!password) {
      return 'Please enter your password';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  /**
   * Handles the complete sign in flow
   */
  const handleSignIn = async () => {
    logger.debug('Sign in attempt', {
      useEmail,
      email: useEmail ? email : undefined,
      mobileNumber: useEmail ? undefined : phoneNumber,
    });

    // Validation
    const validationError = validateSignInData();
    if (validationError) {
      logger.warn('Sign in validation failed', { error: validationError });
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

    // Prepare sign in data
    const signInData: LoginRequest = {
      ...(useEmail ? { email: email.trim() } : { mobileNumber: formattedPhone }),
      password,
    };

    try {
      const result = await signInMutation.mutateAsync(signInData);

      if (result.success) {
        // Navigate to Home (handles both player and organiser)
        Alert.alert('Success', 'Signed in successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home');
            },
          },
        ]);
      }
    } catch (error: unknown) {
      // Use centralized error handling utility
      logError(error, 'SignIn - handleSignIn');
      const { title, message } = formatErrorForAlert(error, 'Sign In');
      Alert.alert(title, message);
    }
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
   * Navigate to forgot password screen
   */
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  /**
   * Navigate to sign up screen
   */
  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return {
    // State
    useEmail,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    password,
    setPassword,
    isLoading: signInMutation.isPending,

    // Actions
    handleSignIn,
    handleGoogleSignIn: () => signInWithGoogle('player'),
    handleUseEmail,
    handleUseWhatsApp,
    handleForgotPassword,
    handleSignUp,
  };
};
