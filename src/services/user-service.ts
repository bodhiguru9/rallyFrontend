import { apiClient } from './api/api-client';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  TopOrganisersResponse,
  GetUserResponse,
  UsersResponse,
} from '../types/api/user.types';
import { logger } from '@dev-tools/logger';

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

export const userService = {
  /**
   * Update user profile
   * @param userId - User ID
   * @param data - Profile data to update
   * @returns Promise with updated user data
   */
  updateProfile: async (
    userId: number | string,
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    const endpoint = `/api/users/${userId}`;
    
    console.log('========================================');
    console.log('🌐 [userService] PUT API Call');
    console.log('========================================');
    console.log('📍 [userService] Endpoint:', endpoint);
    console.log('🆔 [userService] User ID:', userId);
    console.log('📤 [userService] Request Body:', JSON.stringify(data, null, 2));
    logger.api('PUT', endpoint, data);

    try {
      const response = await apiClient.put<UpdateProfileResponse>(endpoint, data);
      
      console.log('✅ [userService] API Response Success');
      console.log('📥 [userService] Response Status:', response.status);
      console.log('📦 [userService] Response Data:', JSON.stringify(response.data, null, 2));
      logger.apiResponse(response.status, endpoint, response.data);
      
      return response.data;
    } catch (error: any) {
      console.log('❌ [userService] API Call Failed');
      console.log('💥 [userService] Error:', error);
      if (error.response) {
        console.log('📥 [userService] Error Response Status:', error.response.status);
        console.log('📦 [userService] Error Response Data:', JSON.stringify(error.response.data, null, 2));
      }
      logger.error('userService - Update profile API failed', error);
      throw error;
    }
  },

  /**
   * Update user profile image
   * @param userId - User ID
   * @param imageUri - Local URI of the image to upload
   * @returns Promise with updated user data
   */
  updateProfileImage: async (
    userId: number | string,
    imageUri: string
  ): Promise<UpdateProfileResponse> => {
    const endpoint = `/api/users/${userId}`;
    
    console.log('========================================');
    console.log('🌐 [userService] PUT API Call - Image Upload');
    console.log('========================================');
    console.log('📍 [userService] Endpoint:', endpoint);
    console.log('🆔 [userService] User ID:', userId);
    console.log('📷 [userService] Image URI:', imageUri);
    logger.api('PUT', endpoint, { imageUri });

    try {
      // Create FormData
      const formData = new FormData();
      
      // Extract filename from URI or use default
      const filename = imageUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // Append the image file - use 'profilePic' field name to match API expectations
      formData.append('profilePic', {
        uri: imageUri,
        type,
        name: filename,
      } as any);

      console.log('📤 [userService] FormData created');
      logger.debug('userService - FormData created for image upload', { filename, type });

      // Note: Don't set Content-Type header manually - axios will set it automatically
      // with the correct boundary for FormData
      const response = await apiClient.put<UpdateProfileResponse>(endpoint, formData);
      
      console.log('✅ [userService] Image Upload API Response Success');
      console.log('📥 [userService] Response Status:', response.status);
      console.log('📦 [userService] Response Data:', JSON.stringify(response.data, null, 2));
      logger.apiResponse(response.status, endpoint, response.data);
      
      return response.data;
    } catch (error: any) {
      console.log('❌ [userService] Image Upload API Call Failed');
      console.log('💥 [userService] Error:', error);
      if (error.response) {
        console.log('📥 [userService] Error Response Status:', error.response.status);
        console.log('📦 [userService] Error Response Data:', JSON.stringify(error.response.data, null, 2));
        console.log('📋 [userService] Error Response Headers:', JSON.stringify(error.response.headers, null, 2));
      }
      if (error.request) {
        console.log('📤 [userService] Request that failed:', error.request);
      }
      logger.error('userService - Update profile image API failed', error);
      throw error;
    }
  },

  /**
   * Delete user account
   * @param userId - User ID
   * @returns Promise with delete response
   */
  deleteAccount: async (userId: number | string): Promise<DeleteAccountResponse> => {
    const endpoint = `/api/users/${userId}`;
    
    console.log('========================================');
    console.log('🗑️ [userService] DELETE API Call');
    console.log('========================================');
    console.log('📍 [userService] Endpoint:', endpoint);
    console.log('🆔 [userService] User ID:', userId);
    logger.api('DELETE', endpoint);

    try {
      const response = await apiClient.delete<DeleteAccountResponse>(endpoint);
      
      console.log('✅ [userService] Delete Account API Response Success');
      console.log('📥 [userService] Response Status:', response.status);
      console.log('📦 [userService] Response Data:', JSON.stringify(response.data, null, 2));
      logger.apiResponse(response.status, endpoint, response.data);
      
      return response.data;
    } catch (error: any) {
      console.log('❌ [userService] Delete Account API Call Failed');
      console.log('💥 [userService] Error:', error);
      if (error.response) {
        console.log('📥 [userService] Error Response Status:', error.response.status);
        console.log('📦 [userService] Error Response Data:', JSON.stringify(error.response.data, null, 2));
      }
      logger.error('userService - Delete account API failed', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns Promise with user data
   */
  getUserById: async (userId: number | string): Promise<GetUserResponse> => {
    const endpoint = `/api/users/${userId}`;

    logger.api('GET', endpoint);

    try {
      const response = await apiClient.get<GetUserResponse>(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Get user by id API failed', error);
      throw error;
    }
  },

  /**
   * Get communities list
   * @param page - Page number (default: 1)
   * @returns Promise with communities data
   */
  getCommunities: async (page: number = 1) => {
    const endpoint = `/api/users/community?page=${page}`;
    
    logger.api('GET', endpoint);

    try {
      const response = await apiClient.get(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Get communities API failed', error);
      throw error;
    }
  },

  /**
   * Get community details by community name
   * @param communityName - Community name
   * @param page - Page number (default: 1)
   * @returns Promise with community details and events (or error response for private communities)
   */
  getCommunityDetails: async (communityName: string, page: number = 1) => {
    const endpoint = `/api/users/community/${communityName}?page=${page}`;
    
    logger.api('GET', endpoint);

    try {
      const response = await apiClient.get(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      // Return response data even if success is false (for private communities)
      return response.data;
    } catch (error: any) {
      // If error response has data, return it (might be private community response)
      if (error.response?.data) {
        logger.apiResponse(error.response.status, endpoint, error.response.data);
        return error.response.data;
      }
      logger.error('userService - Get community details API failed', error);
      throw error;
    }
  },

  /**
   * Follow an organiser/community
   * @param organiserId - Organiser ID
   * @returns Promise with follow response
   */
  followOrganiser: async (organiserId: string | number) => {
    const endpoint = `/api/follow/${organiserId}`;
    
    logger.api('POST', endpoint);

    try {
      const response = await apiClient.post(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Follow organiser API failed', error);
      throw error;
    }
  },

  /**
   * Unfollow an organiser/community
   * @param organiserId - Organiser ID
   * @returns Promise with unfollow response
   */
  unfollowOrganiser: async (organiserId: string | number) => {
    const endpoint = `/api/follow/${organiserId}`;
    
    logger.api('DELETE', endpoint);

    try {
      const response = await apiClient.delete(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Unfollow organiser API failed', error);
      throw error;
    }
  },

  /**
   * Get organiser/community followers
   * @param organiserId - Organiser ID
   * @param page - Page number (default: 1)
   * @param perPage - Items per page (default: 20)
   */
  getOrganiserFollowers: async (
    organiserId: string | number,
    page: number = 1,
    perPage: number = 20,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> => {
    const endpoint = `/api/follow/${organiserId}/followers`;
    logger.api('GET', endpoint, { page, perPage });

    try {
      const response = await apiClient.get(endpoint, {
        params: { page, perPage },
      });
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Get organiser followers API failed', error);
      throw error;
    }
  },

  /**
   * Check if user is following an organiser
   * @param organiserId - Organiser ID
   * @returns Promise with follow status
   */
  checkFollowStatus: async (organiserId: string | number): Promise<{
    success: boolean;
    isFollowing: boolean;
  }> => {
    const endpoint = `/api/follow/${organiserId}/status`;

    logger.api('GET', endpoint);

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          isFollowing: boolean;
        };
      }>(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      // Extract isFollowing from nested data structure
      return {
        success: response.data.success,
        isFollowing: response.data.data?.isFollowing ?? false,
      };
    } catch (error: any) {
      logger.error('userService - Check follow status API failed', error);
      throw error;
    }
  },

  /**
   * Request to join a private community/organiser
   * @param organiserId - Organiser ID
   * @returns Promise with request response
   */
  requestToJoin: async (organiserId: string | number) => {
    const endpoint = `/api/request/${organiserId}`;

    logger.api('POST', endpoint);

    try {
      const response = await apiClient.post(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Request to join API failed', error);
      throw error;
    }
  },

  /**
   * Get top organisers
   * @param page - Page number (default: 1)
   * @returns Promise with top organisers data
   */
  getTopOrganisers: async (page: number = 1): Promise<TopOrganisersResponse> => {
    const endpoint = `/api/users/organisers/top?page=${page}`;

    logger.api('GET', endpoint);

    try {
      const response = await apiClient.get<TopOrganisersResponse>(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Get top organisers API failed', error);
      throw error;
    }
  },

  /**
   * Search organisers by query string
   * @param query - Search query string
   * @param page - Page number (default: 1)
   * @returns Promise with organisers data
   */
  searchOrganisers: async (query: string, page: number = 1): Promise<TopOrganisersResponse> => {
    const endpoint = `/api/users/organisers/top?page=${page}&search=${encodeURIComponent(query)}`;

    logger.api('GET', endpoint);

    try {
      const response = await apiClient.get<TopOrganisersResponse>(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Search organisers API failed', error);
      throw error;
    }
  },

  /**
   * Get users list with pagination and userType filter
   * @param page - Page number (default: 1)
   * @param userType - User type filter (e.g., 'player', 'organiser')
   * @returns Promise with users data
   */
  getUsers: async (page: number = 1, userType?: string): Promise<UsersResponse> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (userType) {
      params.append('userType', userType);
    }
    const endpoint = `/api/users?${params.toString()}`;

    logger.api('GET', endpoint);

    try {
      const response = await apiClient.get<UsersResponse>(endpoint);
      logger.apiResponse(response.status, endpoint, response.data);
      return response.data;
    } catch (error: any) {
      logger.error('userService - Get users API failed', error);
      throw error;
    }
  },
};

