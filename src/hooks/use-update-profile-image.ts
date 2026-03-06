import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { userService } from '@services/user-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import { logger } from '@dev-tools/logger';

/**
 * Custom hook for updating user profile image
 */
export const useUpdateProfileImage = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const updateProfileImageMutation = useMutation({
    mutationFn: ({ userId, imageUri }: { userId: number | string; imageUri: string }) =>
      userService.updateProfileImage(userId, imageUri),
    onSuccess: async (response) => {
      console.log('========================================');
      console.log('✅ [useUpdateProfileImage] Mutation onSuccess');
      console.log('========================================');
      console.log('📥 [useUpdateProfileImage] Response:', JSON.stringify(response, null, 2));
      
      logger.success('Profile image updated successfully', {
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
        };
        
        console.log('💾 [useUpdateProfileImage] Updating auth store with new user data');
        console.log('📦 [useUpdateProfileImage] Updated User:', JSON.stringify(updatedUser, null, 2));
        setUser(updatedUser);
        logger.store('setUser - Profile image updated', updatedUser);
      }

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      // Also refetch user details
      if (user?.id) {
        await queryClient.refetchQueries({ queryKey: ['user', user.id] });
      }
      console.log('🔄 [useUpdateProfileImage] Invalidated and refetched queries for user:', user?.id);
    },
    onError: (error: unknown) => {
      console.log('========================================');
      console.log('❌ [useUpdateProfileImage] Mutation onError');
      console.log('========================================');
      console.log('💥 [useUpdateProfileImage] Error:', error);
      logger.error('Profile image update failed', error);
    },
  });

  /**
   * Update user profile image
   */
  const updateProfileImage = async (imageUri: string) => {
    console.log('========================================');
    console.log('🔧 [useUpdateProfileImage] updateProfileImage called');
    console.log('========================================');

    if (!user) {
      console.log('❌ [useUpdateProfileImage] No user found');
      logger.error('useUpdateProfileImage - No user found');
      Alert.alert('Error', 'User not found. Please log in again.');
      return false;
    }

    // Use userId first (as per API requirement), then id, then mongoId as fallback
    const userId = user.userId?.toString() || user.id?.toString() || user.mongoId;
    
    if (!userId) {
      console.log('❌ [useUpdateProfileImage] No userId found');
      logger.error('useUpdateProfileImage - No userId found', { user });
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return false;
    }

    console.log('👤 [useUpdateProfileImage] User ID:', userId);
    console.log('📷 [useUpdateProfileImage] Image URI:', imageUri);
    logger.debug('useUpdateProfileImage - Updating profile image', { userId, imageUri });

    try {
      console.log('📡 [useUpdateProfileImage] Calling mutation...');
      const response = await updateProfileImageMutation.mutateAsync({ userId, imageUri });
      console.log('✅ [useUpdateProfileImage] Mutation successful');
      console.log('📥 [useUpdateProfileImage] Response:', JSON.stringify(response, null, 2));
      logger.success('useUpdateProfileImage - Profile image updated successfully', {
        userId,
        response: response.data.user,
      });
      Alert.alert('Success', 'Profile picture updated successfully!');
      return true;
    } catch (error: unknown) {
      console.log('❌ [useUpdateProfileImage] Mutation failed');
      console.log('💥 [useUpdateProfileImage] Error:', error);
      logError(error, 'UpdateProfileImage - updateProfileImage');
      logger.error('useUpdateProfileImage - Profile image update failed', error);
      const { title, message } = formatErrorForAlert(error, 'Update Profile Image');
      Alert.alert(title, message);
      return false;
    }
  };

  return {
    updateProfileImage,
    isLoading: updateProfileImageMutation.isPending,
    isError: updateProfileImageMutation.isError,
    error: updateProfileImageMutation.error,
  };
};
