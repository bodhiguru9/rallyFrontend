import { useState, useEffect } from 'react';
import { expandEventsForward } from '@utils/recurrence-utils';
import type { EventData } from '@app-types';

/**
 * Returns original events immediately for fast render, then asynchronously fully expands recurring events
 * up to 2 months into the future.
 */
export function useAsyncExpandedEvents(events: EventData[] | undefined, maxMonthsFuture: number = 2) {
  const [expandedEvents, setExpandedEvents] = useState<EventData[] | undefined>(events);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (!events || events.length === 0) {
      setExpandedEvents(events);
      return;
    }

    // Set fallback pre-expanded to ensure fast initial render
    setExpandedEvents(events);
    setIsExpanding(true);

    const timeoutId = setTimeout(() => {
      // Execute the expansion off the critical render path
      const expanded = expandEventsForward(events, maxMonthsFuture, 2);
      setExpandedEvents(expanded);
      setIsExpanding(false);
    }, 50); 

    return () => clearTimeout(timeoutId);
  }, [events, maxMonthsFuture]);

  return { expandedEvents, isExpanding };
}
