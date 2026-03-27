import React, { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Carousel, FeaturedEventCard, TextDs } from '@components';
import { styles } from '../style/PlayerHomeContent.styles';
import { EventData } from '@app-types';
import { FlexView } from '@designSystem/atoms/FlexView';
import { spacing } from '@theme';
import { logger } from '@dev-tools';

interface FeaturedEventsSectionProps {
  events: EventData[];
  onEventPress: (id: string) => void;
  onBookmark: (id: string) => void;
}

export const FeaturedEventsSection: React.FC<FeaturedEventsSectionProps> = ({
  events,
  onEventPress,
  onBookmark,
}) => {
  const filteredAndSortedEvents = useMemo(() => {
    const now = new Date();
    
    // Filter out past events
    const upcomingEvents = events.filter((event) => {
      if (event.eventEndDateTime) {
        return new Date(event.eventEndDateTime) >= now;
      }
      const implicitEnd = new Date(new Date(event.eventDateTime).getTime() + 60 * 60 * 1000);
      return implicitEnd >= now;
    });

    // Sort chronologically (oldest upcoming to furthest future)
    return upcomingEvents.sort((a, b) => {
      return new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime();
    });
  }, [events]);

  const { width: screenWidth } = useWindowDimensions();
  // Compute the initial active index based on derived events
  const initialActiveIndex = useMemo(() => {
    const index = filteredAndSortedEvents.length > 0 ? Math.floor(filteredAndSortedEvents.length / 2) : 0
    logger.debug('Computed initial active index', { value: index, eventsLength: filteredAndSortedEvents.length })
    return index
  }, [filteredAndSortedEvents.length])
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)
  const cardWidth = 250
  const overlapOffset = 20
  const sidePadding = Math.max(0, (screenWidth - cardWidth) / 2)

  useEffect(() => {
    setActiveIndex(initialActiveIndex)
  }, [initialActiveIndex])

  return (
    <FlexView mb={10}>
      <FlexView px={spacing.base}>
        <TextDs size={16} weight='semibold'>Featured Events</TextDs>
      </FlexView>

      <Carousel
        data={filteredAndSortedEvents}
        itemWidth={cardWidth}
        itemSpacing={-overlapOffset}
        initialIndex={initialActiveIndex}
        onIndexChange={setActiveIndex}
        autoPlay={true}
        autoPlayInterval={2500}
        contentContainerStyle={[
          styles.horizontalScroll,
          { paddingHorizontal: sidePadding },
        ]}
        renderItem={({ item, index, animatedIndex }) => (
          <FlexView key={`${item.eventId}-${index}`} style={index === 0 ? undefined : { marginLeft: -overlapOffset }}>
            <FeaturedEventCard
              id={item.eventId}
              onPress={onEventPress}
              onBookmark={onBookmark}
              event={item}
              width={cardWidth}
              index={index}
              animatedIndex={animatedIndex}
              isActive={index === activeIndex}
            />
          </FlexView>
        )}
      />
    </FlexView>
  )
};
