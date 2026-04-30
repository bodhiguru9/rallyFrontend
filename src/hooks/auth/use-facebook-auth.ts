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
import type { FacebookOAuthRequest, FacebookOAuthResponse } from '@app-types/api/auth.types';
import React from 'react';

WebBrowser.maybeCompleteAuthSession();

type FacebookAuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Custom hook for Facebook OAuth authentication
 */
export const useFacebookAuth = () => {
  const navigation = useNavigation<FacebookAuthNavigationProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setGlobalLoading = useAuthStore((state) => state.setGlobalLoading);

  const getAppId = (): string => {
    // This should be configured in app.json/app.config.js
    return (
      Constants.expoConfig?.extra?.facebookAppId || 
      'YOUR_FACEBOOK_APP_ID'
    );
  };

  const discovery = {
    authorizationEndpoint: 'https://www.facebook.com/v12.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v12.0/oauth/access_token',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getAppId(),
      scopes: ['public_profile', 'email'],
      responseType: AuthSession.ResponseType.Token,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: typeof Constants.expoConfig?.scheme === 'string' 
          ? Constants.expoConfig.scheme 
          : 'rally-app' 
      }),
    },
    discovery
  );

  const oauthMutation = useMutation({
    mutationFn: async (data: FacebookOAuthRequest): Promise<FacebookOAuthResponse> => {
      const response = await authService.facebookOAuth(data);
      return response;
    },
    onSuccess: async (data: FacebookOAuthResponse) => {
      logger.success('Facebook OAuth successful', {
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
      logger.error('Facebook OAuth failed', error);
      const { title, message } = formatErrorForAlert(error, 'Facebook Sign In');
      Alert.alert(title, message);
    },
  });

  const signInWithFacebook = async (userType: 'player' | 'organiser' = 'player') => {
    try {
      if (!request) {
        Alert.alert('Facebook Sign In', 'Auth request not ready. Please try again.');
        return;
      }

      setGlobalLoading(true, 'Signing in with Facebook...');

      logger.info('Facebook OAuth hook request', { 
        redirectUri: request?.redirectUri,
        clientId: request?.clientId 
      });

      const result = await promptAsync();

      if (result.type === 'success') {
        const { access_token } = result.params;

        if (!access_token) {
          throw new Error('No access token received from Facebook');
        }

        logger.debug('Facebook OAuth token received', { hasToken: !!access_token });

        await oauthMutation.mutateAsync({
          userType,
          accessToken: access_token,
        });
      } else if (result.type === 'error') {
        const message =
          typeof result.error?.message === 'string'
            ? result.error.message
            : 'Facebook sign-in failed';
        throw new Error(message);
      } else {
        setGlobalLoading(false);
        logger.info('Facebook sign-in cancelled by user');
      }
    } catch (error: unknown) {
      setGlobalLoading(false);
      logError(error, 'Facebook OAuth - signInWithFacebook');
      const { title, message } = formatErrorForAlert(error, 'Facebook Sign In');
      Alert.alert(title, message);
    }
  };

  return {
    signInWithFacebook,
    isLoading: oauthMutation.isPending || false,
    isError: oauthMutation.isError,
    error: oauthMutation.error,
  };
};
