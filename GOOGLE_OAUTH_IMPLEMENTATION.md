# Google OAuth Implementation Guide

## Overview

This guide documents the implementation of Google OAuth authentication for the Rally App. The implementation allows users to sign in/sign up using their Google account.

## API Endpoint

**POST** `{{url}}/api/auth/oauth/google`

### Request Body

```json
{
  "userType": "player",
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiYTZlZmVmNWUxNzIxNDk5NzFhMmQzYWJiNWYzMzJlMGY3ODcxNjUiLCJ0eXAiOiJKV1QifQ..."
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userType` | `string` | Yes | User type: `"player"` or `"organiser"` |
| `idToken` | `string` | Yes | Google ID token (JWT) received from Google OAuth flow |

### Expected Response

The API should return a response similar to the existing login/signup endpoints:

```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": 123,
      "userId": 123,
      "mongoId": "...",
      "userType": "player",
      "email": "user@example.com",
      "mobileNumber": null,
      "profilePic": "https://...",
      "isMobileVerified": false,
      "fullName": "John Doe",
      "dob": "",
      "gender": "male",
      "sport1": "",
      "sport2": null,
      "sports": [],
      "followingCount": 0
    },
    "token": "jwt-auth-token-here"
  }
}
```

## Implementation Steps

### 1. Install Required Packages

```bash
npm install expo-auth-session expo-crypto
# or
yarn add expo-auth-session expo-crypto
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or **Google Identity Services**)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External (for testing) or Internal
   - App name: Rally App
   - User support email: your email
   - Developer contact: your email
6. Create OAuth 2.0 Client IDs:
   - **iOS**: Add bundle ID `com.rally.app`
   - **Android**: Add package name `com.rally.app` and SHA-1 certificate fingerprint
   - **Web**: Add authorized redirect URIs (for Expo)

### 3. Configure app.json

Add Google OAuth configuration to `app.json`:

```json
{
  "expo": {
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "extra": {
      "googleOAuth": {
        "iosClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
        "androidClientId": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
        "webClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
      }
    }
  }
}
```

**Note**: For Expo, you'll primarily use the **Web Client ID** for both iOS and Android in development.

### 4. Environment Variables

Add to `.env.local`:

```env
GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com
```

### 5. Implementation Files

#### 5.1 Create OAuth Hook

**File**: `src/hooks/auth/use-google-auth.ts`

```typescript
import { useMutation } from '@tanstack/react-query';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '@services/auth-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import type { RootStackParamList } from '@navigation';
import { logger } from '@dev-tools/logger';
import Constants from 'expo-constants';

// Complete auth session for proper redirect handling
WebBrowser.maybeCompleteAuthSession();

type GoogleAuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GoogleOAuthRequest {
  userType: 'player' | 'organiser';
  idToken: string;
}

interface GoogleOAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number | string;
      userId?: number;
      mongoId?: string;
      userType: 'player' | 'organiser';
      email?: string;
      mobileNumber?: string;
      profilePic?: string | null;
      isMobileVerified?: boolean;
      fullName: string;
      dob?: string;
      gender?: 'male' | 'female' | 'other';
      sport1?: string;
      sport2?: string;
      sports?: string[];
      followingCount?: number;
    };
    token: string;
  };
}

/**
 * Custom hook for Google OAuth authentication
 */
