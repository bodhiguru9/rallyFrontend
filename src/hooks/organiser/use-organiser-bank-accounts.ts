import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserBankAccountsOptions {
  enabled?: boolean;
}

export const useOrganiserBankAccounts = (options?: UseOrganiserBankAccountsOptions) => {
  return useQuery({
    queryKey: ['organiser-bank-accounts'],
    queryFn: () => organiserService.getBankAccounts(),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
