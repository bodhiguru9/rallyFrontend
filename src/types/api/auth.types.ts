// Base fields common to both player and organiser
interface SignUpRequestBase {
  userType: 'player' | 'organiser';
  signupToken: string;
  email?: string;
  mobileNumber?: string;
  password: string;
  confirmPassword: string;
  profilePic?: string;
  fullName: string;
  sport1: string;
  sport2?: string;
}

// Player-specific fields
interface PlayerSignUpRequest extends SignUpRequestBase {
  userType: 'player';
  dob: string;
  gender: 'male' | 'female' | 'other';
}

// Organiser-specific fields
interface OrganiserSignUpRequest extends SignUpRequestBase {
  userType: 'organiser';
  yourBest: 'Organiser' | 'coach' | 'club';
  communityName: string;
  yourCity: string;
  sports?: string[]; // Array for additional sports
  bio: string;
  instagramLink?: string;
  profileVisibility?: 'public' | 'private';
}

// Union type for SignUpRequest
export type SignUpRequest = PlayerSignUpRequest | OrganiserSignUpRequest;

export interface SignUpResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      userId: number;
      mongoId: string;
      userType: 'player' | 'organiser';
      email?: string;
      mobileNumber?: string;
      profilePic: string | null;
      isMobileVerified: boolean;
      fullName: string;
      dob: string;
      gender: 'male' | 'female' | 'other';
      sport1: string;
      sport2?: string;
      sports: string[];
      followingCount: number;
    };
    token: string;
    message: string;
    requiresOTPVerification: boolean;
  };
}

export interface SignUpErrorResponse {
  success: false;
  error: string | string[]; // Can be a single string or array of validation errors
}

export interface LoginRequest {
  email?: string;
  mobileNumber?: string;
  password: string;
}

export interface LoginResponse {
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

export interface LoginErrorResponse {
  success: false;
  error: string | string[]; // Can be a single string or array of validation errors
}

export interface VerifyOTPRequest {
  mobileNumber?: string;
  email?: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data: {
    verified: boolean;
  };
}

export interface SendSignupOTPRequest {
  userType: 'player' | 'organiser';
  email?: string;
  mobileNumber?: string;
}

export interface SendSignupOTPResponse {
  success: boolean;
  message: string;
  data?: {
    sentTo: string;
    expiresIn?: number;
  };
}

export interface VerifySignupOTPRequest {
  userType: 'player' | 'organiser';
  email?: string;
  mobileNumber?: string;
  otp: string;
}

export interface VerifySignupOTPResponse {
  success: boolean;
  message: string;
  data: {
    signupToken: string;
    userType: 'player' | 'organiser';
    verifiedEmail: string | null;
    verifiedMobile: string | null;
    nextStep: string;
  };
}

export interface SendForgotPasswordOTPRequest {
  email?: string;
  mobileNumber?: string;
}

export interface SendForgotPasswordOTPResponse {
  success: boolean;
  message: string;
  data?: {
    sentTo: string;
    expiresIn?: number;
  };
}

export interface VerifyForgotPasswordOTPRequest {
  email?: string;
  mobileNumber?: string;
  otp: string;
}

export interface VerifyForgotPasswordOTPResponse {
  success: boolean;
  message: string;
  data: {
    verified: boolean;
    verificationToken: string;
  };
}

export interface SetNewPasswordRequest {
  verificationToken: string;
  password: string;
}

export interface SetNewPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
  };
}

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
