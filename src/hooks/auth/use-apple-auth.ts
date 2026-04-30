import { useMutation } from '@tanstack/react-query';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { authService } from '@services/auth-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import type { RootStackParamList } from '@navigation';
import { logger } from '@dev-tools/logger';
import type { AppleOAuthRequest, AppleOAuthResponse } from '@app-types/api/auth.types';
import React from 'react';

WebBrowser.maybeCompleteAuthSession();

type AppleAuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Custom hook for Apple OAuth authentication
 */
export const useAppleAuth = () => {
  const navigation = useNavigation<AppleAuthNavigationProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setGlobalLoading = useAuthStore((state) => state.setGlobalLoading);

  const getClientId = (): string => {
    // For Apple, this is the Service ID for web-based auth or the Bundle Identifier
    return (
      Constants.expoConfig?.extra?.appleServiceId || 
      Constants.expoConfig?.ios?.bundleIdentifier || 
      'com.rallysports.app'
    );
  };

  const discovery = {
    authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
    tokenEndpoint: 'https://appleid.apple.com/auth/token',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getClientId(),
      scopes: ['name', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: typeof Constants.expoConfig?.scheme === 'string' 
          ? Constants.expoConfig.scheme 
          : 'rally-app' 
      }),
    },
    discovery
  );

  const oauthMutation = useMutation({
    mutationFn: async (data: AppleOAuthRequest): Promise<AppleOAuthResponse> => {
      const response = await authService.appleOAuth(data);
      return response;
    },
    onSuccess: async (data: AppleOAuthResponse) => {
      logger.success('Apple OAuth successful', {
        userId: data.data.user.id,
        userType: data.data.user.userType,
      });

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
      setGlobalLoading(false);
      // Navigation is handled automatically by global route protection listeners
    },
    onError: (error: unknown) => {
      setGlobalLoading(false);
      logger.error('Apple OAuth failed', error);
      const { title, message } = formatErrorForAlert(error, 'Apple Sign In');
      Alert.alert(title, message);
    },
  });

  const signInWithApple = async (userType: 'player' | 'organiser' = 'player') => {
    try {
      if (!request) {
        Alert.alert('Apple Sign In', 'Auth request not ready. Please try again.');
        return;
      }

      setGlobalLoading(true, 'Signing in with Apple...');

      logger.info('Apple OAuth hook request', { 
        redirectUri: request?.redirectUri,
        clientId: request?.clientId 
      });

      const result = await promptAsync();

      if (result.type === 'success') {
        const { id_token } = result.params;

        if (!id_token) {
          throw new Error('No ID token received from Apple');
        }

        logger.debug('Apple OAuth token received', { hasToken: !!id_token });

        await oauthMutation.mutateAsync({
          userType,
          idToken: id_token,
        });
      } else if (result.type === 'error') {
        const message =
          typeof result.error?.message === 'string'
            ? result.error.message
            : 'Apple sign-in failed';
        throw new Error(message);
      } else {
        setGlobalLoading(false);
        logger.info('Apple sign-in cancelled by user');
      }
    } catch (error: unknown) {
      setGlobalLoading(false);
      logError(error, 'Apple OAuth - signInWithApple');
      const { title, message } = formatErrorForAlert(error, 'Apple Sign In');
      Alert.alert(title, message);
    }
  };

  return {
    signInWithApple,
    isLoading: oauthMutation.isPending || false,
    isError: oauthMutation.isError,
    error: oauthMutation.error,
  };
};
