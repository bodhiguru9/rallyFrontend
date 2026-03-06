import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { organiserService } from '@services/organiser-service';
import type { UpdatePackageRequest } from '@services/organiser-service';
import { formatErrorForAlert } from '@utils';

export const useUpdatePackage = (packageId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePackageRequest) => organiserService.updatePackage(packageId, payload),
    onSuccess: () => {
      Alert.alert('Success', 'Package updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['organiser-my-packages'] });
      queryClient.invalidateQueries({ queryKey: ['organiser-package-details', packageId] });
    },
    onError: (error: unknown) => {
      const { title, message } = formatErrorForAlert(error, 'Update Package');
      Alert.alert(title, message);
    },
  });
};

