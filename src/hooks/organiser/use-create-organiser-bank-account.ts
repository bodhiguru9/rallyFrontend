import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { organiserService } from '@services/organiser-service';
import type { CreateBankAccountRequest } from '@services/organiser-service';
import { formatErrorForAlert } from '@utils';

export const useCreateOrganiserBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBankAccountRequest) =>
      organiserService.createBankAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organiser-bank-accounts'] });
    },
    onError: (error: unknown) => {
      const { title, message } = formatErrorForAlert(error, 'Add Bank Account');
      Alert.alert(title, message);
    },
  });
};
