// Card API Types

export interface AddCardRequest {
  cardHolderName: string;
  cardNumber: string;
  isDefault: boolean;
  expiry: string; // Format: MM/YY
}

export interface CardResponse {
  cardId: string;
  cardHolderName: string;
  cardNumber?: string;
  last4: string;
  expiry?: string;
  expMonth: number;
  expYear: number;
  brand?: string | null;
  isDefault: boolean;
  stripePaymentMethodId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardsListResponse {
  cards: CardResponse[];
}
