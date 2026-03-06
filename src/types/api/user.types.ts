import type { User } from '../models/user';

export interface UpdateProfileRequest {
  fullName?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  mobileNumber?: string;
  sport1?: string;
  sport2?: string;
  sports?: string[];
  profilePic?: string | null;
  communityName?: string;
  bio?: string;
  instagramLink?: string;
  profileVisibility?: 'public' | 'private';
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface GetUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface TopOrganiser {
  userId: number;
  profilePic: string | null;
  fullName: string;
  isVerified: boolean;
  communityName?: string; // Optional: may not be in all API responses
}

export interface TopOrganisersResponse {
  success: boolean;
  message: string;
  data: {
    organisers: TopOrganiser[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filter: {
      userType: string;
    };
  };
}

