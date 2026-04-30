import { Platform } from 'react-native';
import { apiClient } from './api/api-client';
import { ENV } from '@config';
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  SendSignupOTPRequest,
  SendSignupOTPResponse,
  VerifySignupOTPRequest,
  VerifySignupOTPResponse,
  SendForgotPasswordOTPRequest,
  SendForgotPasswordOTPResponse,
  VerifyForgotPasswordOTPRequest,
  VerifyForgotPasswordOTPResponse,
  SetNewPasswordRequest,
  SetNewPasswordResponse,
  GoogleOAuthRequest,
  GoogleOAuthResponse,
  FacebookOAuthRequest,
  FacebookOAuthResponse,
  AppleOAuthRequest,
  AppleOAuthResponse,
} from '../types/api/auth.types';

export const authService = {
  /**
   * Sign up a new user
   * @param data - User registration data (can be SignUpRequest object or FormData)
   * @returns Promise with signup response
   * @throws {Error} Error with response data attached
   */
  signUp: async (data: SignUpRequest | FormData): Promise<SignUpResponse> => {
    if (__DEV__) {
      console.warn(
        '[SIGNUP_FLOW] 3. auth-service signUp: entry, about to call apiClient.post("/api/auth/signup")',
        {
          isFormData: data instanceof FormData,
          platform: Platform.OS,
        },
      );
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'auth-service.ts:signUp:entry',
        message: 'signUp called',
        data: { platform: Platform.OS, isFormData: data instanceof FormData },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'H1',
      }),
    }).catch(() => { });
    // #endregion
    try {
      // Axios will automatically handle FormData and set proper Content-Type
      // The interceptor removes the default Content-Type header for FormData
      // Longer timeout for signup (FormData + possible image upload can be slow on Android)
      const response = await apiClient.post<SignUpResponse>('/api/auth/signup', data, {
        timeout: 30000,
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (__DEV__) {
        const branch =
          error.response?.data && typeof error.response?.data === 'object'
            ? 'responseData'
            : error.response
              ? 'responseNoData'
              : 'noResponse';
        console.warn(
          '[SIGNUP_FLOW] 6. auth-service signUp CATCH — Axios error (this is where the failure comes from)',
          {
            branch,
            code: error?.code,
            message: error?.message,
            hasResponse: !!error?.response,
            status: error?.response?.status,
            hasRequest: !!error?.request,
            responseDataKeys:
              error?.response?.data && typeof error.response.data === 'object'
                ? Object.keys(error.response.data)
                : null,
            platform: Platform.OS,
          },
        );
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'auth-service.ts:signUp:catch',
          message: 'signUp error',
          data: {
            platform: Platform.OS,
            code: error?.code,
            message: error?.message,
            hasResponse: !!error?.response,
            status: error?.response?.status,
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          hypothesisId: 'H1,H2,H4',
        }),
      }).catch(() => { });
      // #endregion
      // Extract error response from Axios error (data may have .error or .message)
      const responseData = error.response?.data;
      if (responseData && typeof responseData === 'object') {
        const status = error.response?.status;
        const apiError = responseData.error ?? responseData.message ?? 'Signup failed';
        let errorMessage = typeof apiError === 'string' ? apiError : 'Signup failed';

        // Handle expired signup token with helpful message
        if (status === 401 || status === 410) {
          errorMessage =
            'Your signup session has expired. Since your OTP is still valid, you can go back to verify your OTP again, or restart the signup process.';
        }

        const err = new Error(errorMessage);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).response = error.response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).error = errorMessage;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).success = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).statusCode = status;
        // Mark as token expiration for ProfileSetup to handle navigation
        if (status === 401 || status === 410) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).isTokenExpired = true;
        }
        throw err;
      }
      // Response exists but no/invalid body (e.g. non-JSON, empty) — treat as server/request error, not network
      if (error.response) {
        const status = error.response.status;
        let userMessage = 'Request failed. Please try again.';
        if (status === 400) {
          userMessage = 'Invalid request. Please check your details.';
        } else if (status === 401 || status === 410) {
          // Expired or invalid signup token - guide user to restart signup or verify OTP again
          userMessage =
            'Your signup session has expired. Since your OTP is still valid, you can go back to verify your OTP again, or restart the signup process.';
        } else if (status === 413) {
          userMessage = 'Request too large (e.g. image). Try a smaller photo.';
        } else if (status >= 500) {
          userMessage = 'Server error. Please try again later.';
        }
        const err = new Error(userMessage);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).response = error.response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).error = userMessage;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).statusCode = status;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).success = false;
        // Mark as token expiration for ProfileSetup to handle navigation
        if (status === 401 || status === 410) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).isTokenExpired = true;
        }
        throw err;
      }
      // No response — network failure or Android quirk where 200 responses sometimes throw with no error.response.
      // (on Android Axios may not set error.code, so we set isNetworkError explicitly.)
      if (__DEV__) {
        console.warn('[auth-service signUp] No response from server', {
          code: error?.code,
          message: error?.message,
          hasResponse: !!error?.response,
          status: error?.response?.status,
          hasRequest: !!error?.request,
          platform: Platform.OS,
        });
      }
      // On Android, "Network Error" can occur even when the request succeeded (known Axios/RN issue).
      // Suggest signing in so the user can recover if signup actually went through.
      const isAndroidNoResponse = Platform.OS === 'android';
      const networkMessage = isAndroidNoResponse
        ? 'Connection issue. If you just signed up, try signing in with your email and password.'
        : 'Network error. Please check your connection and try again.';
      const err = new Error(networkMessage);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).error = networkMessage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).success = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).code = error?.code;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).request = error?.request;
      // Only mark as network error for non-Android so alert title is "Network Error"; on Android use "Signup Failed"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).isNetworkError = !isAndroidNoResponse;
      throw err;
    }
  },

  /**
   * Sign in an existing user
   * @param data - Login credentials (email or mobileNumber + password)
   * @returns Promise with login response
   */
  signIn: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/signin', data);
    return response.data;
  },

  /**
   * Login user (alias for signIn)
   * @param data - Login credentials (email or mobileNumber + password)
   * @returns Promise with login response
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/signin', data);
    return response.data;
  },

  /**
   * Authenticate with Google OAuth
   * @param data - Google OAuth data (userType and idToken)
   * @returns Promise with authentication response
   */
  googleOAuth: async (data: GoogleOAuthRequest): Promise<GoogleOAuthResponse> => {
    try {
      const response = await apiClient.post<GoogleOAuthResponse>('/api/auth/oauth/google', data);
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

  /**
   * Authenticate with Facebook OAuth
   * @param data - Facebook OAuth data (userType and accessToken)
   * @returns Promise with authentication response
   */
  facebookOAuth: async (data: FacebookOAuthRequest): Promise<FacebookOAuthResponse> => {
    try {
      const response = await apiClient.post<FacebookOAuthResponse>('/api/auth/oauth/facebook', data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to sign in with Facebook. Please try again.';

      if (statusCode === 400) {
        userMessage = errorMessage || 'Invalid Facebook token. Please try again.';
      } else if (statusCode === 401) {
        userMessage = 'Facebook authentication failed. Please try again.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Verify OTP for mobile number or email
   * @param data - OTP verification data
   * @returns Promise with verification response
   */
  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await apiClient.post<VerifyOTPResponse>('/api/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Resend OTP
   * @param data - Mobile number or email to resend OTP
   * @returns Promise with response
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resendOTP: async (data: { mobileNumber?: string; email?: string }): Promise<any> => {
    const response = await apiClient.post('/api/auth/resend-otp', data);
    return response.data;
  },

  /**
   * Send signup OTP
   * @param data - User type and contact info (email or mobile number with country code)
   * @returns Promise with OTP send response
   * @throws {Error} Error with response data attached
   */
  sendSignupOTP: async (data: SendSignupOTPRequest): Promise<SendSignupOTPResponse> => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'auth-service.ts:sendSignupOTP:entry',
        message: 'sendSignupOTP called',
        data: { platform: Platform.OS, baseURL: ENV.API_BASE_URL, userType: data.userType },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'H3,H5',
      }),
    }).catch(() => { });
    // #endregion
    try {
      const response = await apiClient.post<SendSignupOTPResponse>(
        '/api/auth/send-signup-otp',
        data,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/26465776-1876-4ffd-bd6d-a1b4a3482b32', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'auth-service.ts:sendSignupOTP:catch',
          message: 'sendSignupOTP error',
          data: {
            platform: Platform.OS,
            code: error?.code,
            message: error?.message,
            hasResponse: !!error?.response,
            status: error?.response?.status,
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          hypothesisId: 'H2,H4,H5',
        }),
      }).catch(() => { });
      // #endregion
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      // Extract error message from both 'error' and 'message' fields
      // API can return errors in either field (error can be string or array)
      let errorMessage: string | undefined;
      if (responseData) {
        if (responseData.error) {
          // Handle both string and array of strings
          errorMessage = Array.isArray(responseData.error)
            ? responseData.error.join('\n')
            : responseData.error;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      }

      let userMessage = 'Failed to send OTP. Please try again.';

      if (statusCode === 429) {
        userMessage = 'Too many requests. Please wait before trying again.';
      } else if (statusCode === 400) {
        userMessage = errorMessage || 'Invalid request. Please check your details.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      customError.error = errorMessage; // Attach extracted error for error handler utility
      throw customError;
    }
  },

  /**
   * Verify signup OTP
   * @param data - User type, contact info, and OTP code
   * @returns Promise with verification response
   * @throws {Error} Error with response data attached
   */
  verifySignupOTP: async (data: VerifySignupOTPRequest): Promise<VerifySignupOTPResponse> => {
    try {
      const response = await apiClient.post<VerifySignupOTPResponse>(
        '/api/auth/verify-signup-otp',
        data,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to verify OTP. Please try again.';

      if (statusCode === 400) {
        userMessage = errorMessage || 'Invalid OTP code. Please check and try again.';
      } else if (statusCode === 429) {
        userMessage = 'Too many attempts. Please wait before trying again.';
      } else if (statusCode === 410) {
        userMessage = 'OTP has expired. Please request a new one.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Send forgot password OTP
   * @param data - Email or mobile number
   * @returns Promise with OTP send response
   * @throws {Error} Error with response data attached
   */
  sendForgotPasswordOTP: async (
    data: SendForgotPasswordOTPRequest,
  ): Promise<SendForgotPasswordOTPResponse> => {
    try {
      const response = await apiClient.post<SendForgotPasswordOTPResponse>(
        '/api/auth/forgot-password',
        data,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to send OTP. Please try again.';

      if (statusCode === 400) {
        userMessage = errorMessage || 'Invalid request. Please check your details.';
      } else if (statusCode === 404) {
        userMessage = 'Account not found. Please check your email or phone number.';
      } else if (statusCode === 429) {
        userMessage = 'Too many requests. Please wait before trying again.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Verify forgot password OTP
   * @param data - Email/mobile and OTP code
   * @returns Promise with verification response containing resetToken
   * @throws {Error} Error with response data attached
   */
  verifyForgotPasswordOTP: async (
    data: VerifyForgotPasswordOTPRequest,
  ): Promise<VerifyForgotPasswordOTPResponse> => {
    try {
      const response = await apiClient.post<VerifyForgotPasswordOTPResponse>(
        '/api/auth/verify-forgot-password-otp',
        data,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to verify OTP. Please try again.';

      if (statusCode === 400) {
        userMessage = errorMessage || 'Invalid OTP code. Please check and try again.';
      } else if (statusCode === 429) {
        userMessage = 'Too many attempts. Please wait before trying again.';
      } else if (statusCode === 410) {
        userMessage = 'OTP has expired. Please request a new one.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Set new password after OTP verification
   * @param data - Verification token and new password
   * @returns Promise with user data and auth token
   * @throws {Error} Error with response data attached
   */
  setNewPassword: async (data: SetNewPasswordRequest): Promise<SetNewPasswordResponse> => {
    try {
      const response = await apiClient.post<SetNewPasswordResponse>(
        '/api/auth/set-new-password',
        data,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to set new password. Please try again.';

      if (statusCode === 400) {
        userMessage = errorMessage || 'Invalid request. Please check your password.';
      } else if (statusCode === 401) {
        userMessage = 'Verification token expired or invalid. Please restart the process.';
      } else if (statusCode === 410) {
        userMessage = 'Verification token has expired. Please request a new OTP.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },
};
