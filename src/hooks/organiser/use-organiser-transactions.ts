import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserTransactionsOptions {
  enabled?: boolean;
}

export const useOrganiserTransactions = (
  page: number = 1,
  perPage: number = 20,
  includeDummy: boolean = true,
  options?: UseOrganiserTransactionsOptions,
) => {
  return useQuery({
    queryKey: ['organiser-transactions', page, perPage, includeDummy],
    queryFn: () => organiserService.getOrganiserTransactions(page, perPage, includeDummy),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
