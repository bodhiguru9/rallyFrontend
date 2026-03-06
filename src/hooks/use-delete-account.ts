import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { userService } from '@services/user-service';
import { useAuthStore } from '@store/auth-store';
import { formatErrorForAlert, logError } from '@utils';
import { logger } from '@dev-tools/logger';

/**
 * Custom hook for deleting user account
 */
export const useDeleteAccount = () => {
  const { user, logout } = useAuthStore();

  const deleteAccountMutation = useMutation({
    mutationFn: (userId: number | string) => userService.deleteAccount(userId),
    onSuccess: async (response) => {
      console.log('========================================');
      console.log('✅ [useDeleteAccount] Mutation onSuccess');
      console.log('========================================');
      console.log('📥 [useDeleteAccount] Response:', JSON.stringify(response, null, 2));
      
      logger.success('Account deleted successfully', {
        userId: user?.id,
      });

      // Logout user after account deletion
      console.log('🚪 [useDeleteAccount] Logging out user...');
      await logout();
      logger.store('logout - Account deleted');
    },
    onError: (error: unknown) => {
      console.log('========================================');
      console.log('❌ [useDeleteAccount] Mutation onError');
      console.log('========================================');
      console.log('💥 [useDeleteAccount] Error:', error);
      logger.error('Account deletion failed', error);
    },
  });

  /**
   * Delete user account
   */
  const deleteAccount = async () => {
    console.log('========================================');
    console.log('🗑️ [useDeleteAccount] deleteAccount called');
    console.log('========================================');

    if (!user) {
      console.log('❌ [useDeleteAccount] No user found');
      logger.error('useDeleteAccount - No user found');
      Alert.alert('Error', 'User not found. Please log in again.');
      return false;
    }

    // Use userId first (as per API requirement), then id, then mongoId as fallback
    const userId = user.userId?.toString() || user.id?.toString() || user.mongoId;
    
    if (!userId) {
      console.log('❌ [useDeleteAccount] No userId found');
      logger.error('useDeleteAccount - No userId found', { user });
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return false;
    }

    console.log('👤 [useDeleteAccount] User ID:', userId);
    logger.debug('useDeleteAccount - Deleting account', { userId });

    try {
      console.log('📡 [useDeleteAccount] Calling mutation...');
      const response = await deleteAccountMutation.mutateAsync(userId);
      console.log('✅ [useDeleteAccount] Mutation successful');
      console.log('📥 [useDeleteAccount] Response:', JSON.stringify(response, null, 2));
      logger.success('useDeleteAccount - Account deleted successfully', {
        userId,
        response,
      });
      return true;
    } catch (error: unknown) {
      console.log('❌ [useDeleteAccount] Mutation failed');
      console.log('💥 [useDeleteAccount] Error:', error);
      logError(error, 'DeleteAccount - deleteAccount');
      logger.error('useDeleteAccount - Account deletion failed', error);
      const { title, message } = formatErrorForAlert(error, 'Delete Account');
      Alert.alert(title, message);
      return false;
    }
  };

  return {
    deleteAccount,
    isLoading: deleteAccountMutation.isPending,
    isError: deleteAccountMutation.isError,
    error: deleteAccountMutation.error,
  };
};

