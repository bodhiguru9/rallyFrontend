import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { PlayerBooking } from '@services/booking-service';
import { loadEventDrafts } from '@utils/event-drafts-storage';

/**
 * Loads organiser event drafts from local storage (saved when "Save duplicate in drafts" was checked on publish).
 */
export const useEventDrafts = () => {
  const [draftCards, setDraftCards] = useState<PlayerBooking[]>([]);

  const refresh = useCallback(async () => {
    const rows = await loadEventDrafts();
    setDraftCards(rows.map((r) => r.card));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { draftCards, refreshDrafts: refresh };
};
