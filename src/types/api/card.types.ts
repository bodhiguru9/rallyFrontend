// Card API Types

export interface AddCardRequest {
  cardHolderName: string;
  cardNumber: string;
  isDefault: boolean;
  expiry: string; // Format: MM/YY
}

export interface CardResponse {
  id: string;
  cardHolderName: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  brand?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardsListResponse {
  cards: CardResponse[];
}
