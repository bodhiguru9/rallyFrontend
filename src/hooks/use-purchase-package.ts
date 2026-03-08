import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { organiserService } from '@services/organiser-service';
import { formatErrorForAlert } from '@utils';

export interface PurchasePackagePayload {
  promoCode?: string | null;
  amount?: number;
  currency?: string;
  cardLast4?: string | null;
  expiryMonth?: number | null;
  expiryYear?: number | null;
}

interface UsePurchasePackageOptions {
  showSuccessAlert?: boolean;
  // onSuccess will receive the response data when purchase succeeds
  onSuccess?: (response?: unknown) => void;
}

export const usePurchasePackage = (packageId: string, options?: UsePurchasePackageOptions) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload?: PurchasePackagePayload) =>
      organiserService.purchasePackage(packageId, payload ?? {}),
    onSuccess: (data) => {
      if (options?.showSuccessAlert !== false) {
        Alert.alert('Success', 'Package purchased successfully!');
      }
      queryClient.invalidateQueries({ queryKey: ['package-details', packageId] });
      queryClient.invalidateQueries({ queryKey: ['organiser-package-details', packageId] });
      // Pass the response data to the caller's onSuccess handler
      options?.onSuccess?.(data);
    },
    onError: (error: unknown) => {
      const { title, message } = formatErrorForAlert(error, 'Purchase Package');
      Alert.alert(title, message);
    },
  });

  // Provide an `isPending` alias for compatibility with other hooks/components
  return {
    ...mutation,
    isPending: (mutation as any).isLoading,
  } as typeof mutation & { isPending: boolean };
};

