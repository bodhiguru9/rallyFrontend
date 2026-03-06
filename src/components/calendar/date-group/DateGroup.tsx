import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { EventCard } from '@components/global/EventCard';
import { colors, spacing } from '@theme';
import type { PlayerBooking } from '@services/booking-service';
import { styles } from './DateGroup.styles';

interface DateGroupProps {
  events: PlayerBooking[];
  onEventPress: (id: string) => void;
  onBookmark: (id: string) => void;
  showTimeline?: boolean;
  showStatus?: boolean;
}

export const DateGroup: React.FC<DateGroupProps> = ({ events, onEventPress, onBookmark, showTimeline = true, showStatus = true }) => {
  return (
    <FlexView flexDirection="row" alignItems="flex-start" width={'100%'} overflow="hidden">
      {showTimeline && (
        <FlexView width={40} alignItems="center">
          <FlexView style={styles.timelineDot} />
          <FlexView
            height={1000}
            position="absolute"
            top={14}
            left={'50%'}
            style={{
              borderLeftWidth: 2,
              borderStyle: 'dashed',
              borderColor: colors.primaryDark,
              transform: 'translate(-50%, 0)',
            }}
          />
        </FlexView>
      )}
      <FlexView flex={1} gap={spacing.base}>
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
