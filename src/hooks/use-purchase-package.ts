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
  onSuccess?: () => void;
}

export const usePurchasePackage = (packageId: string, options?: UsePurchasePackageOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: PurchasePackagePayload) =>
      organiserService.purchasePackage(packageId, payload ?? {}),
    onSuccess: () => {
      if (options?.showSuccessAlert !== false) {
        Alert.alert('Success', 'Package purchased successfully!');
      }
      queryClient.invalidateQueries({ queryKey: ['package-details', packageId] });
      queryClient.invalidateQueries({ queryKey: ['organiser-package-details', packageId] });
      // If/when purchased packages list is wired, it can be invalidated here too.
      // queryClient.invalidateQueries({ queryKey: ['purchased-packages'] });
      options?.onSuccess?.();
    },
    onError: (error: unknown) => {
      const { title, message } = formatErrorForAlert(error, 'Purchase Package');
      Alert.alert(title, message);
    },
  });
};

