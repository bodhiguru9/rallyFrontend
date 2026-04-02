import { useMutation } from '@tanstack/react-query';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { authService } from '@services/auth-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import type { RootStackParamList } from '@navigation';
import { logger } from '@dev-tools/logger';
import type { GoogleOAuthRequest, GoogleOAuthResponse } from '@app-types/api/auth.types';
import React from 'react';

WebBrowser.maybeCompleteAuthSession();

type GoogleAuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Custom hook for Google OAuth authentication
 */
export const useGoogleAuth = () => {
  const navigation = useNavigation<GoogleAuthNavigationProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setGlobalLoading = useAuthStore((state) => state.setGlobalLoading);

  const getClientId = (): string => {
    const googleOAuth =
      Constants.expoConfig?.extra?.googleOAuth ||
      // fallback for older Expo manifest shape
      (Constants.manifest as { extra?: { googleOAuth?: { [key: string]: string } } } | null)?.extra
        ?.googleOAuth ||
      {};

    // For Expo Go, we MUST use the Web Client ID
    if (Constants.appOwnership === 'expo') {
      return googleOAuth.webClientId || '';
    }

    if (Platform.OS === 'ios') {
      return googleOAuth.iosClientId || '';
    }
    if (Platform.OS === 'android') {
      return googleOAuth.androidClientId || '';
    }
    return googleOAuth.webClientId || '';
  };

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getClientId(),
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      usePKCE: false,
      redirectUri: Constants.appOwnership === 'expo'
        ? `https://auth.expo.io/@${Constants.expoConfig?.owner || 'ayush04k'}/${Constants.expoConfig?.slug || 'rally-app'}`
        : AuthSession.makeRedirectUri({ 
            scheme: typeof Constants.expoConfig?.scheme === 'string' 
              ? Constants.expoConfig.scheme 
              : 'rally-app' 
          }),
    },
    discovery
  );

  const oauthMutation = useMutation({
    mutationFn: async (data: GoogleOAuthRequest): Promise<GoogleOAuthResponse> => {
      const response = await authService.googleOAuth(data);
      return response;
    },
    onSuccess: async (data: GoogleOAuthResponse) => {
      logger.success('Google OAuth successful', {
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
      logger.error('Google OAuth failed', error);
      const { title, message } = formatErrorForAlert(error, 'Google Sign In');
      Alert.alert(title, message);
    },
  });

  const signInWithGoogle = async (userType: 'player' | 'organiser' = 'player') => {
    try {
      if (!request) {
        Alert.alert('Google Sign In', 'Auth request not ready. Please try again.');
        return;
      }

      setGlobalLoading(true, 'Signing in with Google...');

      logger.info('Google OAuth hook request', { 
        redirectUri: request?.redirectUri,
        clientId: request?.clientId 
      });

      // Note: useProxy is true by default in Expo Go when using useAuthRequest
      const result = await promptAsync();

      if (result.type === 'success') {
        const { id_token } = result.params;

        if (!id_token) {
          throw new Error('No ID token received from Google');
        }

        logger.debug('Google OAuth token received', { hasToken: !!id_token });

        await oauthMutation.mutateAsync({
          userType,
          idToken: id_token,
        });
      } else if (result.type === 'error') {
        const message =
          typeof result.error?.message === 'string'
            ? result.error.message
            : 'Google sign-in failed';
        throw new Error(message);
      } else {
        setGlobalLoading(false);
        logger.info('Google sign-in cancelled by user');
      }
    } catch (error: unknown) {
      setGlobalLoading(false);
      logError(error, 'Google OAuth - signInWithGoogle');
      const { title, message } = formatErrorForAlert(error, 'Google Sign In');
      Alert.alert(title, message);
    }
  };

  return {
    signInWithGoogle,
    isLoading: oauthMutation.isPending || false,
    isError: oauthMutation.isError,
    error: oauthMutation.error,
  };
};
