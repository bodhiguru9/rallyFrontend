import React, { useMemo } from 'react';

import type { UpcomingEventsSectionProps } from './UpcomingEventsSection.types';
import type { EventData } from '@app-types';
import { styles } from './style/UpcomingEventsSection.styles';
import { EventCard,  TextDs,  FlexView } from '@components';
import { useAsyncExpandedEvents } from '@hooks/use-async-expanded-events';

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  onEventPress,
  onEventShare,
}) => {
  const { expandedEvents = [] } = useAsyncExpandedEvents(events);

  const eventsByDate = useMemo(() => {
    const grouped: Record<string, EventData[]> = {};
    
    // Sort events chronologically first
    const sortedEvents = [...expandedEvents].sort((a, b) => 
      new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime()
    );

    sortedEvents.forEach(event => {
      const d = new Date(event.eventDateTime);
      const key = `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;
      if (!grouped[key]) { grouped[key] = []; }
      grouped[key].push(event);
    });

    return Object.entries(grouped);
  }, [expandedEvents]);

  const getDayLabel = (dateStr: string): string => {
    try {
      const [day, month] = dateStr.split(' ');
      const monthMap: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      if (day && month && monthMap[month] !== undefined) {
        const date = new Date(new Date().getFullYear(), monthMap[month], parseInt(day));
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] || '';
      }
      return '';
    } catch { return ''; }
  };

  if (expandedEvents.length === 0) {
    return null;
  }

  return (
    <FlexView style={styles.container}>
      <TextDs style={styles.title}>Upcoming Events</TextDs>
      {eventsByDate.map(([date, groupEvents]) => (
        <FlexView key={date} style={styles.dateGroup}>
          <FlexView style={styles.dateLabelContainer}>
            <TextDs size={14} weight="semibold">{date}</TextDs>
            <TextDs size={14} weight="regular" color="secondary">
              • {getDayLabel(date)}
            </TextDs>
          </FlexView>
          <FlexView style={styles.eventsList}>
            {groupEvents.map((event) => (
              <EventCard
                key={event.eventId}
                id={event.eventId}
                event={event}
                onPress={onEventPress}
                onBookmark={onEventShare || (() => { })}
                hidePrice={true}
                showRevenue={true}
                disableTags={true}
              />
            ))}
          </FlexView>
        </FlexView>
      ))}
    </FlexView>
  );
};

