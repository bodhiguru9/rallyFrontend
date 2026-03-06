import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '@services/auth-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import type { LoginRequest, LoginResponse } from '../../types/api/auth.types';
import type { RootStackParamList } from '@navigation';
import { logger } from '@dev-tools/logger';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UseLoginParams {
  email?: string;
  mobileNumber?: string;
  password: string;
}

/**
 * Custom hook for user login with complete business logic
 * Handles validation, API call, state management, and navigation
 */
export const useLogin = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data: LoginResponse) => {
      logger.success('Login successful', {
        userId: data.data.user.id,
        userType: data.data.user.userType,
      });

      // Store user and token in auth store
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

      // Invalidate and refetch events on successful login
      queryClient.invalidateQueries({ queryKey: ['player-events'] });
      logger.info('Events cache invalidated after login');
    },
    onError: (error: unknown) => {
      logger.error('Login failed', error);
    },
  });

  /**
   * Validates login form data
   */
  const validateLoginData = (params: UseLoginParams): string | null => {
    if (!params.email && !params.mobileNumber) {
      return 'Please enter your email or mobile number';
    }
    if (!params.password) {
      return 'Please enter your password';
    }
    return null;
  };

  /**
   * Handles the complete login flow
   */
  const handleLogin = async (params: UseLoginParams) => {
    logger.debug('Login attempt', {
      email: params.email,
      mobileNumber: params.mobileNumber,
    });

    // Validation
    const validationError = validateLoginData(params);
    if (validationError) {
      logger.warn('Login validation failed', { error: validationError });
      Alert.alert('Error', validationError);
      return;
    }

    // Prepare login data
    const loginData: LoginRequest = {
      ...(params.email ? { email: params.email } : { mobileNumber: params.mobileNumber }),
      password: params.password,
    };

    try {
      const result: LoginResponse = await loginMutation.mutateAsync(loginData);

      if (result.success) {
        // Navigate to Home (handles both player and organiser)
        Alert.alert('Success', 'Login successful!', [
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
      logError(error, 'Login - handleLogin');
      const { title, message } = formatErrorForAlert(error, 'Login');
      Alert.alert(title, message);
    }
  };

  return {
    handleLogin,
    isLoading: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error,
  };
};
