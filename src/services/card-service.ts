import { apiClient } from './api/api-client';
import type { AddCardRequest, CardResponse, CardsListResponse } from '../types/api/card.types';

export const cardService = {
  /**
   * Get all saved cards for the current user
   * @returns Promise with list of cards
   */
  getCards: async (): Promise<CardsListResponse> => {
    const response = await apiClient.get<CardsListResponse>('/api/cards');
    return response.data;
  },

  /**
   * Add a new card
   * @param data - Card data (cardHolderName, cardNumber, isDefault, expiry)
   * @returns Promise with the created card
   */
  addCard: async (data: AddCardRequest): Promise<CardResponse> => {
    const response = await apiClient.post('/api/cards', data);
    // API wraps responses in { success, message, data }
    const payload = (response.data as any)?.data ?? response.data;
    return payload?.card ?? payload;
  },

  /**
   * Delete a saved card
   * @param cardId - The ID of the card to delete
   */
  deleteCard: async (cardId: string): Promise<void> => {
    await apiClient.delete(`/api/cards/${cardId}`);
  },
};
