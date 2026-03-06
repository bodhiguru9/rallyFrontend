import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { authService } from '@services/auth-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import type { SignUpRequest } from '../../types/api/auth.types';
import type { RootStackParamList } from '@navigation';
import { logger } from '@dev-tools/logger';

type ProfileSetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileSetup'>;
type ProfileSetupScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>['route'];

/**
 * Custom hook for ProfileSetup screen (Step 3 of 3)
 * Collects: fullName, password, dob, gender, sports
 * Makes THE ONLY API call with ALL data from all 3 screens
 */
export const useProfileSetup = () => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const route = useRoute<ProfileSetupScreenRouteProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  // Get data passed from previous screens
  const { phoneNumber: initialPhoneNumber, email: initialEmail, userType } = route.params || {};

  // Profile form state
  const [email, setEmail] = useState(initialEmail || '');
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [primarySport, setPrimarySport] = useState('');
  const [secondarySport, setSecondarySport] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  // Signup mutation - makes the actual API call
  const signUpMutation = useMutation({
    mutationFn: authService.signUp,
    onSuccess: async (data) => {
      // Store user and token in auth store
      await setAuth(data.data.user, data.data.token, data.data.requiresOTPVerification);
      
      // Invalidate and refetch events on successful signup/login
      queryClient.invalidateQueries({ queryKey: ['player-events'] });
      logger.info('Events cache invalidated after signup');
    },
  });

  /**
   * Validates profile setup form data
   */
  const validateProfileData = (): string | null => {
    if (!fullName.trim()) {
      return 'Please enter your full name';
    }
    if (!password) {
      return 'Please enter a password';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!dateOfBirth) {
      return 'Please select your date of birth';
    }
    if (!gender) {
      return 'Please select your gender';
    }
    if (!primarySport) {
      return 'Please select your primary sport';
    }
    return null;
  };

  /**
   * Handles the complete signup with ALL collected data
   * This is the ONLY API call in the entire signup flow
   */
  const handleCompleteSignUp = async () => {
    // Validation
    const validationError = validateProfileData();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    // Prepare complete signup data with ALL information from all 3 screens
    // Note: This hook is deprecated - use ProfileSetupContext instead
    const signUpData: SignUpRequest = {
      // From Step 1 (SignUpScreen)
      userType: (userType || 'player') as 'player',
      // Use initialEmail/initialPhoneNumber to determine which was the primary signup method
      // Then include both if the user provided the optional field
      ...(initialEmail ? { email: initialEmail } : { mobileNumber: initialPhoneNumber }),
      // Add the optional field if provided
      ...(initialEmail && phoneNumber ? { mobileNumber: phoneNumber } : {}),
      ...(initialPhoneNumber && email ? { email } : {}),

      // From Step 3 (ProfileSetupScreen) - Player fields only
      password,
      fullName: fullName.trim(),
      dob: dateOfBirth,
      gender,
      sport1: primarySport,
      sport2: secondarySport || undefined,
      profilePic: avatar || undefined,
    } as SignUpRequest;

    try {
      const result = await signUpMutation.mutateAsync(signUpData);

      if (result.success) {
        // Show success message and navigate to Home
        Alert.alert(
          'Success',
          'Your account has been created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Home');
              },
            },
          ]
        );
      }
    } catch (error: unknown) {
      // Use centralized error handling utility
      logError(error, 'ProfileSetup - Complete Signup');
      const { title, message } = formatErrorForAlert(error, 'Signup');
      Alert.alert(title, message);
    }
  };

  /**
   * Handle avatar/profile picture selection
   */
  const handleAvatarSelect = (imageUri: string) => {
    setAvatar(imageUri);
  };

  /**
   * Handle date of birth change
   * Expected format: YYYY-MM-DD (for API)
   */
  const handleDateChange = (date: string) => {
    setDateOfBirth(date);
  };

  return {
    // State from previous screens
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    userType,

    // Profile form state
    fullName,
    setFullName,
    password,
    setPassword,
    dateOfBirth,
    gender,
    setGender,
    primarySport,
    setPrimarySport,
    secondarySport,
    setSecondarySport,
    avatar,

    // Loading state
    isLoading: signUpMutation.isPending,

    // Actions
    handleCompleteSignUp,
    handleAvatarSelect,
    handleDateChange,
  };
};
