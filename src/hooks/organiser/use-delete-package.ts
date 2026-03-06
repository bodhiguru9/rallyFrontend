import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { organiserService } from '@services/organiser-service';
import { formatErrorForAlert } from '@utils';

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (packageId: string) => organiserService.deletePackage(packageId),
    onSuccess: () => {
      Alert.alert('Deleted', 'Package deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['organiser-my-packages'] });
    },
    onError: (error: unknown) => {
      const { title, message } = formatErrorForAlert(error, 'Delete Package');
      Alert.alert(title, message);
    },
  });
};

