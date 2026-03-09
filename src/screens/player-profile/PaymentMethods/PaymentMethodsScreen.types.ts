export interface PaymentCard {
  id: string;
  cardHolderName: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  brand?: string | null;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}
