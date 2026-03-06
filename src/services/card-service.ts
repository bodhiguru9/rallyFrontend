import { apiClient } from './api/api-client';
import type { AddCardRequest, CardResponse, CardsListResponse } from '../types/api/card.types';

export const cardService = {
  /**
   * Get all saved cards for the current user
   * @returns Promise with list of cards
   */
  getCards: async (): Promise<CardResponse[]> => {
    const response = await apiClient.get<CardResponse[] | CardsListResponse>('/api/cards');
    // Handle both array response and wrapped response
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.cards || [];
  },

  /**
   * Add a new card
   * @param data - Card data (cardHolderName, cardNumber, isDefault, expiry)
   * @returns Promise with the created card
   */
  addCard: async (data: AddCardRequest): Promise<CardResponse> => {
    const response = await apiClient.post<CardResponse>('/api/cards', data);
    return response.data;
  },
};
