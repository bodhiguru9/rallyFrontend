import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { EventCard } from '@components/global/EventCard';
import { colors, spacing } from '@theme';
import type { PlayerBooking } from '@services/booking-service';
import { EventStatusBadge } from '@components/global/event-status-badge';
import moment from 'moment';
import { TextDs } from '@designSystem/atoms/TextDs';
import { styles } from './DateGroup.styles';

interface DateGroupProps {
  events: PlayerBooking[];
  onEventPress: (id: string) => void;
  onBookmark: (id: string) => void;
  showTimeline?: boolean;
  showStatus?: boolean;
}

export const DateGroup: React.FC<DateGroupProps> = ({ events, onEventPress, onBookmark, showTimeline = true, showStatus = true }) => {
  const hasOngoing = events.some(e => e.booking?.bookingStatus === 'ongoing');
  const firstEventDate = events[0]?.eventDateTime ? new Date(events[0].eventDateTime) : new Date();
  const dateFormatted = moment(firstEventDate).format('D MMM, dddd');

  return (
    <FlexView flexDirection="row" alignItems="stretch" width={'100%'} overflow="hidden">
      {showTimeline && (
        <FlexView width={55} alignItems="center" pb={hasOngoing ? 30 : 20} ml={-15} mr={2}>
          <FlexView style={styles.timelineDot} mt={6} />

          <FlexView
            flex={1}
            width={2}
            style={{
              borderLeftWidth: 2,
              borderStyle: 'dashed',
              borderColor: colors.primaryDark,
            }}
          />

          <FlexView style={styles.verticalTextContainer}>
            {hasOngoing ? (
              <EventStatusBadge variant="ongoing" style={styles.badgeOverride} />
            ) : (
              <TextDs size={10} weight="medium" color="blueGray" style={styles.verticalDateText}>
                {`• ${dateFormatted}`}
              </TextDs>
            )}
          </FlexView>
        </FlexView>
      )}
      <FlexView flex={1} gap={spacing.base} pb={spacing.base}>
        {events.map((event) => (
          <EventCard
            key={event.eventId}
            id={event.eventId}
            event={event}
            onPress={onEventPress}
            onBookmark={onBookmark}
            hideCreator
            hidePrice
            showStatus={showStatus}
          />
        ))}
      </FlexView>
    </FlexView>
  );
};
