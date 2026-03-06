import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserBankAccountOptions {
  enabled?: boolean;
}

export const useOrganiserBankAccount = (
  id: string | null | undefined,
  options?: UseOrganiserBankAccountOptions,
) => {
  return useQuery({
    queryKey: ['organiser-bank-account', id],
    queryFn: () => organiserService.getBankAccount(id!),
    enabled: !!id && (options?.enabled !== false),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
