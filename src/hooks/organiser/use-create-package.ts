import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { organiserService } from '@services/organiser-service';
import type { CreatePackageRequest } from '@services/organiser-service';
import { formatErrorForAlert } from '@utils';

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePackageRequest) => organiserService.createPackage(payload),
    onSuccess: () => {
      Alert.alert('Success', 'Package created successfully!');
      queryClient.invalidateQueries({ queryKey: ['organiser-my-packages'] });
    },
    onError: (error: unknown) => {
      const { title, message } = formatErrorForAlert(error, 'Create Package');
      Alert.alert(title, message);
    },
  });
};

