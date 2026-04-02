import React, { createContext, useContext } from 'react';
import { Alert, Platform } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authService } from '@services/auth-service';
import { useAuthStore } from '@store/auth-store';
import { useSignupFormStore } from '@store/signup-form-store';
import { formatErrorForAlert, logError } from '@utils';
import {
  IProfileSetupContextValue,
  IProfileSetupProviderProps,
  TProfileSetupScreenNavigationProp,
  TProfileSetupScreenRouteProp,
} from './ProfileSetup.context.types';

const ProfileSetupContext = createContext<IProfileSetupContextValue | undefined>(undefined);

export const ProfileSetupProvider: React.FC<IProfileSetupProviderProps> = ({ children }) => {
  const navigation = useNavigation<TProfileSetupScreenNavigationProp>();
  const route = useRoute<TProfileSetupScreenRouteProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const signupToken = useAuthStore((state) => state.signupToken);
  const clearSignupToken = useAuthStore((state) => state.clearSignupToken);

  // Get data passed from previous screens
  const { phoneNumber: initialPhoneNumber, email: initialEmail, userType } = route.params || {};

  // Form state — backed by signup form store so it survives back-navigation
  const store = useSignupFormStore();
  const email = store.email || initialEmail || '';
  const setEmail = store.setEmail;
  const phoneNumber = store.phoneNumber || initialPhoneNumber || '';
  const setPhoneNumber = store.setPhoneNumber;
  const fullName = store.fullName;
  const setFullName = store.setFullName;
  const password = store.password;
  const setPassword = store.setPassword;
  const confirmPassword = store.confirmPassword;
  const setConfirmPassword = store.setConfirmPassword;
  const primarySport = store.primarySport;
  const setPrimarySport = store.setPrimarySport;
  const secondarySport = store.secondarySport;
  const setSecondarySport = store.setSecondarySport;
  const avatar = store.avatar;

  // Player-specific state
  const dateOfBirth = store.dateOfBirth;
  const gender = store.gender;
  const setGender = store.setGender;

  // Organiser-specific state
  const yourBest = store.yourBest;
  const setYourBest = store.setYourBest;
  const communityName = store.communityName;
  const setCommunityName = store.setCommunityName;
  const yourCity = store.yourCity;
  const setYourCity = store.setYourCity;
  const additionalSports = store.additionalSports;
  const setAdditionalSports = store.setAdditionalSports;
  const additionalSportText = store.additionalSportText;
  const setAdditionalSportText = store.setAdditionalSportText;
  const showAdditionalSport = store.showAdditionalSport;
  const setShowAdditionalSport = store.setShowAdditionalSport;
  const bio = store.bio;
  const setBio = store.setBio;
  const instagramLink = store.instagramLink;
  const setInstagramLink = store.setInstagramLink;
  const profileVisibility = store.profileVisibility;
  const setProfileVisibility = store.setProfileVisibility;

  // Signup mutation - makes the actual API call.
  // Token/user saving is done in handleCompleteSignUp after mutateAsync so we can catch
  // Android-specific failures (e.g. SecureStore) and show a proper message instead of "Network error".
  const signUpMutation = useMutation({
    mutationFn: authService.signUp,
  });

  /**
   * Validates profile setup form data based on user type
   */
  const validateProfileData = (): string | null => {
    // Common validations
    if (!fullName.trim()) {
      return 'Please enter your full name';
    }
    if (!password) {
      return 'Please enter a password';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!primarySport) {
      return 'Please select your primary sport';
    }

    // Player-specific validations
    if (userType === 'player') {
      if (!dateOfBirth) {
        return 'Please select your date of birth';
      }
      if (!gender) {
        return 'Please select your gender';
      }
    }

    // Organiser-specific validations
    if (userType === 'organiser') {
      if (password !== confirmPassword) {
        return 'Passwords do not match';
      }
      if (!avatar) {
        return 'Please add a profile photo';
      }
      if (!yourBest) {
        return 'Please select your role';
      }
      if (!communityName.trim()) {
        return 'Please enter your community name';
      }
      if (!yourCity.trim()) {
        return 'Please enter your city';
      }
      if (!bio.trim()) {
        return 'Please enter a bio';
      }
      if (bio.trim().length < 20) {
        return 'Bio must be at least 20 characters';
      }
      // Validate Instagram link if provided
      if (instagramLink && !instagramLink.match(/^https?:\/\/(www\.)?instagram\.com\/.+/i)) {
        return 'Please enter a valid Instagram URL';
      }
    }

    return null;
  };

  /**
   * Handles the complete signup with ALL collected data
   * This is the ONLY API call in the entire signup flow
   */
  const handleCompleteSignUp = async () => {
    if (__DEV__) {
      console.warn('[SIGNUP_FLOW] 1. ProfileSetup: handleCompleteSignUp started');
    }
    // Validation
    const validationError = validateProfileData();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    // Validate signupToken exists
    if (!signupToken) {
      Alert.alert('Error', 'Signup token is missing. Please restart the signup process.');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();

    // Append common fields
    formData.append('userType', userType || 'player');
    formData.append('signupToken', signupToken);

    if (initialPhoneNumber && email.trim()) {
      formData.append('email', email.trim());
    }
    if (initialEmail && phoneNumber.trim()) {
      formData.append('mobileNumber', phoneNumber.trim());
    }

    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('fullName', fullName.trim());
    formData.append('sport1', primarySport);

    if (secondarySport) {
      formData.append('sport2', secondarySport);
    }

    // Append avatar file if it exists
    if (avatar) {
      // Extract filename from URI or use default
      const filename = avatar.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('profilePic', {
        uri: avatar,
        name: filename,
        type,
      } as any);
    }

    // Append user type specific fields
    if (userType === 'player') {
      formData.append('dob', dateOfBirth);
      formData.append('gender', gender);
    } else {
      // Organiser
      formData.append('yourBest', yourBest);
      formData.append('communityName', communityName.trim());
      formData.append('yourCity', yourCity.trim());

      if (additionalSports.length > 0) {
        additionalSports.forEach((sport) => {
          formData.append('sports', sport);
        });
      }

      if (showAdditionalSport && additionalSportText.trim()) {
        formData.append('sports', additionalSportText.trim());
      }

      formData.append('bio', bio.trim());

      if (instagramLink) {
        formData.append('instagramLink', instagramLink);
      }

      formData.append('profileVisibility', profileVisibility || 'private');
    }

    console.log(formData);

    if (__DEV__) {
      console.warn('[SIGNUP_FLOW] 2. ProfileSetup: FormData built, calling signUpMutation.mutateAsync', {
        userType,
        hasAvatar: !!avatar,
        platform: Platform.OS,
      });
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'ProfileSetup.context.tsx:handleCompleteSignUp:beforeMutate', message: 'Complete signup mutate', data: { platform: Platform.OS, userType, hasAvatar: !!avatar }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'H1' }) }).catch(() => { });
    // #endregion

    try {
      const result = await signUpMutation.mutateAsync(formData);
      if (__DEV__) {
        console.warn('[SIGNUP_FLOW] 2b. ProfileSetup: signUpMutation.mutateAsync SUCCESS', {
          success: result?.success,
        });
      }
      if (result?.success && result?.data) {
        // Save token and user on the main flow so we can catch Android SecureStore failures
        try {
          await setAuth(
            result.data.user,
            result.data.token,
            result.data.requiresOTPVerification,
          );
          clearSignupToken();
          store.clearSignupForm();
        } catch (saveError) {
          if (__DEV__) {
            console.warn('[SIGNUP_FLOW] setAuth failed (e.g. SecureStore on Android)', saveError);
          }
          logError(saveError, 'ProfileSetup - Save session after signup');
          Alert.alert(
            'Signup Succeeded',
            'Your account was created, but we could not save your session on this device. Please sign in with your email and password.',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('SignIn'),
              },
            ],
          );
          return;
        }
        // Navigation is handled automatically by global route protection listeners
        // No manual navigation or Alert is required.
      }
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      if (__DEV__) {
        console.warn('[SIGNUP_FLOW] 7. ProfileSetup CATCH — error shown to user (thrown from auth-service signUp)', {
          message: err?.message,
          code: err?.code,
          hasResponse: !!err?.response,
          status: (err?.response as { status?: number })?.status ?? err?.statusCode,
          errorProp: err?.error,
          isTokenExpired: err?.isTokenExpired,
          platform: Platform.OS,
        });
      }
      // Use centralized error handling utility
      logError(error, 'ProfileSetup - Complete Signup');
      
      // Check if token expired - provide helpful navigation options
      const isTokenExpired = err?.isTokenExpired === true || err?.statusCode === 401 || err?.statusCode === 410;
      
      if (isTokenExpired) {
        // Token expired - offer to go back to verify OTP again or restart signup
        Alert.alert(
          'Signup Session Expired',
          'Your signup session has expired. Since your OTP is still valid, you can go back to verify your OTP again, or restart the signup process.',
          [
            {
              text: 'Go Back to Verify OTP',
              onPress: () => {
                // Navigate back to VerifyOTP screen
                navigation.navigate('VerifyOTP', {
                  flow: 'signup',
                  phoneNumber: initialPhoneNumber || '',
                  email: initialEmail || '',
                  userType: userType || 'player',
                });
              },
            },
            {
              text: 'Restart Signup',
              style: 'destructive',
              onPress: () => {
                // Clear signup token and go back to signup screen
                clearSignupToken();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignUp' }],
                });
              },
            },
          ],
        );
      } else {
        // Other errors - use standard error handling
        const { title, message } = formatErrorForAlert(error, 'Signup');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'ProfileSetup.context.tsx:handleCompleteSignUp:catch', message: 'Complete signup error shown', data: { platform: Platform.OS, title, message, errorMessage: (error as any)?.message, errorCode: (error as any)?.code }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'H1' }) }).catch(() => { });
        // #endregion
        Alert.alert(title, message);
      }
    }
  };

  /**
   * Handle avatar/profile picture selection
   */
  const handleAvatarSelect = (imageUri: string) => {
    store.setAvatar(imageUri);
  };

  /**
   * Handle date of birth change
   * Expected format: YYYY-MM-DD (for API)
   */
  const handleDateChange = (date: string) => {
    store.setDateOfBirth(date);
  };

  const value: IProfileSetupContextValue = {
    // Contact info
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    userType,
    initialEmail,
    initialPhoneNumber,

    // Common profile form state
    fullName,
    setFullName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    primarySport,
    setPrimarySport,
    secondarySport,
    setSecondarySport,
    avatar,

    // Player-specific fields
    dateOfBirth,
    gender,
    setGender,

    // Organiser-specific fields
    yourBest,
    setYourBest,
    communityName,
    setCommunityName,
    yourCity,
    setYourCity,
    additionalSports,
    setAdditionalSports,
    additionalSportText,
    setAdditionalSportText,
    showAdditionalSport,
    setShowAdditionalSport,
    bio,
    setBio,
    instagramLink,
    setInstagramLink,
    profileVisibility,
    setProfileVisibility,

    // Loading state
    isLoading: signUpMutation.isPending,

    // Actions
    handleCompleteSignUp,
    handleAvatarSelect,
    handleDateChange,
  };

  return <ProfileSetupContext.Provider value={value}>{children}</ProfileSetupContext.Provider>;
};

/**
 * Hook to access ProfileSetup context
 */
export const useProfileSetupContext = (): IProfileSetupContextValue => {
  const context = useContext(ProfileSetupContext);
  if (!context) {
    throw new Error('useProfileSetupContext must be used within ProfileSetupProvider');
  }
  return context;
};
