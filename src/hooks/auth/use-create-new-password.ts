import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RootStackParamList } from '@navigation';
import { authService } from '@services';
import { useAuthStore } from '@store';
import { logger } from '@dev-tools/logger';

type CreateNewPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateNewPassword'
>;

/**
 * Custom hook for CreateNewPassword screen
 * Sets new password using verificationToken from forgot password flow
 */
export const useCreateNewPassword = () => {
  const navigation = useNavigation<CreateNewPasswordScreenNavigationProp>();
  const setGlobalLoading = useAuthStore((state) => state.setGlobalLoading);
  const verificationToken = useAuthStore((state) => state.verificationToken);
  const clearVerificationToken = useAuthStore((state) => state.clearVerificationToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  // Form state
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);

  /**
   * Validates password form data
   */
  const validatePasswordData = (): string | null => {
    if (!password) {
      return 'Please enter a password';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!reEnterPassword) {
      return 'Please re-enter your password';
    }
    if (password !== reEnterPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  /**
   * Set new password mutation
   */
  const setNewPasswordMutation = useMutation({
    mutationFn: authService.setNewPassword,
    onMutate: () => {
      setGlobalLoading(true, 'Setting new password...');
    },
    onSuccess: async (response) => {
      setGlobalLoading(false);

      // Clear verification token
      clearVerificationToken();

      // If API returns user and token, log them in
      if (response.data?.user && response.data?.token) {
        await setAuth(response.data.user, response.data.token);
        
        // Invalidate and refetch events on successful login
        queryClient.invalidateQueries({ queryKey: ['player-events'] });
        logger.info('Events cache invalidated after password reset login');
        
        Alert.alert('Success', response.message || 'Password reset successfully', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home');
            },
          },
        ]);
      } else {
        // Otherwise navigate to sign in
        Alert.alert('Success', response.message || 'Password reset successfully', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('SignIn');
            },
          },
        ]);
      }
    },
    onError: (error: any) => {
      setGlobalLoading(false);
      Alert.alert('Error', error.message || 'Failed to set new password. Please try again.');
    },
  });

  /**
   * Handles setting new password
   */
  const handleSetPassword = () => {
    // Validation
    const validationError = validatePasswordData();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    // Validate verification token exists
    if (!verificationToken) {
      Alert.alert('Error', 'Verification token is missing. Please restart the forgot password process.');
      return;
    }

    // Call API to set new password
    setNewPasswordMutation.mutate({
      verificationToken,
      password,
    });
  };

  /**
   * Toggle password visibility
   */
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Toggle re-enter password visibility
   */
  const toggleShowReEnterPassword = () => {
    setShowReEnterPassword(!showReEnterPassword);
  };

  return {
    // State
    password,
    setPassword,
    reEnterPassword,
    setReEnterPassword,
    showPassword,
    showReEnterPassword,
    isLoading: setNewPasswordMutation.isPending,

    // Actions
    handleSetPassword,
    toggleShowPassword,
    toggleShowReEnterPassword,
  };
};
