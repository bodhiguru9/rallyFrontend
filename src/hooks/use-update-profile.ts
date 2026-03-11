import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { userService } from '@services/user-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import type { UpdateProfileRequest } from '../types/api/user.types';
import { logger } from '@dev-tools/logger';

/**
 * Custom hook for updating user profile
 */
export const useUpdateProfile = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number | string; data: UpdateProfileRequest }) =>
      userService.updateProfile(userId, data),
    onSuccess: async (response) => {
      console.log('========================================');
      console.log('✅ [useUpdateProfile] Mutation onSuccess');
      console.log('========================================');
      console.log('📥 [useUpdateProfile] Response:', JSON.stringify(response, null, 2));
      
      logger.success('Profile updated successfully', {
        userId: response.data.user.id,
      });

      // Update user in auth store with the updated data
      if (response.data.user) {
        const responseUser = response.data.user;
        const userId = typeof responseUser.id === 'string' 
          ? parseInt(responseUser.id, 10) 
          : responseUser.id;
        
        const updatedUser = {
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
          profileVisibility: responseUser.profileVisibility ?? user?.profileVisibility ?? 'public',
        };
        
        console.log('💾 [useUpdateProfile] Updating auth store with new user data');
        console.log('📦 [useUpdateProfile] Updated User:', JSON.stringify(updatedUser, null, 2));
        setUser(updatedUser);
        logger.store('setUser - Profile updated', updatedUser);
      }

      // Invalidate any related queries if needed
      await queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      console.log('🔄 [useUpdateProfile] Invalidated queries for user:', user?.id);
    },
    onError: (error: unknown) => {
      console.log('========================================');
      console.log('❌ [useUpdateProfile] Mutation onError');
      console.log('========================================');
      console.log('💥 [useUpdateProfile] Error:', error);
      logger.error('Profile update failed', error);
    },
  });

  /**
   * Update user profile
   */
  const updateProfile = async (data: UpdateProfileRequest) => {
    console.log('========================================');
    console.log('🔧 [useUpdateProfile] updateProfile called');
    console.log('========================================');

    if (!user) {
      console.log('❌ [useUpdateProfile] No user found');
      logger.error('useUpdateProfile - No user found');
      Alert.alert('Error', 'User not found. Please log in again.');
      return false;
    }

    // Use userId first (as per API requirement), then id, then mongoId as fallback
    const userId = user.userId?.toString() || user.id?.toString() || user.mongoId;
    
    if (!userId) {
      console.log('❌ [useUpdateProfile] No userId found');
      logger.error('useUpdateProfile - No userId found', { user });
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return false;
    }

    console.log('👤 [useUpdateProfile] User ID:', userId);
    console.log('📦 [useUpdateProfile] Update Data:', JSON.stringify(data, null, 2));
    logger.debug('useUpdateProfile - Updating profile', { userId, data });

    try {
      console.log('📡 [useUpdateProfile] Calling mutation...');
      const response = await updateProfileMutation.mutateAsync({ userId, data });
      console.log('✅ [useUpdateProfile] Mutation successful');
      console.log('📥 [useUpdateProfile] Response:', JSON.stringify(response, null, 2));
      logger.success('useUpdateProfile - Profile updated successfully', {
        userId,
        response: response.data.user,
      });
      Alert.alert('Success', 'Profile updated successfully!');
      return true;
    } catch (error: unknown) {
      console.log('❌ [useUpdateProfile] Mutation failed');
      console.log('💥 [useUpdateProfile] Error:', error);
      logError(error, 'UpdateProfile - updateProfile');
      logger.error('useUpdateProfile - Profile update failed', error);
      const { title, message } = formatErrorForAlert(error, 'Update Profile');
      Alert.alert(title, message);
      return false;
    }
  };

  return {
    updateProfile,
    isLoading: updateProfileMutation.isPending,
    isError: updateProfileMutation.isError,
    error: updateProfileMutation.error,
  };
};