export const useGoogleAuth = () => {
  const navigation = useNavigation<GoogleAuthNavigationProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setGlobalLoading = useAuthStore((state) => state.setGlobalLoading);

  // Get client ID from environment or app config
  const getClientId = (): string => {
    // Try environment variable first
    const envClientId = Constants.expoConfig?.extra?.googleOAuth?.webClientId;
    if (envClientId) return envClientId;

    // Fallback to hardcoded (should be replaced with actual value)
    // TODO: Replace with actual Google Web Client ID
    return 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
  };

  // OAuth mutation
  const oauthMutation = useMutation({
    mutationFn: async (data: GoogleOAuthRequest): Promise<GoogleOAuthResponse> => {
      // Call your backend API
      const response = await authService.googleOAuth(data);
      return response;
    },
    onSuccess: async (data: GoogleOAuthResponse) => {
      logger.success('Google OAuth successful', {
        userId: data.data.user.id,
        userType: data.data.user.userType,
      });

      // Map response user to full User type
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
      };

      await setAuth(user, data.data.token);
      setGlobalLoading(false);

      // Navigate to Home
      navigation.navigate('Home');
    },
    onError: (error: unknown) => {
      setGlobalLoading(false);
      logger.error('Google OAuth failed', error);
      const { title, message } = formatErrorForAlert(error, 'Google Sign In');
      Alert.alert(title, message);
    },
  });

  /**
   * Initiates Google OAuth flow
   * @param userType - User type: 'player' or 'organiser'
   */
  const signInWithGoogle = async (userType: 'player' | 'organiser' = 'player') => {
    try {
      setGlobalLoading(true, 'Signing in with Google...');

      const clientId = getClientId();
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true, // Use Expo's proxy for development
      });

      // Request configuration
      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.IdToken,
        redirectUri,
        usePKCE: false,
      });

      // Discovery document URL
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      // Start authentication
      const result = await request.promptAsync(discovery, {
        useProxy: true,
      });

      if (result.type === 'success') {
        const { id_token } = result.params;

        if (!id_token) {
          throw new Error('No ID token received from Google');
        }

        logger.debug('Google OAuth token received', { hasToken: !!id_token });

        // Send to backend
        await oauthMutation.mutateAsync({
          userType,
          idToken: id_token,
        });
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || 'Google sign-in was cancelled');
      } else {
        // User cancelled
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
```

#### 5.2 Update Auth Service

**File**: `src/services/auth-service.ts`

Add the Google OAuth method:

```typescript
// Add to imports
import type {
  // ... existing imports
  GoogleOAuthRequest,
  GoogleOAuthResponse,
} from '../types/api/auth.types';

// Add to authService object
export const authService = {
  // ... existing methods

  /**
   * Authenticate with Google OAuth
   * @param data - Google OAuth data (userType and idToken)
   * @returns Promise with authentication response
   */
  googleOAuth: async (data: GoogleOAuthRequest): Promise<GoogleOAuthResponse> => {
    try {
      const response = await apiClient.post<GoogleOAuthResponse>(
        '/api/auth/oauth/google',
        data,
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to sign in with Google. Please try again.';

      if (statusCode === 400) {
        userMessage = errorMessage || 'Invalid Google token. Please try again.';
      } else if (statusCode === 401) {
        userMessage = 'Google authentication failed. Please try again.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },
};
```

#### 5.3 Add Type Definitions

**File**: `src/types/api/auth.types.ts`

Add the following types:

```typescript
// Google OAuth Types
export interface GoogleOAuthRequest {
  userType: 'player' | 'organiser';
  idToken: string;
}

export interface GoogleOAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number | string;
      userId?: number;
      mongoId?: string;
      userType: 'player' | 'organiser';
      email?: string;
      mobileNumber?: string;
      profilePic?: string | null;
      isMobileVerified?: boolean;
      fullName: string;
      dob?: string;
      gender?: 'male' | 'female' | 'other';
      sport1?: string;
      sport2?: string;
      sports?: string[];
      followingCount?: number;
    };
    token: string;
  };
}
```

#### 5.4 Update use-signup Hook

**File**: `src/hooks/auth/use-signup.ts`

Replace the placeholder `handleSocialLogin`:

```typescript
import { useGoogleAuth } from './use-google-auth';

// Inside useSignUp hook:
const { signInWithGoogle } = useGoogleAuth();

const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
  logger.info(`${provider} login pressed`);
  
  if (provider === 'google') {
    await signInWithGoogle(userType);
  } else {
    // TODO: Implement Apple and Facebook login
    Alert.alert('Coming Soon', `${provider} login will be available soon.`);
  }
};
```

#### 5.5 Update use-signin Hook (Optional)

**File**: `src/hooks/auth/use-signin.ts`

Add Google sign-in support to the SignIn screen:

```typescript
import { useGoogleAuth } from './use-google-auth';

// Inside useSignIn hook:
const { signInWithGoogle } = useGoogleAuth();

const handleGoogleSignIn = async () => {
  await signInWithGoogle('player'); // Default to player, or get from context
};
```

#### 5.6 Update SignIn Screen (Optional)

**File**: `src/screens/sign-in/SignInScreen.tsx`

Add social login buttons if desired:

```typescript
import { SocialLoginButtons } from '@components';

// Add before the Sign Up Link section:
<SocialLoginButtons
  onGooglePress={handleGoogleSignIn}
  onApplePress={() => Alert.alert('Coming Soon', 'Apple login will be available soon.')}
  onFacebookPress={() => Alert.alert('Coming Soon', 'Facebook login will be available soon.')}
/>
```

## Testing

### Development Testing

1. **Test on iOS Simulator/Device**:
   ```bash
   npm run ios
   ```

2. **Test on Android Emulator/Device**:
   ```bash
   npm run android
   ```

3. **Test Flow**:
   - Tap Google sign-in button
   - Should open Google sign-in web view
   - After authentication, should receive ID token
   - Should call backend API with token
   - Should navigate to Home screen on success

### Production Testing

1. Ensure Google Cloud Console has production OAuth credentials
2. Update `app.json` with production client IDs
3. Test on production build (not Expo Go)
4. Verify redirect URIs are correctly configured

## Troubleshooting

### Common Issues

1. **"Redirect URI mismatch"**
   - Solution: Ensure redirect URI in Google Cloud Console matches Expo's redirect URI
   - Check `AuthSession.makeRedirectUri()` output

2. **"Invalid client ID"**
   - Solution: Verify client ID in `app.json` or environment variables
   - Ensure using Web Client ID for Expo

3. **"No ID token received"**
   - Solution: Check that `responseType: AuthSession.ResponseType.IdToken` is set
   - Verify scopes include 'openid'

4. **Backend API errors**
   - Solution: Verify backend endpoint is correctly configured
   - Check request format matches API expectations
   - Verify ID token is being sent correctly

## Security Considerations

1. **ID Token Validation**: Backend should validate the Google ID token
2. **Token Storage**: Never store ID tokens client-side; only send to backend
3. **HTTPS**: Always use HTTPS in production
4. **Client ID Security**: Client IDs can be public, but keep them in environment variables for flexibility

## Next Steps

1. ✅ Implement frontend OAuth flow
2. ⏳ Configure Google Cloud Console
3. ⏳ Test on iOS and Android
4. ⏳ Verify backend API integration
5. ⏳ Add error handling and edge cases
6. ⏳ Add Apple and Facebook OAuth (if needed)

## Example Token Format

The ID token received from Google will be a JWT in this format:

```
eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiYTZlZmVmNWUxNzIxNDk5NzFhMmQzYWJiNWYzMzJlMGY3ODcxNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ4NjAxMzE1NjY3NjA2Mjk5MDciLCJoZCI6InJhbGx5c3BvcnRzLmFlIiwiZW1haWwiOiJjZW9AcmFsbHlzcG9ydHMuYWUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Im9XcFl2bWE5QWtwYVd2eWQ3Q2ZUREEiLCJuYW1lIjoiQWtzaGF0IERoYXdhbiIsImdpdmVuX25hbWUiOiJBa3NoYXQiLCJmYW1pbHlfbmFtZSI6IkRoYXdhbiIsImlhdCI6MTc2ODIwNDA1MywiZXhwIjoxNzY4MjA3NjUzfQ...
```

This token contains user information (email, name, etc.) and should be sent to the backend for verification and user creation/login.

## References

- [Expo AuthSession Documentation](https://docs.expo.dev/guides/authentication/#google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Services](https://developers.google.com/identity)
