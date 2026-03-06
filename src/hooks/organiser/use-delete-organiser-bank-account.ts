import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { organiserService } from '@services/organiser-service';
import { formatErrorForAlert } from '@utils';

export const useDeleteOrganiserBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => organiserService.deleteBankAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organiser-bank-accounts'] });
    },
    onError: (error: unknown) => {
      const { title, message } = formatErrorForAlert(error, 'Delete Bank Account');
      Alert.alert(title, message);
    },
  });
};
