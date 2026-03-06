import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { organiserService } from '@services/organiser-service';
import type { UpdateBankAccountRequest } from '@services/organiser-service';
import { formatErrorForAlert } from '@utils';

export const useUpdateOrganiserBankAccount = (id: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBankAccountRequest) =>
      organiserService.updateBankAccount(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organiser-bank-accounts'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['organiser-bank-account', id] });
      }
    },
    onError: (error: unknown) => {
      const { title, message } = formatErrorForAlert(error, 'Update Bank Account');
      Alert.alert(title, message);
    },
  });
};
